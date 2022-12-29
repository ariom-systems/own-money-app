import React from 'react'

//components
import { Box, Divider, HStack, Text } from 'native-base'

const DetailRowItem = (props) => {
	const { nb, data } = props
	const [index, section, sectionLength] = [ data.index, data.section, data.section.data.length - 1 ]
	const { label, value } = data.item
	let veryLastItem = 0

	if (section.title == "Details") {
		if (index == sectionLength) {
			veryLastItem = "4"
		}
	}

	return (
		<Box {...nb} px={"4"} roundedBottom={index == sectionLength ? "8" : "0"} mb={veryLastItem}>
			<HStack justifyContent={"space-between"} py={"4"} roundedBottom={index == sectionLength ? "8" : "0"}>
				<Text bold>{label}</Text>
				<Text textAlign={"right"} >{value}</Text>
			</HStack>
		</Box>
	)
}

export default React.memo(DetailRowItem)
