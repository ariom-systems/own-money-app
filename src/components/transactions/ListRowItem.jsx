import React, { useContext, useEffect, useReducer, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Avatar, Badge, HStack, Pressable, Spacer, Text, VStack } from 'native-base'
import TransactionItem from '../common/TransactionItem'

//data
import { formatCurrency, localiseObjectData } from '../../data/Actions'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { transactionObj } from '../../data/recoil/transactions'
import { loadingState } from '../../data/recoil/system'
import { TransactionObjFormats } from '../../config'
import { userState } from '../../data/recoil/user'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListRowItem = (props) => {
	const navigation = useNavigation()
	const user = useRecoilValue(userState)
	const [ignored, forceUpdate] = useReducer((x) => x + 1, 0)
	const setTransaction = useSetRecoilState(transactionObj)
	const setLoading = useSetRecoilState(loadingState)
	let data = props.data.item
	let index = props.data.index
	let listLength = props.data.section.data.length - 1 //now THATS a mouthfull

	data.transfer_amount = formatCurrency(data.transfer_amount, "en-AU", "AUD").full + " " + language.transactionsList.currencyCodeAUD
	data.received_amount = formatCurrency(data.received_amount, "th-TH", "THB").full + " " + language.transactionsList.currencyCodeTHB

	const handlePress = (item) => {
		setTransaction(item)
		localiseObjectData(item, TransactionObjFormats, user.lang)
		setLoading({ status: true, text: 'Loading' })
		navigation.navigate('TransactionsDetail')
	}

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			forceUpdate()
		}
	}, [language, user])

	return (
		<Pressable bgColor={"white"} px={"4"} onPress={() => handlePress(props.data.item) } borderBottomRadius={ index == listLength ? "8" : "0"}>
			<TransactionItem {...data} />
		</Pressable>
	)
}

export default memo(ListRowItem)


