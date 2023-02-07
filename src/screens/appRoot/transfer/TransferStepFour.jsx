import React, { useContext, useEffect, memo } from 'react'

//components
import AppSafeArea from '../../../components/common/AppSafeArea'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, Text, VStack} from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import AlertBanner from '../../../components/common/AlertBanner'
import Toolbar from '../../../components/common/Toolbar'
import Icon from '../../../components/common/Icon'

//data
import { useRecoilValue, useResetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { AuthContext } from '../../../data/Context'
import { transferStepFourToolbarConfig } from '../../../config'
import { mapActionsToConfig } from '../../../data/Actions'
import { stepAtom, transferAtom, audAtom, thbSelector, feeSelector, rateSelector, stepOneButtonAtom, stepTwoButtonAtom, stepThreeButtonAtom } from '../../../data/recoil/transfer'
import { noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepFour = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)
	
	//temp
	const resetTransfer = useResetRecoilState(transferAtom)
	const resetAUD = useResetRecoilState(audAtom)
	const resetStepOneButton = useResetRecoilState(stepOneButtonAtom)
	const resetStepTwoButton = useResetRecoilState(stepTwoButtonAtom)
	const resetStepThreeButton = useResetRecoilState(stepThreeButtonAtom)
	
	const actions = [() => handleNewTransfer() ]
	let toolbarConfig = mapActionsToConfig(transferStepFourToolbarConfig, actions)
	
	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	const handleNewTransfer = () => {
		setStep(0)
		resetTransfer()
		resetAUD()
		resetStepOneButton()
		resetStepTwoButton()
		resetStepThreeButton()
		navigation.navigate('TransferStepOne')
	}

	return (
		<AppSafeArea>
			<ScrollView>
				<VStack p={"2.5%"} space={"4"}>
					{notices && <AlertBanner />}
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<TransferStepIndicator />
					</VStack>
					<VStack space={"4"} w={"100%"} alignItems={"center"} bgColor={"white"} rounded={"8"} p={"4"}>
						<Text>Under Construction</Text>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>


		// <ScrollView w={"100%"} flex={"1"}>
		// 	<Box mx={"2.5%"} mt={"5%"} px={"5%"} pt={"5%"}  backgroundColor={"white"} h={"100%"} rounded={"2xl"}>
		// 		<StepIndicator
		// 			stepCount={4}
		// 			currentPosition={transfer.step}
		// 			labels={labels} />
		// 		<VStack my={"5%"} borderColor={"primary.600"} borderWidth={"1"} rounded={"lg"} overflow={"hidden"}>
		// 			<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
		// 				<Heading size={"sm"}>{ language.transferStepFour.currencyCodeAUD }</Heading>
		// 			</Box>
		// 			<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
		// 				<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
		// 				<Text fontSize={"md"}>{ summary.get().sender }</Text>
		// 			</HStack>
		// 			<Divider />
		// 			<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
		// 				<Heading size={"sm"}>{ language.transferStepFour.currencyCodeAUD }</Heading>
		// 			</Box>
		// 			<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
		// 				<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
		// 				<Text fontSize={"md"}>{ summary.get().receiver }</Text>
		// 			</HStack>
		// 			<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
		// 				<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
		// 				<Text fontSize={"md"}>{ summary.get().accountnumber }</Text>
		// 			</HStack>
		// 			<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
		// 				<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
		// 				<Text fontSize={"md"}>{ summary.get().branchname }</Text>
		// 			</HStack>
		// 			<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
		// 				<Heading size={"sm"}>{ language.transferStepFour.currencyCodeAUD }</Heading>
		// 			</Box>
		// 			<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
		// 				<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
		// 				<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } ${ summary.get().transfer_amount }</Text>
		// 			</HStack>
		// 			<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
		// 				<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
		// 				<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } ฿{ summary.get().received_amount }</Text>
		// 			</HStack>
		// 			<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
		// 				<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
		// 				<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } ${ summary.get().fee_AUD }</Text>
		// 			</HStack>
		// 			<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
		// 				<Heading size={"sm"}>{ language.transferStepFour.currencyCodeAUD }</Heading>
		// 			</Box>
		// 			<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
		// 				<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
		// 				<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } { formatCurrency(summary.get().total_to_pay, "en-AU", "AUD").full }</Text>
		// 			</HStack>
		// 			<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
		// 				<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
		// 				<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } ฿{ summary.get().received_amount }</Text>
		// 			</HStack>
		// 		</VStack>
		// 		<HStack space={"4"} w={"100%"} justifyContent={"center"}>
		// 			<Button alignSelf={"center"} w={"50%"} onPress={handleFinishTransfer}>
		// 				<Text fontSize={"lg"} color={"#FFFFFF"}>{ language.transferStepFour.buttonNewTransfer }</Text>
		// 			</Button>
		// 		</HStack>
		// 	</Box>
		// </ScrollView>
	)
}

export default memo(TransferStepFour)