import React, { memo } from 'react'
import Icon from './Icon'
import { useNavigation } from '@react-navigation/native'

const IconSettingsCog = () => {
	const navigation = useNavigation()
	return <Icon type={"Ionicon"} name={"settings-outline"} fontSize={"2xl"} mr={"2"} color={"black"} onPress={() => navigation.openDrawer()} />
}

export default memo(IconSettingsCog)