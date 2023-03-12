import React, { useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Box, Pressable, Text, VStack } from 'native-base'
import PayIDSVG from '../../assets/img/PayIDSVG'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { Sizes } from '../../config'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const ButtonPayWithPayID = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const lang = useRecoilValue(langState)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	return (
		<Pressable onPress={() => navigation.navigate('TransferShowPayID')} flex={"1"}>
			<VStack space={Sizes.spacing} borderWidth={"2"} borderColor={"coolGray.200"} p={Sizes.padding} rounded={Sizes.rounded}>
				<PayIDSVG width={60} height={60} />
				<Text textAlign={"center"}>{language.transferStepFour.ui.buttonPayWithPayID}</Text>
			</VStack>
		</Pressable>
	)
}

export default memo(ButtonPayWithPayID)
