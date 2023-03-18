import React, { useEffect, memo } from 'react'

//components
import AppSafeArea from '../../../components/common/AppSafeArea'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, Text, VStack } from 'native-base'
import PaymentStepIndicator from '../../../components/payment/PaymentStepIndicator'
import AlertBanner from '../../../components/common/AlertBanner'
import Toolbar from '../../../components/common/Toolbar'

//data
import Config from 'react-native-config'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { Sizes, paymentShowPoliPaymentToolbarConfig } from '../../../config'
import { mapActionsToConfig } from '../../../data/Actions'
import { transferAtom, paymentStepAtom } from '../../../data/recoil/transfer'
import { noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const TransferShowPoliPayment = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const [ transfer, setTransfer ] = useRecoilState(transferAtom)
	const setPaymentStep = useSetRecoilState(paymentStepAtom)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)


	const actions = [() => {
		setPaymentStep(0)
		navigation.goBack()
	}]
	let toolbarConfig = mapActionsToConfig(paymentShowPoliPaymentToolbarConfig, actions)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	return (
		<AppSafeArea>
			<ScrollView>
				<VStack p={"2.5%"} space={Sizes.spacing}>
					{notices && <AlertBanner />}
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<PaymentStepIndicator />
					</VStack>
					<VStack space={Sizes.spacing} w={"100%"} alignItems={"center"} bgColor={"white"} rounded={"8"} p={"4"}>
						<Text>Poli Payment</Text>
						<Text>(still working on it)</Text>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}

export default memo(TransferShowPoliPayment)
