import React, { useEffect, useContext, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Pressable, ScrollView, Spacer, Text, VStack} from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import AlertBanner from '../../../components/common/AlertBanner'
import LabelValue from '../../../components/common/LabelValue'

//data
import { useRecoilValue, useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { api, Sizes } from '../../../config'
import { buildDataPath, addExtraRecordData } from '../../../data/Actions'
import { AuthContext } from '../../../data/Context'
import { transactionList, transactionObj } from '../../../data/recoil/transactions'
import { transferAtom, stepAtom, paymentStepAtom, audAtom, promoAtom, buttonState } from '../../../data/recoil/transfer'
import { noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const TransferStepFour = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const { auth } = useContext(AuthContext)
	const [ transactions, setTransactions ] = useRecoilState(transactionList)
	const [ transaction, setTransaction ] = useRecoilState(transactionObj)
	const setStep = useSetRecoilState(stepAtom)
	const setPaymentStep = useSetRecoilState(paymentStepAtom)
	const transfer = useRecoilValue(transferAtom)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)
	const resetTransfer = useResetRecoilState(transferAtom)
	const resetTransaction = useResetRecoilState(transactionObj)
	const resetStep = useResetRecoilState(stepAtom)
	const resetAUD = useResetRecoilState(audAtom)
	const resetPromo = useResetRecoilState(promoAtom)
	const resetButton = useResetRecoilState(buttonState)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])
	
	useEffect(() => {	
		api.get(buildDataPath('transactions', auth.uid, 'list', { from: 'now' }))
			.then(response => {
				let data = response.data, newData
				newData = addExtraRecordData(data)
				setTransactions(newData)
				setStep(3)
			})
			.catch(error => console.error('error setting transactions list', error))
	},[])

	const handleProceedToPayment = () => {
		if (transfer.transaction_DB_id != 'undefined') {
			let tmpObj = transactions.find(element => Number(element.id) == Number(transfer.transaction_DB_id))
			if (tmpObj) {
				console.log('found', tmpObj)
				setTransaction(tmpObj)
			}
		}

		navigation.navigate('PaymentSelect')
	}

	const handleNewTransfer = () => {
		resetTransfer()
		resetTransaction()
		resetStep()
		resetAUD()
		resetPromo()
		resetButton()
		navigation.navigate('TransferStepOne')
	}

	return (
		<AppSafeArea>
			<ScrollView>
				<VStack p={"2.5%"} space={Sizes.spacing}>
					{notices && <AlertBanner />}
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<TransferStepIndicator />
					</VStack>
					<VStack space={Sizes.spacingLarge} w={"100%"} alignItems={"center"} bgColor={"white"} rounded={"8"} p={"4"}>
						<LabelValue label={ language.transferStepFour.headings.orderPlaced } value={transaction.transaction_number || ""}  />
						<Text alignSelf={"stretch"}>{ language.transferStepFour.ui.instructions }</Text>
						<VStack space={Sizes.spacingLarge} w={"100%"}>
							<Pressable p={Sizes.padding} bgColor={"primary.600"} rounded={Sizes.rounded} onPress={handleProceedToPayment}>
								<Text textAlign={"center"} color={"white"} fontSize={"xl"}>{ language.transferStepFour.ui.buttonMakePayment }</Text>
							</Pressable>
							<Pressable p={Sizes.padding} borderColor={"primary.600"} borderWidth={"2"} rounded={Sizes.rounded} onPress={handleNewTransfer}>
								<Text textAlign={"center"} color={"primary.600"} fontSize={"xl"}>{ language.transferStepFour.ui.buttonNewTransfer }</Text>
							</Pressable>
						</VStack>
					</VStack>
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}

export default memo(TransferStepFour)