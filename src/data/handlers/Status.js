import * as Navigation from './Navigation'

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
					id: reasonCode,
					icon: 'flag',
					message: language.notices.serverErrorMessage,
					title: language.notices.serverErrorTitle,
					style: 'warning',
					//canClose: true
					canClose: false
				}
			break
			case 'offline':
				return {
					id: reasonCode,
					icon: 'cloud-offline-outline',
					message: language.notices.offlineMessage,
					title: language.notices.offlineTitle,
					style: 'warning',
					canClose: false
				}
			break
			//App.js
			case 'sessionExpired':
				return {
					id: reasonCode,
					icon: 'timer',
					message: language.notices.sessionExpiredMessage,
					title: language.notices.sessionExpiredTitle,
					style: 'info',
					//canClose: true
					canClose: false
				}
			break
			//LoginScreen.jsx / Register.jsx
			case 'noEmail':
				return {
					id: reasonCode,
					icon: 'alert-circle-outline',
					message: language.notices.noEmailMessage,
					title: language.notices.noEmailTitle,
					style: 'error',
					//canClose: true
					canClose: false
				}
			break
			case 'noPassword':
				return {
					id: reasonCode,
					icon: 'alert-circle-outline',
					message: language.notices.noPasswordConfirmMessage,
					title: language.notices.noPasswordConfirmTitle,
					style: 'error',
					//canClose: true
					canClose: false
				}
			break	
			case 'badUser':
				return {
					id: reasonCode,
					icon: 'alert-circle-outline',
					message: language.notices.badUserMessage,
					title: language.notices.badUserTitle,
					style: 'error',
					//canClose: true
					canClose: false
				}
			break
			//LoginScreen.jsx
			case 'passwordMismatch':
				return {
					id: reasonCode,
					icon: 'alert-circle-outline',
					message: language.notices.passwordMismatchMessage,
					title: language.notices.passwordMismatchTitle,
					style: 'error',
					//canClose: true
					canClose: false
				}
			break
			case 'verifyIdentity':
				return {
					id: reasonCode,
					icon: 'shield-outline',
					message: language.notices.statusVerifyIdentityMessage,
					title: language.notices.statusVerifyIdentityTitle,
					style: 'info',
					canClose: false,
					bannerAction: {
						label: language.notices.statusVerifyIdentityButton,
						fn: () => Navigation.navigate('Your Profile', { screen: 'ProfileDetails' })
					}
				}
			break
			case 'registerIncomplete':
				return {
					id: reasonCode,
					icon: '',
					iconType: '',
					message: language.notices.registerIncompleteMessage,
					title: language.notices.registerIncompleteTitle,
					style: 'info',
					//canClose: true
					canClose: false
				}
			break
			case 'redirectToTermsConditions':
				return {
					id: 'termsAndConditions',
					icon: 'receipt-outline',
					message: language.notices.redirectToTermsConditionsMessage,
					title: language.notices.redirectToTermsConditionsTitle,
					style: 'info',
					canClose: false
				}
			break
			//RegisterScreen.jsx
			case 'noPasswordConfirm':
				return {
					id: reasonCode,
					icon: '',
					iconType: '',
					message: language.notices.noPasswordConfirmMessage,
					title: language.notices.noPasswordConfirmTitle,
					style: 'error',
					//canClose: true
					canClose: false
				}
			break
			case 'noPhone':
				return {
					id: reasonCode,
					icon: '',
					iconType: '',
					message: language.notices.noPhoneMessage,
					title: language.notices.noPhoneTitle,
					style: 'error',
					//canClose: true
					canClose: false
				}
			break
			case 'invalidReferrer':
				return {
					id: reasonCode,
					icon: '',
					iconType: '',
					message: language.notices.invalidReferrerMessage,
					title: language.notices.invalidReferrerTitle,
					style: 'warning',
					//canClose: true
					canClose: false
				}
			break
			case 'registerComplete':
				return {
					id: reasonCode,
					icon: 'information-circle-outline',
					message: language.notices.accountRegisteredMessage,
					title: language.notices.accountRegisteredTitle,
					style: 'success',
					//canClose: true
					canClose: false
				}
			break
			//ForgotPasswordScreen.jsx
			case 'resetRequested':
				return {
					id: reasonCode,
					icon: 'information-circle-outline',
					message: language.notices.resetRequestedMessage,
					title: language.notices.resetRequestedTitle,
					style: 'info',
					//canClose: true
					canClose: false
				}
			break
			//SettingsScreen.jsx
			case 'logout':
				return {
					id: reasonCode,
					icon: 'walk-outline',
					message: language.notices.logoutMessage,
					title: language.notices.logoutTitle,
					style: 'info',
					//canClose: true
					canClose: false
				}
			break
			case 'pinReset':
				return {
					id: reasonCode,
					icon: 'keypad-outline',
					message: language.notices.pinResetMessage,
					title: language.notices.pinResetTitle,
					style: 'info',
					canClose: true
				}
			break
			case 'passwordReset':
				return {
					id: reasonCode,
					icon: 'key-outline',
					message: language.notices.passwordResetMessage,
					title: language.notices.passwordResetTitle,
					style: 'info',
					canClose: true
				}
				break
			//BeneficiariesAdd.jsx
			case 'beneficiarySaved':
				return {
					id: reasonCode,
					icon: 'checkmark-circle-outline',
					message: language.notices.beneficiarySavedMessage,
					title: language.notices.beneficiarySavedTitle,
					style: 'success',
					//canClose: true
					canClose: false
				}
			break
			//BeneficiariesDelete.jsx
			case 'beneficiaryDeleted':
				return {
					id: reasonCode,
					icon: 'checkmark-circle-outline',
					message: language.notices.beneficiaryDeletedMessage,
					title: language.notices.beneficiaryDeletedTitle,
					style: 'success',
					//canClose: true
					canClose: false
				}
			break
			//BeneficiariesEdit.jsx
			case 'beneficiaryUpdated':
				return {
					id: reasonCode,
					icon: 'checkmark-circle-outline',
					message: language.notices.beneficiaryUpdatedMessage,
					title: language.notices.beneficiaryUpdatedTitle,
					style: 'success',
					//canClose: true
					canClose: false
				}
			break
			//ProfileDetails.jsx
			case 'profileUpdated':
				return {
					id: reasonCode,
					icon: 'checkmark-circle-outline',
					message: language.notices.profileUpdatedMessage,
					title: language.notices.profileUpdatedTitle,
					style: 'success',
					//canClose: true
					canClose: false
				}
			break
			//TransferStepThree.jsx
			case 'transferComplete':
				return {
					id: reasonCode,
					icon: 'trophy-outline',
					message: language.notices.transferCompleteMessage,
					title: language.notices.transferCompleteTitle,
					style: 'success',
					//canClose: true
					canClose: false
				}
			break
			default:
				return {
					id: reasonCode,
					icon: 'help-circle-outline',
					message: language.notices.defaultMessage,
					title: language.notices.defaultTitle,
					style: 'warning',
					//canClose: true
					canClose: false
				}
			break
		}
	}
}
