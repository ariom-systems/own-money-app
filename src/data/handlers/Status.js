import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')

let language = new LocalizedStrings({...auStrings, ...thStrings})

export function getNotice(reasonCode, currentLang) {
	if(language.getLanguage() !== currentLang) {
		language.setLanguage(currentLang)
	}
	if(typeof reasonCode !== 'undefined') {
		//if we need to process multiple errors, return input here unmodified
		if(typeof reasonCode === 'object') {
			return reasonCode
		}
		switch(reasonCode) {
			//Generic
			case 'serverError':
				return {
					icon: 'flag',
					message: language.notices.serverErrorMessage,
					title: language.notices.serverErrorTitle,
					style: 'warning'
				}
			break
			case 'offline':
				return {
					icon: 'cloud-offline-outline',
					message: language.notices.offlineMessage,
					title: language.notices.offlineTitle,
					style: 'warning'
				}
			break
			//App.js
			case 'sessionExpired':
				return {
					icon: 'timer',
					message: language.notices.sessionExpiredMessage,
					title: language.notices.sessionExpiredTitle,
					style: 'info'
				}
			break
			//LoginScreen.jsx / Register.jsx
			case 'noEmail':
				return {
					icon: 'alert-circle-outline',
					message: language.notices.noEmailMessage,
					title: language.notices.noEmailTitle,
					style: 'error'
				}
			break
			case 'noPassword':
				return {
					icon: 'alert-circle-outline',
					message: language.notices.noPasswordConfirmMessage,
					title: language.notices.noPasswordConfirmTitle,
					style: 'error'
				}
			break	
			case 'badUser':
				console.log(language.notices.badUserMessage)
				return {
					icon: 'alert-circle-outline',
					message: language.notices.badUserMessage,
					title: language.notices.badUserTitle,
					style: 'error'
				}
			break
			//LoginScreen.jsx
			case 'passwordMismatch':
				return {
					icon: 'alert-circle-outline',
					message: language.notices.passwordMismatchMessage,
					title: language.notices.passwordMismatchTitle,
					style: 'error'
				}
			break
			case 'statusInactive':
				return {
					icon: '',
					message: language.notices.statusInactiveMessage,
					title: language.notices.statusInactiveTitle,
					style: 'warning'
				}
			break
			case 'registerIncomplete':
				return {
					icon: '',
					message: language.notices.registerIncompleteMessage,
					title: language.notices.registerIncompleteTitle,
					style: 'info'
				}
			break
			case 'redirectToTermsConditions':
				return {
					icon: '',
					message: language.notices.redirectToTermsConditionsMessage,
					title: language.notices.redirectToTermsConditionsTitle,
					style: 'info'
				}
			break
			//RegisterScreen.jsx
			case 'noPasswordConfirm':
				return {
					icon: '',
					message: language.notices.noPasswordConfirmMessage,
					title: language.notices.noPasswordConfirmTitle,
					style: 'error'
				}
			break
			case 'noPhone':
				return {
					icon: '',
					message: language.notices.noPhoneMessage,
					title: language.notices.noPhoneTitle,
					style: 'error'
				}
			break
			case 'invalidReferrer':
				return {
					icon: '',
					message: language.notices.invalidReferrerMessage,
					title: language.notices.invalidReferrerTitle,
					style: 'warning'
				}
			break
			case 'registerComplete':
				return {
					icon: 'information-circle-outline',
					message: language.notices.accountRegisteredMessage,
					title: language.notices.accountRegisteredTitle,
					style: 'success'
				}
			break
			//ForgotPasswordScreen.jsx
			case 'resetRequested':
				return {
					icon: 'information-circle-outline',
					message: language.notices.resetRequestedMessage,
					title: language.notices.resetRequestedTitle,
					style: 'info'
				}
			break
			//SettingsScreen.jsx
			case 'logout':
				return {
					icon: 'walk-outline',
					message: language.notices.logoutMessage,
					title: language.notices.logoutTitle,
					style: 'info'
				}
			break
			//PinCodeScreen.jsx
			case 'pinReset':
				return {
					icon: 'keypad-outline',
					message: language.notices.pinResetMessage,
					title: language.notices.pinResetTitle,
					style: 'info'
				}
			break
			//BeneficiariesAdd.jsx
			case 'beneficiarySaved':
				return {
					icon: 'checkmark-circle-outline',
					message: language.notices.beneficiarySavedMessage,
					title: language.notices.beneficiarySavedTitle,
					style: 'success'
				}
			break
			//BeneficiariesDelete.jsx
			case 'beneficiaryDeleted':
				return {
					icon: 'checkmark-circle-outline',
					message: language.notices.beneficiaryDeletedMessage,
					title: language.notices.beneficiaryDeletedTitle,
					style: 'success'
				}
			break
			//BeneficiariesEdit.jsx
			case 'beneficiaryUpdated':
				return {
					icon: 'checkmark-circle-outline',
					message: language.notices.beneficiaryUpdatedMessage,
					title: language.notices.beneficiaryUpdatedTitle,
					style: 'success'
				}
			break
			//ProfileDetails.jsx
			case 'profileUpdated':
				return {
					icon: 'checkmark-circle-outline',
					message: language.notices.profileUpdatedMessage,
					title: language.notices.profileUpdatedTitle,
					style: 'success'
				}
			break
			//TransferStepThree.jsx
			case 'transferComplete':
				return {
					icon: 'trophy-outline',
					message: language.notices.transferCompleteMessage,
					title: language.notices.transferCompleteTitle,
					style: 'success'
				}
			break
			default:
				return {
					icon: 'help-circle-outline',
					message: language.notices.defaultMessage,
					title: language.notices.defaultTitle,
					style: 'warning'
				}
			break
		}
	}
}
