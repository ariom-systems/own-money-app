import React from "react"

//components
import { Factory, HStack, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)

//lang
import LocalizedStrings from 'react-native-localization'
import IdentityRowItem from './IdentityRowItem'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const DetailRowItem = (props) => {
	const { nb, data } = props
	const [index, section, sectionLength] = [data.index, data.section, data.section.data.length - 1]
	const { label, value } = data.item
	let veryLastItem = 0
	
	if (section.title == "Identity Info") {
		if (index == sectionLength) {
			veryLastItem = "4"
		}
	}

	return (
		<HStack {...nb} px={"4"} py={"2"} bgColor={"white"} w={"100%"} alignItems={"center"} justifyContent={"space-between"} borderBottomRadius={index == sectionLength ? "8" : "0"} mb={veryLastItem}>
			{section.title == "Identity Info" ? (
				<IdentityRowItem data={props} />
			) : (
				<><VStack>
					<Text fontSize={"xs"} color={"coolGray.500"}>{label}</Text>
					<Text fontSize={"lg"}>{value}</Text>
				</VStack >
				{(value == "" && label != "Nickname (Optional)") && (
					<HStack>
						<NBIonicon name="alert-circle-outline" color={"info.500"} fontSize={"lg"} pr={"1"} />
						<Text color={"info.500"} fontSize={"xs"} mt={"0.25"}>{language.profileDetails.statusUpdateDetails}</Text>
					</HStack>
				)}</>

			)}
			
		</HStack>
	)
}

export default React.memo(DetailRowItem)