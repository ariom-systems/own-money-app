import React, { useEffect } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Button, HStack,Text, VStack, useMediaQuery } from 'native-base'
import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'
import Icon from './Icon'
import { CheckCircleIcon, WarningIcon } from 'native-base'

//data
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { Sizes } from '../../config'
import { transactionObj, transactionList } from '../../data/recoil/transactions'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const TransactionItem = (props) => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const setTransaction = useSetRecoilState(transactionObj)
	const transactions = useRecoilValue(transactionList)
	const lang = useRecoilValue(langState)
	const [ smallScreen ] = useMediaQuery({
		maxWidth: 380
	})
	let { index, fullname, status, transfer_amount, received_amount, button = null } = props
	let headerBgColour, colour, bgColour, element, statusText

	let { label, fn } = button ?? { label: language.components.buttonTranscationPayNow, fn: () => {
		let selected = transactions.find(element => Number(element.id) == Number(props.id))
		setTransaction(selected)
		navigation.navigate('Transfer', { screen: 'PaymentSelect'})
	}}

	switch (status) {
		case 'Completed':
			headerBgColour = "success.600"
			bgColour = "success.200"
			colour = "success.600"
			element = <CheckCircleIcon size={"3xl"} color={"success.600"} />
			statusText = language.components.statusBadgeCompleted
			break
		case 'Cancelled':
			headerBgColour = "error.600"
			bgColour = "error.200"
			colour = "error.700"
			element = <WarningIcon size={"3xl"} color={"error.700"} />
			statusText = language.components.statusBadgeCancelled
			break
		case 'Wait for payment':
			headerBgColour = "primary.600"
			bgColour = "primary.200"
			colour = "primary.700"
			element = <Button onPress={fn}>{label}</Button>
			statusText = language.components.statusBadgeWaitForPayment
			break
	}

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<VStack key={index}>
			<HStack alignItems={"center"} space={"3"} p={Sizes.padding}>
				{element}
				<VStack>
					<Text mb={{ base: "2", sm: "0"}} bold>{fullname}</Text>
					<HStack alignItems={"center"} justifyContent={"flex-end"} space={Sizes.spacing}>
						<AuSVG />
						<Text fontSize={Sizes.tinyText} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{transfer_amount}</Text>
						<Icon type={"Ionicon"} name={"arrow-forward-outline"} />
						<ThSVG />
						<Text fontSize={Sizes.tinyText} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{received_amount}</Text>
					</HStack>
				</VStack>
			</HStack>
		</VStack>
	)
}

export default TransactionItem
