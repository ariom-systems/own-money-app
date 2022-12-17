import React from 'react'
import { ImageBackground } from 'react-native'
import { Box, Button, Checkbox, Divider, FormControl, Heading, HStack, Select, ScrollView, Text, VStack } from 'native-base'

import { useNavigation } from '@react-navigation/native'

//components
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import ReviewListHeader from '../../../components/transfers/ReviewListHeader'
import { Notice } from '../../../components/common/Notice'
import * as Forms from '../../../components/common/Forms'

//data
import { AuthContext } from '../../../data/Context'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { stepAtom, audAtom, thbSelector, feeSelector, rateSelector, limitSelector, stepThreeButtonAtom } from '../../../data/recoil/transfer'
import { globalState } from '../../../data/recoil/system'
import { userState } from '../../../data/recoil/user'
import { beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { api, validationRulesTransferStepThree } from '../../../config'
import { buildDataPath, formatCurrency } from '../../../data/Actions'

//lang
import LocalizedStrings from 'react-native-localization'
import ReviewListItem from '../../../components/transfers/ReviewListItem'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepThree = () => {
	const { auth } = React.useContext(AuthContext)
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

export default TransferStepThree

const TransferStepThreeInner = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = React.useContext(AuthContext)
	const { control, handleSubmit, getValues, formState} = useFormContext()
	const [aud, thb, fee, rate ] = [ useRecoilValue(audAtom), useRecoilValue(thbSelector), useRecoilValue(feeSelector), useRecoilValue(rateSelector) ]
	const globals = useRecoilValue(globalState)
	const user = useRecoilValue(userState)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const setStep = useSetRecoilState(stepAtom)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const scrollRef = React.useRef()

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	const onSubmit = (submitted) => {
		console.log(submitted)
		// setIsLoading(true)
		// api.setHeader('Authorization', 'Bearer ' + auth.token)
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
	}

	const onError = (error) => { console.log(error) }

	const handlePrev = () => {
		setStep(1)
		navigation.goBack()
	}

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<ScrollView w={"100%"} flex={"1"} ref={scrollRef}>
				<Box mx={"2.5%"} mt={"5%"} px={"5%"} pt={"5%"}  backgroundColor={"white"} h={"100%"} rounded={"2xl"}>
					{ (auth.status !== null && auth.status !== "") && <Notice nb={{w:"100%", mb: "4"}} />}
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
							labelStyles={{ fontSize: "md", color: "coolGray.500", flexGrow: "1"}}
							blockStyles={{ mb: "4"}}
						/>

						
						{/* <FormControl px={"4"} py={"2"} isRequired isInvalid={formState.errors.purpose ? true : false }>
							<Text fontSize={"md"} color={"coolGray.500"} mb={"2"}>{  }</Text>
							<Controller
								control={control}
								rules={{
									
								}}
								name={"purpose"}
								render={({ field: { value, onChange }}) => (
									<SelectControlPurpose
										placeholder={}
										value={value}
										onValueChange={onChange}
									/>
								)}
							/>
							{formState.errors.purpose && (
								<ErrorMessage message={formState.errors.purpose.message} />
							)}
						</FormControl> */}
						<FormControl px={"4"} py={"2"} isRequired isInvalid={formState.errors.termandconditions ? true : false }>
							<Controller
								control={control}
								rules={{
									required: language.transferStepthree.errorMessageAcceptTerms
								}}
								name={"termandconditions"}
								render={({ field: { value, onChange }}) => (
									<HStack pb={"2"}>
										<Checkbox
											accessibilityLabel={language.transferStepthree.listDataTermsStatement}
											onChange={onChange}
											isChecked={value}
											value={value}
										/>
										<Text fontSize={"xs"} mt={"-0.5"} ml={"2"} w={"90%"} color={formState.errors.termandconditions ? "danger.600" : "black"}>
											{ language.transferStepthree.listDataTermsStatement }
										</Text>
									</HStack>
								)}
							/>
							{formState.errors.termandconditions && (
								<ErrorMessage message={formState.errors.termandconditions.message} />
							)}
						</FormControl>
					</VStack>
					<HStack w={"100%"} space={"4"} my={"4"} alignItems={"center"}>
						<Button flex={"1"} onPress={()=> handlePrev() }>
							<Text fontSize={"17"} color={"#FFFFFF"}>{language.transferStepthree.buttonPrevious }</Text>
						</Button>
						<Button isLoadingText={"Submitting"} flex={"1"} onPress={handleSubmit(onSubmit, onError)}>
							<Text fontSize={"17"} color={"#FFFFFF"}>{language.transferStepthree.buttonNext }</Text>
						</Button>
					</HStack>
				</Box>
			</ScrollView>
		</ImageBackground>
	)
}