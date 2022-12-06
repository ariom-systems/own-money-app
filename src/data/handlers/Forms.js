import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export const defaultsBeneficiariesAdd = {
	
}

export const rulesBeneficiariesAdd = {
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

