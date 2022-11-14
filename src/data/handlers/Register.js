import React from 'react'
import Config from 'react-native-config'
import { Buffer } from 'buffer'
import { VStack } from 'native-base'
import { api } from '../../config'
import { parseToken } from '../Actions'

export default async function RegisterHandler(data) {
	let response = await api.post(Config.BASEURL + '/authenticate', {
		email: data.email,
		pass: data.password
	})
}

export function getRegisterError(reason) {
	// switch(reason) {
	// 	case 'bad-user':
	// 		return 'There seems to be an problem with your email address.'
	// 	break
	// 	case 'password-mismatch':
	// 		return 'The password you entered does not match our records. Please re-enter your password.'
	// 	break
	// 	default:
	// 		return 'We seem to be experiencing a technical issue. Contact OwnMoney staff for further assistance or please try again later.'
	// 	break
	// }
}

/**
 * Send an request to the remote server to initiate a password reset procedure. 
 * 
 * @category Auth
 * 
 * @param {string} email
 * @param {string} password
 * @param {string} password2	Used to confirm the user correctly entered their preferred password
 * @param {number} phone
 * @param {string} referrer		 An email address of an existing user
 * 
 * @returns {(JSON|String)}
 */
 export const pushNewRegistration = async (email, password, password2, phone, referrer) => {
	let url
	if(referrer != undefined) {
		url = `email=${email}&password=${password}&password2=${password2}&phone=${phone}`
	} else {
		url = `email=${email}&password=${password}&password2=${password2}&phone=${phone}&referrer=${referrer}`
	}
	const response = await fetch(Config.BASEURL + '/register', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: encodeURI(url)
	})
	if(response.ok) {
		return response.json()
	} else {
		return response.text()
	}
}