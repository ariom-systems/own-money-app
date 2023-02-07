import React, { useState, useEffect } from 'react'

//components
import { Box, Button, Checkbox, FormControl, Heading, HStack, Input, InputGroup, InputLeftAddon, InputRightAddon, Text } from 'native-base'
import { Controlled } from './SelectControls'
import DatePicker from 'react-native-date-picker'
import Icon from './Icon'

//data
import { useController } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { Sizes } from '../../config'
import { traverseObjectByPath } from '../../data/Actions'
import { langState } from '../../data/recoil/system'


//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

export const ErrorMessage = (props) => {
	const forceUpdate = useForceUpdate()
	const lang = useRecoilValue(langState)
	const { message, icon = "alert-circle-outline", errorStyles = null } = props
	let label = traverseObjectByPath(language, message)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<FormControl.ErrorMessage leftIcon={<Icon type={"Ionicon"} alignSelf={"flex-start"} mt={"0.5"} name={icon} />} _text={errorStyles}>{ label }</FormControl.ErrorMessage>
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

export const Label = ({ text, errors, styles }) => {
	return <FormControl.Label _text={{ ...styles, color: errors ? "danger.600" : "black" }}>{text}</FormControl.Label>
}

export const HelperText = ({ text }) => {
	return (
		<FormControl.HelperText>{text}</FormControl.HelperText>
	)
}

export const HeaderItem = ({nb, children}) => {
	return (
		<Box {...nb} px={"2"} py={"4"} backgroundColor={"primary.200"}>
			<Heading size={"sm"}>{ children }</Heading>
		</Box>
	)
}

export const TextInput = (props) => {
	const { name, control, rules = {}, errors, label = "", helperText = null, placeholder = "", isRequired, type = "default",
		isReadOnly = false, inputAttributes = null, labelStyles = null, blockStyles = null, errorStyles = null, 
		addonLeft = null, addonRight = null } = props
	const { field, fieldState: { isTouched, isDirty }, formState: { touchedFields, dirtyFields }} = useController({ name, control, rules: rules })
	
	const inputField = (
		<Input
			placeholder={ placeholder }
			onChangeText={field.onChange}
			onBlur={ field.onBlur }
			value={ field.value }
			name={ field.name }
			fontSize={Sizes.inputs}
			width={"100%"}
			autoCorrect={false}
			autoCapitalize={'none'}
			keyboardType={type}
			isReadOnly={isReadOnly}
			{...inputAttributes}
		/>
	)

	let inputRow = inputField

	if (addonLeft != null || addonRight != null) {
		inputRow = (
			<InputGroup>
				{ addonLeft || null }
				{ inputField }
				{ addonRight || null }
			</InputGroup>
		)
	}

	return (
		<FormControl isRequired={ isRequired ? true : false } isInvalid={ errors ? true : false}  {...blockStyles}>
			{ label && <Label text={label} errors={errors} styles={labelStyles} /> }
			{ inputRow }
			{ helperText && <HelperText text={helperText} /> }
			{ errors && <ErrorMessage message={ errors.message } errorStyles={errorStyles} />}
		</FormControl>
	)
}

export const TextInputLeft = (props) => {
	const { value, hasErrors, icon = null, styles = null } = props
	return (
		<InputLeftAddon _light={hasErrors && { borderColor: "danger.600" }} w={"15%"} {...styles} children={
			<HStack>
				{icon}
				<Text fontSize={Sizes.text} color={hasErrors ? "danger.600" : "black"}>{ value }</Text>
			</HStack>
		} />
	)
}

export const TextInputRight = (props) => {
	const { value, hasErrors, icon = "", styles = null} = props
	let iconComp = icon
	return (
		<InputRightAddon _light={hasErrors && { borderColor: "danger.600" }} w={"25%"} {...styles} children={
			<HStack pl={"2"}>
				{ iconComp }
				<Text fontSize={Sizes.text} color={hasErrors ? "danger.600" : "black"} mx={Sizes.marginSmall}>{ value }</Text>
			</HStack>
		} />
	)
}

export const SelectInput = (props) => {
	const { name, control, component, rules = {}, errors, label, helperText = null, placeholder, isRequired = false, isDisabled = false,
		labelStyles = null, blockStyles = null, errorStyles = null, disabledStyles = null } = props
	const { field, fieldState: { isTouched, isDirty }, formState: { touchedFields, dirtyFields } } = useController({ name, control, rules: rules })
	const contextProps = {
		component: component,
		placeholder:  placeholder,
		onValueChange:  field.onChange,
		onBlur:  field.onBlur,
		value:  field.value,
		name:  field.name,
		isDisabled: isDisabled
	}

	return (
		<FormControl isRequired={ isRequired ? true : false} isInvalid={ errors ? true : false} {...blockStyles}>
			{ label && <Label text={label} errors={errors} styles={labelStyles} /> }
			<Controlled {...contextProps} />
			{ helperText && <HelperText text={helperText} /> }
			{ errors && <ErrorMessage message={ errors.message } errorStyles={errorStyles} /> }
		</FormControl>
	)
}

export const CheckInput = (props) => {
	const { name, control, rules, errors, label, helperText = null, defaultChecked = false, isRequired = false, isDisabled = false, 
			labelStyles = null, blockStyles = null, errorStyles = null, innerStyles = null, labelStylesOuter = null, disabledStyles = null } = props
	const { field, fieldState, formState} = useController({ name, control, rules: rules })

	return (
		<FormControl isRequired={ isRequired ? true : false} isInvalid={ errors ? true : false} {...blockStyles}>
			<HStack {...innerStyles}>
				<Checkbox
					name={ field.name }
					accessibilityLabel={ label ?? field.name + " checkbox" }
					onChange={ field.onChange }
					isChecked={ field.value }
					value={ field.value }
					isDisabled={isDisabled}
					disabled={disabledStyles}
				/>
				{ label && <Label text={label} errors={errors} styles={labelStyles} /> }
			</HStack>
			{ helperText && <HelperText text={helperText} /> }
			{ errors && <ErrorMessage message={ errors.message } errorStyles={errorStyles} />}
		</FormControl>
	)
}

export const DatePickerInput = (props) => {
	const { name, control, rules, range = null, errors, label, title, helperText = null, isRequired = false, isDisabled = false,
		labelStyles = null, blockStyles = null, errorStyles = null } = props
	const { field, fieldState: { isTouched, isDirty }, formState: { touchedFields, dirtyFields }} = useController({name, control, rules: rules })
	
	const [open, setOpen] = useState(false)
	const [date, setDate] = useState(new Date())
	const [visualDate, setVisualDate] = useState({
		day: '',
		month: '',
		year: ''
	})
	
	let rangeOptions = {}

	if (range != null) {
		if(typeof range == 'string') {
			switch(range) {
				case 'future': rangeOptions = { minimumDate: new Date(Date.now()) }; break;
				case 'past': rangeOptions = { maximumDate: new Date(Date.now()) }; break;
			}
		} //TODO: make something to handle objects
	}

	useEffect(() => {
		const dateFromRHF = new Date(field.value)
		const dateVisual = formatTheDate(field.value, 'visual')
		if (!isNaN(Date.parse(dateFromRHF))) {
			setDate(dateFromRHF)
			splitDate(dateVisual)
		}
	}, [field.value])

	const handleChange = (newDate) => {
		const visual = formatTheDate(newDate, 'visual')
		const dbstring = formatTheDate(newDate, 'database')
		splitDate(visual)
		field.onChange(dbstring)
	}

	function splitDate(theDate) {
		
		let newDate = theDate.split(' ')
		setVisualDate({
			day: newDate[0],
			month: newDate[1],
			year: newDate[2]
		})
	}

	function formatTheDate(theDate, type) {
		if (type == 'visual') {
			let date = new Date(theDate).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })
			return date
		} else {
			//couldnt find a good way to do this. en-AU year numeric is bugged when using the below options
			let tmp = new Date(theDate).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
			//and americans are weird. how on earth is YYYY/DD/MM a good format? seriously?
			let tmpArray = tmp.split('/')
			tmpArray = tmpArray.reverse()
			tmpArray.push(tmpArray.splice(1, 1)[0])
			return tmpArray.join('-')
		}
	}

	return (
		<FormControl isRequired={isRequired ? true : false} isInvalid={errors ? true : false} {...blockStyles}>
			{ label && <Label text={label} errors={errors} styles={labelStyles} /> }
			<InputGroup w={"100%"}>
				<Input value={visualDate.day} textAlign={"center"} borderRightWidth={"0"} isReadOnly fontSize={"sm"} flexGrow={"2"} />
				<Input value={visualDate.month} textAlign={"center"} borderRightWidth={"0"} isReadOnly fontSize={"sm"} flexGrow={"3"} />
				<Input value={visualDate.year} textAlign={"center"} borderRightWidth={"0"} isReadOnly fontSize={"sm"} flexGrow={"2"} />
				<Button flexGrow={"1"} onPress={() => { setOpen(true) }} isDisabled={isDisabled}>
					<Icon type={"Ionicon"} name={"calendar-sharp"} color={"white"} fontSize={"2xl"} />
				</Button>
			</InputGroup>
			<DatePicker
				modal
				title={title}
				mode={"date"}
				{...rangeOptions}
				open={open}
				date={date}
				locale={'en-AU'}
				onConfirm={(newDate) => {
					setOpen(false)
					setDate(newDate)
					handleChange(newDate)
				}}
				onCancel={() => {
					setOpen(false)
				}}
			/>
			{ helperText && <HelperText text={helperText} /> }
			{ errors && <ErrorMessage message={errors.message} errorStyles={errorStyles} /> }
		</FormControl>
	)
}

