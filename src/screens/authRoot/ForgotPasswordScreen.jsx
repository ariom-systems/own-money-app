import React, { useContext, useEffect, useState, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../components/common/AppSafeArea'
import { Button, HStack, Image, Input, Text, VStack } from 'native-base'
import * as Forms from '../../components/common/Forms'
import { LanguageToggle } from '../../components/common/LanguageToggle'
import image from '../../assets/img/logo.png'
import Toolbar from '../../components/common/Toolbar'

//data
import Config from 'react-native-config'
import { useForm } from 'react-hook-form'
import { useRecoilValue, useRecoilState } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { AuthContext } from '../../data/Context'
import { api, validationRulesForgotPassword, forgotPasswordToolbarConfig } from '../../config'
import { mapActionsToConfig } from '../../data/Actions'
import { loadingState, langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ForgotPasswordScreen = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const { auth, authDispatch } = useContext(AuthContext)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const lang = useRecoilValue(langState)

	let actions = [
		() => {
			new Promise((resolve) => {
				setLoading({ status: true, type: 'processing' })
				forceUpdate()
				setTimeout(() => {
					if (loading.status == false) { resolve() }
				}, 1000)
			}).then(result => {
				handleSubmit((data) => onSubmit(data), (error) => onError(error))()
			})
		},
		() => {
			authDispatch({ type: 'CLEAR_STATUS' })
			navigation.goBack()
		}
	]
	const toolbarConfig = mapActionsToConfig(forgotPasswordToolbarConfig, actions)

	const { control, handleSubmit, formState } = useForm({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			email: ""
		}
	})

	const onSubmit = async (data) => {
		new Promise((resolve, reject) => {
			authDispatch({ type: 'LOADING', payload: { data: true }})
			api.post(Config.BASEURL + '/forgotpassword', {
				email: data.email,
				lang: lang
			})
			.then(response => {
				if(response.ok == true) {
					//get the 'notices' array. this endpoint will always return one notice.
					let notices = response.data.notices
					if(notices.length == 1) {
						authDispatch({ type: 'SET_STATUS', payload: { data: notices[0] } }) //leave this here
						authDispatch({ type: 'LOADING', payload: { data: false }})
					}
					resolve(true)
				}
			})
			.catch(errors => {
				console.log(response)
			})
		})
	}

	const onError = (error) => {
		setLoading({ status: false, message: 'none' })
	}

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<AppSafeArea styles={{ w: "100%", h: "100%", alignItems: "center", justifyContent: "center" }}>
			<VStack space={"4"} mx={"2.5%"} py={"4%"} alignItems={"center"} bgColor={"white"} rounded={"10"}>
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
				<Toolbar config={toolbarConfig} nb={{ bgColor: "white", py: "0" }} />
				<HStack>
					<LanguageToggle />
				</HStack>
			</VStack>
		</AppSafeArea>
	)
}

export default memo(ForgotPasswordScreen)