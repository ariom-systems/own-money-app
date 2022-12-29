import React from 'react'
import { FormControl, Input, InputGroup, VStack } from 'native-base'
import { Controller, useFormContext } from 'react-hook-form'

import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'
import { ErrorMessage, TextInputLeft, TextInputRight } from '../common/Forms'

import { formatCurrency } from '../../data/Actions'
import { validationRulesTransferStepOne } from '../../config'
import { useRecoilState, useRecoilValue } from 'recoil'
import { audAtom, thbSelector} from '../../data/recoil/transfer'
import { globalState } from '../../data/recoil/system'

const CurrencyConverter = () => {
	const { control, setValue, formState } = useFormContext()
	const [ aud, setAud ] = useRecoilState(audAtom)
	const [ thb, setThb ] = useRecoilState(thbSelector)
	const globals = useRecoilValue(globalState)

	let [hasErrors, errorMsg ] = [false, ""]
	if(formState.errors.aud || formState.errors.thb) {
		hasErrors = true
		if(typeof formState.errors.aud != 'undefined') {
			errorMsg = formState.errors.aud.message
		} else if(typeof formState.errors.thb != 'undefined') {
			errorMsg = formState.errors.thb.message
		}
	} else { hasErrors = false }
	return (
		<VStack>
			<FormControl isInvalid={ (hasErrors) ? true : false} >
				<VStack space={"4"} px={"4"}>
					<InputGroup>
						<TextInputLeft value={"$"} hasErrors={hasErrors} />
						<Controller
							control={control}
							name={'aud'}
							rules={validationRulesTransferStepOne.aud}
							render={({ field: { value, onChange, onBlur }}) => (
								<Input
									_focus={hasErrors ? { borderColor: "danger.600"} : { borderColor: "coolGray.300"}}
									borderColor={hasErrors ? "danger.600" : "coolGray.300"}
									color={hasErrors ? "danger.600" : "black"}
									fontSize={"lg"} w={"60%"} placeholder={"0.00"} rounded={"none"}
									value={value}
									onChangeText={onChange}
									onChange={(e) => {

										let newThb = e.nativeEvent.text * globals.rate
										setAud(e.nativeEvent.text) //updates the atom/selector (correct values in real-time)
										setValue('thb', formatCurrency(newThb, "th-TH", "THB").value, { shouldValidate: true})
									}}
								/>
							)}
						/>
						<TextInputRight value={"AUD"} hasErrors={hasErrors} icon={<AuSVG />} />
					</InputGroup>
					<InputGroup>
						<TextInputLeft value={"฿"} hasErrors={hasErrors} />
						<Controller
							control={control}
							name={'thb'}
							rules={validationRulesTransferStepOne.thb}
							render={({ field: { value, onChange, onBlur }}) => (
								<Input
									_focus={hasErrors ? { borderColor: "danger.600"} : { borderColor: "coolGray.300"}}
									borderColor={hasErrors ? "danger.600" : "coolGray.300"}
									color={hasErrors ? "danger.600" : "black"}
									fontSize={"lg"} w={"60%"} placeholder={"0.00"} rounded={"none"}
									value={value}
									onChangeText={onChange}
									onChange={(e) => {
										let newAud = e.nativeEvent.text / globals.rate
										setThb(e.nativeEvent.text) //updates the atom/selector (correct values in real-time)
										setValue('aud', formatCurrency(newAud, "en-AU", "AUD").value, { shouldValidate: true})
									}}
								/>
							)}
						/>
						<TextInputRight value={"THB"} hasErrors={hasErrors} icon={<ThSVG />} />
					</InputGroup>
					{ hasErrors && <ErrorMessage message={errorMsg} /> }
				</VStack>
			</FormControl>
		</VStack>
	)
}

export default CurrencyConverter