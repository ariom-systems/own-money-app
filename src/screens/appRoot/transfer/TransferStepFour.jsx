import React, { useContext, useEffect, memo } from 'react'

//components
import AppSafeArea from '../../../components/common/AppSafeArea'
import { useNavigation } from '@react-navigation/native'
import { Box, ScrollView, Text, VStack} from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import AlertBanner from '../../../components/common/AlertBanner'
import Toolbar from '../../../components/common/Toolbar'
import Icon from '../../../components/common/Icon'

//data
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil'
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
	const setStep = useResetRecoilState(stepAtom)
	
	//temp
	const resetTransfer = useResetRecoilState(transferAtom)
	const resetAUD = useResetRecoilState(audAtom)
	const resetStepOneButton = useResetRecoilState(stepOneButtonAtom)
	const resetStepTwoButton = useResetRecoilState(stepTwoButtonAtom)
	const resetStepThreeButton = useResetRecoilState(stepThreeButtonAtom)
	
	const actions = [() => handleBack() ]
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
		navigation.navigate('TransferStepThree')
	}

	const handleNewTransfer = () => {
		//setStep(2)
		//resetTransfer()
		//resetAUD()
		//resetStepOneButton()
		//resetStepTwoButton()
		//resetStepThreeButton()
		//navigation.navigate('TransferStepOne')
	}

	return (
		<AppSafeArea>
			<ScrollView>
				<VStack p={"2.5%"} space={"4"}>
					{notices && <AlertBanner />}
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<Text italic>NOTE: adding transactions to the database is temporarily disabled as to not clutter it up. It will be re-enabled when it's time to go live.</Text>
						<TransferStepIndicator />
					</VStack>
					<VStack space={"4"} w={"100%"} alignItems={"center"} bgColor={"white"} rounded={"8"} p={"4"}>
						<Text>Select Payment Method</Text>
						<Box w={"40%"} p={"4"} bgColor={"amber.100"} borderWidth={"1"} borderColor={"black"}>
							<Text textAlign={"center"}>Poli Payment button will go here</Text>
						</Box>
						<Box w={"40%"} p={"4"} bgColor={"amber.100"} borderWidth={"1"} borderColor={"black"}>
							<Text textAlign={"center"}>Bank transfer button will go here</Text>
						</Box>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}

export default memo(TransferStepFour)