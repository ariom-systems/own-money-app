import React, { useContext, useEffect, useReducer, memo } from 'react'

//components
import { Button, HStack } from 'native-base'

//data
import { AuthContext } from '../../data/Context'
import { useRecoilState, useRecoilValue } from 'recoil'
import { transactionList } from '../../data/recoil/transactions'
import { userState } from '../../data/recoil/user'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const LoadMoreButton = (props) => {
	const { auth } = useContext(AuthContext)
	const user = useRecoilValue(userState)
	const [ transactions, setTransactions ] = useRecoilState(transactionList)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	const handleRefresh = (batchIndex, uid) => {
		console.log("loading")
	}

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			forceUpdate()
		}
	}, [language, user])

	return (
		<HStack justifyContent={"center"} py={"8"} alignItems={"center"}>
			{ loading.status == true && <Spinner size={"lg"} /> }
			<Button onPress={handleRefresh(transactions, auth.uid)}>
				{ loading.status == true ? language.transactionsList.labelLoading : language.transactionsList.labelLoadMore }
			</Button>
		</HStack>
	)
}

export default memo(LoadMoreButton)
