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