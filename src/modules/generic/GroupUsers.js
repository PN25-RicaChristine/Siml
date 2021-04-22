import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text } from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck, faTimes, faStar} from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
const height = Math.round(Dimensions.get('window').height);
import UserImage from 'components/User/Image';

class GroupUsers extends Component{
  constructor(props){
    super(props);
  }

  render() {
    const { data } = this.props;
    return (
			<View style={{
        width: '100%',
        position: 'relative',
        flexDirection: 'row',
        ...this.props.style
      }}>
        {
          data.length > 0 && data.map((item, index) => {
            if(index < 5) {
              return (
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('viewProfileStack', { user: item, level: 1 }) }}>
                  <UserImage
                    user={{profile: item.account?.profile ? item.account.profile : item?.profile}}
                    color={this.props.color ? this.props.color : Color.secondary}
                    size={ this.props.size ? this.props.size : 30 }
                    style={{
                      width: this.props.size,
                      height: this.props.size,
                      borderRadius: 30,
                      marginRight: '2%',
                      borderColor: Color.secondary,
                      borderWidth: 1
                    }}/>
                </TouchableOpacity>
              )
            }
          })
        }{
          data.length > 5 && (
            <Text style={{color: Color.gray, marginLeft: -3}}>+{data.length - 5}</Text>
          )
        }
			</View>
    )
  }
}

export default GroupUsers;