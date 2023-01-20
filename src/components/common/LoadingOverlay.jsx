import React, { useEffect, useReducer } from 'react'

//components
import { Flex } from 'native-base'
import LoadingSpinner from './LoadingSpinner'

//data
import { useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'
import { loadingState } from '../../data/recoil/system'
import { traverseObjectByPath } from '../../data/Actions'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

export default function LoadingOverlay() {
	const user = useRecoilValue(userState)
	const loading = useRecoilValue(loadingState)
	const [ignored, forceUpdate] = useReducer((x) => x + 1, 0)
	let messageLabel = "something?"

	useEffect(() => {
		if (language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, user])

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