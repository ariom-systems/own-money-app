import React from 'react'
import { ImageBackground, Platform } from 'react-native'
import { Box, Button, HStack, ScrollView, Text, VStack } from 'native-base'

import { useNavigation } from '@react-navigation/native'

import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import CurrencyConverter from '../../../components/transfers/CurrencyConverter'
import TransferDetails from '../../../components/transfers/TransferDetails'
import ExchangeRate from '../../../components/common/ExchangeRate'

//data
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { stepAtom, audAtom, thbSelector, feeSelector, rateSelector, limitSelector } from '../../../data/recoil/transfer'
import { userState } from '../../../data/recoil/user'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { AuthContext } from '../../../data/Context'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepOne = () => {
	const [ aud, thb, user, ] = [ useRecoilValue(audAtom), useRecoilValue(thbSelector), useRecoilValue(userState) ]
	const [ fee, rate, limit ] = [ useRecoilValue(feeSelector), useRecoilValue(rateSelector), useRecoilValue(limitSelector) ]
	const methods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		defaultValues: {
			aud: aud,
			thb: thb,
			remaining: Number(user.daily_limit_remaining),
			fee: fee,
			rate: rate
		}
	})
	return (
		<FormProvider {...methods}>
			<TransferStepOneInner />
		</FormProvider>
	)
}

export default TransferStepOne

const TransferStepOneInner = () => {
	const navigation = useNavigation()
	const { auth } = React.useContext(AuthContext)
	const { handleSubmit, setValue, getValues, reset, formState } = useFormContext()
	const [ step, setStep ] = useRecoilState(stepAtom)
	const [ aud, setAud ] = useRecoilState(audAtom)
	const [ buttonState, setButtonState ] = React.useState(true)
	const setThb = useSetRecoilState(thbSelector)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	let hasErrors

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	React.useEffect(() => {
		if(formState.errors.aud || formState.errors.thb || formState.errors.remaining) {
			hasErrors = true
			setButtonState(true)
		} else {
			hasErrors = false
			if(aud != "") { setButtonState(false) }
		}
	},[formState, aud])

	const onSubmit = (submitted) => {
		console.log(submitted)
		navigation.navigate('TransferStepTwo')
		setStep(1)
	}

	const onError = error => console.log(error)

	const handleCancel = () => {
		setAud(0)
		setThb(0)
		setStep(0)
		reset()
		setButtonState(true)
	}

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<ScrollView>
				<Box mx={"2.5%"} mt={"5%"} p={"5%"} backgroundColor={"white"} rounded={"2xl"}>

					<TransferStepIndicator />

					<VStack space={"4"} w={"100%"} alignItems={"center"}>
						<Text textAlign={"center"}>{ language.transferStepOne.instructionTop }</Text>
						<HStack textAlign={"center"} space={"2"} alignItems={"center"}>
							<ExchangeRate size={"sm"} />
						</HStack>

						<CurrencyConverter />
						<TransferDetails />

						<HStack space={"4"} w={"100%"} justifyContent={"center"}>
							<Button variant={"outline"} w={"40%"} onPress={handleCancel}>Reset</Button>
							<Button
								isDisabled={buttonState}
								_disabled={{ backgroundColor:"primary.500", borderColor:"primary.600", borderWidth:1 }}
								alignSelf={"center"}
								w={"40%"}
								onPress={handleSubmit(onSubmit, onError)} >
								<Text fontSize={"lg"} color={"#FFFFFF"}>{ language.transferStepOne.buttonNext }</Text>
							</Button>
						</HStack>
					</VStack>
				</Box>
			</ScrollView>
		</ImageBackground>
	)
}