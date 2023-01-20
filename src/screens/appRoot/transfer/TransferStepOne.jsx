import React, { useContext, useEffect, useReducer } from 'react'

//components
import AppSafeArea from '../../../components/common/AppSafeArea'
import { useNavigation } from '@react-navigation/native'
import { Button, HStack, ScrollView, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import CurrencyConverter from '../../../components/transfers/CurrencyConverter'
import TransferDetails from '../../../components/transfers/TransferDetails'
import ExchangeRate from '../../../components/common/ExchangeRate'
import Toolbar from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'

//data
import { AuthContext } from '../../../data/Context'
import { mapActionsToConfig, mapPropertiesToConfig } from '../../../data/Actions'
import { transferStepOneToolbarConfig } from '../../../config'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { stepAtom, audAtom, thbSelector, feeSelector, rateSelector, limitSelector, stepOneButtonAtom } from '../../../data/recoil/transfer'
import { userState } from '../../../data/recoil/user'
import { noticeState } from '../../../data/recoil/system'

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
	const { auth } = useContext(AuthContext)
	const notices = useRecoilValue(noticeState)
	const setStep = useSetRecoilState(stepAtom)
	const user = useRecoilValue(userState)
	const [ buttonState, setButtonState] = useRecoilState(stepOneButtonAtom)
	const [ aud, setAud ] = useRecoilState(audAtom)
	const [ thb, setThb ] = useRecoilState(thbSelector)
	const { handleSubmit, setValue, getValues, reset, formState } = useFormContext()
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	const actions = [
		() => handleCancel(),null,
		handleSubmit((data) => onSubmit(data))
	]
	const properties = [ {}, {}, { isDisabled: buttonState } ]
	let toolbarConfig = mapActionsToConfig(transferStepOneToolbarConfig, actions)
	toolbarConfig = mapPropertiesToConfig(toolbarConfig, properties)

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, user])
	
	let hasErrors

	useEffect(() => {
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

	const onSubmit = (e) => {
		navigation.navigate('TransferStepTwo')
		setStep(1)
	}

	const onError = error => console.log(error)

	const handleCancel = () => { console.log('cancelled'); setAud(0); setThb(0); setStep(0); reset(); setButtonState(true); }

	return (
		<AppSafeArea>
			<ScrollView>
				<VStack p={"2.5%"} space={"4"}>
					{notices && <AlertBanner /> }
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
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}