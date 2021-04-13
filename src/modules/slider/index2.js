
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './Style';
import {NavigationActions, StackActions} from 'react-navigation';
import {ScrollView, Text, View, Image, Share, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Helper, BasicStyles, Color } from 'common';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt, faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Gradient from 'modules/generic/Gradient'
import LinearGradient from 'react-native-linear-gradient'
import {Dimensions} from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class Slider2 extends Component {
  constructor(props){
    super(props);
  }
  navigateToScreen = (route) => {
    if(route == 'share'){
      this.onShare()
      return
    }
    this.props.navigation.toggleDrawer();
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
            NavigationActions.navigate({routeName: route, params: {
              initialRouteName: route,
              index: 0
            }}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  onShare = async () => {
    const { user } = this.props.state;
    if(user == null){
      return
    }
    try {
      const result = await Share.share({
        message: 'https://wearesynqt/profile/' + user.code
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  logoutAction(){
    
    //clear storage
    const { logout, setActiveRoute } = this.props;
    logout();
    // setActiveRoute(null)
    this.props.navigation.navigate('loginStack');
  }

  render () {
    const { user, theme } = this.props.state;
    console.log(user.account_information)
    return (
    <Gradient style={{height: height, paddingRight: 10, marginTop: '-1%'}} content={
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flex:1, flexDirection: 'row'}}>
                <View style={{backgroundColor: Color.white, height:height, width:'25%', borderTopRightRadius: 50, borderBottomRightRadius: 50, zIndex: 999, elevation: 50}}>
                    <View style={{marginTop: '40%', marginLeft: 10}}>
                        <TouchableOpacity  onPress={() => this.props.navigation.toggleDrawer()}>
                            <FontAwesomeIcon color={Color.primary} icon={faTimes} size={BasicStyles.iconSize}></FontAwesomeIcon>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex:1, flexDirection: 'row', marginTop: '10%', position: 'absolute', right: 0}}>
                    <Text style={{color: Color.white, fontWeight: 'bold', marginTop: '8%', marginRight: 10}}>{user.account_information.first_name} {user.account_information.last_name}</Text>
                    <Image
                        source={{uri: Config.BACKEND_URL  + user.account_profile.url}}
                        style={[BasicStyles.profileImageSize, {
                          height: 50,
                          width: 50,
                          borderRadius: 50,
                          borderWidth: 2,
                          borderColor: Color.warning
                        }]}/>
                </View>
                <View style={{marginTop: '60%',position: 'absolute', right: 0, alignItems: 'flex-end'}}>
                {Helper.DrawerMenu.length > 0 &&
                    Helper.DrawerMenu.map((item, index) => {
                        return(
                            <View style={[styles.navSectionStyle, {flex: 1, flexDirection: 'row-reverse', borderBottomWidth: item.borderBottom == true ? 1 : 0, width: '180%', borderColor:Color.white}]}>
                                <FontAwesomeIcon style={styles.navItemStyle} icon={item.icon} size={BasicStyles.iconSize}></FontAwesomeIcon>
                                <Text style={{color:Color.white, marginRight: 10, marginTop: 2}} onPress={() => item.title  == 'Connections' ? this.props.navigation.navigate('connectionStack') : this.navigateToScreen(item.route)}>{item.title}</Text>
                            </View>
                            )
                    })
                }
                <View style={[styles.navSectionStyle, {borderBottomWidth: 0,flex: 1, flexDirection: 'row',}]}>
                    <TouchableOpacity  onPress={() => this.logoutAction()}>
                        <Text style={{color:Color.white, marginRight: 10, marginTop: 2}}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => this.logoutAction()}>
                        <FontAwesomeIcon style={styles.navItemStyle} icon={faSignOutAlt} size={BasicStyles.iconSize}></FontAwesomeIcon>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </ScrollView>
    }/>
    );
  }
}

Slider2.propTypes = {
  navigation: PropTypes.object
};

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
    setActiveRoute: (route) => dispatch(actions.setActiveRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Slider2);
