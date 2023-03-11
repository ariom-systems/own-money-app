import React, { useEffect } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { HStack, ScrollView, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import CurrencyConverter from '../../../components/transfers/CurrencyConverter'
import TransferDetails from '../../../components/transfers/TransferDetails'
import ExchangeRate from '../../../components/common/ExchangeRate'
import Toolbar from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'

//data
import { useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { transferStepOneToolbarConfig } from '../../../config'
import { mapActionsToConfig, mapPropertiesToConfig } from '../../../data/Actions'
import { stepAtom, transferAtom, audAtom, promoAtom, thbSelector, feeSelector, rateSelector, stepOneButtonAtom } from '../../../data/recoil/transfer'
import { userState } from '../../../data/recoil/user'
import { globalState, noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
import PromoCode from '../../../components/transfers/PromoCode'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepOne = () => {
	const aud = useRecoilValue(audAtom)
	const thb = useRecoilValue(thbSelector)
	const user = useRecoilValue(userState)
	const fee = useRecoilValue(feeSelector)
	const rate = useRecoilValue(rateSelector)
	const globals = useRecoilValue(globalState)
	const promo = useRecoilValue(promoAtom)
	
	const methods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		defaultValues: {
			sender: user.firstname + " " + user.lastname,
			amounttosend: Number(aud).toFixed(2) || 0,
			yourrate: Number(rate).toFixed(2),
			todayrate: Number(globals.rate).toFixed(2),
			fees: Number(fee).toFixed(2),
			totaltopay: (Number(aud) + Number(fee)).toFixed(2) || 0,
			receivableamount: parseInt(thb.replaceAll(',', '')) || 0,
			maxlimit: Number(user.daily_limit_max).toFixed(2),
			limitbefore: Number(user.daily_limit_remaining) || 0,
			limitbonus: Number(promo.limit) || 0,
			limitafter: (Number(user.daily_limit_remaining) + Number(promo.limit)) - Number(aud) || 0,
			id_users: Number(user.id)
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
	const forceUpdate = useForceUpdate()
	const { handleSubmit, reset, formState } = useFormContext()
	let [ buttonState, setButtonState] = useRecoilState(stepOneButtonAtom)
	let [ aud, setAud ] = useRecoilState(audAtom)
	let [ thb, setThb ] = useRecoilState(thbSelector)
	let setStep = useSetRecoilState(stepAtom)
	let setTransfer = useSetRecoilState(transferAtom)
	let promo = useRecoilValue(promoAtom)
	let user = useRecoilValue(userState)
	let fee = useRecoilValue(feeSelector)
	let rate = useRecoilValue(rateSelector)
	let notices = useRecoilValue(noticeState)
	let globals = useRecoilValue(globalState)
	let lang = useRecoilValue(langState)
	const resetAUD = useResetRecoilState(audAtom)
	const resetPromo = useResetRecoilState(promoAtom)
	const resetButton = useResetRecoilState(stepOneButtonAtom)
	const resetTransfer = useResetRecoilState(transferAtom)

	const actions = [
		() => handleCancel(),null,
		() => {
			handleSubmit((data) => onSubmit(data), (error) => onError(error))()
		}
	]
	const properties = [ {}, {}, { isDisabled: buttonState } ]
	let toolbarConfig = mapActionsToConfig(transferStepOneToolbarConfig, actions)
	toolbarConfig = mapPropertiesToConfig(toolbarConfig, properties)

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	useEffect(() => {
		if(formState.errors.aud || formState.errors.thb || formState.errors.remaining) {
			setButtonState(true)
		} else if(aud == "" || thb == "" || aud == 0 || thb == 0) {
			setButtonState(true)
		} else {
			if(aud != "") { setButtonState(false) }
		}
	},[formState, aud, thb])

	const onSubmit = (e) => {
		navigation.navigate('TransferStepTwo')
		setStep(1)
		setTransfer((prev) => ({
			...prev,
			sender: user.firstname + " " + user.lastname,
			amounttosend: Number(aud).toFixed(2),
			yourrate: Number(rate).toFixed(2),
			todayrate: Number(globals.rate).toFixed(2),
			bonusrate: promo.rate,
			fees: Number(fee).toFixed(2),
			totaltopay: (Number(aud) + Number(fee)).toFixed(2),
			receivableamount: parseInt(thb.replaceAll(',','')),
			maxlimit: Number(user.daily_limit_max).toFixed(2),
			limitbefore: Number(user.daily_limit_remaining),
			limitbonus: Number(promo.limit),
			limitafter: (Number(user.daily_limit_remaining) + Number(promo.limit)) - Number(aud),
			id_users: Number(user.id)
		}))
	}

	const onError = (error) => {
		console.log(error)
		setLoading({ status: false, message: 'none' })
	}

	const handleCancel = () => { 
		reset() // react-form-hook
		resetAUD()
		resetPromo()
		resetButton()
		resetTransfer()
	}

	return (
		<AppSafeArea>
			<ScrollView>
				<VStack p={"2.5%"} space={"4"}>
					{notices && <AlertBanner /> }
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<TransferStepIndicator />
						<VStack space={"4"} w={"100%"} alignItems={"center"}>
							<Text textAlign={"center"}>{ language.transferStepOne.ui.instructionTop }</Text>
							<HStack textAlign={"center"} space={"2"} alignItems={"center"}>
								<ExchangeRate size={"sm"} />
							</HStack>
							{ user.blocked == false && <>
								<CurrencyConverter />
								<PromoCode />
								<TransferDetails />
							</> }
						</VStack>
					</VStack>
					{(user.preventTransfer == false) && <Toolbar config={toolbarConfig} />}
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}