import React from 'react'
import { FormControl, HStack } from 'native-base'
import * as SelectControl from '../../components/beneficiaries/SelectControls'
import { ErrorMessage } from '../common/Forms'
import { useController, useForm } from 'react-hook-form'

const EditFormSelectInput = (props) => {
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

export default EditFormSelectInput
