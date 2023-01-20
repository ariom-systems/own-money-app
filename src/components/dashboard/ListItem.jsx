import React, { useState, useEffect, useReducer, memo } from 'react'

//components
import { Pressable } from 'native-base'
import TransactionItem from '../common/TransactionItem'
import Modal from './Modal'

//data
import { formatCurrency } from '../../data/Actions'
import { AuthContext } from '../../data/Context'
import { useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListItem = (props) => {
	const user = useRecoilValue(userState)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)
	const [ modalVisible, setModalVisible ] = useState(false)
	let data = props.data
	let { count, sectionIndex, sectionItemLength } = props.data.section

	const handlePress = () => {
		setModalVisible(!modalVisible)
	}

	data.transfer_amount = formatCurrency(data.transfer_amount, "en-AU", "AUD").full + " " + language.transactionsList.currencyCodeAUD
	data.received_amount = formatCurrency(data.received_amount, "th-TH", "THB").full + " " + language.transactionsList.currencyCodeTHB

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			forceUpdate()
		}
	}, [language, user])

	return (
		<Pressable px={"4"} onPress={handlePress} bgColor={"white"} roundedBottom={sectionIndex == count - 1 && data.index == sectionItemLength - 1 ? "8" : "0"}>
			<TransactionItem {...data} />
			<Modal isOpen={modalVisible} onClose={setModalVisible} data={props.data} />
		</Pressable>
	)
}

export default memo(ListItem)