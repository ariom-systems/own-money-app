import React from 'react'
import { Box, Divider, Text, VStack } from 'native-base'

const DetailRowItem = (props) => {
	//console.log(props.data)
	const { nb, data } = props
	const index = data.index
	const sectionLength = data.section.data.length - 1
	const { label, value } = data.item
	
	return (
		<Box {...nb} roundedBottom={ index == sectionLength ? "4" : "0"}>
			<VStack px={"4"} py={"2"} roundedBottom={ index == sectionLength ? "4" : "0"}>
				<Text fontSize={"xs"} color={"coolGray.500"}>{label}</Text>
				<Text fontSize={"lg"}>{value}</Text>
			</VStack>
			{index != sectionLength && <Divider /> }
		</Box>
	)
}

export default React.memo(DetailRowItem)