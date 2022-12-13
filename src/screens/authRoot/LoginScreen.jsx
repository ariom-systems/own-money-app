import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ImageBackground, Platform } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Button, Center, FormControl, HStack, Image, Input, KeyboardAvoidingView, 
	Pressable, ScrollView, StatusBar, Text, VStack } from 'native-base'

import { getNotice } from '../../data/handlers/Status'
import { Notice } from '../../components/common/Notice'

import { AuthContext } from '../../data/Context'
import { keychainSave, parseToken } from '../../data/Actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Forms from '../../components/common/Forms'
import { LanguageToggle } from '../../components/common/LanguageToggle'

import image from '../../assets/img/logo.png'
import Config from 'react-native-config'
import { api } from '../../config'

//debug only
import { deleteUserPinCode } from '@haskkor/react-native-pincode'
import { keychainReset } from '../../data/Actions'

import { validationRulesLogin } from '../../config'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const LoginScreen = ({ navigation }) => {
	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const { control, handleSubmit, setError, formState } = useForm({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			email: "",
			password: ""
		}
	})

	const onSubmit = async (data) => {
		let login = new Promise((resolve, reject) => {
			authDispatch({ type: 'LOADING', payload: { data: true }})
			api.post(Config.BASEURL + '/authenticate', {
				email: data.email,
				pass: data.password
			})
			.then(response => {
				if(response.ok == true) {	
					if(response.data.hasOwnProperty("auth")) {
						const jwt_data = parseToken(response.data.auth.token)
						const authObj = {
							uid: response.data.auth.uid,
							email: response.data.auth.username,
							token: response.data.auth.token,
							expire: jwt_data.exp,
							status: null
						}

						resolve(authObj)
					} else {
						reject(response)
					}
				} else {
					reject(response)
				}
			})
		})
		.then(result => {
			async function setPin(result) {
				const pinPromise = new Promise((resolve, reject) => {
					resolve(keychainSave('token', data.email, result.token))
				})
				let pinResult = await pinPromise
			}
			setPin(result).then(keychainResult => { authDispatch({ type: 'LOGIN', payload: result}) })
		})
		.catch(error => {
			authDispatch({ type: 'LOGOUT'})
			switch(error) {
				case 'SERVER_ERROR':
					authDispatch({ type: 'SET_STATUS', payload: { data: 'serverError' }})
				break
				default:
					let authErrors = error.data.notices
					if(authErrors.length == 1) {
						authDispatch({ type: 'SET_STATUS', payload: { data: authErrors[0] }})
						const notice = getNotice(authErrors[0].reason, auth.lang)
						setError(authErrors[0].origin, { type: 'custom', message: notice.message })
					} else {
						authDispatch({ type: 'SET_STATUS', payload: { data: authErrors }})
						authErrors.forEach(e => {
							const notice = getNotice(e.reason, auth.lang)
							setError(e.origin, { type: 'custom', message: notice.message })
						})
					}
				break
			}
		})
	}
	
	React.useEffect(() => {
		const readLang = async () => {
			try {
				const storedLang = await AsyncStorage.getItem('com.ariom.ownmoney.lang')
				if(storedLang != null) { 
					authDispatch({ type: 'SET_LANG', payload: { lang: storedLang }})
				}
			} catch (e) { console.log("loading error: ", e) }
		}
		readLang()
	},[])

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	useFocusEffect(
		React.useCallback(() => {
			forceUpdate()
		}, [language, auth])
	)

	return (
		<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<StatusBar barStyle={"dark-content"} />
			<Center flex={"1"} h={"100%"} alignContent={"center"}>
				<ScrollView w={"100%"} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', flexDirection: 'column' }}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						w={"100%"}>
						<VStack mx={"5%"} p={"2%"} justifyContent={"center"} backgroundColor={"white"} rounded={"2xl"}>
							<VStack space={"4"} alignItems={"center"}>
								{ (auth.status !== null && auth.status !== "") && <Notice nb={{w:"95%", my: "4", rounded: "8"}} />}
								<Image source={image} resizeMode={"contain"} alt={language.login.logoAlt} size={"160"} />
								<Text _dark={{ color: "warmGray.200" }} color={"coolGray.600"} fontWeight={"medium"} fontSize={"md"}>{language.login.underLogo}</Text>

								<Forms.TextInput
									name={ "email" }
									control={ control }
									rules={ validationRulesLogin.email }
									errors={ formState.errors.email }
									label={ language.login.formEmailLabel }
									required={true}
									inputAttributes={{ keyboardType: "email-address", size: "lg"}}
								/>

								<Forms.TextInput
									name={ "password" }
									control={ control }
									rules={ validationRulesLogin.password }
									errors={ formState.errors.password }
									label={ language.login.formPasswordLabel }
									required={true}
									inputAttributes={{ type: "password", size: "lg"}}
								/>
								
								<Pressable alignSelf={"flex-end"} mt={"1"} mr={"4"} onPress={() => navigation.navigate('ForgotPassword')}>
									<Text fontSize={"xs"} fontWeight={"500"} color={"indigo.500"} >{language.login.forgotPassword}</Text>
								</Pressable>
								<HStack px={"4"} space={"3"} flexDir={"row"}>
									<Button
										mt={"2"}
										flex={"1"}
										onPress={handleSubmit(onSubmit)}
										isLoading={auth.loading ? true : false }
										isLoadingText={language.login.buttonLoginLoading}>
											{ language.login.buttonLoginNormal }
									</Button>
									<Button
										mt={"2"}
										flex={"1"}
										variant={"subtle"}
										onPress={() => !auth.loading && navigation.navigate('Register')}>
											{language.login.buttonRegister}
									</Button>
								</HStack>
								<HStack pb={"4"}>
									<LanguageToggle />
								</HStack>
								{/* <HStack w={"100%"} space={"3"}>
									<Button
										flexGrow={"1"}
										variant={"outline"}
										onPress={() => {
											console.log('clearing token')
											keychainReset("token")
										}}>Clear Keychain</Button>
									<Button
										flexGrow={"1"}
										variant={"outline"}
										onPress={() => {
											console.log('clearing pin')
											deleteUserPinCode("com.ariom.ownmoney")
											keychainReset("pin")
										}}>Clear PIN Code</Button>
								</HStack> */}
							</VStack>
						</VStack>
					</KeyboardAvoidingView>
				</ScrollView>
			</Center>
		</ImageBackground>	
	)
}

export default LoginScreen