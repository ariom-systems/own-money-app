import React, { useEffect, memo } from 'react'

//components
import { Box, useMediaQuery } from 'native-base'
import StepIndicator from 'react-native-step-indicator'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { paymentStepAtom } from '../../data/recoil/transfer'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
import { Sizes } from '../../config'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const PaymentStepIndicator = (props) => {
	const forceUpdate = useForceUpdate()
	const paymentStep = useRecoilValue(paymentStepAtom)
	const lang = useRecoilValue(langState)
	const [xs, base] = useMediaQuery([{
		maxWidth: 380
	}, {
		minWidth: 381
	}])

	let labels = [
		language.paymentProgress.labels.select,
		language.paymentProgress.labels.prompt,
		language.paymentProgress.labels.complete,
	]

	let customStyles = {}
	switch (true) {
		case xs: customStyles = { labelSize: 9, stepIndicatorLabelFontSize: 9 }; break
		case base: customStyles = { labelSize: 12, stepIndicatorLabelFontSize: 12 }; break
		default: customStyles = { labelSize: 12, stepIndicatorLabelFontSize: 12 }; break
	}

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang, labels])

	return (
		<Box mt={Sizes.spacingSmall} py={Sizes.spacing} backgroundColor={"white"}>
			<StepIndicator stepCount={3} currentPosition={paymentStep} customStyles={customStyles} labels={labels} />
		</Box>
	)
}

export default memo(PaymentStepIndicator)
