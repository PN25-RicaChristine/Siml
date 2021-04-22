import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { BasicStyles, Color, Routes } from 'common'
import Footer from 'modules/generic/Footer'
import CardList from 'modules/generic/CardList'
import Style from './Style'
import { connect } from 'react-redux';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import _ from 'lodash';

class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevActive: 0,
      currActive: 0,
      search: null,
      isShow: false,
      data: [],
      isLoading: false,
      limit: 8,
      offset: 0
    }
  }

  componentDidMount() {
    this.retrieve(false);
  }

  retrieve(flag) {
    const { user, tempMembers } = this.props.state
    if (user == null) {
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }, {
        value: user.id,
        column: 'account',
        clause: 'or'
      }, {
        clause: "=",
        column: "status",
        value: "accepted"
      }],
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
    }
    this.setState({ isLoading: true })
    Api.request(Routes.circleRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        response.data.map(i => {
          tempMembers.length > 0 && tempMembers.map(item => {
            console.log(item.account?.id, i.account?.id, 'kasdf');
            if(item.account?.id === i.account?.id) {
              i['added'] = true;
            } else {
              i['added'] = false;
            }
          })
        })
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    });
  }

  render() {
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <View style={Style.TextContainer}>
              <TextInput
                style={BasicStyles.formControl}
                onChangeText={(search) => this.setState({ search })}
                value={this.state.search}
                placeholder={'Search Connections'}
              />
            </View>
            {this.state.data.length > 0 && (<View>
              <CardList navigation={this.props.navigation} data={this.state.data} invite={true} hasAction={false} actionType={'button'} actionContent={'text'}></CardList>
            </View>)}
          </View>
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        {/* <Footer layer={1} {...this.props}/> */}
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
