import React, { useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Heading, ScrollView, Text, VStack } from 'native-base'
import PaymentStepIndicator from '../../../components/payment/PaymentStepIndicator'
import AlertBanner from '../../../components/common/AlertBanner'
import Toolbar from '../../../components/common/Toolbar'
import LabelValue from '../../../components/common/LabelValue'
import Notes from '../../../components/payment/Notes'

//data
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { Sizes, paymentShowBankDetailsToolbarConfig } from '../../../config'
import { mapActionsToConfig, formatCurrency } from '../../../data/Actions'
import { paymentStepAtom } from '../../../data/recoil/transfer'
import { transactionObj } from '../../../data/recoil/transactions'
import { userState } from '../../../data/recoil/user'
import { noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const TransferShowBankDetails = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const setPaymentStep = useSetRecoilState(paymentStepAtom)
	const transaction = useRecoilValue(transactionObj)
	const user = useRecoilValue(userState)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)

	const actions = [() => {
		setPaymentStep(0)
		navigation.goBack()
	}]
	let toolbarConfig = mapActionsToConfig(paymentShowBankDetailsToolbarConfig, actions)

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
					<VStack space={Sizes.spacingLarge} w={"100%"} alignItems={"center"} bgColor={"white"} rounded={"8"} p={"4"}>
						<Heading bold>{language.paymentShowBankDetails.headings.bankTransfer}</Heading>
						<Text>{language.paymentShowBankDetails.ui.instructions}</Text>
						<VStack borderColor={"coolGray.800"} borderWidth={"1"} borderRadius={"10"} mx={"5%"}>
							<LabelValue label={language.paymentShowBankDetails.ui.acc_name} value={user.accname} styles={{ bgColor: 'transparent'}} />
							<LabelValue label={language.paymentShowBankDetails.ui.bsb} value={user.bsb} styles={{ bgColor: 'transparent' }} />
							<LabelValue label={language.paymentShowBankDetails.ui.acc} value={user.acc} styles={{ bgColor: 'transparent' }} />
						</VStack>
						<VStack borderColor={"coolGray.800"} borderWidth={"1"} borderRadius={"10"} mx={"5%"}>
							<LabelValue label={language.paymentShowBankDetails.ui.pleasePay} value={formatCurrency(transaction.amount_paid, "en-AU", "AUD").full} styles={{ bgColor: 'transparent' }} />
						</VStack>
						<Notes screen={"BankTransfer"} />
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}

export default memo(TransferShowBankDetails)
