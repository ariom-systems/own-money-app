import React from 'react'
import { Box, Factory, FormControl, Heading, HStack, Input } from 'native-base'
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
	const { name, control, rules = {}, errors, label, placeholder, required } = props
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
		<FormControl px={"4"} isRequired={ required ? true : false } isInvalid={ errors ? true : false}>
			<HStack>
				<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ label }</FormControl.Label>
			</HStack>
			<Input
				placeholder={ placeholder }
				onChangeText={ field.onChange }
				onBlur={ field.onBlur }
				value={ field.value }
				name={ field.name }
				fontSize={"lg"}
				autoCorrect={false}
				autoCapitalize={'none'} />
			{ errors && (
				<ErrorMessage message={ errors.message } />
			)}
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