import React, { useEffect, useReducer } from "react"

//components
import {  HStack, Pressable, Spacer, Text } from 'native-base'
import { PressableStyles } from '../../config'
import Icon from './Icon'

//data
import { useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'
import { traverseObjectByPath } from '../../data/Actions'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const Toolbar = (props) => {
	let { nb, config = [], id, children } = props

	const toolbarContents = config.map((element, index) => {
		if(element.type == 'item') {
			return <ToolbarItem key={index} {...element} />
		} else {
			return <ToolbarSpacer key={index} />
		}
	})

	if(children) {
		toolbarContents.push(children)
	}

	if(toolbarContents.length == 1) {
		toolbarContents.unshift(<ToolbarSpacer key={Math.random() * 1000} />)
		toolbarContents.push(<ToolbarSpacer key = {Math.random() * 1000} />)
	}
	
	return (
		<HStack key={id+'_'+Math.random()} {...nb} w={"100%"} justifyContent={"center"} alignItems={"center"} bgColor={"primary.700:alpha.90"} p={"4"} rounded={"8"} space={"2"}>
			{toolbarContents}
		</HStack>
	)
}

export default Toolbar

export const ToolbarItem = (props) => {
	const user = useRecoilValue(userState)
	const [ignored, forceUpdate] = useReducer((x) => x + 1, 0)
	let { id, label = null, labelObj = null, icon = null, action, extraProps = null, iconProps = null, 
		labelProps, space = 2, iconPosition = "left", style = "primary", variant = "solid",
		flex = "1", isDisabled = false, isPressed = false } = props
	let direction = {}, spacing = {}, styleObj = {}, theme = {}
	
	if(isDisabled == true) { style = "disabled" }
	if(labelObj != null) { label = traverseObjectByPath(language, labelObj) }
	
	direction = ( iconPosition == "left" ) ? { ...PressableStyles.iconLeft } : { ...PressableStyles.iconRight }
	spacing = (icon != null && label != null) ? { ...PressableStyles.itemsSingle } : { ...PressableStyles.itemsMultiple }

	switch(style) {
		case 'primary': styleObj = { ...PressableStyles.primary }; break
		case 'disabled': styleObj = { ...PressableStyles.disabled }; break
	}

	switch(variant) {
		case 'solid': theme = { ...styleObj.solid }; break
		case 'subtle': theme = { ...styleObj.subtle }; break
		case 'outline': theme = { ...styleObj.outline }; break
	}

	useEffect(() => {
		if (language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			forceUpdate()
		}
	}, [language, user])

	return (
		<Pressable isDisabled={isDisabled} onPress={action} flex={flex}>
			{({isHovered,isFocused,isPressed}) => {
				return (
					<HStack
						style={{ transform: [{ scale: isPressed ? 0.95 : 1 }] }}
						{...PressableStyles.base}
						{...spacing}
						{...direction}
						{...theme}
						{...extraProps}
						space={space}
					>
						{icon && <Icon type={"Ionicon"} {...iconProps} name={icon} color={theme.color} fontSize={"xl"} />}
						{label && <Text borderColor={"black"} {...labelProps} color={theme.color}>{label}</Text>}
					</HStack>
				)
			}}
		</Pressable>
	)
}

export const ToolbarSpacer = () => {
	return <Spacer flex={"1"} order={"2"} />
}
