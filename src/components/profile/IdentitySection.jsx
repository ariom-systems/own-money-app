import React, { useEffect } from "react"

//components
import { Divider, Factory, Flex, HStack, Text, VStack } from 'native-base'
import { Image } from 'react-native'
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
	let [ img_name, created_date, idtype, idnumber, idexpiry, idissuer ] = identitySection
	let none = language.misc.none

	if (img_name.value == '' || created_date.value == '' || idtype.value == '' || idnumber.value == '' || idexpiry.value == '' || idissuer.value == '' ) {	
		let styles = { pt: "1", justifyContent: "center" }, iconStyles = { fontSize: "2xl"}, labelStyles = { fontSize: "lg" }
		let label = language.profileDetails.ui.statusVerifyIdentity, icon = "alert-circle-outline"
		identityStatus = <AlertLabel icon={icon} label={label} color={"error.600"} styles={styles} iconStyles={iconStyles} labelStyles={labelStyles} />
	}

	useEffect(() => {
		if (img_name.value != '') {

		}
	}, [identitySection])

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
						<Text fontSize={"xs"} color={"coolGray.500"}>{ idtype.label  }</Text>
						<Text fontSize={"md"} color={idtype.value != "" ? "black" : "coolGray.300"}>{idtype.value || none}</Text>
					</VStack>
					<Divider />
					<VStack w={"50%"}>
						<Text fontSize={"xs"} color={"coolGray.500"}>{idnumber.label}</Text>
						<Text fontSize={"md"} color={idnumber.value != "" ? "black" : "coolGray.300"}>{idnumber.value || none}</Text>
					</VStack>
					<Divider />
				</VStack>
				{ img_name.value != "" && (
					<Flex w={"50%"} h={"100%"} flexDirection={"column"} backgroundColor={"primary.100:alpha.50"}>
						<Image
							source={{ uri: 'https://ownservices.com.au/Cus_ID_api_test/' + img_name.value }}
							style={{ width: "100%", height: 150, resizeMode: 'contain' }}
							alt="scanned image" objectFit={"contain"}
						/>
					</Flex>
				) || (
					<Flex borderStyle={"dashed"} borderWidth={"1"} w={"50%"} h={"100%"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
						<Icon type={"Material"} name={"image-not-supported"} fontSize={"6xl"} color={"coolGray.300"} />
					</Flex>
				)}
			</HStack>



			<HStack justifyContent={"space-between"}>
				<VStack>
					<Text fontSize={"xs"} color={"coolGray.500"}>{idexpiry.label}</Text>
					<Text fontSize={"md"} color={idexpiry.value != "" ? "black" : "coolGray.300"}>{idexpiry.value || none}</Text>
				</VStack>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{idissuer.label}</Text>
					<Text fontSize={"md"} color={idissuer.value != "" ? "black" : "coolGray.300"}>{idissuer.value || none}</Text>
				</VStack>
			</HStack>


			<Divider />
			<HStack justifyContent={"space-between"}>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{created_date.label}</Text>
					<Text fontSize={"md"} color={created_date.value != "" ? "black" : "coolGray.300"}>{created_date.value || none}</Text>
				</VStack>
			</HStack>
		</VStack>
	)
}

export default IdentitySection
