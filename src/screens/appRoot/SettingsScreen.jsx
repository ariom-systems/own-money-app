import React, { useContext, useState, useEffect } from 'react'
import { Box, Center, Divider, Factory, Heading, HStack, Pressable, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import { hasUserSetPinCode } from '@haskkor/react-native-pincode'
import Config from 'react-native-config'
import { AuthContext, DataContext } from '../../data/Context'
import { keychainReset } from '../../data/Actions'
import { LanguageToggle } from '../../components/common/LanguageToggle'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const NBIonicon = Factory(Ionicon)

function SettingsScreen({navigation}) {
	const { auth, authDispatch } = useContext(AuthContext)
	const { data, dataDispatch } = useContext(DataContext)
	const [ hasPin, setHasPin ] = useState(false)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	const handleLogout = async () => {	
		const reset = await keychainReset("com.ariom.ownmoney.token")
		if(reset === true) {
			navigation.navigate('LogoutScreen')
		}
	}

	const handleResetPin = async () => {

	}

	const handleResetPassword = () => {

	}

	useEffect(() => {
		const checkKeychainForPin = async () => {
			const result = await hasUserSetPinCode("com.ariom.ownmoney.pin")
			if(result === true) {
				setHasPin(true)
			}
		}
		checkKeychainForPin()
	}, [])

  	return (
		<>
			<StatusBar barStyle={"dark-content"}/>
			<Center flex={1} justifyContent={"flex-start"}>
				<VStack flex="1" w={"100%"} justifyContent={"flex-start"}>
					<Box backgroundColor={"coolGray.300"} p={"4"} w={"100%"}>
						<Heading size={"sm"}>{ language.settings.sectionHeaderPreferences }</Heading>
					</Box>
					<HStack w={"100%"} p={"4"} alignItems={"center"} justifyContent={"space-between"}>
						<Text>{ language.settings.sectionLabelLanguage }</Text>
						<Box>
							<LanguageToggle />
						</Box>
					</HStack>
					<Box backgroundColor={"coolGray.300"} p={"4"} w={"100%"}>
						<Heading size={"sm"}>{ language.settings.sectionHeaderAccount }</Heading>
					</Box>
					<Pressable onPress={() => handleLogout() } p={"4"} >
						<Text>{ language.settings.sectionLabelLogout }</Text>
					</Pressable>
					<Divider />
					<Pressable onPress={() => handleResetPin() } p={"4"} >
						<Text>{ language.settings.sectionLabelResetPin }</Text>
					</Pressable>
					<Divider />
					<Pressable onPress={() => handleResetPassword() } p={"4"} >
						<Text>{ language.settings.sectionLabelResetPassword }</Text>
					</Pressable>
					<Box backgroundColor={"coolGray.300"} p={"4"} w={"100%"}>
						<Heading size={"sm"}>{ language.settings.sectionHeaderAbout }</Heading>
					</Box>
					<Box p={"4"}>
						<VStack>
							<Text fontSize={"xs"} color={"coolGray.500"}>{ language.settings.sectionLabelAppVersion }</Text>
							<Text fontSize={"md"}>{ Config.MAJOR_VERSION+'.'+Config.MINOR_VERSION+'.'+Config.PATCH_VERSION+'-'+Config.STAGE+'.'+Config.BUILD_NUMBER}</Text>
						</VStack>
					</Box>					
				</VStack>
			</Center>
		</>
		
  	)
}

export default SettingsScreen