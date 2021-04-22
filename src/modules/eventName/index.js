import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, TextInput, CheckBox, Modal, ImageBackground, Alert, Dimensions } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faStar, faClock } from '@fortawesome/free-solid-svg-icons';
import CustomizedButton from 'modules/generic/CustomizedButton';
import Config from 'src/config.js';
import Group from 'modules/generic/PeopleList.js'
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
class EventName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { title: 'Retail 1', price: '100.00', quantity: 2 },
        { title: 'Retail 2', price: '61.00', quantity: 5 },
        { title: 'Retail 3', price: '7.00', quantity: 1 }
      ],
      value: null,
      placeOrder: false,
      group: [
        { user: { profile: { uri: require('assets/test.jpg') } } },
        { user: { profile: { uri: require('assets/test.jpg') } } },
        { user: { profile: { uri: require('assets/test.jpg') } } },
        { user: { profile: { uri: require('assets/test.jpg') } } },
        { user: { profile: { uri: require('assets/test.jpg') } } },
        { user: { profile: { uri: require('assets/test.jpg') } } },
        { user: { profile: { uri: require('assets/test.jpg') } } },
        { user: { profile: { uri: require('assets/test.jpg') } } }
      ],
      isLoading: false
    }
  }
  onClick = () => {
    if (this.props.navigation.state?.params?.buttonTitle === 'Cancel') {
      this.deleteItem();
    } else {
      this.addToReservation();
    }
  }

  redirect(route) {
    this.props.navigation.navigate(route)
  }

  goesTo = () => {
    this.redirect('peopleListStack')
  }

  deleteItem = () => {
    Alert.alert(
      '',
      'Confirm cancellation',
      [
        { text: 'Close', onPress: () => { return }, style: 'cancel' },
        {
          text: 'Confirm', onPress: () => {
            let parameter = {
              id: this.props.navigation?.state?.params?.data?.id,
              status: 'cancelled'
            }
            this.setState({ isLoading: true });
            Api.request(Routes.reservationUpdate, parameter, response => {
              this.setState({ isLoading: false })
              if (response.data !== null) {
                this.props.navigation.navigate('historyStack', { title: 'Upcoming' })
              }
            })
          }
        },
      ],
      { cancelable: false }
    )
  }

  addToReservation = () => {
    Alert.alert(
      '',
      'Please click "OKAY" to continue',
      [
        { text: 'Cancel', onPress: () => { return }, style: 'cancel' },
        {
          text: 'Okay', onPress: () => {
            this.setState({ isLoading: true })
            Api.request(Routes.reservationCreate, this.props.navigation.state?.params?.parameter, response => {
              this.setState({ isLoading: false })
              if (response.data !== null) {
                this.props.navigation.navigate('historyStack', { title: 'History' })
              }
            },
              error => {
                this.setState({ isLoading: false })
                console.log({ error });
              },
            );
          }
        },
      ],
      { cancelable: false }
    )
  }

  render() {
    const { data } = this.props.navigation.state.params;
    console.log(data, 'hhhh');
    return (
      <ScrollView>
        <View style={{
          backgroundColor: 'white',
          width: '100%',
          backgroundColor: 'white',
          paddingBottom: 15,
          height: height - 70
        }}>
          <ImageBackground
            style={{
              width: '100%',
              height: '50%'
            }}
            imageStyle={{ flex: 1, height: null, width: null, resizeMode: 'cover' }}
            source={{ uri: Config.BACKEND_URL + data.merchant.logo }}>
          </ImageBackground>
          <View style={{ padding: 10 }}>
            <Text style={{
              fontSize: 16,
            }}>
              SYNQT: RESTAURANT | {data.merchant.name}
            </Text>
            <Text style={{
              color: Color.gray,
              marginTop: 5
            }}>
              {data.merchant.address || 'no address provided'}
            </Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            paddingLeft: 20
          }}>
            {this.state.isLoading ? <Spinner mode="overlay" /> : null}
            <FontAwesomeIcon icon={faUser} size={20} color={Color.gray} style={{ marginRight: 10 }} />
            <Text style={{ color: Color.gray }}>{this.props.navigation.state?.params?.data.members.length} people</Text>
            <View style={{
              borderRadius: 6,
              position: 'absolute',
              right: width - 240,
              height: 25,
              width: '30%',
              padding: 6,
              borderWidth: .5,
              borderColor: Color.warning,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Text style={{ color: Color.primary }}>{data.synqt[0].date}</Text>
            </View>
            <View style={{
              backgroundColor: Color.primary,
              borderRadius: 6,
              height: 18,
              position: 'absolute',
              right: width - 300,
              width: 55,
              borderWidth: .5,
              borderColor: Color.primary,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Text numberOfLines={1} style={{ fontSize: 10, color: 'white' }}>0.64 km</Text>
            </View>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 6,
              height: 18,
              position: 'absolute',
              right: width - 360,
              width: 55,
              borderWidth: .5,
              borderColor: Color.primary,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <FontAwesomeIcon icon={faStar} color={Color.warning} style={{ marginRight: 2 }} size={8} />
              <Text numberOfLines={1} style={{ fontSize: 10, color: Color.primary }}>43</Text>
            </View>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 6,
              height: 21,
              position: 'absolute',
              right: 10,
              width: 50,
              borderWidth: .5,
              borderColor: Color.primary,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <TouchableOpacity style={{
                height: 15,
                width: 15,
                borderRadius: 8,
                backgroundColor: '#30F2F2',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5
              }}>
                <FontAwesomeIcon icon={faStar} color={Color.white} size={8} />
              </TouchableOpacity>
              <Text numberOfLines={1} style={{ color: Color.warning }}>1</Text>
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 25,
            paddingLeft: 15
          }}>
            <Group navigation={this.props.navigation} style={{ marginLeft: 13 }} size={60} data={this.state.group} />
          </View>
          <CustomizedButton style={{marginLeft:-20}} onClick={this.onClick} title={this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.buttonTitle && this.props.navigation.state.params.buttonTitle}></CustomizedButton>
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({ state: state });


const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    updateUser: (user) => dispatch(actions.updateUser(user)),
    setDefaultAddress: (defaultAddress) => dispatch(actions.setDefaultAddress(defaultAddress))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventName);