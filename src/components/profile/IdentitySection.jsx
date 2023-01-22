import React, { useEffect } from "react"

//components
import { Divider, Factory, Flex, HStack, Text, VStack } from 'native-base'
import Icon from '../common/Icon'
import AlertLabel from '../common/AlertLabel'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { userState } from '../../data/recoil/user'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const IdentitySection = ({section}) => {
	const forceUpdate = useForceUpdate()
	const user = useRecoilValue(userState)
	const lang = useRecoilValue(langState)
	let identitySection = section[0].data, identityStatus
	let [ type, expiry, issuer, number, uploaded, file ] = identitySection
	let none = language.misc.none

	if (type.value == '' || expiry.value == '' || issuer.value == '' || number.value == '' || uploaded.value == '' || file.value == '' ) {	
		let styles = { pt: "1", justifyContent: "center" }, iconStyles = { fontSize: "2xl"}, labelStyles = { fontSize: "lg" }
		let label = language.profileDetails.ui.statusVerifyIdentity, icon = "alert-circle-outline"
		identityStatus = <AlertLabel icon={icon} label={label} color={"error.600"} styles={styles} iconStyles={iconStyles} labelStyles={labelStyles} />
	}

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<VStack space={"4"} px={"4"} py={"2"} bgColor={"white"} mb={"4"} roundedBottom={"8"}>
			{ identityStatus }
			<HStack justifyContent={"space-between"} space={"4"} mt={"2.5%"}>
				<VStack flex={"1"} space={"4"}>
					<VStack>
						<Text fontSize={"xs"} color={"coolGray.500"}>{ type.label  }</Text>
						<Text fontSize={"md"} color={type.value != "" ? "black" : "coolGray.300"}>{type.value || none}</Text>
					</VStack>
					<Divider />
					<VStack>
						<Text fontSize={"xs"} color={"coolGray.500"}>{expiry.label}</Text>
						<Text fontSize={"md"} color={expiry.value != "" ? "black" : "coolGray.300"}>{expiry.value || none}</Text>
					</VStack>
					<Divider />
				</VStack>
				<Flex borderStyle={"dashed"} borderWidth={"1"} w={"50%"} h={"100%"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
					<Icon type={"Material"} name={"image-not-supported"} fontSize={"6xl"} color={"coolGray.300"} />
				</Flex>
			</HStack>
			<HStack justifyContent={"space-between"}>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{number.label}</Text>
					<Text fontSize={"md"} color={number.value != "" ? "black" : "coolGray.300"}>{number.value || none}</Text>
				</VStack>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{issuer.label}</Text>
					<Text fontSize={"md"} color={issuer.value != "" ? "black" : "coolGray.300"}>{issuer.value || none}</Text>
				</VStack>
			</HStack>
			<Divider />
			<HStack justifyContent={"space-between"}>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{uploaded.label}</Text>
					<Text fontSize={"md"} color={uploaded.value != "" ? "black" : "coolGray.300"}>{uploaded.value || none}</Text>
				</VStack>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{file.label}</Text>
					<Text fontSize={"md"} color={file.value != "" ? "black" : "coolGray.300"}>{file.value || none}</Text>
				</VStack>
			</HStack>
		</VStack>
	)
}

export default IdentitySection
