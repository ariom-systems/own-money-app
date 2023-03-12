import React, { useEffect, memo } from 'react'

//components
import AppSafeArea from '../../../components/common/AppSafeArea'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import AlertBanner from '../../../components/common/AlertBanner'
import Toolbar from '../../../components/common/Toolbar'

//data
import { useRecoilValue, useRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'

import { transferShowPayIDToolbarConfig } from '../../../config'

import { mapActionsToConfig } from '../../../data/Actions'
import { noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const TransferShowPayID = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)

	const actions = [() => navigation.navigate('TransferStepFour')]
	let toolbarConfig = mapActionsToConfig(transferShowPayIDToolbarConfig, actions)

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
				<VStack p={"2.5%"} space={"4"}>
					{notices && <AlertBanner />}
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<TransferStepIndicator />
					</VStack>
					<VStack space={"4"} w={"100%"} alignItems={"center"} bgColor={"white"} rounded={"8"} p={"4"}>
						<Text>Pay ID</Text>

					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}

export default memo(TransferShowPayID)
