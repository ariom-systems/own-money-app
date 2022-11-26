import React from 'react'
import { Divider, Text, VStack } from 'native-base'

const DetailRowItem = (data) => {
	const { label, value } = data.data.item
	return (
		<>
			<VStack px={"4"} py={"2"}>
				<Text fontSize={"xs"} color={"coolGray.500"}>{label}</Text>
				<Text fontSize={"lg"}>{value}</Text>
			</VStack>
			<Divider />
		</>
	)
}

export default React.memo(DetailRowItem)