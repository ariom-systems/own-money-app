import React, { useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Box, ScrollView, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import StaticFlatList from '../../../components/transfers/StaticFlatList'
import Toolbar from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'
import AppSafeArea from '../../../components/common/AppSafeArea'

//data
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { transferStepTwoToolbarConfig } from '../../../config'
import { mapActionsToConfig, mapPropertiesToConfig } from '../../../data/Actions'
import { beneficiaryList } from '../../../data/recoil/beneficiaries'
import { noticeState, langState } from '../../../data/recoil/system'
import { stepAtom, stepTwoButtonAtom } from '../../../data/recoil/transfer'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepTwo = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const setStep = useSetRecoilState(stepAtom)
	const beneficiaries = useRecoilValue(beneficiaryList)
	const buttonState = useRecoilValue(stepTwoButtonAtom)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)

	const actions = [
		() => handlePrevious(),,
		() => handleNext()
	]
	let buttonProps = transferStepTwoToolbarConfig[2].buttonProps, toolbarConfig
	const properties = [null, null, { buttonProps: { ...buttonProps, isDisabled: buttonState } }]
	toolbarConfig = mapActionsToConfig(transferStepTwoToolbarConfig, actions)
	toolbarConfig = mapPropertiesToConfig(toolbarConfig, properties)

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	const handleNext = () => {
		setStep(2)
		navigation.navigate('TransferStepThree')
	}

	const handlePrevious = () => {
		setStep(0)
		navigation.goBack()
	}

	return (
		<AppSafeArea>
			<ScrollView>
				<VStack p={"2.5%"} space={"4"}>
					{ notices && <AlertBanner /> }
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<TransferStepIndicator />
						<VStack justifyContent={"space-between"} flexGrow={"1"}>
							<Box w={"100%"} p={"2"} mb={"4"}>
								<Text textAlign={"center"}>{language.transferSteptwo.titleTop }</Text>
							</Box>
							<Box borderColor={"primary.600"} borderWidth={"1"} rounded={"lg"}>
								<StaticFlatList data={beneficiaries} listProps={{ mb: "4", roundedTop: "10", roundedBottom: "10" }} />
							</Box>
						</VStack>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}

export default memo(TransferStepTwo)