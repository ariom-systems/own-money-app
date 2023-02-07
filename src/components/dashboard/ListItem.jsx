import React, { useState, useEffect, memo } from 'react'

//components
import { Pressable } from 'native-base'
import TransactionItem from '../common/TransactionItem'
import Modal from './Modal'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { formatCurrency } from '../../data/Actions'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListItem = (props) => {
	const forceUpdate = useForceUpdate()
	const lang = useRecoilValue(langState)
	const [ modalVisible, setModalVisible ] = useState(false)
	let data = props.data
	let { count, sectionIndex, sectionItemLength } = props.data.section

	const handlePress = () => {
		setModalVisible(!modalVisible)
	}

	data.transfer_amount = formatCurrency(data.transfer_amount, "en-AU", "AUD").full + " " + language.misc.aud
	data.received_amount = formatCurrency(data.received_amount, "th-TH", "THB").full + " " + language.misc.thb

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<Pressable px={"4"} onPress={handlePress} bgColor={"white"} roundedBottom={sectionIndex == count - 1 && data.index == sectionItemLength - 1 ? "8" : "0"}>
			<TransactionItem {...data} />
			<Modal isOpen={modalVisible} onClose={setModalVisible} data={props.data} />
		</Pressable>
	)
}

export default memo(ListItem)