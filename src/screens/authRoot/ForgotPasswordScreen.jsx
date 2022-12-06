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

const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')

let language = new LocalizedStrings({...auStrings, ...thStrings})

const ForgotPasswordScreen = ({ navigation }) => {

	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
	const [ requested, setRequested ] = React.useState("")

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
				lang: auth.lang
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
								{ (auth.status !== null && auth.status !== "") && <Notice nb={{w:"100%", mb: "4"}} />}
								<Image source={image} resizeMode={"contain"} alt={language.forgotPassword.logoAlt} size={"160"} />
								<Text _dark={{ color: "warmGray.200" }} color={"coolGray.600"} fontWeight={"medium"} fontSize={"md"}>{language.forgotPassword.underLogo}</Text>
								<FormControl isInvalid={ formState.errors.email ? true : false }>
									<FormControl.Label>{language.forgotPassword.formEmailLabel}</FormControl.Label>
									<Controller
										control={control}
										rules={{
											required: language.forgotPassword.formEmailMessageRequired,
											pattern: {
												value: /\S+@\S+\.\S+/i,
												message: language.forgotPassword.formEmailMessagePattern
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
								<HStack space={"3"} flexDir={"row"}>
									<Button
										mt={"2"}
										flex={"1"}
										onPress={handleSubmit(onSubmit)}
										isLoading={ auth.loading ? true : false }
										isLoadingText={language.forgotPassword.buttonResetLoading}
										isDisabled={requested !== "" ? true : false }
										>
											{ requested !== "" ? requested : language.forgotPassword.buttonResetPassword }
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
											{language.forgotPassword.buttonBackToLogin}
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

export default ForgotPasswordScreen