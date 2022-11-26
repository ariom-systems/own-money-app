import React from 'react'
import { FormControl, HStack, Input } from 'native-base'
import { ErrorMessage } from '../common/Forms'
import { useController, useForm } from 'react-hook-form'

const EditFormTextInput = (props) => {
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

export default EditFormTextInput
