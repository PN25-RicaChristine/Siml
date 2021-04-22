import React, { Component } from 'react';
import { View, Text, Image, } from 'react-native';
import Style from './Style.js';
import Config from 'src/config.js';

class Cards extends Component{
  constructor(props){
    super(props);
  }

  render() {
    return (
      this.props.data && this.props.data.map((u, i) => {
      return (
        <View style={Style.Container}>
          <Image
            style={Style.Image}
            source={u.images && u.images.length > 0 ? { uri: Config.BACKEND_URL + u.images[0].url} : require('assets/test.jpg')}
          />
          <View style={Style.Text}>
            <Text style={Style.Title}>{u.title}</Text>
            <Text style={Style.Price}>USD {u.price}</Text>
            <Text style={Style.Description} numberOfLines={4}>{u.description}</Text>
          </View>
        </View>
      );
    })
    )
  }

}

export default Cards;