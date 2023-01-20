import React from 'react'

import { HStack, Text } from 'native-base'

const LabelValue = (props) => {
	let { label, value, altContent, styles } = props
	let content = (<Text textAlign={"right"} >{value}</Text>)
	if(altContent && value == '') { content = altContent }
	return (
		<HStack justifyContent={"space-between"} bgColor={"white"} p={"4"} {...styles}>
			<Text bold>{label}</Text>	
			{content}
		</HStack>
	)
}

export default LabelValue
