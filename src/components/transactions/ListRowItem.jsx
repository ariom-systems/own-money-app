import React, { useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Pressable } from 'native-base'
import TransactionItem from '../common/TransactionItem'

//data
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { formatCurrency, localiseObjectData } from '../../data/Actions'
import { TransactionObjFormats } from '../../config'
import { transactionObj } from '../../data/recoil/transactions'
import { loadingState, langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListRowItem = (props) => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const setTransaction = useSetRecoilState(transactionObj)
	const setLoading = useSetRecoilState(loadingState)
	const lang = useRecoilValue(langState)
	let data = props.data.item
	let index = props.data.index
	let listLength = props.data.section.data.length - 1 //now THATS a mouthfull

	data.transfer_amount = formatCurrency(data.transfer_amount, "en-AU", "AUD").full + " " + language.transactionsList.currencyCodeAUD
	data.received_amount = formatCurrency(data.received_amount, "th-TH", "THB").full + " " + language.transactionsList.currencyCodeTHB

	const handlePress = (item) => {
		setTransaction(item)
		localiseObjectData(item, TransactionObjFormats, lang)
		setLoading({ status: true, text: 'Loading' })
		navigation.navigate('TransactionsDetail')
	}

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<Pressable key={index} bgColor={"white"} px={"4"} onPress={() => handlePress(props.data.item) } borderBottomRadius={ index == listLength ? "8" : "0"}>
			<TransactionItem {...data} />
		</Pressable>
	)
}

export default memo(ListRowItem)


