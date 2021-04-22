import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import Style from './Style';
import CustomizedButton from 'modules/generic/CustomizedButton';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner, ImageUpload } from 'components';
import Config from 'src/config.js';
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      middleName: null,
      lastName: null,
      cellularNumber: null,
      email: null,
      isLoading: false,
      id: null,
      isImageUpload: false
    }
  }

  componentDidMount() {
    this.retrieve();
  }

  firstNameHandler = (value) => {
    this.setState({ firstName: value })
  }

  middleNameHandler = (value) => {
    this.setState({ middleName: value })
  }

  lastNameHandler = (value) => {
    this.setState({ lastName: value })
  }

  cellularNumberHandler = (value) => {
    this.setState({ cellularNumber: value })
  }

  emailHandler = (value) => {
    this.setState({ email: value })
  }

  retrieve = () => {
    const { user } = this.props.state;
    if (user === null) {
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'account_id'
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountInformationRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        let data = response.data[0]
        this.setState({
          id: data.id,
          firstName: data.first_name,
          middleName: data.middle_name,
          lastName: data.last_name,
          cellularNumber: data.cellular_number,
          email: user.email
        })
      }
    });
  }

  update = () => {
    const { user } = this.props.state;
    if (user === null) {
      return
    }
    if(this.validation() === true) {
      Alert.alert(
        "Opps",
        "All fields are required!",
        [
          { text: "OK"}
        ],
        { cancelable: false }
      );
      return
    }
    let parameter = {
      id: this.state.id,
      account_id: user.id,
      first_name: this.state.firstName,
      middle_name: this.state.middleName,
      last_name: this.state.lastName
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountInformationUpdate, parameter, response => {
      this.setState({ isLoading: false })
    });
  }

  reloadProfile = () => {
    const { user, token } = this.props.state;
    if (user == null) {
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'id'
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      const { updateUser } = this.props;
      updateUser(response.data[0])
    });
  }


  updateProfile = (url) => {
    const { user } = this.props.state;
    if (user == null) {
      return
    }
    let parameter = {
      account_id: user.id,
      url: url
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountProfileCreate, parameter, response => {
      this.setState({ isLoading: false })
      this.reloadProfile();
    }, error => {
      console.log(error)
    });
  }

  validation = () => {
    const { firstName, middleName, lastName, cellularNumber } = this.state;
    if(firstName === null || middleName === null || lastName === null || cellularNumber == null || 
      firstName === '' || middleName === '' || lastName === '' || cellularNumber == '') {
        return true;
    } else {
      return false;
    }
  }

  render() {
    const { user } = this.props.state;
    return (
      <ScrollView>
        <View style={[Style.MainContainer, {
          backgroundColor: Color.containerBackground
        }]}>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <View style={{ borderBottomWidth: 1, borderColor: Color.primary }}>
            <View style={Style.TopView}>
              <TouchableOpacity
                style={{
                  height: 180,
                  width: 180,
                  borderRadius: 100,
                  borderColor: Color.primary,
                  borderWidth: 2
                }}
                onPress={() => {
                  this.setState({ isImageUpload: true })
                }}>
                {
                  user.account_profile && user.account_profile.url && (
                    <Image
                      source={user && user.account_profile && user.account_profile.url ? { uri: Config.BACKEND_URL + user.account_profile.url } : require('assets/logo.png') }
                      style={[BasicStyles.profileImageSize, {
                        height: '100%',
                        width: '100%',
                        borderRadius: 100
                      }]} />
                  )
                }
                <View style={{
                  borderColor: Color.primary,
                  borderWidth: 1,
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                  marginRight: 5,
                  position: 'absolute',
                  right: -5,
                  bottom: 1,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                    <FontAwesomeIcon style={{
                      borderColor: Color.primary
                    }}
                      icon={faEdit}
                      size={20}
                      color={Color.primary}
                    />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{
              width: '100%'
            }}>
              <TouchableOpacity onPress={() => {
                this.setState({ isImageUpload: true })
              }}>
                <Text style={{
                  textAlign: 'center',
                  color: '#333333'
                }}>Tap to edit profile</Text>
              </TouchableOpacity>
            </View>
            <View style={Style.BottomView}>
              <FontAwesomeIcon style={{ marginRight: 5 }} icon={faCheckCircle} size={20} color={Color.primary} />
              <Text style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18
              }}>{this.state.firstName && this.state.middleName && this.state.lastName && this.state.firstName + ' ' + this.state.middleName  +' ' + this.state.lastName}</Text>
            </View>
          </View>
          <View style={{
            padding: 25,
            textAlign: 'center',
            justifyContent: 'center'
          }}>
            <Text style={Style.TextStyle}>First Name</Text>
            <TextInput
              style={Style.TextInput}
              onChangeText={text => this.firstNameHandler(text)}
              value={this.state.firstName}
              placeholder='   Enter First Name'
            />
            <Text style={Style.TextStyle}>Middle Name</Text>
            <TextInput
              style={Style.TextInput}
              onChangeText={text => this.middleNameHandler(text)}
              value={this.state.middleName}
              placeholder='   Enter Middle Name'
            />
            <Text style={Style.TextStyle}>Last Name</Text>
            <TextInput
              style={Style.TextInput}
              onChangeText={text => this.lastNameHandler(text)}
              value={this.state.lastName}
              placeholder='   Enter Last Name'
            />
            <Text style={Style.TextStyle}>Phone Number</Text>
            <TextInput
              style={Style.TextInput}
              onChangeText={text => this.cellularNumberHandler(text)}
              value={this.state.cellularNumber}
              placeholder='   Enter Phone Number'
            />
          </View>
        </View>
        {this.state.isImageUpload ?
          <ImageUpload
            visible={this.state.isImageUpload}
            onSelect={(url) => {
              this.setState({ isImageUpload: false, isLoading: false })
              this.updateProfile(url)
            }}
            onClose={() => {
              this.setState({ isImageUpload: false, isLoading: false })
            }} /> : null}
        <View style={{
            padding: 25,
            textAlign: 'center',
            justifyContent: 'center',
            paddingTop: 10
          }}>
          <CustomizedButton onClick={() => {this.update()}} title={'Update'}></CustomizedButton>
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
