import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export const TransactionBlank = [
	{
		title: language.transactionsDetail.listHeaderRecipient,
		data: [
			{ key: "fullname", label: language.transactionsDetail.listDataAccountNameLabel, value: "" },
			{ key: "accountnumber", label: language.transactionsDetail.listDataAccountNumberLabel, value: "" },
			{ key: "bankname", label: language.transactionsDetail.listDataBankNameLabel, value: "" }
		]
	},
	{
		title: language.transactionsDetail.listHeaderAmounts,
		data: [
			{ key: "sendamount", label: language.transactionsDetail.listDataSendAmountLabel, value: ""},
			{ key: "rate", label: language.transactionsDetail.listDataYourRateLabel, value: ""},
			{ key: "fee", label: language.transactionsDetail.listDataFeeLabel, value: ""},
			{ key: "payamount", label: language.transactionsDetail.listDataTotalToPayLabel, value: ""},
			{ key: "receiveamount", label: language.transactionsDetail.listDataReceivableAmountLabel, value: ""}
		]
	},
	{
		title: language.transactionsDetail.listHeaderDetails,
		data: [
			{ key: "transactionnumber", label: language.transactionsDetail.listDataTransactionNumberLabel, value: ""},
			{ key: "status", label: language.transactionsDetail.listDataStatusLabel, value: ""},
			{ key: "datecreated", label: language.transactionsDetail.listDataDateCreatedLabel, value: ""},
			{ key: "datecompleted", label: language.transactionsDetail.listDataDateCompletedLabel, value: ""}
		]
	}
]