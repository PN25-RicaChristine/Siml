import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
import Config from 'src/config.js';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ScrollView } from 'react-native-gesture-handler';
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Settings extends Component {

	constructor(props) {
		super(props);
		this.state = {
			options: [
				{
					title: 'Edit Group Name',
					type: 'button'
				},
				{
					title: 'Members',
					type: 'icon'
				},
				{
					title: 'Rate Now',
					type: 'icon'
				},
				{
					title: 'Close',
					type: 'close'
				}
			]
		}
	}

	render() {
		const { options } = this.state;
		return (
			<View style={{
				position: 'absolute',
				zIndex: 1000,
				bottom: 0,
				right: 0,
				height: height * 0.45,
				width: width,
				backgroundColor: Color.white,
				borderTopLeftRadius: BasicStyles.standardBorderRadius,
				borderTopRightRadius: BasicStyles.standardBorderRadius,
				borderWidth: 1,
				borderColor: Color.lightGray
			}}
			>
				<ScrollView>
					<View style={{alignItems: 'center', marginBottom: 50, marginTop: 10 }}>
					<View style={{borderBottomWidth: 2, marginBottom: 10, borderBottomColor: 'gray', width: 70}}></View>
						<Text style={{ fontWeight: 'bold' }}>More settings</Text>
					</View>
					{
						options.map(item => {
							return (
								<TouchableOpacity style={{
									height: 50,
									alignItems: 'center',
									flexDirection: 'row',
									borderBottomWidth: 1,
									paddingLeft: 20,
									paddingRight: 20,
									borderBottomColor: Color.lightGray
								}}
								>
									<Text style={{
										fontSize: BasicStyles.standardFontSize,
										color: item.type === 'close' ? Color.danger : 'black'
									}}>{item.title}</Text>
									{item.type === 'button' && <View style={{
										width: '25%',
										justifyContent: 'center',
										alignItems: 'center',
										height: 35,
										position: 'absolute',
										right: 10,
										borderRadius: 20,
										backgroundColor: Color.primary
									}}>
										<TouchableOpacity
											onPress={() => {
												this.setState({isVisible: true})
											}}>
											<Text style={{
												color: Color.white,
												fontSize: BasicStyles.standardFontSize
											}}>Edit</Text>
										</TouchableOpacity>
									</View>}
									{item.type === 'icon' && <View style={{
                    position: 'absolute',
										right: 30,
                    justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      size={30}
                      style={{ color: Color.primary }} />
                  </View>}
								</TouchableOpacity>
							)
						})}
				</ScrollView>
			</View>
		);
	}
}

export default Settings;