import React, { useEffect } from 'react'

//components
import { Flex } from 'native-base'
import LoadingSpinner from './LoadingSpinner'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { traverseObjectByPath } from '../../data/Actions'
import { loadingState, langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

export default function LoadingOverlay() {
	const lang = useRecoilValue(langState)
	const loading = useRecoilValue(loadingState)
	const forceUpdate = useForceUpdate()
	let messageLabel = "something?"

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	switch(loading.type) {
		case 'processing':
		case 'saving':
		case 'loading':
		case 'deleting':
			messageLabel = traverseObjectByPath(language, 'loadingOverlay.' + loading.type)
		break;
	}

	return (
		<Flex
			backgroundColor={"primary.300:alpha.75"}
			bottom={"0"}
			h={"100%"}
			left={"0"}
			position={"absolute"}
			paddingX={"10%"}
			right={"0"}
			top={"0"}
			w={"100%"}
			zIndex={"1"}
			justifyContent={"center"}>
			<LoadingSpinner message={messageLabel} subtitle={language.loadingOverlay.subtitle} />
		</Flex>
	)
}