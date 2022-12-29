import React from 'react'
import { Box, Checkbox, Factory, FormControl, Heading, HStack, Input, InputGroup, InputLeftAddon, InputRightAddon, Text } from 'native-base'
import { useController } from 'react-hook-form'
import { Controlled as BeneficiaryControl } from '../../components/beneficiaries/SelectControls'
import { Controlled as TransferControl } from '../../components/transfers/SelectControls'

import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)

export const ErrorMessage = (props) => {
	const { message, icon = "alert-circle-outline", errorStyles = null } = props
	return (
		<FormControl.ErrorMessage leftIcon={<NBIonicon alignSelf={"flex-start"} mt={"0.5"} name={icon} />} _text={errorStyles}>{ message }</FormControl.ErrorMessage>
	)
}

export const ErrorMessageBlock = (props) => {
	const { message, icon = "alert-circle-outline", errorStyles = null } = props
	return (
		<FormControl isInvalid={true}>
			<ErrorMessage message={message} icon={icon} errorStyles={errorStyles} />
		</FormControl>
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
	let { name, control, rules = {}, errors, label = "", placeholder = "", required,
		inputAttributes = null,
		labelStyles = null,
		blockStyles = null,
		errorStyles = null,
		addonLeft = null,
		addonRight = null } = props
	const { field, fieldState: { isTouched, isDirty }, formState: { touchedFields, dirtyFields }} = useController({ name, control, rules: rules })
	
	let labelRow, inputRow

	const inputField = (
		<Input
			placeholder={ placeholder }
			onChangeText={field.onChange}
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
		labelRow = <FormControl.Label _text={{ ...labelStyles, color: errors ? "danger.600" : "black" }}>{ label }</FormControl.Label>
	}

	return (
		<FormControl px={"4"} isRequired={ required ? true : false } isInvalid={ errors ? true : false}  {...blockStyles}>
			{ labelRow || null }
			{ inputRow }
			{ errors && <ErrorMessage message={ errors.message } errorStyles={errorStyles} />}
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

export const SelectInput = (props) => {
	const { name, control, component, rules = {}, errors, label, placeholder, required, context, labelStyles = null, blockStyles = null, errorStyles = null } = props
	const { field, fieldState: { isTouched, isDirty }, formState: { touchedFields, dirtyFields } } = useController({ name, control, rules: rules })
	const contextProps = {
		component: component,
		placeholder:  placeholder,
		onValueChange:  field.onChange,
		onBlur:  field.onBlur,
		value:  field.value,
		name:  field.name
	}
	let selectElement = null
	switch(context) {
	 	case 'Beneficiaries': selectElement = <BeneficiaryControl {...contextProps} />; break;
		case 'Transfers': selectElement = <TransferControl {...contextProps} />; break;
	}

	return (
		<FormControl px={"4"} isRequired={ required ? true : false} isInvalid={ errors ? true : false} {...blockStyles}>
			<HStack>
				<FormControl.Label _text={{ ...labelStyles, color: errors ? "danger.600" : "black" }}>{ label }</FormControl.Label>
			</HStack>
			{ selectElement }
			{ errors && <ErrorMessage message={ errors.message } errorStyles={errorStyles} /> }
		</FormControl>
	)
}

export const CheckInput = (props) => {
	const { name, control, rules, required = false, errors, label, labelStyles = null, blockStyles = null, 
		errorStyles = null, innerStyles = null, labelStylesOuter = null, isDisabled = false, disabledStyles = null } = props
	const { field, fieldState: { isTouched, isDirty }, formState: { touchedFields, dirtyFields }} = useController({ name, control, rules: rules })
	return (
		<FormControl px={"4"} isRequired={ required ? true : false} isInvalid={ errors ? true : false} {...blockStyles}>
			<HStack {...innerStyles}>
				<Checkbox
					name={ field.name }
					accessibilityLabel={ label }
					onChange={ field.onChange }
					isChecked={ field.value }
					value={ field.value }
					isDisabled={isDisabled}
					disabled={disabledStyles}
				/>
				<FormControl.Label _text={{ ...labelStyles, color: errors ? "danger.600": "black" }}>{ label }</FormControl.Label>	
			</HStack>
			{ errors && <ErrorMessage message={ errors.message } errorStyles={errorStyles} />}
		</FormControl>
	)
}