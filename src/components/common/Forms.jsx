import React from 'react'
import { Box, Factory, FormControl, Heading, HStack, Input, InputGroup, InputLeftAddon, InputRightAddon, Text } from 'native-base'
import { useController } from 'react-hook-form'
import * as SelectControl from '../../components/beneficiaries/SelectControls'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)

export const ErrorMessage = ({ message, icon }) => {
	return (
		<FormControl.ErrorMessage w={"90%"} leftIcon={<NBIonicon alignSelf={"flex-start"} mt={"0.5"} name={icon} />}>
			{message}
		</FormControl.ErrorMessage>
	)
}

export const HeaderItem = ({nb, children}) => {
	return (
		<Box {...nb} px={"2"} py={"4"} backgroundColor={"coolGray.200"}>
			<Heading size={"sm"}>{ children }</Heading>
		</Box>
	)
}

export const TextInput = (props) => {
	let { name, control, rules = {}, errors, label = "", placeholder = "", required, inputAttributes = null,
		onChange, addonLeft = null, addonRight = null } = props
	const { field, fieldState: { isTouched, isDirty }, formState: { touchedFields, dirtyFields }} = useController({ name, control, rules: rules })
	
	let labelRow, inputRow

	const inputField = (
		<Input
			placeholder={ placeholder }
			onChangeText={field.onChange}
			onChange={(event) => onChange(event.nativeEvent.text)}
			onBlur={ field.onBlur }
			value={ field.value }
			name={ field.name }
			fontSize={"lg"}
			autoCorrect={false}
			autoCapitalize={'none'}
			{...inputAttributes}
		/>
	)

	if (addonLeft != null || addonRight != null) {
		inputRow = (
			<InputGroup>
				{ addonLeft || null }
				{ inputField }
				{ addonRight || null }
			</InputGroup>
		)
	} else {
		inputRow = inputField
	}

	if(label != "") {
		labelRow = (<HStack><FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ label }</FormControl.Label></HStack>)
	}

	return (
		<FormControl px={"4"} isRequired={ required ? true : false } isInvalid={ errors ? true : false}>
			{ labelRow || null }
			{ inputRow }
			{ errors && <ErrorMessage message={ errors.message } />}
		</FormControl>
	)
}


export const SelectInput = (props) => {
	const { name, control, component, rules = {}, errors, label, placeholder } = props

	const {
		field,
		fieldState: { isTouched, isDirty },
		formState: { touchedFields, dirtyFields }
	} = useController({
		name,
		control,
		rules: rules
	})

	return (
		<FormControl px={"4"} isRequired isInvalid={ errors ? true : false}>
			<HStack>
				<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ label }</FormControl.Label>
			</HStack>
			<SelectControl.Controlled
				component={component}
				placeholder={ placeholder }
				onValueChange={ field.onChange }
				onBlur={ field.onBlur }
				value={ field.value } 
				name={ field.name } />
			{ errors && (
				<ErrorMessage message={ errors.message } />
			)}
		</FormControl>
	)
}

export const TextInputLeft = (props) => {
	const { value, hasErrors, icon = null} = props
	return (
		<InputLeftAddon _light={hasErrors && { borderColor: "danger.600" }} w={"15%"}
			children={<HStack>{icon}<Text color={hasErrors ? "danger.600" : "black"}>{ value }</Text></HStack>} />
	)
}

export const TextInputRight = (props) => {
	const { value, hasErrors, icon = ""} = props
	let iconComp = icon
	return (
		<InputRightAddon _light={hasErrors && { borderColor: "danger.600" }} w={"25%"}
			children={<HStack pl={"2"}>{ iconComp }<Text color={hasErrors ? "danger.600" : "black"} mx={"2"}>{ value }</Text></HStack>} />
	)
}