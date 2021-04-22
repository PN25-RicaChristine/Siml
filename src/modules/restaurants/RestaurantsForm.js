import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SliderPicker } from 'react-native-slider-picker';
import { BasicStyles, Color, Routes } from 'common'
import LocationInput from 'components/InputField/LocationInput'
import NumberInput from 'components/InputField/NumberInput'
import InputSelect from 'components/InputField/InputSelect'
import Range from 'components/InputField/Range'
import Slider from 'components/InputField/Slider'
import DateTimePicker from 'components/DateTime/index.js'
import Group from 'modules/generic/PeopleList.js'
import { connect } from 'react-redux';
import Api from 'services/api';
import { Spinner } from 'components';


class Restaurants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      value: 100,
      selectVal: null,
      val: 1,
      Date: null,
      Time: null,
      isLoading: false,
      size: 1,
      cuisines: null
    }
  }
  componentDidMount() {
    const { setDefaultAddress, setTempMembers } = this.props;
    setDefaultAddress(null);
    setTempMembers([]);
  }

  redirect(route) {
    this.props.navigation.navigate(route)
  }

  goesTo = () => {
    this.redirect('peopleListStack')
  }

  createSynqt = () => {
    const { setDefaultAddress, setLocation } = this.props;
    if(this.props.state.tempMembers.length === 0) {
      Alert.alert(
        'Oopps',
        'Please invite atleast 1 person to your SYNQT. Thank you.',
        [
          {text: 'Cancel'},
          {text: 'Ok'}
        ],
        { cancelable: false }
      )
      return
    }
    let param = {
      account_id: this.props.state.user.id,
      address_type: 'NULL',
      merchant_id: this.props.state.user.sub_account?.merchant?.id || null,
      latitude: this.props.state.location.latitude,
      longitude: this.props.state.location.longitude,
      route: this.props.state.location.address,
      // route: this.props.state.location.route,
      locality: this.props.state.location.locality,
      region: this.props.state.location.region,
      country: this.props.state.location.country,
    }
    this.setState({ isLoading: true })
    Api.request(Routes.locationCreate, param, response => {
      this.setState({ isLoading: false })
      if (response.data === null) {
        return
      }
      let parameter = {
        account_id: this.props.state.user.id,
        location_id: response.data,
        date: this.state.Date?.date + ' ' + this.state.Date?.time,
        status: 'pending',
        details: "{ 'type': 'restaurant',  'parameter': { 'size': '1' }"
      }
      this.setState({ isLoading: true })
      Api.request(Routes.synqtCreate, parameter, res => {
        this.setState({ isLoading: false })
        if (res.data !== null) {
          this.sendInvitation(res.data);
          setDefaultAddress(null);
          setLocation(null);
          this.createMessengerGroup(res.data, parameter.date)
          this.setState({ Date: null })
        }
      });
    });
  }

  createMessengerGroup(id, date) {
    let parameter = {
      account_id: this.props.state.user.id,
      title: date,
      payload: id,
      members: this.props.state.tempMembers
    }
    this.setState({ isLoading: true })
    Api.request(Routes.messengerGroupCreate, parameter, response => {
      console.log(response);
      this.setState({ isLoading: false })
      if (response.data !== null) {
        this.props.navigation.navigate('menuStack', { synqt_id: id })
      }
    });
  }

  sendInvitation = (id) => {
    const { tempMembers } = this.props.state;
    tempMembers.length > 0 && tempMembers.map((item, index) => {
      let parameter = {
        from: this.props.state.user.id,
        to: item.account.id,
        payload: 'synqt',
        payload_value: id,
        route: `/restaurant/${item.account?.code}`
      }
      this.setState({ isLoading: true });
      Api.request(Routes.notificationCreate, parameter, response => {
        this.setState({ isLoading: false })
        const { setTempMembers } = this.props;
        setTempMembers([]);
      });
    })
  }

  render() {
    return (
      <View style={{
        flex: 1,
        height: '100%'
      }}>
        <ScrollView style={{
          backgroundColor: Color.containerBackground,
          height: '100%'
        }}
          showsVerticalScrollIndicator={false}
        >
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <View>
            <View style={{
              marginTop: '7%',
              marginLeft: 20,
            }}>
              <Text>Location</Text>
              <TouchableOpacity
                style={{
                  height: 50,
                  borderRadius: 25,
                  borderWidth: .3,
                  marginRight: 20,
                  marginBottom: 20,
                  borderColor: Color.gray,
                  justifyContent: 'center',
                  paddingLeft: 10,
                  marginTop: 3
                }}
                onPress={() => { this.props.navigation.navigate('locationStack') }}>
                <Text style={{ color: Color.gray }}>{this.props.state.location?.address || 'Type your location'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{
              marginLeft: 20,
              marginRight: 20
            }}>
              <Text>Date and Time</Text>
              <DateTimePicker
                borderBottomColor={Color.gray}
                icon={true}
                textStyle={{ marginRight: '-7%' }}
                borderColor={'white'}
                type={'datetime'}
                placeholder={'Select Date and Time'}
                onFinish={(date) => {
                  this.setState({
                    Date: date
                  })
                }}
                style={{
                  marginTop: '-5%'
                }} />
            </View>
            <View style={{ marginBottom: '23%' }}>
              <NumberInput
                onFinish={(count) => {
                  this.setState({
                    size: count
                  })
                }}
                title={'Party Size'} />
            </View>
            <View style={{ marginBottom: '23%' }}>
              <Range 
              onFinish={(amount) => {
                  this.setState({
                    value: amount
                  })
                }} title={'Price Range'} />
            </View>
            <View>
              <InputSelect 
              onFinish={(cuisine) => {
                  this.setState({
                    cuisines: cuisine
                  })
                }} 
                titles={'cuisines'}
                placeholder={' '}
                title={'Cuisines'} />
            </View>
            <Text style={{ color: 'black', marginBottom: 15, marginLeft: 20 }}>Radius</Text>
            <SliderPicker
              callback={position => {
                this.setState({ val: position })
              }}
              defaultValue={this.state.val}
              labelFontColor={"#6c7682"}
              labelFontWeight={'600'}
              showFill={true}
              fillColor={'gray'}
              labelFontWeight={'bold'}
              showNumberScale={true}
              showSeparatorScale={true}
              buttonBackgroundColor={'#fff'}
              buttonBorderWidth={2}
              labelFontSize={15}
              scaleNumberFontWeight={'300'}
              buttonDimensionsPercentage={6}
              buttonBorderColor={'#5842D7'}
              heightPercentage={1}
              widthPercentage={90}
              sliderInnerBackgroundColor={'gray'}
              minLabel={'1km'}
              midLabel={'25km'}
              maxLabel={'50km'}
              maxValue={50}
            />
            <Text style={{ marginLeft: 20, marginBottom: 5 }}>People in this SYNQT</Text>
            <Group style={{ marginLeft: 50, marginTop: -30 }} redirectTo={() => this.goesTo()} data={this.props.state.tempMembers} />
          </View>

          <View style={{
            width: '33%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30%',
            marginLeft: '35%'
          }}>
            <TouchableOpacity
              onPress={() => this.createSynqt()}
              style={{
                height: 70,
                width: 70,
                borderRadius: 35,
                backgroundColor: Color.primary,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Image source={require('assets/logo.png')} style={{
                height: 50,
                width: 50
              }} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* <Footer layer={1} {...this.props}/> */}
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });


const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    updateUser: (user) => dispatch(actions.updateUser(user)),
    setDefaultAddress: (defaultAddress) => dispatch(actions.setDefaultAddress(defaultAddress)),
    setTempMembers: (tempMembers) => dispatch(actions.setTempMembers(tempMembers)),
    setLocation: (location) => dispatch(actions.setLocation(location)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurants);