import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { ListItem } from 'react-native-elements'
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import Style from './Style';
import CustomizedButton from 'modules/generic/CustomizedButton';
import ImageCardWithUser from 'modules/generic/ImageCardWithUser';
import Tab from 'modules/generic/TabOptions';
import CardModal from 'modules/modal/Swipe.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import _ from 'lodash';
import Api from 'services/api/index.js';
import { Spinner, Empty } from 'components';

class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      phoneNumber: null,
      email: null,
      choice: 'SIML ACTIVITY',
      connections: [],
      isVisible: false,
      data: [],
      limit: 5,
      offset: 0,
      isLoading: false
    }
  }

  componentDidMount() {
    this.retrieveActivity(false);
  }

  retrieveActivity = (flag) => {
    let status = this.props.navigation.state.params && this.props.navigation.state.params.title && this.props.navigation.state.params.title.toLowerCase() === 'upcoming' ? 'pending' : 'completed'
    let parameter = {
      condition: [{
        value: this.props.navigation.state?.params?.user?.account?.id,
        column: 'account_id',
        clause: '='
      }, {
        value: 'completed',
        column: 'status',
        clause: '='
      }],
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset
    }
    this.setState({ isLoading: true })
    Api.request(Routes.reservationRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset,
        })
      }
    });
  }

  retrieveConnections(flag) {
    const { user } = this.props.state
    if (user == null) {
      return
    }
    let parameter = {
      condition: [{
        value: this.props.navigation.state?.params?.user?.account_id,
        column: 'account_id',
        clause: 'or'
      }, {
        value: this.props.navigation.state?.params?.user?.account_id,
        column: 'account',
        clause: '='
      }, {
        clause: "like",
        column: "status",
        value: 'accepted'
      }],
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
    }
    this.setState({ isLoading: true })
    Api.request(Routes.circleRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          connections: flag == false ? response.data : _.uniqBy([...this.state.connections, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          connections: flag == false ? [] : this.state.connections,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    });
  }

  choiceHandler = (value) => {
    this.setState({ choice: value })
    if(value === 0) {
      this.retrieveActivity(false);
    } else {
      this.retrieveConnections(false);
    }
  }

  fullNameHandler = (value) => {
    this.setState({ fullName: value })
  }

  phoneNumberHandler = (value) => {
    this.setState({ phoneNumber: value })
  }

  emailHandler = (value) => {
    this.setState({ email: value })
  }

  renderConnections() {
    return (
      <View>
        {this.state.connections.length === 0 && (<Empty refresh={true} onRefresh={() => this.retrieveConnections(false)} />)}
        {
          this.state.connections.length > 0 && this.state.connections.map((el, idx) => {
            return (
              <TouchableOpacity>
                {/* <Card containerStyle={{padding:-5, borderRadius: 20}}> */}
                <ListItem key={idx}>
                  <Image
                    style={Style.circleImage}
                    // resizeMode="cover"
                    source={el.account?.profile?.url ? { uri: Config.BACKEND_URL + el.account?.profile?.url } : require('assets/logo.png')}
                  />
                  <View>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                      <View style={{ width: '50%' }}>
                        <Text style={{ fontWeight: 'bold' }}>{el?.account?.information?.first_name + ' ' + el?.account?.information?.last_name}</Text>
                        <Text style={{ fontStyle: 'italic' }}>{el?.account?.information?.address}</Text>
                        <Text style={{ color: 'gray', fontSize: 10 }}>{el.numberOfConnection} similar connections</Text>
                      </View>
                      <TouchableOpacity
                        // onPress={() => this.changeTab(idx)}
                        style={{
                          ...Style.actionBtn,
                          backgroundColor:'#4DD965'
                        }}
                      >
                        <Text style={{ color: 'white' }}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem>
                {/* </Card> */}
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }


  renderSimlActivity() {
    const height = Math.round(Dimensions.get('window').height);
    return (
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if(event.nativeEvent.contentOffset.y <= 0) {
              if(this.state.isLoading == false){
                // this.retrieve(false)
              }
            }
            if (Math.round(scrollingHeight) >= Math.round(totalHeight)) {
              if (this.state.isLoading === false) {
                this.retrieve(true)
              }
            }
          }}
          >
          {this.state.data.length === 0 && (<Empty refresh={true} onRefresh={() => this.retrieveActivity(false)} />)}
          <View style={{
            marginTop: 15,
            flex: 1,
            padding: 10
          }}>
            {
              this.state.data.length > 0 && this.state.data.map((item, index) => (
                <ImageCardWithUser
                data={{
                  logo: item.merchant.logo,
                  address: item.merchant.address || 'No address provided',
                  name: item.merchant.name,
                  date: item.synqt[0].date,
                  superlike: true,
                  users: [{
                    account: {
                      profile: {
                        url: '/storage/image/11_2021-04-06_02_04_43_fries.jpg'
                      }
                    }
                  }, {
                    account: {
                      profile: {
                        url: '/storage/image/11_2021-04-06_02_04_43_fries.jpg'
                      }
                    }
                  }, {
                    account: {
                      profile: {
                        url: '/storage/image/11_2021-04-06_02_04_43_fries.jpg'
                      }
                    }
                  }, {
                    account: {
                      profile: {
                        url: '/storage/image/11_2021-04-06_02_04_43_fries.jpg'
                      }
                    }
                  }, {
                    account: {
                      profile: {
                        url: '/storage/image/11_2021-04-06_02_04_43_fries.jpg'
                      }
                    }
                  }]
                }}
                style={{
                  marginBottom: 20
                }}
                redirectTo={this.props.navigation.state.params && this.props.navigation.state.params.title}
                onClick={() => {
                  // this.onClick(item)
                }}
                />
                ))
              }
          </View>
          </ScrollView>
      </SafeAreaView>
    )
  }

  render() {
    let user = this.props.navigation.state?.params?.user
    console.log(this.props.navigation.state?.params?.user?.account?.username, 'level--------------');
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView>
          <View>
            <View style={Style.TopView}>
              <TouchableOpacity
                style={{
                  height: 180,
                  width: 180,
                  borderRadius: 100,
                  borderColor: Color.primary,
                  borderWidth: 2
                }}>
                <Image source={user && user?.account?.profile?.url ? { uri: Config.BACKEND_URL + user.account.profile.url } : require('assets/logo.png')} style={{
                  height: 176,
                  width: 176,
                  borderRadius: 100,
                }} />
              </TouchableOpacity>
            </View>
            <View style={Style.BottomView}>
              <FontAwesomeIcon
                style={{ marginRight: 5 }}
                icon={faCheckCircle}
                size={20}
                color={Color.blue} />
              <Text style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18
              }}>{user?.account?.information?.first_name + user?.account?.information?.last_name || 'Unknow name'}</Text>
            </View>
            <View style={{
              width: '100%'
            }}>
              <Text style={{
                textAlign: 'center',
                color: Color.gray
              }}>3 similar connections</Text>
            </View>

          </View>
          <View style={{
            marginTop: 25,
            textAlign: 'center',
            justifyContent: 'center'
          }}>
            {this.props.navigation.state?.params?.level === 1 ? <Tab level={1} choice={['SYNQT ACTIVITIES', 'CONNECTIONS']} onClick={this.choiceHandler}></Tab> :
            <Tab level={2} choice={['CONNECTIONS']} onClick={this.choiceHandler}></Tab> }
          </View>
          <View>
            {this.state.choice === 'SYNQT ACTIVITIES' ? (
              this.renderSimlActivity()
            ) :
              this.renderConnections()}
          </View>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          {this.state.isVisible && <CardModal
          visisble={this.state.isVisible}
          onClose={() => {
          this.setState({
            isVisible: false
          })
        }}/>}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(ViewProfile);