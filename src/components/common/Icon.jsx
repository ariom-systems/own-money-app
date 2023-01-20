import React, { memo } from "react"

import Ionicon from 'react-native-vector-icons/Ionicons'
import Material from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import { Factory } from 'native-base'

const Icon = (props) => {
	switch(props.type) {
		case 'Ionicon': return <IonIcon {...props} />; break
		case 'Material': return <MaterialIcon {...props} />; break
		case 'MaterialCommunity': return <MaterialCommunityIcon {...props} />; break
	}
}

export default memo(Icon)

const IonIcon = (props) => {
	Ionicon.loadFont()
	const IconOutput = Factory(Ionicon)
	return (
		<IconOutput {...props} />
	)
}

const MaterialIcon = (props) => {
	Material.loadFont()
	const IconOutput = Factory(Material)
	return (
		<IconOutput {...props} />
	)
}

const MaterialCommunityIcon = (props) => {
	MaterialCommunity.loadFont()
	const IconOutput = Factory(MaterialCommunity)
	return (
		<IconOutput {...props} />
	)
}