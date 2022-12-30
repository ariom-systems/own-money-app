import React from "react"

//components
import { Button, Factory, HStack, Spacer, Text } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)

const Toolbar = (props) => {
	let { nb, children } = props
	return (
		<HStack key={Math.random()} {...nb} w={"100%"} justifyContent={"center"} alignItems={"center"} bgColor={"primary.700:alpha.90"} p={"4"} rounded={"8"} space={"2"}>
			{children}
		</HStack>
	)
}

export default Toolbar

export const ToolbarItem = (props) => {
	const { label, icon = null, action, buttonProps, iconProps, labelProps, space = 2, iconPosition = "left" } = props
	return (
		<Button {...buttonProps} onPress={action}>
			<HStack alignItems={"center"} space={space} flexDirection={ iconPosition == "left" ? "row" : "row-reverse" }>
				{icon && <NBIonicon name={icon} color={"white"} {...iconProps} fontSize={"2xl"} /> }
				{label && <Text {...labelProps} color={"white"}>{label}</Text> }
			</HStack>
		</Button>
	)
}

export const ToolbarSpacer = () => {
	return <Spacer />
}
