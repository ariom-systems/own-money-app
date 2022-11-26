import React from 'react'

import { Badge, HStack, Modal as ModalComponent, Text } from 'native-base'
import { AuthContext } from '../../data/Context'
import { formatCurrency } from '../../data/Actions'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const Modal = (props) => {
	const { auth } = React.useContext(AuthContext)
	const { accountnumber, amount_paid, bankname, completed_date, completed_time, created_date, created_time, 
		fee_AUD, fullname, initials, rate, received_amount, status, transaction_number, transfer_amount } = props.data
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
	
	let statusBadge
	switch( status ) {
		case 'Wait for payment': statusBadge = 'default'; break
		case 'Cancelled': statusBadge = 'danger'; break
		case 'Completed': statusBadge = 'success'; break
	}

	let dateCR = new Date([created_date, created_time].join('T'))
	let dateCO = new Date([completed_date, completed_time].join('T'))
	let dateOptions = { dateStyle: 'medium', timeZone: 'Australia/Sydney', timeStyle: 'medium' }

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	return (
		<ModalComponent isOpen={props.isOpen} onClose={props.onClose} size={"lg"}>
			<ModalComponent.Content w={"95%"} >
				<ModalComponent.CloseButton />
				<ModalComponent.Header>{"Transaction: " + transaction_number}</ModalComponent.Header>
				<ModalComponent.Body>
					<HStack justifyContent={"space-between"} py={"4"}>
						<Text bold>{ language.dashboard.modalLabelBeneficiaryName }</Text>
						<Text textAlign={"right"} >{ fullname }</Text>
					</HStack>
					<HStack justifyContent={"space-between"} py={"4"}>
						<Text bold>{ language.dashboard.modalLabelAccountNumber }</Text>
						<Text textAlign={"right"} >{ accountnumber }</Text>
					</HStack>
					<HStack justifyContent={"space-between"} py={"4"} borderBottomWidth={"1"} borderBottomColor={"coolGray.300"}>
						<Text bold>{ language.dashboard.modalLabelBank }</Text>
						<Text textAlign={"right"}>{ bankname }</Text>
					</HStack>
					<HStack justifyContent={"space-between"} py={"4"}>
						<Text bold>{ language.dashboard.modalLabelSendAmount }</Text>
						<Text textAlign={"right"} >{ formatCurrency(transfer_amount, "en-AU", "AUD").full } { language.dashboard.audCode }</Text>
					</HStack>
					<HStack justifyContent={"space-between"} py={"4"}>
						<Text bold>{ language.dashboard.modalLabelRate }</Text>
						<Text textAlign={"right"} >{ formatCurrency(rate, "en-AU", "AUD").full } { language.dashboard.thbCode }</Text>
					</HStack>
					<HStack justifyContent={"space-between"} py={"4"}>
						<Text bold>{ language.dashboard.modalLabelFees }</Text>
						<Text textAlign={"right"} >{ formatCurrency(fee_AUD, "en-AU", "AUD").full } { language.dashboard.audCode }</Text>
					</HStack>
					<HStack justifyContent={"space-between"} py={"4"}>
						<Text bold>{ language.dashboard.modalLabelTotalToPay }</Text>
						<Text textAlign={"right"} >{ formatCurrency(amount_paid, "en-AU", "AUD").full } { language.dashboard.audCode }</Text>
					</HStack>
					<HStack justifyContent={"space-between"} py={"4"} borderBottomWidth={"1"} borderBottomColor={"coolGray.300"}>
						<Text bold>{ language.dashboard.modalLabelReceivableAmount }</Text>
						<Text textAlign={"right"}>{ formatCurrency(received_amount, "th-TH", "THB").full } { language.dashboard.thbCode }</Text>
					</HStack>
					<HStack justifyContent={"space-between"} py={"4"}>
						<Text bold>{ language.dashboard.modalLabelStatus }</Text>
						<Badge colorScheme={ statusBadge } variant={"solid"} textAlign={"right"} >{ status }</Badge>
					</HStack>
					<HStack justifyContent={"space-between"} py={"4"}>
						<Text bold>{ language.dashboard.modalLabelCreatedDate }</Text>
						<Text textAlign={"right"} >{ dateCR.toLocaleString(auth.lang, dateOptions) }</Text>
					</HStack>
					{ status == 'Completed' && ( 
					<HStack justifyContent={"space-between"} py={"4"}>
						<Text bold>{ language.dashboard.modalLabelCompletedDate }</Text>
						<Text textAlign={"right"} >{ dateCO.toLocaleString(auth.lang, dateOptions) }</Text>
					</HStack>)}
				</ModalComponent.Body>
			</ModalComponent.Content>
		</ModalComponent>
	)
}

export default React.memo(Modal);
