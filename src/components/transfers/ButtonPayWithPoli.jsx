import React, { useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Image, Pressable, Text, VStack } from 'native-base'

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

const ButtonPayWithPoli = () => {
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
		<Pressable onPress={() => navigation.navigate('TransferShowPoliPayment')} flex={"1"}>
			<VStack space={Sizes.spacing} borderWidth={"2"} borderColor={"coolGray.200"} p={Sizes.padding} rounded={Sizes.rounded}>
				<Image style={{ aspectRatio: 3/2 }} source={{ uri: 'https://resources.apac.paywithpoli.com/poli-logo-46.png' }} alt={language.transferStepFour.ui.buttonPayWithPoliImageAlt} />
				<Text textAlign={"center"}>{language.transferStepFour.ui.buttonPayWithPoli}</Text>
			</VStack>
		</Pressable>
	)
}

export default memo(ButtonPayWithPoli)
