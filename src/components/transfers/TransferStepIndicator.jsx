import React, { useEffect, memo } from 'react'

//components
import { Box } from 'native-base'
import StepIndicator from 'react-native-step-indicator'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { stepAtom } from '../../data/recoil/transfer'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepIndicator = (props) => {
	const forceUpdate = useForceUpdate()
	const step = useRecoilValue(stepAtom)
	const lang = useRecoilValue(langState)

	let labels = [
		language.transferProgress.labels.amount,
		language.transferProgress.labels.beneficiary,
		language.transferProgress.labels.review,
		language.transferProgress.labels.finish
	]

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang, labels])

	return (
		<Box mt={"5%"} mx={"2.5%"} py={"4"} backgroundColor={"white"}>
			<StepIndicator stepCount={4} currentPosition={step} labels={labels} />
		</Box>
	)
}

export default memo(TransferStepIndicator)
