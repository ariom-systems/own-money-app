import React, { useContext, useState, useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../components/common/AppSafeArea'
import { Button, HStack, Image, Input, ScrollView, Text, VStack } from 'native-base'
import * as Forms from '../../components/common/Forms'
import { LanguageToggle } from '../../components/common/LanguageToggle'
import image from '../../assets/img/logo.png'
import Toolbar from '../../components/common/Toolbar'

//data
import Config from 'react-native-config'
import { useForm} from 'react-hook-form'
import { useRecoilValue, useRecoilState} from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { AuthContext } from '../../data/Context'
import { api, validationRulesRegister, registerToolbarConfig, Sizes } from '../../config'
import { buildDataPath, mapActionsToConfig } from '../../data/Actions'
import { loadingState, langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const RegisterScreen = () => {
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
		() => navigation.goBack()
	]
	const toolbarConfig = mapActionsToConfig(registerToolbarConfig, actions)

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
		new Promise((resolve, reject) => {
			api.post(Config.BASEURL + '/register', {
				email: data.email,
				password: data.password,
				passwordConfirm: data.passwordConfirm,
				phone: data.phone,
				referrer: data.referrer,
				lang: lang
			})
			.then(response => {
				if(response.ok == true) {
					//get the 'notices' array. this endpoint will always return one notice.
					let notices = response.data.notices
					if(notices.length == 1) {
						authDispatch({ type: 'SET_STATUS', payload: { data: notices[0] } }) //leave this here
					}
					resolve(true)
				}
			})
			.catch(response => {
				console.log(response)
			})
		}).then(result => {
			navigation.goBack()
		})
	}

	const onError = (error) => {
		setLoading({ status: false, message: 'none' })
	}

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
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, auth])

	return (
		<AppSafeArea styles={{ w: "100%", h: "100%", alignItems: "center", justifyContent: "center" }}>
			<ScrollView w={"100%"}>
				<VStack space={Sizes.spacing} mx={"2.5%"} py={"4%"} alignItems={"center"} bgColor={"white"} rounded={"10"}>
					<Image source={image} resizeMode={"contain"} alt={language.register.ui.logoAlt} size={"md"} />
					<Text color={"coolGray.600"} fontWeight={"medium"} fontSize={"md"}>{language.register.ui.underLogo}</Text>
					<Forms.TextInput
						name={"email"}
						control={control}
						rules={{...validationRulesRegister.email, ...emailRemote}}
						errors={formState.errors.email}
						label={language.register.labels.email}
						required={true}
						inputAttributes={{ keyboardType: "email-address"}}
						blockStyles={{ px: "4%" }}
					/>
					<Forms.TextInput
						name={"password"}
						control={control}
						rules={validationRulesRegister.password}
						errors={formState.errors.password}
						label={language.register.labels.password}
						required={true}
						inputAttributes={{ type: "password" }}
						blockStyles={{ px: "4%" }}
					/>
					<Forms.TextInput
						name={"passwordConfirm"}
						control={control}
						rules={{...validationRulesRegister.passwordConfirm, ...passwordMatch}}
						errors={formState.errors.passwordConfirm}
						label={language.register.labels.passwordConfirm}
						required={true}
						inputAttributes={{ type: "password" }}
						blockStyles={{ px: "4%" }}
					/>
					<Forms.TextInput
						name={"phone"}
						control={control}
						rules={validationRulesRegister.phone}
						errors={formState.errors.phone}
						label={language.register.labels.phone}
						required={true}
						inputAttributes={{ keyboardType: "phone-pad" }}
						blockStyles={{ px: "4%" }}
					/>
					<Forms.TextInput
						name={"referrer"}
						control={control}
						rules={referrerRemote}
						errors={formState.errors.referrer}
						label={language.register.labels.referrer}
						blockStyles={{ px: "4%" }}
					/>
					<Toolbar config={toolbarConfig} nb={{ bgColor: "white", py: "0" }} />
					<HStack>
						<LanguageToggle />
					</HStack>
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}

export default memo(RegisterScreen)