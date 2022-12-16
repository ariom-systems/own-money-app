import React from 'react'
import { Factory, FormControl, Input, InputGroup, VStack } from 'native-base'
import { Controller, useFormContext } from 'react-hook-form'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
const NBIonicon  = Factory(Ionicon)
import { formatCurrency, formatFloat } from '../../data/Actions'
import { ErrorMessage, TextInputLeft, TextInputRight } from '../common/Forms'
import { validationRulesTransferStepOne } from '../../config'

import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'

import { useRecoilState, useRecoilValue, atom, selector } from 'recoil'
import { globalState } from '../../data/recoil/system'

const formStateAtom = atom({
	key: 'formstate',
	default: {}
})

const audAtom = atom({
	key: 'aud',
	default: 0
})

const thbSelector = selector({
	key: 'thb',
	get: ({get}) => {
		const [aud, globals] = [get(audAtom), get(globalState)]
		return aud * globals.rate
	},
	set: ({get, set}, newThbValue) => {
		const globals = get(globalState)
		const newAudValue = newThbValue / globals.rate
		set(audAtom, newAudValue)
	}
})

const CurrencyConverter = () => {
	const { control, setValue, watch, formState } = useFormContext()
	let hasErrors = false
	if(formState.errors.aud || formState.errors.thb) { hasErrors = true } else { hasErrors = false }
	const [ aud, setAud ] = useRecoilState(audAtom)
	const [ thb, setThb ] = useRecoilState(thbSelector)
	const globals = useRecoilValue(globalState)
	const [ formstate, setFormstate ] = useRecoilState(formStateAtom)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		console.log("aud", aud, "thb", thb)
	}, [aud, thb])


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
					{/* { hasErrors && <ErrorMessage message={formState.errors.aud.message} /> } */}
				</VStack>
			</FormControl>
		</VStack>
	)
}

export default CurrencyConverter