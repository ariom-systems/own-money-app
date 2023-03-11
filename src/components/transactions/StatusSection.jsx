import React, { memo } from 'react'

//components
import { Box , Button, HStack, Text, VStack } from 'native-base'
import { CheckCircleIcon, WarningIcon, WarningOutlineIcon } from 'native-base'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const StatusSection = ({section, raw}) => {
	console.log("StatusSection",section)
	console.log("raw?", raw)
	let { key, label, value }  = section[0]
	let headerBgColour, colour, bgColour, element, statusText
	let { buttonLabel, fn } = { buttonLabel: "Test", fn: () => alert('test') }

	switch (value) {
		case 'Completed':
			headerBgColour = "success.600"
			bgColour = "success.200"
			colour = "success.600"
			element = <CheckCircleIcon size={"3xl"} color={"success.600"} />
			statusText = language.components.statusBadgeCompleted
		break
		case 'Cancelled':
			headerBgColour = "error.600"
			bgColour = "error.200"
			colour = "error.700"
			element = <WarningIcon size={"3xl"} color={"error.700"} />
			statusText = language.components.statusBadgeCancelled
		break
		case 'Wait for payment':
			headerBgColour = "primary.600"
			bgColour = "primary.200"
			colour = "primary.700"
			element = <Button onPress={fn}>{buttonLabel}</Button>
			statusText = language.components.statusBadgeWaitForPayment
		break
	}
	
	return (
		<VStack key={key} rounded={"8"} bgColor={bgColour} position={"relative"}>
			<Box roundedTop={"8"} bgColor={headerBgColour} p={"2"}>
				<Text color={"white"} fontWeight={"bold"}>{label}</Text>
			</Box>
			<HStack alignItems={"center"} p={"4"} justifyContent={"center"}>
				{element}
				<Text ml={"4"} fontSize={"xl"} color={colour} mr={"4"}>{statusText}</Text>
			</HStack>
		</VStack>
	)
}

export default memo(StatusSection)
