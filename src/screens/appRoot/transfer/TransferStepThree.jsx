import React from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import { Box, Button, Divider, HStack, ScrollView, StatusBar, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import ReviewListHeader from '../../../components/transfers/ReviewListHeader'
import ReviewListItem from '../../../components/transfers/ReviewListItem'
import * as Forms from '../../../components/common/Forms'
import Toolbar, { ToolbarItem, ToolbarSpacer } from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'


//data
import { AuthContext } from '../../../data/Context'
import { Controller, FormProvider, set, useForm, useFormContext } from 'react-hook-form'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { stepAtom, audAtom, thbSelector, feeSelector, rateSelector, limitSelector, stepThreeButtonAtom } from '../../../data/recoil/transfer'
import { globalState, loadingState } from '../../../data/recoil/system'
import { userState } from '../../../data/recoil/user'
import { beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { api, validationRulesTransferStepThree } from '../../../config'
import { buildDataPath, formatCurrency } from '../../../data/Actions'

//lang
import LocalizedStrings from 'react-native-localization'
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
	const [ loading, setLoading ] = useRecoilState(loadingState)
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

	React.useEffect(() => {
		//console.log("loading", loading)
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
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<StatusBar barStyle={"dark-content"} />
			<ScrollView>
				<AlertBanner m={"2.5%"} mb={"0"} />
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
					<Toolbar>
						<ToolbarItem
							label={language.transferStepthree.buttonPrevious}
							icon={"chevron-back-outline"}
							space={"1"}
							iconProps={{ ml: "-4" }}
							buttonProps={{ flex: "1" }}
							action={() => handlePrevious()} />
						<ToolbarSpacer />
						<ToolbarItem
							label={language.transferStepthree.buttonNext}
							icon={"chevron-forward-outline"}
							iconPosition={"right"}
							buttonProps={{ flex: "1" }}
							action={handleSubmit(onSubmit, onError)} />
					</Toolbar>
				</VStack>
			</ScrollView>
		</ImageBackground>
	)
}