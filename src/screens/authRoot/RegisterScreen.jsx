import React, { useContext, useState, useEffect, useReducer, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../components/common/AppSafeArea'
import { Button, HStack, Image, Input, Text, VStack } from 'native-base'
import * as Forms from '../../components/common/Forms'
import { LanguageToggle } from '../../components/common/LanguageToggle'
import image from '../../assets/img/logo.png'

//data
import { AuthContext } from '../../data/Context'
import { useForm} from 'react-hook-form'
import Config from 'react-native-config'
import { buildDataPath } from '../../data/Actions'
import { api, validationRulesRegister } from '../../config'
import { useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const RegisterScreen = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = useContext(AuthContext)
	const user = useRecoilValue(userState)
	const [ registered, setRegistered ] = useState("")
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	const { control, handleSubmit, getValues, formState } = useForm({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			email: "",
			password: "",
			passwordConfirm: "",
			phone: "",
			referrer: ""
		}
	})

	const onSubmit = async (data) => {
		console.log(data)
		authDispatch({ type: 'LOADING', payload: { data: true }})
		let reset = new Promise((resolve, reject) => {
			api.post(Config.BASEURL + '/register', {
				email: data.email,
				password: data.password,
				passwordConfirm: data.passwordConfirm,
				phone: data.phone,
				referrer: data.referrer,
				lang: user.lang
			})
			.then(response => {
				if(response.ok == true) {
					//get the 'notices' array. this endpoint will always return one notice.
					let notices = response.data.notices
					if(notices.length == 1) {
						
						authDispatch({ type: 'SET_STATUS', payload: { data: notices[0] }})
						authDispatch({ type: 'LOADING', payload: { data: false }})
						setRegistered(language.register.buttonRegisterComplete)
					}
					resolve(true)
				}
			})
		})
	}

	const onError = (error) => console.log("error:", error)

	const emailRemote = {
		validate: {
			checkUsername: async (value) => {
				const response = await api.post(buildDataPath('query', null, 'username'), { username: value })
				return response.data[0].username == 0 || language.register.errors.emailRemote
			}
		}
	}

	const passwordMatch = {
		validate: value => value === getValues("password") || language.register.errors.passwordConfirmMismatch
	}

	const referrerRemote = {
		validate: {
			checkReferrer: async (value) => {
				if (value !== "") {
					const response = await api.post(buildDataPath('query', null, 'referrer'), { referrer: value })
					return response.data[0].member != 0 || language.register.errors.referrerInvalid
				}
			}
		}
	}

	useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	return (
		<AppSafeArea styles={{ w: "100%", h: "100%", alignItems: "center", justifyContent: "center" }}>
			<VStack space={"4"} mx={"2.5%"} py={"4%"} alignItems={"center"} bgColor={"white"} rounded={"10"}>
				
				<Image source={image} resizeMode={"contain"} alt={language.register.ui.logoAlt} size={"md"} />
				<Text _dark={{ color: "warmGray.200" }} color={"coolGray.600"} fontWeight={"medium"} fontSize={"md"}>{language.register.ui.underLogo}</Text>
				
				<Forms.TextInput
					name={"email"}
					control={control}
					rules={{...validationRulesRegister.email, ...emailRemote}}
					errors={formState.errors.email}
					label={language.register.labels.email}
					required={true}
					inputAttributes={{ keyboardType: "email-address", size: "lg", w: "100%" }}
					blockStyles={{ px: "4%" }}
				/>

				<Forms.TextInput
					name={"password"}
					control={control}
					rules={validationRulesRegister.password}
					errors={formState.errors.password}
					label={language.register.labels.password}
					required={true}
					inputAttributes={{ type: "password", size: "lg", w: "100%" }}
					blockStyles={{ px: "4%" }}
				/>

				<Forms.TextInput
					name={"passwordConfirm"}
					control={control}
					rules={{...validationRulesRegister.passwordConfirm, ...passwordMatch}}
					errors={formState.errors.passwordConfirm}
					label={language.register.labels.passwordConfirm}
					required={true}
					inputAttributes={{ type: "password", size: "lg", w: "100%" }}
					blockStyles={{ px: "4%" }}
				/>

				<Forms.TextInput
					name={"phone"}
					control={control}
					rules={validationRulesRegister.phone}
					errors={formState.errors.phone}
					label={language.register.labels.phone}
					required={true}
					inputAttributes={{ keyboardType: "phone-pad", size: "lg", w: "100%" }}
					blockStyles={{ px: "4%" }}
				/>

				<Forms.TextInput
					name={"referrer"}
					control={control}
					rules={referrerRemote}
					errors={formState.errors.referrer}
					label={language.register.labels.referrer}
					inputAttributes={{ size: "lg", w: "100%" }}
					blockStyles={{ px: "4%" }}
				/>
				<HStack w={"100%"} px={"4%"} space={"4%"}>
					<Button mt={"2"} flex={"1"} onPress={handleSubmit(onSubmit, onError)}
						isLoading={ auth.loading ? true : false }
						isLoadingText={language.register.ui.buttonRegisterLoading}
						isDisabled={registered !== "" ? true : false }
						>
						{registered !== "" ? registered : language.register.ui.buttonRegister }
					</Button>
					<Button mt={"2"} flex={"1"} variant={"outline"}
						onPress={() => {
							if(!auth.loading) {
								authDispatch({ type: 'CLEAR_STATUS' })
								navigation.goBack()
							}
						}}>
						{language.register.ui.buttonBackToLogin}
					</Button>
				</HStack>
				<HStack>
					<LanguageToggle />
				</HStack>
			</VStack>
		</AppSafeArea>
	)
}

export default memo(RegisterScreen)