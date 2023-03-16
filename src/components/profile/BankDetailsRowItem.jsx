import React, { useEffect } from "react"

//components
import { Box, HStack, Text } from 'native-base'
import LabelValue from '../common/LabelValue'
import DetailRowItem from './DetailRowItem'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { Sizes } from '../../config'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const BankDetailsRowItem = (props) => {
	const lang = useRecoilValue(langState)
	const forceUpdate = useForceUpdate()
	let { index, item, section } = props
	let sectionLength = section.data.length - 1
	let styles = {}, altContent
	let { label, value } = item

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	if(index != 0) {
		if (item.key == 'payid') {
			return (
				<HStack flexWrap={"wrap"} width={"100%"} justifyContent={'space-between'} alignItems={"center"} bgColor={"white"} px={Sizes.padding} pt={Sizes.padding}>
					<Box flex={"1"} pb={"4"}><Text bold>{label}</Text></Box>
					<Box flex={"4"} pb={"4"}><Text textAlign={"right"}>{value}</Text></Box>
				</HStack>
			)
		} else {
			return <DetailRowItem item={item} index={index} section={section} />
		}
	} else {
		return (
			<>
				<HStack flexWrap={"wrap"} width={"100%"} justifyContent={'space-between'} alignItems={"center"} bgColor={"white"} px={Sizes.padding} py={Sizes.padding}>
					<Text italic textAlign={"center"}>{language.profileDetails.labels.bankdetailshelper}</Text>
				</HStack>
				<LabelValue label={label} value={value} altContent={altContent} styles={styles} />
			</>
		)
	}

}

export default BankDetailsRowItem