import React, { useContext, useEffect, useReducer, memo } from 'react'

//components
import { Heading, HStack, Text, VStack } from 'native-base'

//data
import { AuthContext } from '../../data/Context'
import { useFormContext } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { feeSelector, rateSelector, limitSelector } from '../../data/recoil/transfer'
import { userState } from '../../data/recoil/user'
import { formatCurrency } from '../../data/Actions'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferDetails = (props)  => {
	const { auth } = useContext(AuthContext)
	const { control, setValue, setError, clearErrors, formState } = useFormContext()
	const [ user, fee, rate, limit ] = [ useRecoilValue(userState), useRecoilValue(feeSelector), useRecoilValue(rateSelector), useRecoilValue(limitSelector) ]
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			forceUpdate()
		}
	}, [language, user])

	useEffect(() => {
		setValue("remaining", Number(limit))
		setValue("fee", Number(fee))
		setValue("rate", Number(rate))
		if(Number(limit) < 0) {
			setError('remaining', { type: 'custom', message: language.transferStepOne.errorMessageLimitExceeded})
		} else {
			clearErrors()
		}
	}, [limit])

	return (
		<VStack width={"100%"} p={"4"} borderColor="coolGray.300" borderWidth={"1"} rounded={"8"} alignItems={"center"} space={"2"}>
			<Heading fontSize={"md"}>{ language.transferStepOne.headingTransferDetails }</Heading>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text>{ language.transferStepOne.labelDailyLimit }:</Text>
				<Text>{ formatCurrency(user.daily_limit_max, "en-AU", "AUD").full }</Text>
			</HStack>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text>{ language.transferStepOne.labelRemainingLimit }:</Text>
				<Text>{ formatCurrency(user.daily_limit_remaining, "en-AU", "AUD").full }</Text>
			</HStack>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text color={ formState.errors.remaining ? "danger.600" : "black" }>{ language.transferStepOne.labelLimitAfterTransfer }:</Text>
				<Text color={ formState.errors.remaining ? "danger.600" : "black" }>{ formatCurrency(limit, "en-AU", "AUD").full }</Text> 
			</HStack>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text>{ language.transferStepOne.labelFee }:</Text>
				<Text>{ formatCurrency(fee, "en-AU", "AUD").full }</Text>
			</HStack>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text>{ language.transferStepOne.labelYourRate }:</Text>
				<Text>{ formatCurrency(rate, "en-AU", "AUD").full }</Text>
			</HStack>
			{(formState.errors.remaining) && (
				<HStack w={"100%"}><Text color={"danger.600"}>{formState.errors.remaining.message}</Text></HStack>)}
		</VStack>
	)
}

export default memo(TransferDetails)