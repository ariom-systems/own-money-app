import React, { useEffect } from 'react'

//components
import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'
import { ErrorMessage, TextInputLeft, TextInputRight } from '../common/Forms'
import { FormControl, Input, InputGroup, VStack, useMediaQuery } from 'native-base'
import { Controller, useFormContext } from 'react-hook-form'

//data
import { formatCurrency } from '../../data/Actions'
import { Sizes, validationRulesTransferStepOne } from '../../config'
import { useRecoilState, useRecoilValue } from 'recoil'
import { audAtom, promoAtom, thbSelector, rateSelector} from '../../data/recoil/transfer'
import { userState } from '../../data/recoil/user'
import { globalState } from '../../data/recoil/system'
import { useForceUpdate } from '../../data/Hooks'
//lang

const CurrencyConverter = () => {
	const { control, trigger, setValue, formState } = useFormContext()
	const forceUpdate = useForceUpdate()
	const [ aud, setAud ] = useRecoilState(audAtom)
	const [ thb, setThb ] = useRecoilState(thbSelector)
	const rate = useRecoilValue(rateSelector)
	const promo = useRecoilValue(promoAtom)
	const user = useRecoilValue(userState)
	const globals = useRecoilValue(globalState)

	const [xs, base] = useMediaQuery([{
		maxWidth: 380
	}, {
		minWidth: 381
	}])
	switch (true) {
		case xs: direction = 'column'; spacing = 'flex-start'; break
		case base: direction = 'row'; spacing = 'center'; break
		default: direction = 'row'; spacing = 'center'; break
	}

	let [hasErrors, errorMsg ] = [false, ""]
	if(formState.errors.aud || formState.errors.thb) {
		hasErrors = true
		if(typeof formState.errors.aud != 'undefined') {
			errorMsg = formState.errors.aud.message
		} else if(typeof formState.errors.thb != 'undefined') {
			errorMsg = formState.errors.thb.message
		}
	} else { hasErrors = false }

	useEffect(() => {
		let newThb = aud * rate
		let newAud = newThb / rate
		setValue('thb', formatCurrency(newThb, "th-TH", "THB").value, { shouldValidate: true })
		setValue('aud', formatCurrency(newAud, "en-AU", "AUD").value, { shouldValidate: true })
	}, [promo])

	useEffect(()=> {
		//console.log('CurrencyConvertor.useEffect', rate)
	}, [rate])

	return (
		<VStack>
			<FormControl isInvalid={ (hasErrors) ? true : false} >
				<VStack space={"4"}>
					<InputGroup>
						<TextInputLeft isDisabled={ user.preventTransfer } value={"$"} hasErrors={hasErrors} styles={{ width: "15%" }} />
						<Controller
							control={control}
							name={'aud'}
							rules={validationRulesTransferStepOne.aud}
							render={({ field: { value, onChange, onBlur }}) => (
								<Input
									_focus={hasErrors ? { borderColor: "danger.600"} : { borderColor: "coolGray.300"}}
									borderColor={hasErrors ? "danger.600" : "coolGray.300"}
									color={hasErrors ? "danger.600" : "black"}
									fontSize={Sizes.inputs} w={"60%"} placeholder={"0.00"} rounded={"none"}
									value={value}
									onChangeText={onChange}
									onChange={(e) => {
										let audVal = Number(e.nativeEvent.text).toFixed(2)
										setAud(audVal) //updates the atom/selector (correct values in real-time)
										setValue('aud', formatCurrency(audVal, "en-AU", "AUD").value, { shouldValidate: true })
										let newTHB = Number(audVal * rate).toFixed(2)
										setValue('thb', formatCurrency(newTHB, "th-TH", "THB").value, { shouldValidate: true })
									}}
									onBlur={(e) => {
										let audVal = Number(e.nativeEvent.text).toFixed(2)
										setAud(audVal) //updates the atom/selector (correct values in real-time
										setValue('aud', formatCurrency(audVal, "en-AU", "AUD").value, { shouldValidate: true })
										let newTHB = Number(audVal * rate).toFixed(2)
										setValue('thb', formatCurrency(newTHB, "th-TH", "THB").value, { shouldValidate: true })
									}}
									isDisabled={ user.preventTransfer }
								/>
							)}
						/>
						<TextInputRight isDisabled={ user.preventTransfer } value={"AUD"} hasErrors={hasErrors} styles={{ width: "25%" }} icon={<AuSVG />} />
					</InputGroup>
					<InputGroup>
						<TextInputLeft isDisabled={ user.preventTransfer } value={"฿"} hasErrors={hasErrors} styles={{ width: "15%" }} />
						<Controller
							control={control}
							name={'thb'}
							rules={validationRulesTransferStepOne.thb}
							render={({ field: { value, onChange }}) => (
								<Input
									_focus={hasErrors ? { borderColor: "danger.600"} : { borderColor: "coolGray.300"}}
									borderColor={hasErrors ? "danger.600" : "coolGray.300"}
									color={hasErrors ? "danger.600" : "black"}
									fontSize={Sizes.inputs} w={"60%"} placeholder={"0.00"} rounded={"none"}
									value={value}
									onChangeText={onChange}
									onChange={(e) => {
										let thbVal = Number(e.nativeEvent.text).toFixed(2)
										setThb(thbVal) //updates the atom/selector (correct values in real-time)
										let newAud = Number(thbVal / rate).toFixed(2)
										setValue('aud', formatCurrency(newAud, "en-AU", "AUD").value, { shouldValidate: true})
									}}
									onBlur={(e) => {
									 	let thbVal = Number((e.nativeEvent.text).replace(',','')).toFixed(2)
									 	setThb(thbVal) //updates the atom/selector (correct values in real-time)
									 	let newAUD = Number(thbVal / rate).toFixed(2)
									 	setValue('aud', formatCurrency(newAUD, "en-AU", "AUD").value, { shouldValidate: true })
									// 	setValue('thb', formatCurrency(thbVal, "th-TH", "THB").value, { shouldValidate: true })
									}}
									isDisabled={ user.preventTransfer }
								/>
							)}
						/>
						<TextInputRight isDisabled={ user.preventTransfer } value={"THB"} hasErrors={hasErrors} styles={{ width: "25%" }} icon={<ThSVG />} />
					</InputGroup>
					{ hasErrors && <ErrorMessage message={errorMsg} /> }
				</VStack>
			</FormControl>
		</VStack>
	)
}

export default CurrencyConverter