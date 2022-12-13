import React from 'react'
import { Avatar, Badge, Box, HStack, Pressable, Spacer, Text, VStack } from 'native-base'
import Modal from './Modal'
import { formatCurrency } from '../../data/Actions'
import { AuthContext } from '../../data/Context'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListItem = (props) => {
	const { auth } = React.useContext(AuthContext)
	const { fullname, initials, status, transfer_amount, received_amount } = props.data
	const styles = props.styles
	const [ modalVisible, setModalVisible ] = React.useState(false)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	let badgeWaiting = <Badge colorScheme={"default"} variant={"outline"}>{ language.components.statusBadgeWaitForPayment }</Badge>
	let badgeCancelled = <Badge colorScheme={"danger"} variant={"outline"}>{ language.components.statusBadgeCancelled }</Badge>
	let badgeCompleted = <Badge colorScheme={"success"} variant={"outline"}>{ language.components.statusBadgeCompleted }</Badge>

	let statusBadge
	switch(status) {
		case 'Wait for payment': statusBadge = badgeWaiting; break
		case 'Cancelled': statusBadge = badgeCancelled; break
		case 'Completed': statusBadge = badgeCompleted; break
	} 

	const handlePress = () => {
		setModalVisible(!modalVisible)
	}

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth.lang])

	React.useEffect(() => {
		forceUpdate()
	}, [status, auth.lang])

	return (
		<Box>
			<Pressable px={"4"} onPress={handlePress} bgColor={"white"} {...styles}>
				<HStack alignItems={"center"} space={"3"} py={"4"}>
					<Avatar size={"48px"} backgroundColor={"primary.600"}>{ initials }</Avatar>
					<VStack>
						<Text mb={"2"} bold>{ fullname }</Text>
					</VStack>
					<Spacer />
					<VStack alignContent={"flex-end"} space={"2"}>
						{ statusBadge }
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