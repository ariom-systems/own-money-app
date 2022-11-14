import React from 'react';
import { Platform } from 'react-native'
import { CommonActions } from '@react-navigation/native';
import { Box, Heading, Text, Button, VStack, SectionList, Badge } from 'native-base'
import { CheckCircleIcon, InfoIcon, WarningIcon, WarningOutlineIcon } from 'native-base';

import { AuthContext, DataContext } from '../../../data/Context'
import { formatCurrency, log } from '../../../data/Actions';

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransactionsDetail = ({route, navigation }) => {
	
	const { auth } = React.useContext(AuthContext)
	const { data } = React.useContext(DataContext)
	const { transactionNumber } = route.params
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])
	
	let transaction = null
	const groups = data.transactions.find((group) => {
		group.data.some((item) => {
			if(transaction == null) {
				if(item.transaction_number === transactionNumber) {
					transaction = item
				}
			}
		})
	})

	const amountSend = formatCurrency(transaction.transfer_amount, 'en-AU', 'AUD').full
	const amountReceived = formatCurrency(transaction.received_amount, 'th-TH', 'THB').full
	const rate = formatCurrency(transaction.today_rate, 'th-TH', 'THB').full
	const fee = formatCurrency(transaction.fee_AUD, 'en-AU', 'AUD').full
	const amountToPay = formatCurrency(Number(transaction.transfer_amount) + Number(transaction.fee_AUD), 'en-AU', 'AUD').full

	const dateOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute:'2-digit',
		second: '2-digit',
		numberingSystem: language.getLanguage() == 'th-TH' ? 'thai' : 'latn'
	}

	const createdDate = new Date(transaction.created_date.replace(' ', 'T')).toLocaleString(language.getLanguage(), dateOptions)
	
	let completedDate
	if(transaction.status !== "Completed") {
		completedDate = undefined
	} else {
		completedDate = new Date(transaction.completed_date.replace(' ', 'T')).toLocaleString(language.getLanguage(), dateOptions)
	}

	let badgeType, headerIconType, statusCode
	switch(transaction.status) {
		case 'Completed':
			badgeType = 'success'
			headerIconType = <CheckCircleIcon size={"5xl"} color={"success.600"} />
			statusCode = language.transactionStatus.completed
		break
		case 'Cancelled':
			badgeType = 'danger'
			headerIconType = <WarningIcon size={"5xl"} color={"error.600"} />
			statusCode = language.transactionStatus.cancelled
		break
		case 'Open':
			badgeType = 'default'
			headerIconType = <InfoIcon size={"5xl"} color={"info.600"} />
			statusCode = language.transactionStatus.open
		break
		case 'Overdue':
			badgeType = 'warning'
			headerIconType = <WarningOutlineIcon size={"5xl"} color={"warning.600"} />
			statusCode = language.transactionStatus.overdue
		break
	}

	const transactionData = [
		{
			title: (
				<Box alignItems={"center"}>
					{headerIconType}
					<Text fontSize={"xl"} bold>{statusCode}</Text>
				</Box>
			),
			data: []
		},
		{
			title: (<Heading size={"sm"}>{ language.transactionsDetail.listHeaderRecipient }</Heading>),
			data: [
				{ label: language.transactionsDetail.listDataAccountNameLabel, value: transaction.fullname },
				{ label: language.transactionsDetail.listDataAccountNumberLabel, value: transaction.accountnumber },
				{ label: language.transactionsDetail.listDataBankNameLabel, value: transaction.bankname }
			]
		},
		{
			title: (<Heading size={"sm"}>{ language.transactionsDetail.listHeaderAmounts }</Heading>),
			data: [
				{ label: language.transactionsDetail.listDataSendAmountLabel, value: amountSend},
				{ label: language.transactionsDetail.listDataYourRateLabel, value: rate},
				{ label: language.transactionsDetail.listDataFeeLabel, value: fee},
				{ label: language.transactionsDetail.listDataTotalToPayLabel, value: amountToPay},
				{ label: language.transactionsDetail.listDataReceivableAmountLabel, value: amountReceived}
			]
		},
		{
			title: (<Heading size={"sm"}>{ language.transactionsDetail.listHeaderDetails }</Heading>),
			data: [
				{ label: language.transactionsDetail.listDataTransactionNumberLabel, value: transaction.transaction_number},
				{ label: language.transactionsDetail.listDataStatusLabel, value: (<Box py={"2"}><Badge colorScheme={badgeType} variant={"outline"}>{statusCode}</Badge></Box>) },
				{ label: language.transactionsDetail.listDataDateCreatedLabel, value: createdDate},
				{ label: language.transactionsDetail.listDataDateCompletedLabel, value: completedDate},
			]
		}
	]

	return (
		<Box w={"100%"} pt={ Platform.OS !== 'ios' ? "0" : "0" } flex={"1"} mb={"74"}>
			<Box>
				<Box padding={"4"}>
					<Button onPress={() => {navigation.dispatch(CommonActions.goBack())}}>Back</Button>
				</Box>
				<SectionList
					backgroundColor={"white"}
					sections={transactionData}
					keyExtractor={(item, index) => item + index }
					renderItem={(item) => {
						if(item.item.value !== undefined) {
							return (<Box px={"4"}> 
								<VStack
									borderTopWidth={item.index == 0 ? "0" : "1"}
									borderTopColor={"coolGray.200"}
									py={"2"}>
									<Text fontSize={"xs"} color={"coolGray.500"}>{item.item.label}</Text>
									<Text>{item.item.value}</Text>
								</VStack>
							</Box>)		
						} else {
							return (<></>)
						}
					}}
					renderSectionHeader={({section: { title }}) => (
						<Box px={"2"} py={"4"} backgroundColor={"coolGray.100"}>
							{title}
						</Box>
					)} />
			</Box>
		</Box>
	)
}

export default TransactionsDetail;