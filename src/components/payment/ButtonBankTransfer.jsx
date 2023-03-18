import React, { useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import {  Pressable, Text, VStack } from 'native-base'
import Icon from '../common/Icon'

//data
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { Sizes } from '../../config'
import { paymentStepAtom } from '../../data/recoil/transfer'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const ButtonBankTransfer = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const lang = useRecoilValue(langState)
	const setPaymentStep = useSetRecoilState(paymentStepAtom)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	const handlePress = () => {
		setPaymentStep(2)
		navigation.navigate('PaymentShowBankDetails')
	}

	return (
		<Pressable onPress={handlePress} flex={"1"}>
			<VStack alignItems={"center"} borderWidth={"2"} borderColor={"coolGray.200"} p={Sizes.padding} rounded={Sizes.rounded} flex={"1"}>
				<Icon type={"MaterialCommunity"} name={"bank-transfer"} fontSize={"5xl"} />
				<Text textAlign={"center"}>{language.paymentSelectPayment.ui.buttonPayWithBank}</Text>
			</VStack>
		</Pressable>
	)
}

export default memo(ButtonBankTransfer)
