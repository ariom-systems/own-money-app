import React from 'react'
import { Box, Button, Heading, HStack, Text, VStack } from 'native-base'
import { Controller, useFormContext } from 'react-hook-form'
import { AuthContext } from '../../data/Context'
import { useRecoilState, useRecoilValue } from 'recoil'
import { audAtom, thbSelector, feeSelector, rateSelector, limitSelector } from '../../data/recoil/transfer'
import { userState } from '../../data/recoil/user'
import { formatCurrency } from '../../data/Actions'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferDetails = (props)  => {
	const { auth } = React.useContext(AuthContext)
	const { control, setValue, setError, clearErrors, formState } = useFormContext()
	const [ user, fee, rate, limit ] = [ useRecoilValue(userState), useRecoilValue(feeSelector), useRecoilValue(rateSelector), useRecoilValue(limitSelector) ]
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	React.useEffect(() => {
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

export default TransferDetails


//const onSubmit = submitted => {
	// let subAUD = formatFloat(submitted.aud)
	// let subTHB = formatFloat(submitted.thb)
	// let subFee = formatFloat(submitted.fee)
	// let subRate = formatFloat(submitted.rate)
	// let remaining = {
	// 	max: data.userMeta.daily_limit.max,
	// 	remaining: submitted.remaining.toFixed(2)
	// }
	//dataDispatch({ type: 'UPDATE_REMAINING', payload: { data: remaining } })
	// transferDispatch({ type: 'SET_STEP_ONE', payload: {
	// 	aud: formatCurrency(subAUD, "en-AU", "AUD").value,
	// 	thb: formatCurrency(subTHB, "th-TH", "THB").value,
	// 	fee: formatCurrency(subFee, "en-AU", "AUD").value,
	// 	rate: formatCurrency(subRate, "th-TH", "THB").value,
	// }})
	// transferDispatch({ type: 'GO_TO', payload: { step: 1 }})
	// navigation.navigate('TransferStepTwo')
//}




	// React.useEffect(() => {
	// 	if(transfer.reset == true) {
	// 		//reload daily_limit
	// 		api.post(buildDataPath('meta', auth.uid, 'view', { endpoint: 'users' }), JSON.stringify(Object.assign({}, ["daily_limit"])))
	// 		//api.post(buildDataPath('meta', auth.uid, 'view'), JSON.stringify(Object.assign({}, ["daily_limit"])))
	// 		.then(response => {
	// 			dataDispatch({ type: 'UPDATE_REMAINING', payload: { data: response.data.daily_limit } })
	// 			forceUpdate()
	// 		})
	// 		.then(result => {
	// 			forceUpdate()
	// 			remaining.set(data.userMeta.daily_limit.remaining)
	// 			limit.set(data.userMeta.daily_limit.max)
	// 			reset({ "aud": "" })
	// 			reset({ "thb": "" })
	// 			reset({ "fee": "" })
	// 			reset({ "rate": "" })
	// 		})
	// 		.catch(error => { console.log(error) })
	// 	}
	// }, [transfer.reset])





