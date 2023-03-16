import React from 'react'

//components
import IdentitySection from './components/profile/IdentitySection'
import StatusSection from './components/transactions/StatusSection'
import RateDetailRowItem from './components/transfers/RateDetailRowItem'
import LimitDetailRowItem from './components/transfers/LimitDetailRowItem'
import BankDetailsRowItem from './components/profile/BankDetailsRowItem'

//data
import { extendTheme } from 'native-base'
import { DefaultTheme } from '@react-navigation/native'
import { create } from 'apisauce'
import Config from 'react-native-config'

//lang
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

export const keychain = {
	token: 'com.ariom.ownservices.token',
	pin: 'com.ariom.ownmoney.pin',
	lang: 'com.ariom.ownmoney.lang'
}

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
	breakpoints: {
		xs: 300,
		sm: 400,
		md: 768,
		lg: 992,
		xl: 1280
	},
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

export const PressableStyles = {
	base: {
		space: "1",
		alignItems: "center",
		pl: ["1", "2", "3", "3", "3"],
		pr: ["1", "2", "3", "3", "3"],
		py: "2.5",
		rounded: "4",
		borderStyle: "solid",
		borderWidth: "1"
	},
	itemsSingle: { justifyContent: "center" },
	itemsMultiple: { justifyContent: "center" },
	iconLeft: { flexDirection: "row" },
	iconRight: { flexDirection: "row-reverse" },
	primary: {
		solid: {
			bgColor: "primary.500",
			borderColor: "primary.500",
			color: "white"
		},
		subtle: {
			bgColor: "primary.300",
			borderColor: "primary.300",
			color: "primary.800"
		},
		outline: {
			bgColor: "transparent",
			borderColor: "primary.100",
			color: "primary.100"
		},
		outlineDark: {
			bgColor: "transparent",
			borderColor: "primary.600",
			color: "primary.600"
		}
	},
	disabled: {
		solid: {
			bgColor: "primary.800:alpha.70",
			borderColor: "primary.800:alpha.70",
			color: "primary.100:alpha.20"
		},
		subtle: {
			bgColor: "primary.300:alpha.70",
			borderColor: "primary.300:alpha.70",
			color: "primary.800:alpha.70"
		},
		outline: {
			bgColor: "transparent:alpha.70",
			borderColor: "primary.100:alpha.70",
			color: "primary.100:alpha.70"
		},
		outlineDark: {
			bgColor: "transparent:alpha.70",
			borderColor: "primary.600:alpha.70",
			color: "primary.600:alpha.70"
		}
	}
}

export const Sizes = {
	text: {
		base: "md",
		sm: "sm"
	},
	tinyText: {
		base: "sm",
		sm: "xs"
	},
	labels: {
		base: "md"
	},
	headings: {
		base: "md"
	},
	icons: {
		base: "md",
		xs: "xl",
		sm: "lg",
		md: "md"
	},
	inputs: {
		base: "md",
		sm: "sm"
	},
	spacing: {
		base: "4",
		sm: "3",
		xs: "2"
	},
	spacingSmall: {
		base: "2",
		sm: "1"
	},
	spacingLarge: {
		base: "8",
		sm: "4"
	},
	padding: {
		base: "4",
		sm: "2"
	},
	paddingLarge: {
		base: "8",
		sm: "4"
	},
	margin: {
		base: "4",
		sm: "2"
	},
	marginSmall: {
		base: "2",
		sm: "1"
	},
	buttons: {
		base: "md",
		sm: "xs"
	},
	rounded: {
		base: "10",
		sm: "8",
		xs: "6"
	}
}

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

/* VALIDATION */

export const validationRulesLogin = {
	email: {
		required: 'login.errors.emailRequired',
		pattern: { value: /\S+@\S+\.\S+/i, message: 'login.errors.emailPattern' }
	},
	password: { required: 'login.errors.passwordRequired' }
}

export const validationRulesRegister = {
	email: {
		required: 'register.errors.emailRequired',
		pattern: { value: /\S+@\S+\.\S+/i, message: 'register.errors.emailPattern' }
	},
	password: { required: 'register.errors.passwordRequired' },
	passwordConfirm: { required: 'register.errors.passwordConfirmRequired' },
	phone: {
		required: 'register.errors.phoneRequired',
		pattern: { value: /^[0-9-]+$/, message: 'register.errors.phonePattern' }
	}
}

export const validationRulesForgotPassword = {
	email: {
		required: 'forgotPassword.errors.emailRequired',
		pattern: { value: /\S+@\S+\.\S+/i, message: 'forgotPassword.errors.emailPattern' }
	}
}

export const validationRulesBeneficiaryAdd = {
	firstname: { required: 'beneficiaryAdd.errors.firstNameRequired' },
	lastname: { required: 'beneficiaryAdd.errors.lastNameRequired' },
	phone: {
		pattern: { value: /[0-9-]+/, message: 'beneficiaryAdd.errors.phoneDigits' },
		minLength: { value: 10, message: 'beneficiaryAdd.errors.phoneMin' },
		maxLength: { value: 10, message: 'beneficiaryAdd.errors.phoneMax' }
	},
	accountnumber: {
		required: 'beneficiaryAdd.errors.accountNumberRequired',
		pattern: { value: /\d+/, message: 'beneficiaryAdd.errors.accountNumberDigits' },
		minLength: { value: 10, message: 'beneficiaryAdd.errors.accountNumberMin' },
		maxLength: { value: 10, message: 'beneficiaryAdd.errors.accountNumberMax' }
	},
	accounttype: { required: 'beneficiaryAdd.errors.accountTypeRequired' },
	bankname: { required: 'beneficiaryAdd.errors.bankNameRequired' },
	branchname: { required: 'beneficiaryAdd.errors.branchNameRequired' },
	branchcity: { required: 'beneficiaryAdd.errors.branchCityRequired' },
	address: { required: 'beneficiaryAdd.errors.thaiAddressRequired' },
	state: { required: 'beneficiaryAdd.errors.provinceRequired' },
	city: { required: 'beneficiaryAdd.errors.districtRequired' },
	postcode: { required: 'beneficiaryAdd.errors.postCodeRequired' }

}

export const validationRulesBeneficiaryEdit = {
	firstname: { required: 'beneficiaryEdit.errors.firstNameRequired' },
	lastname: { required: 'beneficiaryEdit.errors.lastNameRequired' },
	phone: {
		pattern: { value: /[0-9-]+/, message: 'beneficiaryEdit.errors.phoneDigits' },
		minLength: { value: 10, message: 'beneficiaryEdit.errors.phoneMin' },
		maxLength: { value: 10, message: 'beneficiaryEdit.errors.phoneMax' }
	},
	accountnumber: {
		required: 'beneficiaryEdit.errors.accountNumberRequired',
		pattern: { value: /\d+/, message: 'beneficiaryEdit.errors.accountNumberDigits' },
		minLength: { value: 10, message: 'beneficiaryEdit.errors.accountNumberMin' },
		maxLength: { value: 10, message: 'beneficiaryEdit.errors.accountNumberMax' }
	},
	accounttype: { required: 'beneficiaryEdit.errors.accountTypeRequired' },
	bankname: { required: 'beneficiaryEdit.errors.bankNameRequired' },
	branchname: { required: 'beneficiaryEdit.errors.branchNameRequired' },
	branchcity: { required: 'beneficiaryEdit.errors.branchCityRequired' },
	address: { required: 'beneficiaryEdit.errors.thaiAddressRequired' },
	state: { required: 'beneficiaryEdit.errors.provinceRequired' },
	city: { required: 'beneficiaryEdit.errors.districtRequired' },
	postcode: { required: 'beneficiaryEdit.errors.postCodeRequired' }
}

export const validationRulesTransferStepOne = {
	aud: { pattern: { value: /^(?!,\.$)[\d,]+[\.]?(\d{1,2})?$/, message: 'transferStepOne.errors.invalidFormat' }},
	thb: { pattern: { value: /^(?!,\.$)[\d,]+[\.]?(\d{1,2})?$/, message: 'transferStepOne.errors.invalidFormat' }}
}

export const validationRulesTransferStepThree = {
	purpose: { required: 'transferStepthree.errorMessageSelectReason' },
	termsandconditions: { required: 'transferStepthree.errorMessageAcceptTerms' }
}

export const validationRulesProfileEdit = {
	firstname: { required: 'profileEdit.errors.firstNameRequired' },
	middlename: { required: 'profileEdit.errors.middleNamRequired' },
	lastname: { required: 'profileEdit.errors.lastNameRequired' },
	dateofbirth: { required: 'profileEdit.errors.dateOfBirthRequired' },
	occupation: { required: 'profileEdit.errors.occupationRequired' },
	phone: {
		required: 'profileEdit.errors.phoneRequired',
		pattern: { value: /[0-9-]+/, message: 'profileEdit.errors.phoneDigits' },
		minLength: { value: 10, message: 'profileEdit.errors.phoneMin' },
		maxLength: { value: 10, message: 'profileEdit.errors.phoneMax' }
	},
	address: { required: 'profileEdit.errors.addressRequired' },
	city: { required: 'profileEdit.errors.suburbRequired' },
	state: { required: 'profileEdit.errors.stateRequired' },
	postcode: { required: 'profileEdit.errors.postCodeRequired' },
	accname: { required: 'profileEdit.errors.accountnameRequired' },
	bsb: {
		required: 'profileEdit.errors.accountBsbRequired',
		pattern: { value: /[0-9-]+/, message: 'profileEdit.errors.accountBsbDigits' },
		minLength: { value: 6, message: 'profileEdit.errors.accountBsbMin' },
		maxLength: { value: 6, message: 'profileEdit.errors.accountBsbMax' }
	},
	acc: {
		required: 'profileEdit.errors.accountNumberRequired',
		pattern: { value: /[0-9-]+/, message: 'profileEdit.errors.accountNumberDigits' },
	}
}

export const validationRulesProfileEditIdentity = {
	idtype: { required: 'profileEdit.errors.idtypeRequired' },
	idnumber: { required: 'profileEdit.errors.idnumberRequired' },
	idexpiry: { required: 'profileEdit.errors.idexpiryRequired' },
	idissuer: { required: 'profileEdit.errors.idissuerRequired' },
}

/* DATA TEMPLATES */

export const BeneficiaryTemplate = [
	{
		title: { key: "personal", value: ""},
		data: [
			{ key: "firstname", label: "", value: "" },
			{ key: "lastname", label: "", value: "" },
			{ key: "thainame", label: "", value: "" },
			{ key: "phone", label: "", value: "" }
		]
	},
	{
		title: { key: "bank", value: "" },
		data: [
			{ key: "accountnumber", label: "", value: "" },
			{ key: "accounttype", label: "", value: "" },
			{ key: "bankname", label: "", value: "" },
			{ key: "branchname", label: "", value: "" },
			{ key: "branchcity", label: "", value: "" }
		]
	},
	{
		title: { key: "address", value: ""},
		data: [
			{ key: "address", label: "", value: "" },
			{ key: "city", label: "", value: "" },
			{ key: "state", label: "", value: "" },
			{ key: "postcode", label: "", value: "" },
			{ key: "country", label: "", value: "" }
		]
	}
]

const renderRateSection = ({ item, index, section: { data } }) => <RateDetailRowItem key={index} item={item} section={data} />
const renderLimitSection = ({ item, index, section: { data } }) => <LimitDetailRowItem key={index} item={item} section={data} />
export const TransferStepThreeTemplate = [
	{
		title: { key: "from", value: "" },
		data: [
			{ key: "sender", label: "", value: "" },
		]
	},
	{
		title: { key: "to", value: "" },
		data: [
			{ key: "receiver", label: "", value: "" },
			{ key: "accountnumber", label: "", value: "" },
			{ key: "bankname", label: "", value: "" }
		]
	},
	{
		title: { key: "amounts", value: "" },
		renderItem: renderRateSection,
		data: [
			{ key: "amounttosend", label: "", value: "" },
			{ key: "fees", label: "", value: "" },
			{ key: "rate", data: [
				{ key: "todayrate", label: "", value: "" },
				{ key: "yourrate", label: "", value: "" },
				{ key: "bonusrate", label: "", value: "" }
			]},
		]
	},
	{
		title: { key: "totals", value: "" },
		renderItem: renderLimitSection,
		data: [
			{ key: "totaltopay", label: "", value: "" },
			{ key: "receivableamount", label: "", value: "" },
			{ key: "dailylimit", data: [
				{ key: "maxlimit", label: "", value: "" },
				{ key: "limitbefore", label: "", value: "" },
				{ key: "limitbonus", label: "", value: "" },
				{ key: "limitafter", label: "", value: "" },
			] }
		]
	},
]

const renderStatusSection = ({section: {data, raw}}) => <StatusSection section={data} raw={raw} />
export const TransactionTemplate = [
	{
		title: { key: "status", value: "" },
		renderItem: renderStatusSection,
		data: [
			{ key: "status", label: "", value: ""}
		]
	},
	{
		title: { key: "recipient", value: "" },
		data: [
			{ key: "fullname", label: "", value: "" },
			{ key: "accountnumber", label: "", value: "" },
			{ key: "bankname", label: "", value: "" }
		]
	},
	{
		title: { key: "amounts", value: "" },
		data: [
			{ key: "transfer_amount", label: "", value: "" },
			{ key: "rate", label: "", value: "" },
			{ key: "fee_AUD", label: "", value: "" },
			{ key: "amount_paid", label: "", value: "" },
			{ key: "received_amount", label: "", value: "" }
		]
	},
	{
		title: { key: "details", value: "" },
		data: [
			{ key: "created_datetime", label: "", value: "" },
			{ key: "completed_datetime", label: "", value: "" },
			{ key: "processed_datetime", label: "", value: "" },
			{ key: "transaction_number", label: "", value: "" }
		]
	}
]

const renderIdentitySection = ({section: {data}}) => <IdentitySection section={data} />
const renderBankDetailsSection = ({ item, index, section }) => <BankDetailsRowItem item={item} index={index} section={section} />
export const UserTemplate = [
	{
		id: 'personal',
		title: { key: "personalDetails", value: "" },
		data: [
			{ key: "firstname", label: "", value: "" },
			{ key: "middlename", label: "", value: "" },
			{ key: "lastname", label: "", value: "" },
			{ key: "nickname", label: "", value: "", optional: true},
			{ key: "dateofbirth", label: "", value: "" },
			{ key: "occupation", label: "", value: "" }
		]
	},
	{
		id: 'contact',
		title: { key: "contactDetails", value: "" },
		data: [
			{ key: "phone", label: "", value: "" },
			{ key: "email", label: "", value: "", readOnly: true}
		]
	},
	{
		id: 'address',
		title: { key: "addressDetails", value: "" },
		data: [
			{ key: "address", label: "", value: "" },
			{ key: "city", label: "", value: "" },
			{ key: "state", label: "", value: "" },
			{ key: "postcode", label: "", value: "" },
			{ key: "country", label: "", value: "" }
		]
	},
	{
		id: 'account',
		title: { key: "accountInfo", value: "" },
		data: [
			{ key: "memberid", label: "", value: "", readOnly: true },
			{ key: "date_regis", label: "", value: "", readOnly: true },
			{ key: "date_regis_completed", label: "", value: "", readOnly: true },
			{ key: "status", label: "", value: "", readOnly: true }
		]
	},
	{
		id: 'identity',
		title: { key: "identityInfo", value: "" },
		renderItem: renderIdentitySection,
		data: [
			{ key: "identity", data: [
				{ key: "img_name", label: "", value: "" },
				{ key: "created_date", label: "", value: "", readOnly: true },
				{ key: "idtype", label: "", value: "" },
				{ key: "idnumber", label: "", value: "" },
				{ key: "idexpiry", label: "", value: "" },
				{ key: "idissuer", label: "", value: "" }
			]} 
		]
	},
	{
		id: 'bank',
		title: { key: "bankDetails", value: "" },
		renderItem: renderBankDetailsSection,
		data: [
			{ key: "accname", label: "", value: "" },
			{ key: "bsb", label: "", value: "" },
			{ key: "acc", label: "", value: "" },
			{ key: "acc_status", label: "", value: "", readOnly: true, options: ['profileDetails.ui.acc_statusActive', 'profileDetails.ui.acc_statusInactive']},
			{ key: "payid_name", label: "", value: "", readOnly: true },
			{ key: "payid", label: "", value: "", readOnly: true },
		]
	}
]

/* i18n FORMATTING */

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

export const TransferObjFormats = {
	amounttosend: { type: 'currency', options: ['en-AU', 'AUD'] },
	yourrate: { type: 'currency', options: ['th-TH', 'THB'] },
	fees: { type: 'currency', options: ['en-AU', 'AUD'] },
	totaltopay: { type: 'currency', options: ['en-AU', 'AUD'] },
	receivableamount: { type: 'currency', options: ['th-TH', 'THB'] },
	dailylimitremaining: { type: 'currency', options: ['en-AU', 'AUD'] }
}

export const ProfileObjFormats = {
	date_regis: { type: 'date', options: { dateStyle: 'medium', timeZone: 'Australia/Sydney', timeStyle: 'medium' } },
	dateofbirth: { type: 'date', options: { dateStyle: 'short' } }
}

/* TOOLBAR CONFIGS */

export const loginToolbarConfig = [
	{ type: 'item', labelObj: 'login.ui.buttonLoginNormal', flex: 1 },
	{ type: 'item', labelObj: 'login.ui.buttonRegister', flex: 1, variant: 'outlineDark' }
]

export const registerToolbarConfig = [
	{ type: 'item', labelObj: 'register.ui.buttonRegister', flex: 1 },
	{ type: 'item', labelObj: 'register.ui.buttonBackToLogin', flex: 1, variant: 'outlineDark' }
]

export const forgotPasswordToolbarConfig = [
	{ type: 'item', labelObj: 'forgotPassword.ui.buttonResetPassword', flex: 1 },
	{ type: 'item', labelObj: 'forgotPassword.ui.buttonBackToLogin', flex: 1, variant: 'outlineDark' }
]

export const dashboardToolbarConfig = [
	{ type: 'item', labelObj: 'dashboard.ui.buttonViewTransactions', flex: "3", id: 'dashboard' }
]

export const beneficiaryListToolbarConfig = [
	{ type: 'item', labelObj: 'beneficiaryList.ui.buttonAddNew', icon: "add-circle-outline", flex: "1" },
]

export const beneficiaryDetailToolbarConfig = [
	{ type: 'item', labelObj: 'beneficiaryDetail.ui.buttonBack', icon: "chevron-back-outline", flex: "1" },
	{ type: 'spacer' },
	{ type: 'item', labelObj: 'beneficiaryDetail.ui.buttonEdit', icon: "create-outline", flex: "1" },
	{ type: 'item', icon: "trash-outline", flex: "1" }
]

export const beneficiaryEditToolbarConfig = [
	{ type: 'item', labelObj: 'beneficiaryEdit.ui.buttonBack', icon: "chevron-back-outline", flex: "1" },
	{ type: 'spacer' },
	{ type: 'item', labelObj: 'beneficiaryEdit.ui.buttonSave', icon: "save-outline", flex: "1" }
]

export const beneficiaryAddToolbarConfig = [
	{ type: 'item', labelObj: 'beneficiaryAdd.ui.buttonCancel', icon: "close", variant: 'outline' },
	{ type: 'spacer' },
	{ type: 'item', labelObj: 'beneficiaryAdd.ui.buttonSave', icon: "save-outline", flex: "1" }
]

export const transferStepOneToolbarConfig = [
	{ type: 'item', labelObj: 'transferStepOne.ui.buttonReset', icon: "reload-outline", variant: 'outline' },
	{ type: 'spacer' },
	{ type: 'item', labelObj: 'transferStepOne.ui.buttonNext', icon: "chevron-forward-outline", iconPosition: 'right' }
]

export const transferStepTwoToolbarConfig = [
	{ type: 'item', labelObj: 'transferSteptwo.buttonPrevious', icon: "chevron-back-outline" },
	{ type: 'spacer' },
	{ type: 'item', labelObj: 'transferSteptwo.buttonNext', icon: "chevron-forward-outline", iconPosition: 'right'}
]

export const transferStepThreeToolbarConfig = [
	{ type: 'item', labelObj: 'transferStepthree.ui.buttonPrevious', icon: "chevron-back-outline" },
	{ type: 'spacer' },
	{ type: 'item', labelObj: 'transferStepthree.ui.buttonNext', icon: "chevron-forward-outline", iconPosition: 'right' }
]

export const transferStepFourToolbarConfig = [
	{ type: 'item', labelObj: 'transferStepthree.ui.buttonPrevious', icon: "chevron-back-outline", flex: "2" }
]

export const paymentShowBankDetailsToolbarConfig = [
	{ type: 'item', labelObj: 'paymentShowBankDetails.ui.buttonPrevious', icon: "chevron-back-outline", flex: "2" }
]

export const paymentShowPoliPaymentToolbarConfig = [
	{ type: 'item', labelObj: 'paymentShowPoliPayment.ui.buttonPrevious', icon: "chevron-back-outline", flex: "2" }
]

export const paymentShowPayIDToolbarConfig = [
	{ type: 'item', labelObj: 'paymentShowPayID.ui.buttonPrevious', icon: "chevron-back-outline", flex: "2" }
]

export const transactionsListToolbarConfig = [
	{ type: 'item', labelObj: 'transactionsList.labelLoadMore', icon: "refresh-circle", flex: "2", iconProps: { fontSize: "2xl" } },
]

export const transactionsDetailToolbarConfig = [
	{ type: 'item', labelObj: 'transactionsDetail.ui.buttonBack', icon: "chevron-back-outline" },
]

export const profileDetailToolbarConfig = [
	{ type: 'item', labelObj: 'profileDetails.ui.buttonUpdateProfile', icon: "construct", flex: "3" }
]

export const profileEditToolbarConfig = [
	{ type: 'item', labelObj: 'profileEdit.ui.buttonBack', icon: "chevron-back-outline", flex: "1" },
	{ type: 'spacer' },
	{ type: 'item', labelObj: 'profileEdit.ui.buttonSave', icon: "save-outline", flex: "1" }
]

export const profileEditIdentityToolbarConfig = [
	{ type: 'item', labelObj: 'profileEdit.ui.buttonUploadFile', icon: "camera-outline", flex: "3" }
]

export const profileEditViaAlertBannerToolbarConfig = [
	{ type: 'item', labelObj: 'profileEdit.ui.buttonSave', icon: "save-outline", flex: "1" }
]

export const termsAndConditionsToolbarConfig = [
	{ type: 'item', labelObj: 'termsAndConditions.buttonSubmit', icon: "chevron-forward-outline", iconPosition: 'right', flex: "2" }
]