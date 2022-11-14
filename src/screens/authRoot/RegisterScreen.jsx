import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ImageBackground, Platform } from 'react-native'
import { Button, Center, FormControl, HStack, Image, Input, KeyboardAvoidingView, ScrollView, StatusBar, Text, VStack } from 'native-base'
import { AuthContext } from '../../data/Context'
import { ErrorMessage } from '../../components/common/Forms'
import { Notice } from '../../components/common/Notice'
import { LanguageToggle } from '../../components/common/LanguageToggle'
import LocalizedStrings from 'react-native-localization'
import image from '../../assets/img/logo.png'
import Config from 'react-native-config'
import { api } from '../../config'
import { buildDataPath } from '../../data/Actions';
import debounce from 'debounce'

const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')

let language = new LocalizedStrings({...auStrings, ...thStrings})

const RegisterScreen = ({ navigation }) => {

	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
	const [ registered, setRegistered ] = React.useState("")

	const { control, handleSubmit, getValues, watch, setError, clearErrors, formState } = useForm({
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
		authDispatch({ type: 'LOADING', payload: { data: true }})
		let reset = new Promise((resolve, reject) => {
			api.post(Config.BASEURL + '/register', {
				email: data.email,
				password: data.password,
				passwordConfirm: data.passwordConfirm,
				phone: data.phone,
				referrer: data.referrer,
				lang: auth.lang
			})
			.then(response => {
				if(response.ok == true) {
					//get the 'notices' array. this endpoint will always return one notice.
					let notices = response.data.notices
					if(notices.length == 1) {
						console.log(notices)
						authDispatch({ type: 'SET_STATUS', payload: { data: notices[0] }})
						authDispatch({ type: 'LOADING', payload: { data: false }})
						setRegistered(language.register.buttonRegisterComplete)
					}
					resolve(true)
				}
			})
		})
	}

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	return (
		<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<StatusBar barStyle={"dark-content"} />
			<Center flex={"1"} h={"100%"} alignContent={"center"}>
				<ScrollView w={"100%"} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', flexDirection: 'column' }}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						w={"100%"}>
						<VStack mx={"5%"} p={"2%"} justifyContent={"center"} backgroundColor={"white"} rounded={"2xl"}>
							<VStack p={"4"} space={"4"} alignItems={"center"}>
								{ (auth.status !== null && auth.status !== "") && <Notice wrap={{w:"100%", mb: "4"}} />}
								<Image source={image} resizeMode={"contain"} alt={language.register.logoAlt} size={"md"} />
								<Text _dark={{ color: "warmGray.200" }} color={"coolGray.600"} fontWeight={"medium"} fontSize={"md"}>{language.register.underLogo}</Text>
								<FormControl isInvalid={ formState.errors.email ? true : false }>
									<FormControl.Label>{language.register.formEmailLabel}</FormControl.Label>
									<Controller
										control={control}
										rules={{
											required: language.register.formEmailMessageRequired,
											pattern: {
												value: /\S+@\S+\.\S+/i,
												message: language.register.formEmailMessagePattern
											},
											validate: {
												checkUsername: async (value) => {
													const response = await api.post(buildDataPath('query', null, 'username'), { username: value })
													return response.data[0].username == 0 || language.register.formEmailMessageRemote
												}
											}
										}}
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												size={"lg"}
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												autoCapitalize={"none"}
												autoCorrect={false}
												keyboardType={"email-address"} />
										)}
										name={"email"} />
									{ formState.errors.email && (
										<ErrorMessage message={formState.errors.email.message} icon={"alert-circle-outline"} />
									)}
								</FormControl>

								<FormControl isInvalid={ formState.errors.password ? true : false }>
									<FormControl.Label>{language.register.formPasswordLabel}</FormControl.Label>
									<Controller
										control={control}
										rules={{
											required: language.register.formPasswordMessageRequired,
										}}
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												size={"lg"}
												type={"password"}
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												autoCapitalize={"none"}
												autoCorrect={false} />
										)}
										name={"password"} />
									{ formState.errors.password && (
										<ErrorMessage message={formState.errors.password.message} icon={"alert-circle-outline"} />
									)}
								</FormControl>

								<FormControl isInvalid={ formState.errors.passwordConfirm ? true : false }>
									<FormControl.Label>{language.register.formPasswordConfirmLabel}</FormControl.Label>
									<Controller
										control={control}
										rules={{
											required: language.register.formPasswordConfirmMessageRequired,
											validate: value => value === getValues("password") || language.register.formPasswordConfirmMessageMismatch
										}}
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												size={"lg"}
												type={"password"}
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												autoCapitalize={"none"}
												autoCorrect={false} />
										)}
										name={"passwordConfirm"} />
									{ formState.errors.passwordConfirm && (
										<ErrorMessage message={formState.errors.passwordConfirm.message} icon={"alert-circle-outline"} />
									)}
								</FormControl>

								<FormControl isInvalid={ formState.errors.phone ? true : false }>
									<FormControl.Label>{language.register.formPhoneLabel}</FormControl.Label>
									<Controller
										control={control}
										rules={{
											required: language.register.formPhoneMessageRequired,
											pattern: {
												value: /^[0-9-]+$/,
												message: language.register.formPhoneMessagePattern
											}
										}}
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												size={"lg"}
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												autoCapitalize={"none"}
												autoCorrect={false} />
										)}
										name={"phone"} />
									{ formState.errors.phone && (
										<ErrorMessage message={formState.errors.phone.message} icon={"alert-circle-outline"} />
									)}
								</FormControl>

								<FormControl isInvalid={ formState.errors.referrer ? true : false }>
									<FormControl.Label>{language.register.formReferrerLabel}</FormControl.Label>
									<Controller
										control={control}
										rules={{
											validate: {
												checkReferrer: async (value) => {
													if(value !== "") {
														const response = await api.post(buildDataPath('query', null, 'referrer'), { referrer: value })
														return response.data[0].member != 0 || language.register.formReferrerMessageInvalid
													}
												}
											}
										}}
										render={({ field: { onChange, onBlur, value } }) => (
											<Input
												size={"lg"}
												value={value}
												onChangeText={onChange}
												onBlur={onBlur}
												autoCapitalize={"none"}
												autoCorrect={false} />
										)}
										name={"referrer"} />
									{ formState.errors.referrer && (
										<ErrorMessage message={formState.errors.referrer.message} icon={"alert-circle-outline"} />
									)}
								</FormControl>

								<HStack space={"3"} flexDir={"row"}>
									<Button
										mt={"2"}
										flex={"1"}
										onPress={handleSubmit(onSubmit)}
										isLoading={ auth.loading ? true : false }
										isLoadingText={language.register.buttonRegisterLoading}
										isDisabled={registered !== "" ? true : false }
										>
											{ registered !== "" ? registered : language.register.buttonRegister }
									</Button>
									<Button
										mt={"2"}
										flex={"1"}
										variant={"outline"}
										onPress={() => {
											if(!auth.loading) {
												authDispatch({ type: 'CLEAR_STATUS' })
												navigation.goBack()
											}
										}}>
										{language.register.buttonBackToLogin}
									</Button>
								</HStack>
								<HStack>
									<LanguageToggle />
								</HStack>
							</VStack>
						</VStack>
					</KeyboardAvoidingView>
				</ScrollView>
			</Center>
		</ImageBackground>
	)
}

export default RegisterScreen;