import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export const BeneficiaryBlank = [
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