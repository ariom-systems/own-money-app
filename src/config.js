import React, { useContext } from 'react';
import { extendTheme } from 'native-base';
import { DefaultTheme } from '@react-navigation/native';
import { border } from 'native-base/lib/typescript/theme/styled-system';
import { create } from 'apisauce'
import Config from 'react-native-config';

import LocalizedStrings from 'react-native-localization'
const auStrings = require('./i18n/en-AU.json')
const thStrings = require('./i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export const api = create({
	baseURL: Config.BASEURL + '/' + Config.APIVERSION + '/',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	timeout: 5000
})

//no idea where else to put this
export const beneficiaryColumns = [
	"id",
	"id_users",
	"firstname",
	"lastname",
	"thainame",
	"phone",
	"accountnumber",
	"accounttype",
	"bankname",
	"branchname",
	"branchcity",
	"address",
	"state",
	"city",
	"postcode",
	"country",
	"status" 
]

export const NativeBaseTheme = extendTheme({
	colors: {
		primary: {
			50: '#FCF5E1',
			100: '#F0E0BF',
			200: '#E3CB9A',
			300: '#D8B674',
			400: '#CDA14D',
			500: '#B38834',
			600: '#8B6A27',
			700: '#644B1B',
			800: '#3D2D0D',
			900: '#180E00'
		}
	},
	config: {
		//initialColorMode: 'dark'
	},
	components: {
		Button: {
			variants: {
				outline: () => ({
					_text: {
						color: 'primary.600'
					},
					_light: {
						borderColor: 'primary.600'
					},
					borderWidth: '1px',
				}),
				subtle: () => ({
					_light: {
						borderColor: 'primary.600'
					},
					borderWidth: '1px'
				})
			}
		}
	}
})

export const ReactNavigationThemeDark = {
	dark: true,
	colors: {
		primary: '#FFFFFF',
		background: '#180E00',
		text: '#FCF5E1'
	}
}

export const ReactNavigationThemeDefault = {
	...DefaultTheme,
	colors: {
		
	}
}

export const validationRulesLogin = {
	email: {
		required: language.login.formEmailMessageRequired,
		pattern: { value: /\S+@\S+\.\S+/i, message: language.login.formEmailMessagePattern }
	},
	password: { required: language.login.formPasswordMessageRequired }
}

export const validationRulesRegister = {

}

export const validationRulesForgotPassword = {

}

export const validationRulesBeneficiariesAdd = {
	firstname: { required: language.beneficiariesAdd.listDataFirstNameErrorRequired },
	lastname: { required: language.beneficiariesAdd.listDataLastNameErrorRequired },
	phone: {
		pattern: { value: /[0-9-]+/, message: language.beneficiariesAdd.listDataPhoneErrorDigits },
		minLength: { value: 10, message: language.beneficiariesAdd.listDataPhoneErrorMin },
		maxLength: { value: 10, message: language.beneficiariesAdd.listDataPhoneErrorMax }
	},
	accountnumber: {
		required: language.beneficiariesAdd.listDataAccountNumberErrorRequired,
		pattern: { value: /\d+/, message: language.beneficiariesAdd.listDataAccountNumberErrorDigits },
		minLength: { value: 10, message: language.beneficiariesAdd.listDataAccountNumberErrorMin },
		maxLength: { value: 10, message: language.beneficiariesAdd.listDataAccountNumberErrorMax }
	},
	accounttype: { required: language.beneficiariesAdd.listDataAccountTypeErrorRequired },
	bankname: { required: language.beneficiariesAdd.listDataBankNameErrorRequired },
	branchname: { required: language.beneficiariesAdd.listDataBranchNameErrorRequired },
	branchcity: { required: language.beneficiariesAdd.listDataBranchCityErrorRequired },
	address: { required: language.beneficiariesAdd.listDataThaiAddressErrorRequired },
	state: { required: language.beneficiariesAdd.listDataProvinceErrorRequired },
	city: { required: language.beneficiariesAdd.listDataDistrictErrorRequired },
	postcode: { required: language.beneficiariesAdd.listDataPostCodeErrorRequired }

}

export const validationRulesBeneficiariesEdit = {
	firstname: { required: language.beneficiariesEdit.listDataFirstNameErrorRequired },
	lastname: { required: language.beneficiariesEdit.listDataLastNameErrorRequired },
	phone: {
		pattern: { value: /[0-9-]+/, message: language.beneficiariesEdit.listDataPhoneErrorDigits },
		minLength: { value: 10, message: language.beneficiariesEdit.listDataPhoneErrorMin },
		maxLength: { value: 10, message: language.beneficiariesEdit.listDataPhoneErrorMax }
	},
	accountnumber: {
		required: language.beneficiariesEdit.listDataAccountNumberErrorRequired,
		pattern: { value: /\d+/, message: language.beneficiariesEdit.listDataAccountNumberErrorDigits },
		minLength: { value: 10, message: language.beneficiariesEdit.listDataAccountNumberErrorMin },
		maxLength: { value: 10, message: language.beneficiariesEdit.listDataAccountNumberErrorMax }
	},
	accounttype: { required: language.beneficiariesEdit.listDataAccountTypeErrorRequired },
	bankname: { required: language.beneficiariesEdit.listDataBankNameErrorRequired },
	branchname: { required: language.beneficiariesEdit.listDataBranchNameErrorRequired },
	branchcity: { required: language.beneficiariesEdit.listDataBranchCityErrorRequired },
	address: { required: language.beneficiariesEdit.listDataThaiAddressErrorRequired },
	state: { required: language.beneficiariesEdit.listDataProvinceErrorRequired },
	city: { required: language.beneficiariesEdit.listDataDistrictErrorRequired },
	postcode: { required: language.beneficiariesEdit.listDataPostCodeErrorRequired }
}

export const validationRulesTransferStepOne = {
	aud: { pattern: { value: /^(?!,\.$)[\d,]+[\.]?(\d{1,2})?$/, message: language.transferStepOne.errorMessageInvalidFormat }},
	thb: { pattern: { value: /^(?!,\.$)[\d,]+[\.]?(\d{1,2})?$/, message: language.transferStepOne.errorMessageInvalidFormat }}
}

export const validationRulesTransferStepThree = {
	purpose: { required: language.transferStepthree.errorMessageSelectReason },
	termsandconditions: { required: language.transferStepthree.errorMessageAcceptTerms }
}

export const validationRulesTermsAndConditions = {
	accept: { required: language.termsAndConditions.errorMessageAccept }
}

export const BeneficiaryTemplate = [
	{
		title: language.beneficiariesDetail.listDataHeaderPersonalDetails,
		data: [
			{ key: "firstname", label: language.beneficiariesDetail.listDataLabelFirstName, value: "" },
			{ key: "lastname", label: language.beneficiariesDetail.listDataLabelLastName, value: "" },
			{ key: "thainame", label: language.beneficiariesDetail.listDataLabelThaiName, value: "" },
			{ key: "phone", label: language.beneficiariesDetail.listDataLabelPhone, value: "" }
		]
	},
	{
		title: language.beneficiariesDetail.listDataHeaderBankDetails,
		data: [
			{ key: "accountnumber", label: language.beneficiariesDetail.listDataLabelAccountNumber, value: "" },
			{ key: "accounttype", label: language.beneficiariesDetail.listDataLabelAccountType, value: "" },
			{ key: "bankname", label: language.beneficiariesDetail.listDataLabelBankName, value: "" },
			{ key: "bankbranch", label: language.beneficiariesDetail.listDataLabelBankBranch, value: "" },
			{ key: "bankcity", label: language.beneficiariesDetail.listDataLabelBankCity, value: "" }
		]
	},
	{
		title: language.beneficiariesDetail.listDataHeaderAddressDetails,
		data: [
			{ key: "thaiaddress", label: language.beneficiariesDetail.listDataLabelThaiAddress, value: "" },
			{ key: "province", label: language.beneficiariesDetail.listDataLabelProvince, value: "" },
			{ key: "district", label: language.beneficiariesDetail.listDataLabelDistrict, value: "" },
			{ key: "postcode", label: language.beneficiariesDetail.listDataLabelPostCode, value: "" },
			{ key: "country", label: language.beneficiariesDetail.listDataLabelCountry, value: "" }
		]
	}
]

export const TransactionTemplate = [
	{
		title: language.transactionsDetail.listHeaderStatus,
		data: [
			{ key: "status", label: language.transactionsDetail.listHeaderStatus, value: ""}
		]
	},
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
			{ key: "transfer_amount", label: language.transactionsDetail.listDataSendAmountLabel, value: "" },
			{ key: "rate", label: language.transactionsDetail.listDataYourRateLabel, value: "" },
			{ key: "fee_AUD", label: language.transactionsDetail.listDataFeeLabel, value: "" },
			{ key: "amount_paid", label: language.transactionsDetail.listDataTotalToPayLabel, value: "" },
			{ key: "received_amount", label: language.transactionsDetail.listDataReceivableAmountLabel, value: "" }
		]
	},
	{
		title: language.transactionsDetail.listHeaderDetails,
		data: [
			{ key: "created_datetime", label: language.transactionsDetail.listDataDateCreatedLabel, value: "" },
			{ key: "completed_datetime", label: language.transactionsDetail.listDataDateCompletedLabel, value: "" },
			{ key: "processed_datetime", label: language.transactionsDetail.listDataDateProcessedLabel, value: "" },
			{ key: "transaction_number", label: language.transactionsDetail.listDataTransactionNumberLabel, value: "" }
		]
	}
]

export const UserTemplate = [
	{
		title: language.profileDetails.listDataHeaderPersonalDetails,
		data: [
			{ key: "firstname", label: language.profileDetails.listDataFirstNameLabel, value: "" },
			{ key: "middlename", label: language.profileDetails.listDataMiddleNameLabel, value: "" },
			{ key: "lastname", label: language.profileDetails.listDataLastNameLabel, value: "" },
			{ key: "nickname", label: language.profileDetails.listDataNickNameLabel, value: "" },
			{ key: "dateofbirth", label: language.profileDetails.listDataDateOfBirthLabel, value: "" },
			{ key: "occupation", label: language.profileDetails.listDataOccupationLabel, value: "" }
		]
	},
	{
		title: language.profileDetails.listDataHeaderContactDetails,
		data: [
			{ key: "phone", label: language.profileDetails.listDataPhoneLabel, value: "" },
			{ key: "email", label: language.profileDetails.listDataEmailLabel, value: "" }
		]
	},
	{
		title: language.profileDetails.listDataHeaderAddressDetails,
		data: [
			{ key: "address", label: language.profileDetails.listDataAddressLabel, value: "" },
			{ key: "city", label: language.profileDetails.listDataSuburbLabel, value: "" },
			{ key: "state", label: language.profileDetails.listDataStateLabel, value: "" },
			{ key: "postcode", label: language.profileDetails.listDataPostCodeLabel, value: "" },
			{ key: "country", label: language.profileDetails.listDataCountryLabel, value: "" }
		]
	},
	{
		title: language.profileDetails.listDataHeaderAccountInfo,
		data: [
			{ key: "memberid", label: language.profileDetails.listDataMemberIDLabel, value: "" },
			{ key: "date_regis", label: language.profileDetails.listDataDateRegisteredLabel, value: "" },
			{ key: "date_regis_completed", label: language.profileDetails.listDataDateVerifiedLabel, value: "" },
			{ key: "status", label: language.profileDetails.listDataAccountStatusLabel, value: "" }
		]
	},
	{
		title: language.profileDetails.listDataHeaderIdentityInfo,
		data: [
			{ key: "identity1", label: language.profileDetails.listDataIdentityOneLabel, value: "", subdata: {
				type: { label: language.profileDetails.listDataIdentityOneSublabelType, value: "" },
				expiry: { label: language.profileDetails.listDataIdentityOneSublabelExpiry, value: "" },
				issuer: { label: language.profileDetails.listDataIdentityOneSublabelIssuer, value: "" },
				number: { label: language.profileDetails.listDataIdentityOneSublabelNumber, value: "" },
				uploaded: { label: language.profileDetails.listDataIdentityOneSublabelUploaded, value: "" },
				file: { label: language.profileDetails.listDataIdentityOneSublabelFile, value: "" }
			}},
			{ key: "identity2", label: language.profileDetails.listDataIdentityTwoLabel, value: "", subdata: {
				type: { label: language.profileDetails.listDataIdentityTwoSublabelType, value: "" },
				expiry: { label: language.profileDetails.listDataIdentityTwoSublabelExpiry, value: "" },
				issuer: { label: language.profileDetails.listDataIdentityTwoSublabelIssuer, value: "" },
				number: { label: language.profileDetails.listDataIdentityTwoSublabelNumber, value: "" },
				uploaded: { label: language.profileDetails.listDataIdentityTwoSublabelUploaded, value: "" },
				file: { label: language.profileDetails.listDataIdentityTwoSublabelFile, value: "" }
			}}
		]
	}
]


export const TransactionObjFormats = {
	amount_paid: { type: 'currency', options: ['en-AU', 'AUD']},
	completed_datetime: { type: 'date', options: { dateStyle: 'medium', timeZone: 'Australia/Sydney', timeStyle: 'medium' } },
	created_datetime: { type: 'date', options: { dateStyle: 'medium', timeZone: 'Australia/Sydney', timeStyle: 'medium' } },
	fee_AUD: { type: 'currency', options: ['en-AU', 'AUD'] },
	processed_datetime: { type: 'date', options: { dateStyle: 'medium', timeZone: 'Australia/Sydney', timeStyle: 'medium' } },
	rate: { type: 'currency', options: ['th-TH', 'THB'] },
	received_amount: { type: 'currency', options: ['th-TH', 'THB'] },
	today_rate: { type: 'currency', options: ['th-TH', 'THB'] },
	transfer_amount: { type: 'currency', options: ['en-AU', 'AUD'] }
}