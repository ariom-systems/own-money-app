import React from 'react'

import { HStack, Text } from 'native-base'

const LabelValue = (props) => {
	let { label, value, altContent, styles, labelStyles, children } = props
	let content = (<Text textAlign={"right"} >{value}</Text>)
	if(altContent && value == '') { content = altContent }
	return (
		<HStack justifyContent={"space-between"} bgColor={"white"} p={"4"} {...styles}>
			<Text bold {...labelStyles}>{label}</Text>
			{ children == null ? content : children}
		</HStack>
	)
}

export default LabelValue
