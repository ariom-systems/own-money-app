import React, { memo } from "react"

//components
import { HStack, Text, VStack } from 'native-base'
import LabelValue from '../common/LabelValue'
import AlertLabel from '../common/AlertLabel'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const DetailRowItem = (props) => {
	const { index, item, section } = props
	const sectionLength = section.data.length - 1
	const { label, value } = item

	let styles = {}, altContent

	if (value == "" && label != "Nickname (Optional)") {
		altContent = (<AlertLabel icon={"alert-circle-outline"} label={language.profileDetails.ui.statusUpdateDetails} color={"info.500"} />)
	}

	if (index == sectionLength) { styles = { borderBottomRadius: "8" } }

	return (
		<LabelValue label={label} value={value} altContent={altContent} styles={styles} />
	)
}

export default memo(DetailRowItem)