import React from 'react'
import { Button, HStack, Spinner, Text } from 'native-base'
import { AuthContext } from '../../data/Context'

import * as Recoil from 'recoil'
import { loadingState } from '../../data/recoil/system'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export default function ListFooterItem() {
	const { auth } = React.useContext(AuthContext)
	const loading = Recoil.useRecoilValue(loadingState)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	return (
		<HStack justifyContent={"center"} py={"8"} alignItems={"center"}>
			{ loading.status == true && <Spinner size={"lg"} /> }
			<Button>
				{ loading.status == true ? language.transactionsList.labelLoading : language.transactionsList.labelLoadMore }
			</Button>
		</HStack>
	)
}


