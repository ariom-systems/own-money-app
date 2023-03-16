import React, { memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import Icon from './Icon'

//data
import { Sizes } from '../../config'

const IconSettingsCog = () => {
	const navigation = useNavigation()
	return <Icon type={"Ionicon"} name={"settings-outline"} fontSize={"2xl"} mr={"2"} color={"black"} onPress={() => navigation.openDrawer()} />
}

export default memo(IconSettingsCog)