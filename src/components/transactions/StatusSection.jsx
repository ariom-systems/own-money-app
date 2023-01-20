import React, { memo } from 'react'

//components
import { Box, HStack, Text, VStack } from 'native-base'
import { CheckCircleIcon, WarningIcon, WarningOutlineIcon } from 'native-base'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const StatusSection = ({section}) => {
	let { key, label, value }  = section[0]
	let headerBgColour, colour, bgColour, icon, statusText

	switch (value) {
		case 'Completed':
			headerBgColour = "success.600"
			bgColour = "success.200"
			colour = "success.600"
			icon = <CheckCircleIcon size={"3xl"} color={"success.600"} />
			statusText = language.components.statusBadgeCompleted
		break
		case 'Cancelled':
			headerBgColour = "error.600"
			bgColour = "error.200"
			colour = "error.700"
			icon = <WarningIcon size={"3xl"} color={"error.700"} />
			statusText = language.components.statusBadgeCancelled
		break
		case 'Wait for payment':
			headerBgColour = "primary.600"
			bgColour = "primary.200"
			colour = "primary.700"
			icon = <WarningOutlineIcon size={"3xl"} color={"primary.700"} />
			statusText = language.components.statusBadgeWaitForPayment
		break
	}
	
	return (
		<VStack rounded={"8"} bgColor={bgColour} position={"relative"}>
			<Box roundedTop={"8"} bgColor={headerBgColour} p={"2"}>
				<Text color={"white"} fontWeight={"bold"}>Status</Text>
			</Box>
			<HStack alignItems={"center"} p={"4"} justifyContent={"center"}>
				{icon}
				<Text ml={"4"} fontSize={"xl"} color={colour} mr={"4"}>{statusText}</Text>
			</HStack>
		</VStack>
	)
}

export default memo(StatusSection)
