import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export const defaultsBeneficiariesAdd = {
	
}

export const rulesBeneficiariesAdd = {

}

export const rulesBeneficiariesEdit = {
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

