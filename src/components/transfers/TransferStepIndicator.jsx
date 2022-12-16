import React from 'react'
import { Box } from 'native-base'
import StepIndicator from 'react-native-step-indicator'

import { AuthContext } from '../../data/Context'
import { useRecoilValue } from 'recoil'
import { stepAtom } from '../../data/recoil/transfer'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepIndicator = (props) => {
	const { auth } = React.useContext(AuthContext)
	const step = useRecoilValue(stepAtom)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	let labels = [
		language.transferProgress.labelAmount,
		language.transferProgress.labelBeneficiary,
		language.transferProgress.labelReview,
		language.transferProgress.labelFinish
	]

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	return (
		<Box mt={"5%"} mx={"2.5%"} py={"4"} backgroundColor={"white"}>
			<StepIndicator stepCount={4} currentPosition={step} labels={labels} />
		</Box>
	)
}

export default TransferStepIndicator
