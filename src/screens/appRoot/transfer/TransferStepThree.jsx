import React, { useContext, useEffect, useReducer, useRef, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Box, Button, Divider, HStack, ScrollView, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import ReviewListHeader from '../../../components/transfers/ReviewListHeader'
import ReviewListItem from '../../../components/transfers/ReviewListItem'
import * as Forms from '../../../components/common/Forms'
import Toolbar from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'


//data
import { AuthContext } from '../../../data/Context'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { stepAtom, audAtom, thbSelector, feeSelector, rateSelector, limitSelector, stepThreeButtonAtom } from '../../../data/recoil/transfer'
import { globalState, loadingState, noticeState } from '../../../data/recoil/system'
import { userState } from '../../../data/recoil/user'
import { beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { api, validationRulesTransferStepThree, transferStepThreeToolbarConfig } from '../../../config'
import { buildDataPath, formatCurrency, mapActionsToConfig, mapPropertiesToConfig } from '../../../data/Actions'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepThree = () => {
	const { auth } = useContext(AuthContext)
	const [aud, thb, fee, rate ] = [ useRecoilValue(audAtom), useRecoilValue(thbSelector), useRecoilValue(feeSelector), useRecoilValue(rateSelector) ]
	const globals = useRecoilValue(globalState)
	const user = useRecoilValue(userState)
	const beneficiary = useRecoilValue(beneficiaryObj)

	const methods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		defaultValues: {
			id_users: auth.uid,
			id_receivers: beneficiary.id,
			fee_AUD: fee,
			rate: Number(rate).toFixed(2),
			today_rate: Number(globals.rate).toFixed(2),
			sender: user.firstname + " " + user.lastname,
			receiver: beneficiary.fullname,
			accountnumber: beneficiary.accountnumber,
			branchname: beneficiary.branchname,
			transfer_amount: Number(aud),
			totalsend: Number(aud) + Number(fee),
			received_amount: Number(thb),
			purpose: '',
			termandconditions: ''
		}
	})

	return (
		<FormProvider {...methods}>
			<TransferStepThreeInner />
		</FormProvider>
	)

}

export default memo(TransferStepThree)

const TransferStepThreeInner = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = useContext(AuthContext)
	const { control, handleSubmit, getValues, formState} = useFormContext()
	const [aud, thb, fee, rate ] = [ useRecoilValue(audAtom), useRecoilValue(thbSelector), useRecoilValue(feeSelector), useRecoilValue(rateSelector) ]
	const [ globals, notices ] = [useRecoilValue(globalState), useRecoilValue(noticeState)]
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const user = useRecoilValue(userState)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const setStep = useSetRecoilState(stepAtom)
	const [buttonState, setButtonState] = useRecoilState(stepThreeButtonAtom)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	const scrollRef = useRef()

	const actions = [
		() => handlePrevious(),null,
		handleSubmit((data) => onSubmit(data))
	]
	const properties = [{},{},{ isDisabled: buttonState }]
	let toolbarConfig = mapActionsToConfig(transferStepThreeToolbarConfig, actions)
	toolbarConfig = mapPropertiesToConfig(toolbarConfig, properties)


	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			navigation.setOptions()
			forceUpdate()
		}

	}, [language, user])

	useEffect(() => {
		
	},[loading])

	const onSubmit = (submitted) => {
		setLoading((prev) => ({ ...prev, status: true }))
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		setTimeout(() => {

			// api.post(buildDataPath('transactions', auth.uid, 'add'), JSON.stringify(submitted))
			// .then(response => {
			// 	if(response.ok == true) {
			// 		if(response.data == true) {
			// 			const returnPayload = JSON.stringify({"daily_limit" : data.userMeta.daily_limit})
			// 			api.put(buildDataPath('meta', auth.uid, 'edit', { endpoint: 'users' }), returnPayload)
			// 			.then(response => {
			// 				if (response.ok == true && response.data == true) {
			// 					authDispatch({ type: 'SET_STATUS', payload: { data: 'transferComplete' }})
			// 					transferDispatch({ type: 'SET_STEP_THREE', payload: { data: submitted }})
			// 					transferDispatch({ type: 'GO_TO', payload: { step: 3 }})
			// 					setIsLoading(false)
			// 					navigation.navigate('TransferStepFour')
			// 				} else {
			// 					scrollRef.current.scrollTo({x:0, y:0, animated: false})
			// 					authDispatch({ type: 'SET_STATUS', payload: { data: 'serverError' }})
			// 					console.log('🚫',response)
			// 					setIsDisabled(true)
			// 				}
			// 			})
			// 		} else {
			// 			scrollRef.current.scrollTo({x:0, y:0, animated: false})
			// 			authDispatch({ type: 'SET_STATUS', payload: { data: 'serverError' }})
			// 			console.log('🚫',response)
			// 			setIsDisabled(true)
			// 		}
			// 	}
			// })
			// setLoading((prev) => ({ ...prev, status: false }))
		
		}, 1000)
		// setIsLoading(true)
		
	}

	const onError = (error) => { console.log(error) }

	const handlePrevious = () => {
		setStep(1)
		navigation.goBack()
	}

	return (
		<AppSafeArea>
			<ScrollView>
				{notices && <AlertBanner />}
				<VStack p={"2.5%"} space={"4"}>
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<TransferStepIndicator />
						<Box p={"4"}>
							<Text>{ language.transferStepthree.titleTop }</Text>	
						</Box>
						<VStack borderColor={"primary.600"} borderWidth={"1"} rounded={"8"} overflow={"hidden"}>

							<ReviewListHeader title={ language.transferStepthree.headerFrom } style={{ roundedTop: "8" }} />
							<ReviewListItem label={ language.transferStepthree.listDataSenderLabel } value={ user.firstname + " " + user.lastname } />
							
							<ReviewListHeader title={ language.transferStepthree.headerTo } />
							<ReviewListItem label={ language.transferStepthree.listDataReceiverLabel } value={ beneficiary.fullname } />
							<Divider />
							<ReviewListItem label={ language.transferStepthree.listDataAccountNumberLabel } value={ beneficiary.accountnumber } />
							<Divider />
							<ReviewListItem label={ language.transferStepthree.listDataBankNameLabel } value={ beneficiary.branchname } />

							<ReviewListHeader title={ language.transferStepthree.headerAmounts } />
							<ReviewListItem label={ language.transferStepthree.listDataAmountToSendLabel } value={ 
								formatCurrency(aud, "en-AU", "AUD").full + ' ' + language.transferStepthree.currencyCodeAUD
							} />
							<Divider />
							<ReviewListItem label={ language.transferStepthree.listDataYourRateLabel } value={
								formatCurrency(rate, "th-TH", "THB").full + ' ' + language.transferStepthree.currencyCodeTHB
							} />
							<Divider />
							<ReviewListItem label={ language.transferStepthree.listDataFeesLabel } value={
								formatCurrency(fee, "en-AU", "AUD").full + ' ' + language.transferStepthree.currencyCodeAUD
							} />
							
							<ReviewListHeader title={ language.transferStepthree.headerTotals } />
							<ReviewListItem label={ language.transferStepthree.listDataTotalToPayLabel } value={
								formatCurrency(aud + fee, "en-AU", "AUD").full + ' ' + language.transferStepthree.currencyCodeAUD
							} />
							<ReviewListItem label={ language.transferStepthree.listDataReceivableAmountLabel } value={
								formatCurrency(thb, "th-TH", "THB").full + ' ' + language.transferStepthree.currencyCodeTHB
							} />
							<Forms.SelectInput
								name={ "purpose" }
								control={ control }
								component={"Purpose"}
								rules={ validationRulesTransferStepThree.purpose }
								errors={ formState.errors.purpose }
								label={ language.transferStepthree.listDataPurposeOfTransferLabel }
								placeholder={ language.transferStepthree.listDataPurposeOfTransferPlaceholder }
								required={true}
								context={"Transfers"}
								labelStyles={{ fontSize: "md", color: "coolGray.500", flexGrow: "1", mb: "2"}}
								blockStyles={{ mb: "4"}}
							/>

							<Forms.CheckInput
								name={"termandconditions"}
								control={control}
								rules={ validationRulesTransferStepThree.termsandconditions }
								errors={ formState.errors.termandconditions }
								label={ language.transferStepthree.listDataTermsStatement }
								labelStyles={{ fontSize: "xs", mt: "-0.5", ml: "2", w: "90%" }}
								blockStyles={{ paddingBottom: "4"}}
							/>

						</VStack>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}