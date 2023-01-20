import React, { memo } from 'react'

//components
import { HStack, Text } from 'native-base'

const ReviewListItem = (props) => {
	const { label, value, children } = props
	let row = { justifyContent: "space-between" },
		column = { flexDirection: "column"},
		styles = { px: "4", py: "2", justifyContent: "space-between"},
		newStyles
	if(!children) {
		newStyles = { ...styles, ...row}
	} else {
		newStyles = { ...styles, ...column}
	}
	return (
		<HStack {...newStyles}>
			<Text fontSize={"md"} color={"coolGray.500"}>{ label }</Text>
			{ value && <Text fontSize={"md"}>{ value }</Text>}
			{ children }
		</HStack>
	)
}

export default memo(ReviewListItem)