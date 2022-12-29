import React from 'react'
import { Button, HStack } from 'native-base'

import { AuthContext } from '../../data/Context'
import { useRecoilState } from 'recoil'
import { transactionList } from '../../data/recoil/transactions'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const LoadMoreButton = (props) => {
	const { auth } = React.useContext(AuthContext)
	const [ transactions, setTransactions ] = useRecoilState(transactionList)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const handleRefresh = (batchIndex, uid) => {
		console.log("loading")
	}

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	return (
		<HStack justifyContent={"center"} py={"8"} alignItems={"center"}>
			{ loading.status == true && <Spinner size={"lg"} /> }
			<Button onPress={handleRefresh(transactions, auth.uid)}>
				{ loading.status == true ? language.transactionsList.labelLoading : language.transactionsList.labelLoadMore }
			</Button>
		</HStack>
	)
}

export default LoadMoreButton
