import React, { useContext, useEffect, useReducer, memo } from 'react'

//components
import AppSafeArea from '../../components/common/AppSafeArea'
import { Box, Button, Center, Image, Text, VStack } from 'native-base'
import WebView from 'react-native-webview'
import image from '../../assets/img/logo.png'
import * as Forms from '../../components/common/Forms'
import { useNavigation } from '@react-navigation/native'

//data
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { buildDataPath } from '../../data/Actions'
import { api } from '../../config'
import { atom, useRecoilState } from 'recoil'
import { noticeState } from '../../data/recoil/system'
import Config from 'react-native-config'

//lang
import LocalizedStrings from 'react-native-localization'
import { AuthContext } from '../../data/Context'
import { AlertItem } from '../../components/common/AlertBanner'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const scrollState = atom({
	key: 'scrollState',
	default: 0
})

const acceptanceState = atom({
	key: 'acceptanceState',
	default: {
		scrolled: false,
		checked: false
	}
})

const TermsAndConditionsScreen = () => {
	const methods = useForm({
		mode: 'all',
		criteriaMode: 'all'
	})
	return (
		<FormProvider {...methods}>
			<TermsAndConditionsScreenInner />
		</FormProvider>
	)
}

export default memo(TermsAndConditionsScreen)

const TermsAndConditionsScreenInner = () => {
	const navigation = useNavigation()
	const { auth } = useContext(AuthContext)
	const { handleSubmit, setError, clearErrors, formState } = useFormContext()
	const [ acceptance, setAcceptance ] = useRecoilState(acceptanceState)
	const [ scroll, setScroll ] = useRecoilState(scrollState)
	const [ termsBanner, setTermsBanner ] = useRecoilState(noticeState)
	const [ignored, forceUpdate] = useReducer((x) => x + 1, 0)
	let banner = termsBanner.find(element => element.id == "termsAndConditions"), 
		blankBanner = {title: "", message: "", style: "default", icon: "help-circle-outline"}


	useEffect(() => {
		banner =  
		forceUpdate()
	}, [termsBanner])

	useEffect(() => {
		if(scroll >= 99) {
			setAcceptance(previous => ({
				...previous,
				scrolled: true
			}))
	 	}
	}, [scroll])

	const onSubmit = (data) => {
		if(acceptance.scrolled != true || acceptance.checked != true) {
			setError('accepted', { type: 'custom', message: language.termsAndConditions.errorMessageAccept })
		} else {
			clearErrors('accepted')
			//this should be the first component to modify this field. we require the user to accept the terms
			//before letting them do anything else in the application.
			let newFlags = {
				app_flags: JSON.stringify({ termsAccepted: true, termsDate: new Date(Date.parse(new Date())).getTime() / 1000 })
			}
			api.put(buildDataPath('users', auth.uid, 'edit'), newFlags)
			.then(response => {
				if(response.data == true) {
					let newBanners = termsBanner.filter((obj) => { return obj.id !== 'termsAndConditions' })
					setTermsBanner(previous => (newBanners))
					navigation.navigate('AppDrawer')
				}
			})
		}
	}

	return (
		<AppSafeArea>
			<Center flex={"1"} p={"2.5%"} h={"100%"} alignContent={"center"}>
				<VStack w={"100%"} h={"90%"} p={"4"} bgColor={"white"} rounded={"8"}>
					{ acceptance.checked || <AlertItem data={banner} /> }
					<Box w={"100%"} alignItems={"center"}>
						<Image source={image} resizeMode={"contain"} alt={language.login.logoAlt} size={"100"} />
					</Box>
					<WebView
						source={{ uri: 'https://api.ownservices.com.au/checkterms/get'}}
						style={{ borderColor: "#767676", borderWidth: 1, borderRadius: 8 }}
						containerStyle={{ padding: 10 }}
						onScroll={syntheticEvent => {
							let {contentSize, contentOffset, layoutMeasurement } = syntheticEvent.nativeEvent
							let [ offsetY, viewHeight, totalHeight ] = [ Math.floor(contentOffset.y), Math.floor(layoutMeasurement.height), contentSize.height]
							let offsetHeight = offsetY + viewHeight, percent = offsetHeight / totalHeight
							setScroll(Math.floor(percent * 100))
						}}
						onMessage={(event) => {
							if (event.nativeEvent.data == 'true') {
								setAcceptance(previous => ({ ...previous, checked: true }))
								clearErrors('accepted')
							} else if (event.nativeEvent.data == 'false') {
								setAcceptance(previous => ({ ...previous, checked: false }))
							}
						}}
					/>
					{formState.errors.accepted && <Forms.ErrorMessageBlock message={language.termsAndConditions.errorMessageAccept} errorStyles={{ marginBottom: "4"}} />}
					<Box w={"100%"} justifyContent={"center"} flexDirection={"row"}>
						<Button onPress={handleSubmit(onSubmit)} w={"50%"} >
							<Text fontSize={"17"} color={"#FFFFFF"}>{language.termsAndConditions.buttonSubmit}</Text>
						</Button>
					</Box>
				</VStack>
			</Center>
		</AppSafeArea>
	)
}
