import React from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import { Box, Button, HStack, ScrollView, StatusBar, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import CurrencyConverter from '../../../components/transfers/CurrencyConverter'
import TransferDetails from '../../../components/transfers/TransferDetails'
import ExchangeRate from '../../../components/common/ExchangeRate'
import Toolbar, { ToolbarItem, ToolbarSpacer } from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'

//data
import { AuthContext } from '../../../data/Context'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { stepAtom, audAtom, thbSelector, feeSelector, rateSelector, limitSelector, stepOneButtonAtom } from '../../../data/recoil/transfer'
import { userState } from '../../../data/recoil/user'

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
	const [ buttonState, setButtonState ] = useRecoilState(stepOneButtonAtom)
	const [ thb, setThb ] = useRecoilState(thbSelector)
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
		} else if(aud == "" || thb == "" || aud == 0 || thb == 0) {
			hasErrors = true
			setButtonState(true)
		} else {
			hasErrors = false
			if(aud != "") { setButtonState(false) }
		}
	},[formState, aud, thb])

	const onSubmit = (submitted) => {
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
			<StatusBar barStyle={"dark-content"} />
			<ScrollView>
				<AlertBanner m={"2.5%"} mb={"0"} />
				<VStack p={"2.5%"} space={"4"}>
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<TransferStepIndicator />

						<VStack space={"4"} w={"100%"} alignItems={"center"}>
							<Text textAlign={"center"}>{ language.transferStepOne.instructionTop }</Text>
							<HStack textAlign={"center"} space={"2"} alignItems={"center"}>
								<ExchangeRate size={"sm"} />
							</HStack>

							<CurrencyConverter />
							<TransferDetails />

						</VStack>

					</VStack>
					<Toolbar>
						<ToolbarItem
							label={language.transferStepOne.buttonReset}
							icon={"reload-outline"}
							space={"1"}
							iconProps={{ ml: "-4" }}
							buttonProps={{ flex: "1", variant: "outline" }}
							action={() => handleCancel()} />
						<ToolbarSpacer />
						<ToolbarItem
							label={language.transferStepOne.buttonNext}
							icon={"chevron-forward"}
							iconPosition={"right"}
							buttonProps={{ flex: "1", isDisabled: buttonState, _disabled: { style: "subtle" } }}
							action={handleSubmit(onSubmit, onError)} />
					</Toolbar>
				</VStack>
				
			</ScrollView>
		</ImageBackground>
	)
}