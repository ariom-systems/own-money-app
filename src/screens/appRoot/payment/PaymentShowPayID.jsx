import React, { useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Heading, HStack, Pressable, ScrollView, Text, VStack } from 'native-base'
import PaymentStepIndicator from '../../../components/payment/PaymentStepIndicator'
import AlertBanner from '../../../components/common/AlertBanner'
import Toolbar from '../../../components/common/Toolbar'
import LabelValue from '../../../components/common/LabelValue'
import Notes from '../../../components/payment/Notes'

//data
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { Sizes, paymentShowPayIDToolbarConfig } from '../../../config'
import { mapActionsToConfig, formatCurrency } from '../../../data/Actions'
import { paymentStepAtom } from '../../../data/recoil/transfer'
import { transactionObj } from '../../../data/recoil/transactions'
import { userState } from '../../../data/recoil/user'
import { noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
import CopyButton from '../../../components/common/CopyButton'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const TransferShowPayID = () => {
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
	let toolbarConfig = mapActionsToConfig(paymentShowPayIDToolbarConfig, actions)

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
						<Heading bold>{language.paymentShowPayID.headings.payID}</Heading>
						<Text>{language.paymentShowPayID.ui.instructions}</Text>
						<VStack w={"90%"} borderColor={"coolGray.800"} borderWidth={"1"} borderRadius={"10"} space={Sizes.spacing}>
							<HStack alignItems={"center"} justifyContent={"space-between"} w={"100%"} px={Sizes.padding} py={Sizes.spacing}>
								<VStack space={Sizes.spacing}>
									<Text bold>{language.paymentShowPayID.ui.acc_name}</Text>
									<Text>{user.payid_name}</Text>
								</VStack>
								<CopyButton payload={user.payid_name} />
							</HStack>
							<HStack alignItems={"center"} justifyContent={"space-between"} w={"100%"} px={Sizes.padding} py={Sizes.spacing}>
								<VStack space={Sizes.spacing}>
									<Text bold>{language.paymentShowPayID.ui.payID}</Text>
									<Text fontSize={"xs"}>{user.payid}</Text>
								</VStack>
								<CopyButton payload={user.payid} />
							</HStack>
						</VStack>
						<VStack borderColor={"coolGray.800"} borderWidth={"1"} borderRadius={"10"} mx={"5%"}>
							<LabelValue label={language.paymentShowPayID.ui.pleasePay} value={formatCurrency(transaction.amount_paid, "en-AU", "AUD").full} styles={{ bgColor: 'transparent' }} />
						</VStack>
						<Notes screen={"BankTransfer"} />
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}

export default memo(TransferShowPayID)
