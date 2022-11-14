import React from 'react'
import { Platform } from 'react-native'
import { Box, Button, Factory, FormControl, HStack, Input, InputGroup, InputLeftAddon, InputRightAddon, 
	Popover, Pressable,	Text, VStack } from 'native-base'
import StepIndicator from 'react-native-step-indicator'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import { api } from '../../../config'
import { buildDataPath } from '../../../data/Actions'
import { AuSVG } from '../../../assets/img/AuSVG'
import { ThSVG } from '../../../assets/img/ThSVG'
import { AuthContext, DataContext, TransferContext } from '../../../data/Context'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { formatCurrency, formatFloat, valueIsBetween } from '../../../data/Actions'
import { useAspect } from '../../../data/Hooks'
import { ErrorMessage } from '../../../components/common/Forms'
import { useNavigation } from '@react-navigation/native'

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

const NBIonicon = Factory(Ionicon)

export default TransferStepOne = () => {
	const methods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		defaultValues: {
			aud: '',
			thb: '',
			remaining: '',
			fee: '',
			rate: ''
		}
	})

	return (
		<FormProvider {...methods}>
			<TransferStepOneInner />
		</FormProvider>
	)
}

const TransferStepOneInner = () => {
	const navigation = useNavigation()
	const { control, handleSubmit, watch, reset, setValue, getValues, formState } = useFormContext()
	const { auth } = React.useContext(AuthContext)
	const { data , dataDispatch } = React.useContext(DataContext)
	const { transfer, transferDispatch } = React.useContext(TransferContext)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
	
	const onSubmit = submitted => {
		let subAUD = formatFloat(submitted.aud)
		let subTHB = formatFloat(submitted.thb)
		let subFee = formatFloat(submitted.fee)
		let subRate = formatFloat(submitted.rate)
		let remaining = {
			max: data.userMeta.daily_limit.max,
			remaining: submitted.remaining.toFixed(2)
		}
		dataDispatch({ type: 'UPDATE_REMAINING', payload: { data: remaining } })
		transferDispatch({ type: 'SET_STEP_ONE', payload: {
			aud: formatCurrency(subAUD, "en-AU", "AUD").value,
			thb: formatCurrency(subTHB, "th-TH", "THB").value,
			fee: formatCurrency(subFee, "en-AU", "AUD").value,
			rate: formatCurrency(subRate, "th-TH", "THB").value,
		}})
		transferDispatch({ type: 'GO_TO', payload: { step: 1 }})
		navigation.navigate('TransferStepTwo')
	}
	const onError = error => console.log(error)
	const limit = useAspect(data.userMeta.daily_limit.max)
	const limitFormatted = useAspect(formatCurrency(limit.get(), "en-AU", "AUD").full)
	const remaining = useAspect(data.userMeta.daily_limit.remaining)
	const remainingFormatted = useAspect(formatCurrency(remaining.get(), "en-AU", "AUD").full)
	const aud = useAspect(0)
	const rate = useAspect(data.globals.rate)
	const fee = useAspect(data.globals.fee)

	React.useEffect(() => {
		if(transfer.reset == true) {
			//reload daily_limit
			api.post(buildDataPath('meta', auth.uid, 'view', { endpoint: 'users' }), JSON.stringify(Object.assign({}, ["daily_limit"])))
			//api.post(buildDataPath('meta', auth.uid, 'view'), JSON.stringify(Object.assign({}, ["daily_limit"])))
			.then(response => {
				dataDispatch({ type: 'UPDATE_REMAINING', payload: { data: response.data.daily_limit } })
				forceUpdate()
			})
			.then(result => {
				forceUpdate()
				remaining.set(data.userMeta.daily_limit.remaining)
				limit.set(data.userMeta.daily_limit.max)
				reset({ "aud": "" })
				reset({ "thb": "" })
				reset({ "fee": "" })
				reset({ "rate": "" })
			})
			.catch(error => { console.log(error) })
		}
	}, [transfer.reset])

	React.useEffect(() => {
		if(transfer.stepOne.aud != "" && transfer.stepOne.thb != "") {
			let tmpAUD = formatFloat(transfer.stepOne.aud)
			let tmpTHB = formatFloat(transfer.stepOne.thb)
			setValue('aud', formatCurrency(tmpAUD, "en-AU", "AUD").value, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
			setValue('thb', formatCurrency(tmpTHB, "th-TH", "THB").value, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
		}
	}, [])

	React.useEffect(() => {
		if(getValues("aud") != "") {
			aud.set(getValues("aud"))
		}
	},[aud])

	React.useEffect(() => {
		const subscription = watch((value, { name, type }) => {
			//console.log(value)
			let aud = value.aud || 0
			let changed = Number(remaining.get()) - Number(aud)
			if(!isNaN(aud)) {
				remainingFormatted.set(formatCurrency(changed, "en-AU", "AUD").full)
			}
			handleFeesRates(value, name)
		})
		return () => subscription.unsubscribe()
	}, [watch])

	React.useEffect(() => {
		forceUpdate()
	}, [rate.get()])

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

	const handleLimitChange = (change) => {
		if(!isNaN(change)) {
			let changed = Number(remaining.get()) - Number(change)
			setValue("remaining", changed, { shouldValidate: true })
		}
	}

	const handleFeesRates = (value, name) => {
		
		if(name == "aud" && value.aud !== "") {
			//fees
			const feeModifiers = data.globals.steps.feeModifier
			feeModifiers.forEach(modifier => {
				switch(modifier.conditions.type) {
					case "send_amount":
						if(valueIsBetween(value.aud, modifier.conditions) == true) {
							if(modifier.function == 'set') {
								fee.set(modifier.value)
								setValue("fee", formatCurrency(modifier.value, "en-AU", "AUD").value, { shouldValidate: true })
							}
						} else {
							fee.set(0)
							setValue("fee", formatCurrency(0, "en-AU", "AUD").value, { shouldValidate: true })
						}
					break
				}
			})
			//rate
			const rateModifiers = data.globals.steps.rateModifier
			rateModifiers.forEach(modifier => {
				switch(modifier.conditions.type) {
					case "send_amount":
						if(valueIsBetween(value.aud, modifier.conditions) == true) {
							switch(modifier.function) {
								case "add":
									let addValue = Number(data.globals.rate) + Number(modifier.value)
									rate.set(addValue)
									setValue("rate", formatCurrency(addValue, "th-TH", "THB").value, { shouldValidate: true })
								break
								case "subtract":
									let subValue = Number(data.globals.rate) - Number(modifier.value)
									rate.set(subValue)
									setValue("rate", formatCurrency(subValue, "th-TH", "THB").value, { shouldValidate: true })
								break
								case "set":
									if(modifier.value != 0) {
										rate.set(Number(modifier.value))
										setValue("rate", formatCurrency(modifier.value, "th-TH", "THB").value, { shouldValidate: true })	
									} else {
										rate.set(data.globals.rate)
										setValue("rate", formatCurrency(data.globals.rate, "th-TH", "THB").value, { shouldValidate: true })
									}
								break
							}
						}
					break
				}
			})
		}
	}

	return (
		<Box mx={"2.5%"} mt={"5%"} p={"5%"} backgroundColor={"white"} rounded={"2xl"}>
			<Box mt={"5%"} mx={"2.5%"} py={"4"} backgroundColor={"white"}>
				<StepIndicator
					stepCount={4}
					currentPosition={transfer.step}
					labels={labels} />
			</Box>
			<VStack space={"4"} w={"100%"} alignItems={"center"}>
				<Text textAlign={"center"}>{ language.transferStepOne.titleTop }</Text>
				<HStack textAlign={"center"} space={"2"} alignItems={"center"}>
					<Text>{ language.transferStepOne.currentRate }: { language.transferStepOne.currencyCodeAUD } $1.00 = ฿{parseFloat(data.globals.rate).toFixed(2)} { language.transferStepOne.currencyCodeTHB }</Text>
					<Popover trigger={triggerProps => { return (
						<Pressable {...triggerProps}><NBIonicon color={"coolGray.400"} name={"information-circle-outline"} fontSize={"md"}/></Pressable>
					) }} >
						<Popover.Content>
							<Popover.Arrow />
							<Popover.Body>
								{ language.transferStepOne.popoverToolTip }
							</Popover.Body>
						</Popover.Content>
					</Popover>
				</HStack>
				<FormControl isInvalid={ (formState.errors.aud || formState.errors.thb) ? true : false} >
					<VStack space={"4"} px={"4"}>
						<InputGroup>
							<InputLeftAddon
								_light={(formState.errors.aud || formState.errors.thb) && { borderColor: "danger.600" }}
								children={
									<Text
										color={(formState.errors.aud || formState.errors.thb) && "danger.600"}
										key={Math.random()}
										fontSize={"lg"}>$</Text>
								}
								w={"15%"} />
							<Controller
								control={control}
								name={'aud'}
								rules={{
									pattern: {
										value: /^(?!,\.$)[\d,]+[\.]?(\d{1,2})?$/,
										message: language.transferStepOne.errorMessageInvalidFormat
									}
								}}
								render={({ field: { value, onChange, onBlur }}) => (
									<Input
										_focus={(formState.errors.aud || formState.errors.thb) && { borderColor: "danger.600" }}
										color={(formState.errors.aud || formState.errors.thb) && "danger.600"}
										fontSize={"lg"} w={"60%"} placeholder={"0.00"} rounded={"none"}
										value={value}
										onChangeText={onChange}
										onChange={(e) => {
											let newTHB = formatFloat(e.nativeEvent.text) * getValues("rate")
											handleLimitChange(e.nativeEvent.text)
											setValue('thb', formatCurrency(newTHB, "th-TH", "THB").value, { shouldValidate: true})
										}}
										onBlur={() => {
											onBlur()
											forceUpdate()
										}}
										onEndEditing={() => forceUpdate()}
									/>
								)}
							/>
							<InputRightAddon
								_light={(formState.errors.aud || formState.errors.thb) && { borderColor: "danger.600" }}
								w={"25%"}
								children={
									<HStack>
										<AuSVG />
										<Text
											color={(formState.errors.aud || formState.errors.thb) && "danger.600"}
											mx={"2"}>AUD</Text>
									</HStack>
								} />
						</InputGroup>
						<InputGroup>
							<InputLeftAddon
								_light={(formState.errors.aud || formState.errors.thb) && { borderColor: "danger.600" }}
								children={
									<Text
										color={(formState.errors.aud || formState.errors.thb) && "danger.600"}
										key={Math.random()}
										fontSize={"lg"}>฿</Text>
								}
								w={"15%"} />
							<Controller
								control={control}
								name={'thb'}
								rules={{
									pattern: {
										value: /^(?!,\.$)[\d,]+[\.]?(\d{1,2})?$/,
										message: language.transferStepOne.errorMessageInvalidFormat
									}
								}}
								render={({ field: { value, onChange, onBlur }}) => (
									<Input
										_focus={(formState.errors.aud || formState.errors.thb) && { borderColor: "danger.600" }}
										color={(formState.errors.aud || formState.errors.thb) && "danger.600"}
										fontSize={"lg"} w={"60%"} placeholder={"0.00"} rounded={"none"}
										value={value}
										onChangeText={onChange}
										onChange={(e) => {
											let newAUD = formatFloat(e.nativeEvent.text) / getValues("rate")
											handleLimitChange(newAUD)
											setValue('aud', formatCurrency(newAUD, "en-AU", "AUD").value, { shouldValidate: true})		
										}}
										onBlur={() => {
											onBlur()
											forceUpdate()
										}}
										onEndEditing={() => forceUpdate()}
									/>
								)}
							/>
							<InputRightAddon
								_light={(formState.errors.aud || formState.errors.thb) && { borderColor: "danger.600" }}
								w={"25%"}
								children={
									<HStack>
										<ThSVG />
										<Text
											color={(formState.errors.aud || formState.errors.thb) && "danger.600"}
											mx={"2"}>THB</Text>
									</HStack>
								} />
						</InputGroup>
						{(formState.errors.aud || formState.errors.thb ) && (
							<ErrorMessage message={formState.errors.aud.message} />
						)}
					</VStack>
				</FormControl>
				<Box w={"100%"}>
					<VStack mx={"5%"} p={"4"} space={"2"} backgroundColor={"white"} rounded={"md"}>
						<HStack justifyContent={"space-between"}>
							<Text>{ language.transferStepOne.labelDailyLimit }:</Text>
							<Text>{limitFormatted.get()}</Text>
						</HStack>
						<Controller
							control={control}
							name={"remaining"}
							rules={{
								 validate: v => parseInt(v) > 0 || language.transferStepOne.errorMessageLimitExceeded	
							}}
							render={({ field: { value }}) => (
								<VStack space={"2"}>
									<HStack justifyContent={"space-between"}>
										<Text>{ language.transferStepOne.labelBalanceRemaining }:</Text>
										<Text
											color={ formState.errors.remaining ? "danger.600" : "black" }
										>{remainingFormatted.get()}</Text>
									</HStack>
									{(formState.errors.remaining) && (
										<Text color={"danger.600"}>{formState.errors.remaining.message}</Text>
									)}
								</VStack>
							)}
							>
						</Controller>
						{ aud.get() !== 0 && (
						<>
							<HStack justifyContent={"space-between"}>
								<Text>{ language.transferStepOne.labelFee }:</Text>
								<Text>{ formatCurrency(fee.get(), "en-AU", "AUD").full }</Text>
							</HStack>
							<HStack justifyContent={"space-between"}>
								<Text>{ language.transferStepOne.labelYourRate }:</Text>
								<Text>{ formatCurrency(rate.get(), "th-TH", "THB").full}</Text>
							</HStack>
						</>
						)}
					</VStack>
				</Box>

				<HStack space={"4"} w={"100%"} justifyContent={"center"}>
					<Button
						isDisabled={(
							formState.errors.aud ||
							formState.errors.thb ||
							formState.errors.remaining ||
							getValues('aud') == "" ||
							getValues('thb') == ""
						) ? true : false }
						_disabled={{ backgroundColor:"primary.500", borderColor:"primary.600", borderWidth:1 }}
						alignSelf={"center"}
						w={"50%"}
						onPress={handleSubmit(onSubmit, onError)} >
						<Text fontSize={"lg"} color={"#FFFFFF"}>{ language.transferStepOne.buttonNext }</Text>
					</Button>
				</HStack>
			</VStack>
		</Box>
	)
}
