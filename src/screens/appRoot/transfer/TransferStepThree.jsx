import React, { useContext, useEffect, useRef, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Box, Divider, ScrollView, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import ReviewListHeader from '../../../components/transfers/ReviewListHeader'
import ReviewListItem from '../../../components/transfers/ReviewListItem'
import * as Forms from '../../../components/common/Forms'
import Toolbar from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'

//data

import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { AuthContext } from '../../../data/Context'
import { api, validationRulesTransferStepThree, transferStepThreeToolbarConfig } from '../../../config'
import { buildDataPath, formatCurrency, mapActionsToConfig, mapPropertiesToConfig } from '../../../data/Actions'
import { stepAtom, audAtom, thbSelector, feeSelector, rateSelector, stepThreeButtonAtom } from '../../../data/recoil/transfer'
import { beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { userState } from '../../../data/recoil/user'
import { globalState, loadingState, noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepThree = () => {
	const { auth } = useContext(AuthContext)
	const aud = useRecoilValue(audAtom)
	const thb = useRecoilValue(thbSelector)
	const fee = useRecoilValue(feeSelector)
	const rate = useRecoilValue(rateSelector)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const globals = useRecoilValue(globalState)
	const user = useRecoilValue(userState)

	const methods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		defaultValues: {
			id_users: auth.uid,
			id_receivers: beneficiary.id,
			fee_AUD: fee,
			rate: Number(rate).toFixed(2),
			today_rate: Number(globals.rate).toFixed(2),
			sender: user.fullname,
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
	const forceUpdate = useForceUpdate()
	const { control, handleSubmit, formState} = useFormContext()
	const { auth } = useContext(AuthContext)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const [ buttonState, setButtonState ] = useRecoilState(stepThreeButtonAtom)
	const setStep = useSetRecoilState(stepAtom)
	const aud = useRecoilValue(audAtom)
	const thb = useRecoilValue(thbSelector)
	const fee = useRecoilValue(feeSelector)
	const rate = useRecoilValue(rateSelector)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const notices = useRecoilValue(noticeState)
	const user = useRecoilValue(userState)
	const lang = useRecoilValue(langState)
	const scrollRef = useRef()

	const actions = [
		() => handlePrevious(),null,
		() => {
			handleSubmit((data) => onSubmit(data), (error) => onError(error))()
		}
	]
	const properties = [{},{},{ isDisabled: buttonState }]
	let toolbarConfig = mapActionsToConfig(transferStepThreeToolbarConfig, actions)
	toolbarConfig = mapPropertiesToConfig(toolbarConfig, properties)


	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

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
			// 					
			// 					transferDispatch({ type: 'SET_STEP_THREE', payload: { data: submitted }})
			// 					transferDispatch({ type: 'GO_TO', payload: { step: 3 }})
			// 					setIsLoading(false)
			// 					navigation.navigate('TransferStepFour')
			// 				} else {
			// 					scrollRef.current.scrollTo({x:0, y:0, animated: false})
			// 					
			// 					console.log('🚫',response)
			// 					setIsDisabled(true)
			// 				}
			// 			})
			// 		} else {
			// 			scrollRef.current.scrollTo({x:0, y:0, animated: false})
			// 			
			// 			console.log('🚫',response)
			// 			setIsDisabled(true)
			// 		}
			// 	}
			// })
			// setLoading((prev) => ({ ...prev, status: false }))
		
		}, 1000)
		// setIsLoading(true)
		
	}

	const onError = (error) => {
		console.log(error)
		setLoading({ status: false, message: 'none' })
	}

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

							<ReviewListHeader title={ language.transferStepthree.headings.from } style={{ roundedTop: "8" }} />
							<ReviewListItem label={ language.transferStepthree.labels.sender } value={ user.firstname + " " + user.lastname } />
							
							<ReviewListHeader title={ language.transferStepthree.headings.to } />
							<ReviewListItem label={ language.transferStepthree.labels.receiver } value={ beneficiary.fullname } />
							<Divider />
							<ReviewListItem label={ language.transferStepthree.labels.accountnumber } value={ beneficiary.accountnumber } />
							<Divider />
							<ReviewListItem label={ language.transferStepthree.labels.bankname } value={ beneficiary.branchname } />

							<ReviewListHeader title={ language.transferStepthree.headings.amounts } />
							<ReviewListItem label={ language.transferStepthree.labels.amounttosend } value={ 
								formatCurrency(aud, "en-AU", "AUD").full + ' ' + language.misc.aud
							} />
							<Divider />
							<ReviewListItem label={ language.transferStepthree.labels.yourrate } value={
								formatCurrency(rate, "th-TH", "THB").full + ' ' + language.misc.thb
							} />
							<Divider />
							<ReviewListItem label={ language.transferStepthree.labels.fees } value={
								formatCurrency(fee, "en-AU", "AUD").full + ' ' + language.misc.aud
							} />
							
							<ReviewListHeader title={ language.transferStepthree.headings.totals } />
							<ReviewListItem label={ language.transferStepthree.labels.totaltopay } value={
								formatCurrency(aud + fee, "en-AU", "AUD").full + ' ' + language.misc.aud
							} />
							<ReviewListItem label={ language.transferStepthree.labels.receivableamount } value={
								formatCurrency(thb, "th-TH", "THB").full + ' ' + language.misc.thb
							} />
							<Forms.SelectInput
								name={ "purpose" }
								control={ control }
								component={"Purpose"}
								rules={ validationRulesTransferStepThree.purpose }
								errors={ formState.errors.purpose }
								label={ language.transferStepthree.labels.purpose }
								placeholder={ language.transferStepthree.placeholders.purpose }
								required={true}
								context={"Transfers"}
								labelStyles={{ fontSize: "md", color: "coolGray.500", flexGrow: "1", mb: "2"}}
								blockStyles={{ mb: "4", px: "4"}}
							/>

							<Forms.CheckInput
								name={"termandconditions"}
								control={control}
								rules={ validationRulesTransferStepThree.terms }
								errors={ formState.errors.termandconditions }
								label={ language.transferStepthree.labels.terms }
								labelStyles={{ fontSize: "xs", mt: "-0.5", ml: "2", w: "90%" }}
								blockStyles={{ pb: "4", pl: "4"}}
							/>

						</VStack>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}