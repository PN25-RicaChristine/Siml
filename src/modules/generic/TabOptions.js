import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import Style from 'modules/generic/TabOptionStyle.js'

class Tab extends Component{
  constructor(props){
    super(props);
    this.state = {
        choice: this.props.choice[0]
    }
  }

  choiceHandler = (value) => {
    this.setState({choice: value});
    this.props.onClick(value)
  }

  render() {
    return (
      <View>
        {
          (this.props.level === 1) && (
            <View style={Style.Tab}>
              <TouchableOpacity style={this.state.choice == this.props.choice[0] ? Style.MenuClicked : Style.Menu} onPress={() => this.choiceHandler('Menu')}>
                <Text style={this.state.choice == this.props.choice[0] ? {color: 'white', marginTop: 12} : {color: 'black', marginTop: 12}}>{this.props.choice[0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={this.state.choice == this.props.choice[1] ? Style.InformationClicked : Style.Information} onPress={() => this.choiceHandler('Information')}>
                <Text style={this.state.choice == this.props.choice[1] ? {color: 'white', marginTop: 12} : {color: 'black', marginTop: 12}}>{this.props.choice[1]}</Text>
              </TouchableOpacity>
            </View>
          )
        }
        {
          (this.props.level === 2) && (
            <View style={Style.Tab}>
              <TouchableOpacity style={[Style.InformationClicked, {width: '100%'}]}>
                <Text style={{color: 'white', marginTop: 12}}>{this.props.choice[0]}</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    )
  }

}

export default Tab;