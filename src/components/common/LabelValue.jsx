import React from 'react'

import { Box, HStack, Text, useBreakpointValue, useMediaQuery } from 'native-base'

const LabelValue = (props) => {
	let { label, value, altContent, additionalContent = null, styles, labelStyles, children } = props
	let content = (<Text textAlign={"right"} >{value}</Text>)
	if(altContent && value == '') { content = altContent }
	let spacing
	const [ xs, base ] = useMediaQuery([{
		maxWidth: 380
	},{
		minWidth: 381
	}])
	switch(true) {
		case xs: spacing = 'flex-start'; break
		case base: spacing = 'center'; break
		default: spacing = 'center'; break
	}
	return (
		<>
			<HStack flexWrap={"wrap"} width={"100%"} justifyContent={'space-between'} alignItems={spacing} bgColor={"white"} pt={"4"} {...styles}>
				<Box width={"50%"} px={"4"} pb={"4"}><Text bold {...labelStyles}>{label}</Text></Box>
				<Box width={"50%"} px={"4"} pb={"4"}>
					{children == null ? content : children}
				</Box>
				{additionalContent}
			</HStack>
		</>
	)
}

export default LabelValue
