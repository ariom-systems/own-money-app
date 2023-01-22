import React, { useEffect } from 'react'

//components
import { Avatar, Badge, HStack, Spacer, Text, VStack } from 'native-base'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const TransactionItem = (props) => {
	const forceUpdate = useForceUpdate()
	const lang = useRecoilValue(langState)
	let { index, initials, fullname, status, transfer_amount, received_amount } = props

	let scheme, message
	switch (status) {
		case 'Wait for payment': [scheme, message] = ['default', language.components.statusBadgeWaitForPayment]; break
		case 'Cancelled': [scheme, message] = ['danger', language.components.statusBadgeCancelled]; break
		case 'Completed': [scheme, message] = ["default", language.components.statusBadgeCompleted]; break
	}

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<HStack key={index} alignItems={"center"} space={"3"} py={"4"}>
			<Avatar size={"48px"} bgColor={"primary.600"}>{initials}</Avatar>
			<VStack>
				<Text mb={"2"} bold>{fullname}</Text>
			</VStack>
			<Spacer />
			<VStack alignContent={"flex-end"} space={"2"}>
				<Badge colorScheme={scheme} variant={"outline"}>{message}</Badge>
				<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{transfer_amount}</Text>
				<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{received_amount}</Text>
			</VStack>
		</HStack>
	)
}

export default TransactionItem