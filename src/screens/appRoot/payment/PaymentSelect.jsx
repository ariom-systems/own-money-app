import React, { useEffect, useContext, memo } from 'react'

//components
import AppSafeArea from '../../../components/common/AppSafeArea'
import { useNavigation } from '@react-navigation/native'
import { HStack, ScrollView, Spacer, Text, VStack } from 'native-base'
import PaymentStepIndicator from '../../../components/payment/PaymentStepIndicator'
import AlertBanner from '../../../components/common/AlertBanner'
import Toolbar from '../../../components/common/Toolbar'
import ButtonPayWithPoli from '../../../components/payment/ButtonPayWithPoli'
import ButtonBankTransfer from '../../../components/payment/ButtonBankTransfer'
import ButtonPayWithPayID from '../../../components/payment/ButtonPayWithPayID'

//data
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { Sizes, transferStepFourToolbarConfig } from '../../../config'
import { mapActionsToConfig } from '../../../data/Actions'
import { paymentStepAtom, transferAtom } from '../../../data/recoil/transfer'
import { noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const PaymentSelect = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const [transfer, setTransfer] = useRecoilState(transferAtom)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)
	const setStep = useSetRecoilState(paymentStepAtom)

	//temp

	const actions = [() => handleBack()]
	let toolbarConfig = mapActionsToConfig(transferStepFourToolbarConfig, actions)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	const handleBack = () => {
		setStep(3)
		navigation.navigate('TransferStepFour')
	}

	return (
		<AppSafeArea>
			<ScrollView>
				<VStack p={"2.5%"} space={Sizes.spacing}>
					{notices && <AlertBanner />}
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<PaymentStepIndicator />
					</VStack>
					<VStack space={Sizes.spacing} w={"100%"} alignItems={"center"} bgColor={"white"} rounded={"8"} p={"4"}>
						<Text>{ language.paymentSelectPayment.headings.selectPayment }</Text>
						<HStack space={Sizes.spacing} w={"3/4"} alignItems={"stretch"}>
							<ButtonBankTransfer />
							<ButtonPayWithPoli />
						</HStack>
						<HStack space={Sizes.spacing} w={"3/4"} >
							<ButtonPayWithPayID />
							<Spacer />
						</HStack>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}

export default memo(PaymentSelect)