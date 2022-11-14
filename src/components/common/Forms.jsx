import React from 'react'
import { Factory, FormControl } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()

const NBIonicon = Factory(Ionicon)

export const ErrorMessage = ({ message, icon }) => {
	return (
		<FormControl.ErrorMessage w={"90%"} leftIcon={<NBIonicon alignSelf={"flex-start"} mt={"0.5"} name={icon} />}>
			{message}
		</FormControl.ErrorMessage>
	)
}