import React, { memo } from "react"

//components
import { StyleSheet, Platform } from 'react-native'
import { Box, Heading, Text } from 'native-base'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const YourPointSummary = () => {

	let styles = StyleSheet.create({})

	const generateBoxShadow = (xOffset, yOffset, shadowColorIos, shadowOpacity, shadowRadius, elevation, shadowColorAndroid) => {
		if (Platform.OS === 'ios') {
			styles.boxShadow = {
				shadowColor: shadowColorIos,
				shadowOffset: { width: xOffset, height: yOffset },
				shadowOpacity,
				shadowRadius
			}
		} else if (Platform.OS === 'android') {
			styles.boxShadow = {
				elevation,
				shadowColor: shadowColorAndroid
			}
		}
	}

	generateBoxShadow(-2, 4, '#2b2b2b', 0.2, 3, 4, '#2b2b2b')

	return (
		<Box backgroundColor={"primary.200"} borderRadius={"8"} p={"4"}>
			<Heading fontSize={"lg"}>{language.dashboard.yourPointsTitle}</Heading>
			<Box pt={"4"} pb={"8"}>
				<Text textAlign={"center"} fontSize={"3xl"} bold
					style={[styles.boxShadow, { transform: [{ rotate: "-8deg" }], backgroundColor: "#FFFFFF" }]}>{language.dashboard.yourPointsPlaceholder}</Text>
			</Box>
		</Box>
	)
}

export default memo(YourPointSummary)
