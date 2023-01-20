import React, { useContext, useEffect, useReducer, memo } from 'react'

//components
import { Box } from 'native-base'
import StepIndicator from 'react-native-step-indicator'

//data
import { AuthContext } from '../../data/Context'
import { useRecoilValue } from 'recoil'
import { stepAtom } from '../../data/recoil/transfer'
import { userState } from '../../data/recoil/user'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferStepIndicator = (props) => {
	const { auth } = useContext(AuthContext)
	const user = useRecoilValue(userState)
	const step = useRecoilValue(stepAtom)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	let labels = [
		language.transferProgress.labelAmount,
		language.transferProgress.labelBeneficiary,
		language.transferProgress.labelReview,
		language.transferProgress.labelFinish
	]

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			forceUpdate()
		}
	}, [language, user])

	return (
		<Box mt={"5%"} mx={"2.5%"} py={"4"} backgroundColor={"white"}>
			<StepIndicator stepCount={4} currentPosition={step} labels={labels} />
		</Box>
	)
}

export default memo(TransferStepIndicator)
