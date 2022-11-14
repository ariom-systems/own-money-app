import React from 'react'
import { Platform } from 'react-native'
import { Factory } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()

const NBIonicon = Factory(Ionicon)

export default IconSettingsCog = ({props}) => {
	const navigation = props
	return <NBIonicon 
		name={Platform.OS === 'ios' ? "ios-settings-outline" : "md-settings-outline" } 
		fontSize={"2xl"}
		mr={"2"}
		color={"#000"} 
		onPress={() => navigation.getParent('AppRoot').navigate('Settings')} />
}