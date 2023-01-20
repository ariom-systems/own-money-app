import React, { useContext, useEffect, useReducer, useState, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../components/common/AppSafeArea'
import { Button, HStack, Image, Input, Text, VStack } from 'native-base'
import * as Forms from '../../components/common/Forms'
import { LanguageToggle } from '../../components/common/LanguageToggle'
import image from '../../assets/img/logo.png'

//data
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../data/Context'
import { api, validationRulesForgotPassword } from '../../config'
import Config from 'react-native-config'
import { useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ForgotPasswordScreen = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = useContext(AuthContext)
	const user = useRecoilValue(userState)
	const [ requested, setRequested ] = useState("")
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	const { control, handleSubmit, setError, formState } = useForm({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			email: ""
		}
	})

	const onSubmit = async (data) => {
		let reset = new Promise((resolve, reject) => {
			authDispatch({ type: 'LOADING', payload: { data: true }})
			api.post(Config.BASEURL + '/forgotpassword', {
				email: data.email,
				lang: user.lang
			})
			.then(response => {
				if(response.ok == true) {
					//get the 'notices' array. this endpoint will always return one notice.
					let notices = response.data.notices
					if(notices.length == 1) {
						authDispatch({ type: 'SET_STATUS', payload: { data: notices[0] }})
						authDispatch({ type: 'LOADING', payload: { data: false }})
						setRequested(language.forgotPassword.buttonResetSent)
					}
					resolve(true)
				}
			})
		})
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
				{ (auth.status !== null && auth.status !== "") && <Notice nb={{w:"100%", mb: "4"}} />}
				<Image source={image} resizeMode={"contain"} alt={language.forgotPassword.ui.logoAlt} size={"160"} />
				<Text color={"coolGray.600"} fontWeight={"medium"} fontSize={"md"} px={"4%"}>{language.forgotPassword.ui.underLogo}</Text>
				
				<Forms.TextInput
					name={"email"}
					control={control}
					rules={validationRulesForgotPassword.email}
					errors={formState.errors.email}
					label={language.forgotPassword.labels.email}
					required={true}
					inputAttributes={{ keyboardType: "email-address", size: "lg", w: "100%" }}
					blockStyles={{ px: "4%" }}
				/>
				<HStack w={"100%"} px={"4%"} space={"4%"}>
					<Button
						mt={"2"}
						flex={"1"}
						onPress={handleSubmit(onSubmit)}
						isLoading={ auth.loading ? true : false }
						isLoadingText={language.forgotPassword.ui.buttonResetLoading}
						isDisabled={requested !== "" ? true : false }
						>
							{ requested !== "" ? requested : language.forgotPassword.ui.buttonResetPassword }
					</Button>
					<Button
						mt={"2"}
						flex={"1"}
						variant={"subtle"}
						onPress={() => {
							if(!auth.loading) {
								authDispatch({ type: 'CLEAR_STATUS' })
								navigation.goBack()
							}
						}}>
							{language.forgotPassword.ui.buttonBackToLogin}
					</Button>
				</HStack>
				<HStack>
					<LanguageToggle />
				</HStack>
			</VStack>
		</AppSafeArea>
	)
}

export default memo(ForgotPasswordScreen)