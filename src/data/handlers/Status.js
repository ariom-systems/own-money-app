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
			case 'debug':
				return {
					id: reasonCode,
					icon: 'bug-outline',
					message: language.notices.message.debug,
					title: language.notices.title.debug,
					style: 'info',
					//canClose: true
					canClose: false
				}
			break
			case 'serverError':
				return {
					id: reasonCode,
					icon: 'flag',
					message: language.notices.message.serverError,
					title: language.notices.title.serverError,
					style: 'warning',
					//canClose: true
					canClose: false
				}
			break
			case 'offline':
				return {
					id: reasonCode,
					icon: 'cloud-offline-outline',
					message: language.notices.message.offline,
					title: language.notices.title.offline,
					style: 'warning',
					canClose: false
				}
			break
			//App.js
			case 'sessionExpired':
				return {
					id: reasonCode,
					icon: 'timer',
					message: language.notices.message.sessionExpired,
					title: language.notices.title.sessionExpired,
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
					message: language.notices.message.noEmail,
					title: language.notices.title.noEmail,
					style: 'error',
					canClose: false
				}
			break
			case 'noPassword':
				return {
					id: reasonCode,
					icon: 'alert-circle-outline',
					message: language.notices.message.noPasswordConfirm,
					title: language.notices.title.noPasswordConfirm,
					style: 'error',
					canClose: false
				}
			break	
			case 'badUser':
				return {
					id: reasonCode,
					icon: 'alert-circle-outline',
					message: language.notices.message.badUser,
					title: language.notices.title.badUser,
					style: 'error',
					canClose: false
				}
			break
			//LoginScreen.jsx
			case 'passwordMismatch':
				return {
					id: reasonCode,
					icon: 'alert-circle-outline',
					message: language.notices.message.passwordMismatch,
					title: language.notices.title.passwordMismatch,
					style: 'error',
					canClose: false
				}
			break
			case 'verifyIdentity':
				return {
					id: reasonCode,
					icon: 'shield-outline',
					message: language.notices.message.statusVerifyIdentity,
					title: language.notices.title.statusVerifyIdentity,
					style: 'info',
					canClose: false,
					bannerAction: {
						label: language.notices.ui.statusVerifyIdentityButton,
						fn: () => Navigation.navigate('Your Profile', { screen: 'ProfileDetails' })
					}
				}
			break
			case 'statusInactive':
				return {
					id: reasonCode,
					icon: 'alert-circle-outline',
					message: language.notices.message.accountInactive,
					title: language.notices.title.accountInactive,
					style: 'info',
					canClose: false
				}
			break
			case 'registerIncomplete':
				return {
					id: reasonCode,
					icon: '',
					iconType: '',
					message: language.notices.message.registerIncomplete,
					title: language.notices.title.registerIncomplete,
					style: 'info',
					//canClose: true
					canClose: false
				}
			break
			case 'redirectToTermsConditions':
				return {
					id: 'termsAndConditions',
					icon: 'receipt-outline',
					message: language.notices.message.redirectToTermsConditions,
					title: language.notices.title.redirectToTermsConditions,
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
					message: language.notices.message.noPasswordConfirm,
					title: language.notices.title.noPasswordConfirm,
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
					message: language.notices.message.noPhone,
					title: language.notices.title.noPhone,
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
					message: language.notices.message.invalidReferrer,
					title: language.notices.title.invalidReferrer,
					style: 'warning',
					//canClose: true
					canClose: false
				}
			break
			case 'registerComplete':
				return {
					id: reasonCode,
					icon: 'information-circle-outline',
					message: language.notices.message.accountRegistered,
					title: language.notices.title.accountRegistered,
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
					message: language.notices.message.resetRequested,
					title: language.notices.title.resetRequested,
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
					message: language.notices.message.logout,
					title: language.notices.title.logout,
					style: 'info',
					//canClose: true
					canClose: false
				}
			break
			case 'pinReset':
				return {
					id: reasonCode,
					icon: 'keypad-outline',
					message: language.notices.message.pinReset,
					title: language.notices.title.pinReset,
					style: 'info',
					canClose: true
				}
			break
			case 'passwordReset':
				return {
					id: reasonCode,
					icon: 'key-outline',
					message: language.notices.message.passwordReset,
					title: language.notices.title.passwordReset,
					style: 'info',
					canClose: true
				}
			break
			case 'blockedUser':
				return {
					id: reasonCode,
					icon: 'hand-left-outline',
					message: language.notices.message.blockedUser,
					title: language.notices.title.blockedUser,
					style: 'warning'
				}
			break
			case 'idExpired':
				return {
					id: reasonCode,
					icon: 'hand-left-outline',
					message: language.notices.message.idExpired,
					title: language.notices.title.idExpired,
					style: 'warning'
				}
			break
			//BeneficiariesAdd.jsx
			case 'beneficiarySaved':
				return {
					id: reasonCode,
					icon: 'checkmark-circle-outline',
					message: language.notices.message.beneficiarySaved,
					title: language.notices.title.beneficiarySaved,
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
					message: language.notices.message.beneficiaryDeleted,
					title: language.notices.title.beneficiaryDeleted,
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
					message: language.notices.message.beneficiaryUpdated,
					title: language.notices.title.beneficiaryUpdated,
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
					message: language.notices.message.profileUpdated,
					title: language.notices.title.profileUpdated,
					style: 'success',
					canClose: true
				}
			break
			//TransferStepFour.jsx
			case 'transferRequested':
				return {
					id: reasonCode,
					icon: 'trophy-outline',
					message: language.notices.message.transferRequested,
					title: language.notices.title.transferRequested,
					style: 'success',
					canClose: true
				}
			break
			default:
				return {
					id: reasonCode,
					icon: 'help-circle-outline',
					message: language.notices.message.default,
					title: language.notices.title.default,
					style: 'warning',
					//canClose: true
					canClose: false
				}
			break
		}
	}
}
