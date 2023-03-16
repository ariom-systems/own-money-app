import React from 'react'

//components
import { HStack, Text } from 'native-base'
import Icon from './Icon'

//data
import { Sizes } from '../../config'

const AlertLabel = ({icon, label, color, styles = null, iconStyles = null, labelStyles = null}) => {
	return (
		<HStack {...styles}>
			<Icon type={"Ionicon"} name={icon} color={color} fontSize={"lg"} pr={"1"} {...iconStyles} />
			<Text color={color} fontSize={"xs"} mt={"0.25"} {...labelStyles}>{label}</Text>
		</HStack>
	)
}

export default AlertLabel
