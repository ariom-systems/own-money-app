import React, { useEffect, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Badge, Divider, Modal as ModalComponent, } from 'native-base'
import LabelValue from '../common/LabelValue'

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

const Modal = (props) => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const lang = useRecoilValue(langState)
	let { accountnumber, amount_paid, bankname, completed_date, completed_time, created_date, created_time, 
		fee_AUD, fullname, rate, received_amount, status, transaction_number, transfer_amount } = props.data

	let dateCR = new Date([created_date, created_time].join('T'))
	let dateCO = new Date([completed_date, completed_time].join('T'))
	let dateOptions = { dateStyle: 'medium', timeZone: 'Australia/Sydney', timeStyle: 'medium' }

	let scheme, message, badge
	switch (status) {
		case 'Wait for payment': [scheme, message] = ['default', language.components.statusBadgeWaitForPayment]; break
		case 'Cancelled': [scheme, message] = ['danger', language.components.statusBadgeCancelled]; break
		case 'Completed': [scheme, message] = ["default", language.components.statusBadgeCompleted]; break
	}
	badge = <Badge colorScheme={scheme} variant={"solid"}>{message}</Badge>

	transfer_amount = formatCurrency(transfer_amount, "en-AU", "AUD").full + " " + language.misc.aud
	rate = formatCurrency(rate, "en-AU", "AUD").full + " " + language.misc.aud
	fee_AUD = formatCurrency(fee_AUD, "en-AU", "AUD").full + " " + language.misc.aud
	amount_paid = formatCurrency(amount_paid, "en-AU", "AUD").full + " " + language.misc.aud
	received_amount = formatCurrency(received_amount, "th-TH", "THB").full + " " + language.misc.thb
	dateCR = dateCR.toLocaleString(lang, dateOptions)
	dateCO = dateCO.toLocaleString(lang, dateOptions)

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
		forceUpdate()
	}, [language, lang])

	return (
		<ModalComponent isOpen={props.isOpen} onClose={props.onClose} size={"lg"}>
			<ModalComponent.Content w={"95%"} >
				<ModalComponent.CloseButton />
				<ModalComponent.Header>{language.dashboard.modal.title + ": " + transaction_number}</ModalComponent.Header>
				<ModalComponent.Body>
					<LabelValue label={language.dashboard.modal.beneficiaryName} value={fullname} />
					<LabelValue label={language.dashboard.modal.accountNumber} value={accountnumber} />
					<LabelValue label={language.dashboard.modal.bank} value={bankname} />
					<Divider />
					<LabelValue label={language.dashboard.modal.sendAmount} value={transfer_amount} />
					<LabelValue label={language.dashboard.modal.rate} value={rate} />
					<LabelValue label={language.dashboard.modal.fees} value={fee_AUD} />
					<LabelValue label={language.dashboard.modal.totalToPay} value={amount_paid} />
					<LabelValue label={language.dashboard.modal.receivableAmount} value={received_amount} />
					<LabelValue label={language.dashboard.modal.status} value={badge} />
					<LabelValue label={language.dashboard.modal.createdDate} value={dateCR} />
					<LabelValue label={language.dashboard.modal.completedDate} value={dateCO} />
				</ModalComponent.Body>
			</ModalComponent.Content>
		</ModalComponent>
	)
}

export default memo(Modal);
