import React from 'react'
import { Avatar, Badge, Box, HStack, Pressable, Spacer, Text, VStack } from 'native-base'
import Modal from './Modal'
import { formatCurrency } from '../../data/Actions'

const ListItem = (props) => {
	const { fullname, initials, status, transfer_amount, received_amount } = props.data
	const [ modalVisible, setModalVisible ] = React.useState(false)
	let statusBadge
	switch( status ) {
		case 'Wait for payment': statusBadge = 'default'; break
		case 'Cancelled': statusBadge = 'danger'; break
		case 'Completed': statusBadge = 'success'; break
	}

	const handlePress = () => {
		setModalVisible(!modalVisible)
	}

	const handleModalClose = () => {
		alert("test")
	}

	return (
		<Box>
			<Pressable px={"4"} onPress={handlePress}>
				<HStack alignItems={"center"} space={"3"} py={"4"}>
					<Avatar size={"48px"} backgroundColor={"primary.600"}>{ initials }</Avatar>
					<VStack>
						<Text mb={"2"} bold>{ fullname }</Text>
					</VStack>
					<Spacer />
					<VStack alignContent={"flex-end"} space={"2"}>
						<Badge colorScheme={ statusBadge } variant={"outline"}>{ status }</Badge>
						<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{ formatCurrency(transfer_amount, "en-AU", "AUD").full } AUD</Text>
						<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{ formatCurrency(received_amount, "th-TH", "THB").full } THB</Text>
					</VStack>
				</HStack>
			</Pressable>
			<Modal isOpen={modalVisible} onClose={setModalVisible} data={props.data} />
		</Box>
	)
}

export default React.memo(ListItem)