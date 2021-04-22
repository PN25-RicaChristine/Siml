import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { BasicStyles, Color, Routes } from 'common'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Footer from 'modules/generic/Footer'
import CardList from 'modules/generic/CardList'
import Share from 'components/Share'
import Style from './Style'
import { connect } from 'react-redux';
import { Spinner, Empty } from 'components';
import Api from 'services/api/index.js';
import _ from 'lodash';

const navs = [
  { name: "Suggestions", flag: true },
  { name: "Connections", flag: false }
]

class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevActive: 0,
      currActive: 0,
      search: null,
      isShow: false,
      data: [],
      limit: 6,
      offset: 0,
      isLoading: false,
      pending: [],
      suggestions: [],
      connections: []
    }
  }

  componentDidMount() {
    this.retrieveRandomUsers(false);
    this.retrieve(false);
  }

  refresh = () => {
    this.retrieveRandomUsers(false);
    this.retrieve(false);
  }

  retrieve(flag) {
    const { user } = this.props.state
    if (user == null) {
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        column: this.state.currActive == 0 ? 'account' : 'account_id',
        clause: 'or'
      }, {
        value: user.id,
        column: 'account',
        clause: this.state.currActive == 0 ? '=' : '='
      }, {
        clause: "=",
        column: "status",
        value: this.state.currActive == 0 ? 'pending' : 'accepted'
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

  retrieveRandomUsers = (flag) => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id
    }
    this.setState({ isLoading: true })
    Api.request(Routes.otherAccountsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ suggestions: response.data})
      }
    });
  }

  async changeTab(idx) {
    if (this.state.prevActive != idx) {
      await this.setState({ currActive: idx })
      navs[this.state.prevActive].flag = false
      navs[idx].flag = true
      await this.setState({ prevActive: idx })
    }
    this.setState({connections: []})
    this.retrieve(false)
  }

  group = () => {
    const { pending, connections } = this.state;
    this.state.data && this.state.data.length > 0 && this.state.data.map((item, index) => {
      if(item.status === 'pending') {
        pending.push(item);
      } else if(item.status === 'accepted') {
        connections.push(item);
      }
    })
  }

  render() {
    this.group();
    return (
      <View style={{
        flex: 1
      }}>
        <ScrollView style={{
          backgroundColor: Color.containerBackground,
          marginBottom: 50
        }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 0.3, paddingBottom: 20, borderColor: Color.gray, marginTop: '7%' }}>
            {
              navs.map((el, idx) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.changeTab(idx)}
                    style={{
                      ...Style.standardButton,
                      backgroundColor: el.flag == true ? Color.primary : '#BDBDBD',
                      marginLeft: 5
                    }}
                  >
                    <Text style={{ color: 'white' }}>{el.name}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
          {
            this.state.currActive == 0 ? (
              <View>
                <CardList level={2} retrieve={() => {this.refresh()}} status={'pending'} navigation={this.props.navigation} data={this.state.connections.length > 0 && this.state.connections} hasAction={true} actionType={'text'}></CardList>
                <View style={{ marginTop: 50, paddingLeft: 30, borderTopWidth: 0.3, paddingTop: 20, borderColor: Color.gray }}>
                  <Text style={{ fontWeight: 'bold' }}>Connections you may know</Text>
                </View>

                <View>
                  <CardList level={2} retrieve={() => {this.refresh()}} navigation={this.props.navigation} data={this.state.suggestions.length > 0 && this.state.suggestions} hasAction={false} actionType={'button'} actionContent={'text'}></CardList>
                  {this.state.suggestions.length == 0 && (<Empty refresh={true} onRefresh={() => this.refresh()} />)}
                </View>

              </View>
            ) : (
              <View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '5%' }}>
                <View style={Style.TextContainer}>
                  <TextInput
                    style={[BasicStyles.formControl, {backgroundColor: '#e8e8e8'}]}
                    onChangeText={(search) => this.setState({ search })}
                    value={this.state.search}
                    placeholder={'Search'}
                  />
                </View>
                <View>
                  <CardList level={1} retrieve={() => {this.refresh()}} navigation={this.props.navigation} data={this.state.connections.length > 0 && this.state.connections} hasAction={false} actionType={'button'} actionContent={'icon'} ></CardList>
                </View>
              </View>
                {this.state.connections.length == 0 && (<Empty refresh={true} onRefresh={() => this.refresh()} />)}
                </View>
            )
          }
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        <Footer layer={1} {...this.props} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    viewMenu: (isViewing) => dispatch(actions.viewMenu(isViewing))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(Connections);
