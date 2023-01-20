import React, { useContext, useEffect, useReducer, useCallback, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../components/common/AppSafeArea'
import { Button, HStack, Image, Pressable, Text, VStack } from 'native-base'
import * as Forms from '../../components/common/Forms'
import { LanguageToggle } from '../../components/common/LanguageToggle'
import image from '../../assets/img/logo.png'

//data
import { AuthContext } from '../../data/Context'
import { useForm } from 'react-hook-form'
import { useFocusEffect } from '@react-navigation/native'
import { getNotice } from '../../data/handlers/Status'
import { keychainSave, parseToken } from '../../data/Actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Config from 'react-native-config'
import { api } from '../../config'
import { validationRulesLogin } from '../../config'
import { useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

//debug only
import { deleteUserPinCode } from '@haskkor/react-native-pincode'
import { keychainReset } from '../../data/Actions'

const LoginScreen = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = useContext(AuthContext)
	const user = useRecoilValue(userState)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

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
						const notice = getNotice(authErrors[0].reason, user.lang)
						setError(authErrors[0].origin, { type: 'custom', message: notice.message })
					} else {
						authDispatch({ type: 'SET_STATUS', payload: { data: authErrors }})
						authErrors.forEach(e => {
							const notice = getNotice(e.reason, user.lang)
							setError(e.origin, { type: 'custom', message: notice.message })
						})
					}
				break
			}
		})
	}
	
	useEffect(() => {
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

	useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	useFocusEffect(
		useCallback(() => {
			forceUpdate()
		}, [language, auth])
	)

	return (
		<AppSafeArea styles={{ w: "100%", h: "100%", alignItems: "center", justifyContent: "center" }}>
			<VStack space={"4"} mx={"2.5%"} py={"4%"} alignItems={"center"} bgColor={"white"} rounded={"10"}>
				<Image source={image} resizeMode={"contain"} alt={language.login.ui.logoAlt} size={"160"} />
				<Text color={"coolGray.600"} fontWeight={"medium"} fontSize={"md"}>{language.login.ui.underLogo}</Text>
				<Forms.TextInput
					name={ "email" }
					control={ control }
					rules={ validationRulesLogin.email }
					errors={ formState.errors.email }
					label={ language.login.labels.email }
					required={true}
					inputAttributes={{ keyboardType: "email-address", size: "lg", w: "100%"}}
					blockStyles={{ px: "4%" }}
				/>
				<Forms.TextInput
					name={ "password" }
					control={ control }
					rules={ validationRulesLogin.password }
					errors={ formState.errors.password }
					label={language.login.labels.password }
					required={true}
					inputAttributes={{ type: "password", size: "lg", w: "100%" }}
					blockStyles={{ px: "4%" }}
				/>
				<Pressable alignSelf={"flex-end"} mt={"1"} mr={"4"} onPress={() => navigation.navigate('ForgotPassword')}>
					<Text fontSize={"xs"} fontWeight={"500"} color={"indigo.500"} >{language.login.ui.forgotPassword}</Text>
				</Pressable>
				<HStack px={"4"} space={"3"} flexDir={"row"}>
					<Button mt={"2"} flex={"1"} onPress={handleSubmit(onSubmit)} >
						{language.login.ui.buttonLoginNormal}
					</Button>
					<Button mt={"2"} flex={"1"} variant={"subtle"} onPress={() => !auth.loading && navigation.navigate('Register')}>
						{language.login.ui.buttonRegister}
					</Button>
				</HStack>
				<HStack>
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
		</AppSafeArea>
	)
}

export default memo(LoginScreen)