import React, { useEffect } from "react"

//components
import { HStack, Text, VStack } from 'native-base'
import LabelValue from '../common/LabelValue'
import AlertLabel from '../common/AlertLabel'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { traverseObjectByPath } from '../../data/Actions'
import { Sizes } from '../../config'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const DetailRowItem = (props) => {
	const lang = useRecoilValue(langState)
	const forceUpdate = useForceUpdate()
	let { index, item, section } = props
	let sectionLength = section.data.length - 1
	let { label, value } = item
	let styles = {}, altContent

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	if (index == sectionLength) { styles = { borderBottomRadius: "8" } }

	if (item.hasOwnProperty('readOnly') || item.hasOwnProperty('optional')) {
		altContent = null
	} else {
		altContent = (<AlertLabel icon={"alert-circle-outline"} label={language.profileDetails.ui.statusUpdateDetails} color={"info.500"} />)
	}
	
	if(item.hasOwnProperty('options')) {
		//options are present. value might be a boolean
		if(value === "true") {
			value = traverseObjectByPath(language, item.options[0])
		} else {
			value = traverseObjectByPath(language, item.options[1])
		}
	}

	return (
		<LabelValue label={label} value={value} altContent={altContent} styles={styles} />
	)
}

export default DetailRowItem