import React from 'react'

//components
import { Box, Divider, Hidden, Text, VStack } from 'native-base'

//data
import { AuthContext } from '../../data/Context'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const DetailRowItem = (props) => {
	const { auth } = React.useContext(AuthContext)
	const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0)
	const { nb, data } = props
	const index = data.index
	const section = data.section
	const sectionLength = data.section.data.length - 1
	const { label, value } = data.item
	let veryLastItem

	if (section.title == "Address Details") {
		if (index == sectionLength) {
			veryLastItem = true
		}
	}

	React.useEffect(() => {
		if (language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	return (
		<Box {...nb} roundedBottom={index == sectionLength ? "8" : "0"} mb={veryLastItem ? "4" : "0"}>
			<VStack px={"4"} py={"2"} roundedBottom={ index == sectionLength ? "8" : "0"}>
				<Text fontSize={"xs"} color={"coolGray.500"}>{label}</Text>
				<Text fontSize={"lg"} color={ value != null ? "black" : "coolGray.300" }>{value || language.misc.none }</Text>
			</VStack>
			{index != sectionLength && <Divider /> }		
		</Box>
	)
}

export default React.memo(DetailRowItem)