import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Box, Button, Checkbox, Divider, FormControl, Heading, HStack, Select, 
	ScrollView, Text, VStack } from 'native-base'
import StepIndicator from 'react-native-step-indicator'

import { api } from '../../../config'
import { buildDataPath } from '../../../data/Actions'
import { AuthContext, DataContext, TransferContext } from '../../../data/Context'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { ErrorMessage } from '../../../components/common/Forms'
import { Notice } from '../../../components/common/Notice'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

let labels = [
	language.transferProgress.labelAmount,
	language.transferProgress.labelBeneficiary,
	language.transferProgress.labelReview,
	language.transferProgress.labelFinish
]

export default TransferStepThree = () => {
	const { auth } = React.useContext(AuthContext)
	const { data } = React.useContext(DataContext)
	const { transfer } = React.useContext(TransferContext)

	const methods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		defaultValues: {
			id_users: auth.uid,
			id_receivers: transfer.stepTwo.beneficiary.id,
			fee_AUD: transfer.stepOne.fee,
			rate: Number.parseFloat(transfer.stepOne.rate).toFixed(2),
			today_rate: Number.parseFloat(data.globals.rate).toFixed(2),
			sender: data.user.firstname + " " + data.user.lastname,
			receiver: transfer.stepTwo.beneficiary.fullname,
			accountnumber: transfer.stepTwo.beneficiary.accountnumber,
			branchname: transfer.stepTwo.beneficiary.branchname,
			transfer_amount: transfer.stepOne.aud,
			totalsend: Number(transfer.stepOne.aud) + Number(transfer.stepOne.fee),
			received_amount: transfer.stepOne.thb,
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

const TransferStepThreeInner = () => {
	const navigation = useNavigation()
	const { control, handleSubmit, getValues, formState} = useFormContext()
	const { auth, authDispatch } = React.useContext(AuthContext)
	const { data, dataDispatch } = React.useContext(DataContext)
	const { transfer, transferDispatch } = React.useContext(TransferContext)
	const [ isLoading, setIsLoading ] = React.useState(false)
	const [ isDisabled, setIsDisabled ]  = React.useState(false)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const scrollRef = React.useRef()

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			labels = [
				language.transferProgress.labelAmount,
				language.transferProgress.labelBeneficiary,
				language.transferProgress.labelReview,
				language.transferProgress.labelFinish
			]
			forceUpdate()
		}
	}, [language, auth, labels])

	const onSubmit = submitted => {
		setIsLoading(true)
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.post(buildDataPath('transactions', auth.uid, 'add'), JSON.stringify(submitted))
		.then(response => {
			if(response.ok == true) {
				if(response.data == true) {
					const returnPayload = JSON.stringify({"daily_limit" : data.userMeta.daily_limit})
					api.put(buildDataPath('meta', auth.uid, 'edit', { endpoint: 'users' }), returnPayload)
					.then(response => {
						if (response.ok == true && response.data == true) {
							authDispatch({ type: 'SET_STATUS', payload: { data: 'transferComplete' }})
							transferDispatch({ type: 'SET_STEP_THREE', payload: { data: submitted }})
							transferDispatch({ type: 'GO_TO', payload: { step: 3 }})
							setIsLoading(false)
							navigation.navigate('TransferStepFour')
						} else {
							scrollRef.current.scrollTo({x:0, y:0, animated: false})
							authDispatch({ type: 'SET_STATUS', payload: { data: 'serverError' }})
							console.log('🚫',response)
							setIsDisabled(true)
						}
					})
				} else {
					scrollRef.current.scrollTo({x:0, y:0, animated: false})
					authDispatch({ type: 'SET_STATUS', payload: { data: 'serverError' }})
					console.log('🚫',response)
					setIsDisabled(true)
				}
			}
		})
	}

	const onError = (error) => { console.log(error) }

	return (
		<ScrollView w={"100%"} flex={"1"} ref={scrollRef}>
			<Box mx={"2.5%"} mt={"5%"} px={"5%"} pt={"5%"}  backgroundColor={"white"} h={"100%"} rounded={"2xl"}>
				{ (auth.status !== null && auth.status !== "") && <Notice nb={{w:"100%", mb: "4"}} />}
				<StepIndicator
					stepCount={4}
					currentPosition={transfer.step}
					labels={labels} />
				<Box p={"4"}>
					<Text>{ language.transferStepthree.titleTop }</Text>	
				</Box>
				<VStack borderColor={"primary.600"} borderWidth={"1"} rounded={"lg"} overflow={"hidden"}>
					<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
						<Heading size={"sm"}>{ language.transferStepthree.headerFrom }</Heading>
					</Box>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepthree.listDataSenderLabel }</Text>
						<Text fontSize={"md"}>{getValues('sender')}</Text>
					</HStack>
					<Divider />
					<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
						<Heading size={"sm"}>{ language.transferStepthree.headerTo }</Heading>
					</Box>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepthree.listDataReceiverLabel }</Text>
						<Text fontSize={"md"}>{getValues('receiver')}</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepthree.listDataAccountNumberLabel }</Text>
						<Text fontSize={"md"}>{getValues('accountnumber')}</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepthree.listDataBankNameLabel }</Text>
						<Text fontSize={"md"}>{getValues('branchname')}</Text>
					</HStack>
					<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
						<Heading size={"sm"}>{ language.transferStepthree.headerAmounts }</Heading>
					</Box>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepthree.listDataAmountToSendLabel }</Text>
						<Text fontSize={"md"}>{ language.transferStepthree.currencyCodeAUD } ${getValues('transfer_amount')}</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepthree.listDataYourRateLabel }</Text>
						<Text fontSize={"md"}>{ language.transferStepthree.currencyCodeTHB } ฿{getValues('rate')}</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepthree.listDataFeesLabel }</Text>
						<Text fontSize={"md"}>{ language.transferStepthree.currencyCodeAUD } ${getValues('fee_AUD')}</Text>
					</HStack>
					<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
						<Heading size={"sm"}>{ language.transferStepthree.headerTotals }</Heading>
					</Box>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepthree.listDataTotalToPayLabel }</Text>
						<Text fontSize={"md"}>{ language.transferStepthree.currencyCodeAUD } ${getValues('totalsend')}</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepthree.listDataReceivableAmountLabel }</Text>
						<Text fontSize={"md"}>{ language.transferStepthree.currencyCodeTHB } ฿{getValues('received_amount')}</Text>
					</HStack>
					<FormControl px={"4"} py={"2"} isRequired isInvalid={formState.errors.purpose ? true : false }>
						<Text fontSize={"md"} color={"coolGray.500"} mb={"2"}>{ language.transferStepthree.listDataPurposeOfTransferLabel }</Text>
						<Controller
							control={control}
							rules={{
								required: language.transferStepthree.errorMessageSelectReason
							}}
							name={"purpose"}
							render={({ field: { value, onChange }}) => (
								<SelectControlPurpose
									placeholder={language.transferStepthree.listDataPurposeOfTransferPlaceholder}
									value={value}
									onValueChange={onChange}
								/>
							)}
						/>
						{formState.errors.purpose && (
							<ErrorMessage message={formState.errors.purpose.message} />
						)}
					</FormControl>
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
					<Button flex={"1"} onPress={()=> {
						transferDispatch({ type: 'GO_TO', payload: { step: 1 }})
						navigation.goBack()
					}}>
						<Text fontSize={"17"} color={"#FFFFFF"}>{language.transferStepthree.buttonPrevious }</Text>
					</Button>
					<Button isLoading={isLoading} isLoadingText={"Submitting"} flex={"1"} onPress={handleSubmit(onSubmit, onError)}>
						<Text fontSize={"17"} color={"#FFFFFF"}>{language.transferStepthree.buttonNext }</Text>
					</Button>
				</HStack>
			</Box>
		</ScrollView>
	)
}

const SelectControlPurpose = (props) => {
	const { auth } = React.useContext(AuthContext)
	const [ purposes, setPurposes ] = React.useState([])

	React.useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('globals', null, 'purpose'))
		.then(response => {
			let list = []
			if(response.ok == true) {
				if(Array.isArray(response.data)) {
					response.data.map((element, index) => {
						list.push(<Select.Item key={index} label={element.purpose} value={element.purpose}/>)
					})
					if(auth.uid == 16) { //ME!!!
						list.push(<Select.Item key={'999'} label={"API Testing Only"} value={"API Testing Only"}/>)
					}
					setPurposes(list)
				}
			}
		})
		.catch(error => console.log(error))
	}, [])

	return (
		<Select fontSize={"md"} placeholder={props.placeholder} selectedValue={props.value} value={props.value} onValueChange={props.onValueChange}>
			{purposes}
		</Select>
	)
}