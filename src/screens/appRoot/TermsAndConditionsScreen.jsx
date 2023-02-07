import React, { useContext, useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../components/common/AppSafeArea'
import { Box, Button, Image, Text, View, VStack } from 'native-base'
import WebView from 'react-native-webview'
import image from '../../assets/img/logo.png'
import * as Forms from '../../components/common/Forms'
import { AlertItem } from '../../components/common/AlertBanner'
import Toolbar from '../../components/common/Toolbar'

//data
import { atom, useRecoilState } from 'recoil'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useForceUpdate } from '../../data/Hooks'
import { AuthContext } from '../../data/Context'
import { api, Sizes, termsAndConditionsToolbarConfig } from '../../config'
import { buildDataPath, mapActionsToConfig, mapPropertiesToConfig } from '../../data/Actions'
import { noticeState, loadingState } from '../../data/recoil/system'


//lang
import LocalizedStrings from 'react-native-localization'
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

const buttonDisabledState = atom({
	key: 'button',
	default: true
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
	const { handleSubmit } = useFormContext()
	const [ acceptance, setAcceptance ] = useRecoilState(acceptanceState)
	const [ scroll, setScroll ] = useRecoilState(scrollState)
	const [ buttonState, setButtonState ] = useRecoilState(buttonDisabledState)
	const [ termsBanner, setTermsBanner ] = useRecoilState(noticeState)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const forceUpdate = useForceUpdate()

	let banner = termsBanner.find(element => element.id == "termsAndConditions")
	let blankBanner = {title: "", message: "", style: "default", icon: "help-circle-outline"}

	const properties = [{ isDisabled: buttonState }]
	let actions = [() => {
		new Promise((resolve) => {
			console.log('✅ sending acceptance to API')
			setLoading({ status: true, type: 'processing' })
			forceUpdate()
			setTimeout(() => {
				resolve(true)
			}, 1000)
		}).then(result => {
			handleSubmit((data) => onSubmit(data), (error) => onError(error))()
		})
	}]
	let toolbarConfig = mapActionsToConfig(termsAndConditionsToolbarConfig, actions)
	toolbarConfig = mapPropertiesToConfig(toolbarConfig, properties)

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

	useEffect(() => { 
		const unsubscribe = navigation.addListener('focus', () => {
			console.log('🔏 Showing Terms and Conditions screen')
		})
		return unsubscribe
	}, [])

	const onSubmit = (data) => {
		if(acceptance.scrolled == true || acceptance.checked == true) {
			//this should be the first component to modify this field. we require the user to accept the terms
			//before letting them do anything else in the application.
			let newFlags = {
				app_flags: JSON.stringify({ termsAccepted: true, termsDate: new Date(Date.parse(new Date())).getTime() / 1000 })
			}
			api.put(buildDataPath('users', auth.uid, 'edit'), newFlags)
			.then(response => {
				if(response.ok == true) {
					console.log(' acceptance recieved by API')
					navigation.navigate('AppDrawer')
					let newBanners = termsBanner.filter((obj) => { return obj.id !== 'termsAndConditions' })
					setTermsBanner(previous => (newBanners))
					setLoading({ status: false, message: 'none' })
				}
			})
		}
	}

	const onError = (error) => { console.error(error) }

	return (
		<AppSafeArea>
			<View h={"100%"} justifyContent={"center"} px={Sizes.padding}>
				<VStack w={"100%"} h={"90%"} p={"4"} bgColor={"white"} rounded={"8"}>
					{ acceptance.checked || <AlertItem data={banner} /> }
					<Box w={"100%"} alignItems={"center"}>
						<Image source={image} resizeMode={"contain"} alt={language.login.ui.logoAlt} size={"100"} />
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
								console.log('☑️  T&C checkbox: checked')
								setAcceptance(previous => ({ ...previous, checked: true }))
								setButtonState(false)
							} else if (event.nativeEvent.data == 'false') {
								setAcceptance(previous => ({ ...previous, checked: false }))
								setButtonState(true)
							}
						}}
					/>
					<Toolbar config={toolbarConfig} nb={{ bgColor: "white", py: ["2", "1", "0"] }} />
				</VStack>
			</View>
		</AppSafeArea>
	)
}
