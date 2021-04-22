import React, { Component } from 'react';
import { View, ScrollView, Image, Dimensions, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import UserImage from 'components/User/Image';
const height = Math.round(Dimensions.get('window').height);

class PeopleList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    const { theme } = this.props.state;
    return (
      <View style={{
        width: '100%',
        position: 'relative',
        flexDirection: 'row'
      }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginRight: '5%' }}>
          <FontAwesomeIcon
            icon={faPlusCircle}
            size={45}
            style={{
              color: Color.primary,
              marginLeft: 20,
              fontSize: 1
            }}
            onPress={() => this.props.redirectTo()}
          />
          {
            data && data.length > 0 && data.map((item, index) => (
              <View style={{
                borderWidth: 1,
                borderColor: theme ? theme.primary : Color.primary,
                borderRadius: 50,
                width: 45,
                height: 45,
                marginLeft: 3,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserImage
                  key={index}
                  user={
                    item.account
                  }
                  color={Color.primary}
                  size={45}
                  borderColor={Color.primary}
                  borderWidth={3}
                  marginLeft={3} />
              </View>
            ))
          }
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setTheme: (theme) => dispatch(actions.setTheme(theme))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(PeopleList);
