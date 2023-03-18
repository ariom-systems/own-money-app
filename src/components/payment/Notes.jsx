import React, { useEffect, memo } from "react"

//components
import { Box, HStack, Text, VStack } from 'native-base'
import Bullet from '../common/Bullet'

//data
import { useRecoilValue } from 'recoil'
import { Sizes } from '../../config'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const Notes = (props) => {
	const { screen } = props
	
	switch(screen) {
		case 'PaymentSelect': return <NotesPaymentSelect />; break;
		case 'BankTransfer': return <NotesBankTransfer />; break;
	}
}

export default memo(Notes)

const NotesPaymentSelect = () => {
	const lang = useRecoilValue(langState)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<VStack w={"100%"} py={Sizes.padding} space={Sizes.spacing}>
			<Text textAlign={"left"} bold>{language.paymentSelectPayment.notes.heading}</Text>
			<Box>
				<Text italic>{language.paymentSelectPayment.notes.allPayment.subHeading}</Text>
				<Bullet><Text>{language.paymentSelectPayment.notes.allPayment.point1}</Text></Bullet>
			</Box>
			<Box>
				<Text italic>{language.paymentSelectPayment.notes.bankPayment.subHeading}</Text>
				<Bullet><Text>{language.paymentSelectPayment.notes.bankPayment.point1}</Text></Bullet>
				<Bullet><Text>{language.paymentSelectPayment.notes.bankPayment.point2}</Text></Bullet>
			</Box>
			<Box>
				<Text italic>{language.paymentSelectPayment.notes.poliPayment.subHeading}</Text>
				<Bullet><Text>{language.paymentSelectPayment.notes.poliPayment.point1}</Text></Bullet>
			</Box>
			<Box>
				<Text italic>{language.paymentSelectPayment.notes.payid.subHeading}</Text>
				<Bullet><Text>{language.paymentSelectPayment.notes.payid.point1}</Text></Bullet>
			</Box>
		</VStack>
	)
}

const NotesBankTransfer = () => {
	const lang = useRecoilValue(langState)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<VStack w={"100%"} py={Sizes.padding} space={Sizes.spacing}>
			<Text textAlign={"left"} bold>{language.paymentSelectPayment.notes.heading}</Text>
			<VStack space={Sizes.spacing}>
				<Bullet><Text>{language.paymentShowBankDetails.notes.notice1}</Text></Bullet>
				<Bullet><Text>{language.paymentShowBankDetails.notes.notice2}</Text></Bullet>
				<Bullet><Text>{language.paymentShowBankDetails.notes.notice3}</Text></Bullet>
			</VStack>
		</VStack>
	)
}

const NotesPoliPayment = () => {

}

const NotesPayID = () => {

}
