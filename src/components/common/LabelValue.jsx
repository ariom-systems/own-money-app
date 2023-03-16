import React from 'react'

import { Box, HStack, Text, useBreakpointValue, useMediaQuery } from 'native-base'
import { Sizes } from '../../config'

const LabelValue = (props) => {
	let { label, value, altContent, additionalContent = null, styles, labelStyles, children } = props
	let content = (<Text textAlign={"right"} >{value}</Text>)
	if(altContent && value == '') { content = altContent }
	let alignItems
	const [ xs, base ] = useMediaQuery([{
		maxWidth: 380
	},{
		minWidth: 381
	}])
	switch(true) {
		case xs: alignItems = 'flex-start'; break
		case base: alignItems = 'center'; break
		default: alignItems = 'center'; break
	}
	return (
		<HStack flexWrap={"wrap"} width={"100%"} justifyContent={'space-between'} alignItems={alignItems} bgColor={"white"} px={Sizes.padding} pt={Sizes.padding} {...styles}>
			<Box flex={"1"} pb={"4"}><Text bold {...labelStyles}>{label}</Text></Box>
			<Box flex={"1"} pb={"4"}>
				{children == null ? content : children}
				{additionalContent}
			</Box>
		</HStack>
	)
}

export default LabelValue
