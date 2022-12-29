import React from 'react'

//components
import { Box, Divider, Hidden, Text, VStack } from 'native-base'

const DetailRowItem = (props) => {
	const { nb, data } = props
	const index = data.index
	const section = data.section
	const sectionLength = data.section.data.length - 1
	const { label, value } = data.item
	let veryLastItem

	if (section.title == "Address Details") {
		if (index == sectionLength) {
			veryLastItem = true
		}
	}

	return (
		<Box {...nb} roundedBottom={index == sectionLength ? "8" : "0"} mb={veryLastItem ? "4" : "0"}>
			<VStack px={"4"} py={"2"} roundedBottom={ index == sectionLength ? "8" : "0"}>
				<Text fontSize={"xs"} color={"coolGray.500"}>{label}</Text>
				<Text fontSize={"lg"}>{value}</Text>
			</VStack>
			{index != sectionLength && <Divider /> }		
		</Box>
	)
}

export default React.memo(DetailRowItem)