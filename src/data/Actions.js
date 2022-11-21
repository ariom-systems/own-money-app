import * as Keychain from "react-native-keychain"
import { Buffer } from 'buffer'
import Config from 'react-native-config'

import NetInfo from '@react-native-community/netinfo'
import React from 'react'


import { useRecoilState, useSetRecoilState, useRecoilValue, selector } from 'recoil'

export function checkConnectionInitial() {
	//const [ appstate, setAppstate ] = useRecoilState(appstateAtom)
	//const setAppstate = useSetRecoilState(appstateAtom)
	checkConnection()
	setTimeout(() => {
		NetInfo.fetch().then(state => {
			if(state.isInternetReachable !== true) {
				//console.log('isInternetReachable: ' + state.isInternetReachable)
				
			} else {
				//console.log('Connected to ' + Config.BASEURL)
			}
		})
	}, 2500)
	return null
}


export function initialCheckConnection(authDispatch) {
	checkConnection()
	setTimeout(() => {
		NetInfo.fetch().then(state => {
			if(state.isInternetReachable !== true) {
				console.log('isInternetReachable: ' + state.isInternetReachable)
				retryConnection(authDispatch)
			} else {
				console.log('Connected to ' + Config.BASEURL)
			}
		})
	}, 2500)
}


export function checkConnection() {
	NetInfo.fetch().then(state => {
		return state.isInternetReachable
	})
}


export function retryConnection(authDispatch) {
	authDispatch({ type: 'SET_STATUS', payload: { data: 'offline' }})
	const reconnecting = setInterval(() => {
		NetInfo.fetch().then(state => {
			if(state.isInternetReachable === true) {
				authDispatch({ type: 'CLEAR_STATUS' })
				clearInterval(reconnecting)
			} else {
				console.log('network connection issue')
			}
		})
	}, 30000)
}


/**
 * Send an request to the remote server to initiate a password reset procedure. 
 * 
 * @category Auth
 * 
 * @param {string} email		
 * 
 * @returns {(JSON|String)}
 */
export const requestPasswordReset = async (email) => {
	const response = await fetch(Config.BASEURL + '/forgotpassword', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: encodeURI(`email=${email}&context=mobile`)
	})
	if(response.ok) {
		return response.json()
	} else {
		return response.text()
	}
}


/**
 * Encrypt and write a fragment of sensitive data to the iOS Keychain/Android Keystore. 
 * 		
 * @category Auth
 * 
 * @param {string} type			Identifier. Allows multiple fragments of data to be stored under different names, e.g 'Token', 'Pin'
 * @param {string} user			Username. Almost always the users email address
 * @param {string} pass			Password. Used as a payload store for passwords, encrypted JWT tokens, pin numbers, etc.
 * 
 * @returns {Object}
 */
export const keychainSave = async (type, user, pass) => {
	await Keychain.setInternetCredentials(type, user, pass)
	try {
		// Retrieve the credentials
		const credentials = await Keychain.getInternetCredentials(type)
		if (credentials) {
			return credentials
		}
	} catch (error) {
		console.log('keychain save returned an error: ' + error)
	}
}


/**
 * Decrypt and read a fragment of sensitive data to the iOS Keychain/Android Keystore. 
 * 		
 * @category Auth
 * 
 * @param {string} type			Identifier. Selects the fragment to be decrypted and retrieved, e.g 'Token', 'Pin'
 * 
 * @returns {Object}
 */
export const keychainLoad = async (type) => {
	try {
		const credentials = await Keychain.getInternetCredentials(type)
		if (credentials) {
			return credentials
		}
	} catch (error) {
		console.log('keychain load returned an error: ' + error)
	}
}


/**
 * Deletes a fragment of sensitive data to the iOS Keychain/Android Keystore. 
 * 		
 * @category Auth
 * 
 * @param {string} type			Identifier. Selects the fragment to be deleted, e.g 'Token', 'Pin'
 * 
 * @returns {Boolean}
 */
export const keychainReset = async (type) => {
	try {
		const resetResult = await Keychain.resetInternetCredentials(type)
		if(resetResult) {
			return resetResult
		}
	} catch (error) {
		console.log('keychain reset returned an error: ' + error)
	}
}

/**
 * Reads in an encoded JWT token and processes it into a JSON object. 
 * 		
 * @category Auth
 * 
 * @param {string} token		JSON Web Token.
 * 
 * @returns {JSON}
 */
export const parseToken = (token) => {
	var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


/**
 * Builds the url path, header, and body of a Fetch request
 * 		
 * @category Auth
 * 
 * @param {string} uid			User Id. 
 * @param {string} token		JSON Web Token for authentication.
 * @param {string} endpoint		API resource such as 'beneficiaries', 'transactions', or 'users'
 * @param {string} action		Action to perform such as 'view', 'edit', 'delete', 'add', 'count', or 'list'
 * @param {string} method		HTTP request method. Requests accepted by the server: GET, POST, PUT, and DELETE
 * @param {array?} args			Additional items required for certain requests (e.g 'id', 'from', 'count', or 'body')
 * 
 * @returns {Object|boolean}	Returns an object on success, false on error
 */
export const buildDataPath = (endpoint, uid, action, args = []) => {
	let path = ''
	switch(endpoint) {
		case 'users':
			path = `${endpoint}/${action}`
			switch(action) {
				case 'view':
				case 'edit':
					path = path + `/${uid}`
				break
				default:
					return false
				break
			}
		break
		case 'meta':
			path = `${endpoint}` //this 'endpoint' is only "meta"
			//while this 'endpoint' is an API resource (e.g 'users')
			if(args['endpoint'] !== undefined) {
				path = path + `/${args['endpoint']}/${uid}/${action}`
			}
		break
		case 'globals':
		case 'query':
			path = `${endpoint}/${action}`
		break
		default:
			path = `${endpoint}/${uid}/${action}`
			if(args['id'] !== undefined) { path = path + `/${args['id']}` }
			if(action == 'list') {
				if(args['from'] !== undefined) { path = path + `/${args['from']}` } //TODO: do these need a fail condition?
				if(args['count'] !== undefined) { path = path + `/${args['count']}` } //TODO: do these need a fail condition?
			}
		break
	}
	return path
}

/**
 * Read in an array to sort through and a key value to sort by. 
 * 		
 * @category Data
 * 
 * @param {array}      	[input]		The array to iterate through.
 * @param {string}		[key]		A key value to compare each array item against.
 * 
 * @returns  {array}
 */
export function sortByParam(input, key) {
	input = input.sort((a, b) => {
		if(a[key] < b[key]) return -1
		if(a[key] > b[key]) return 1
		return 0
	})
	return input
}


/**
 * Read an array of strings and return a combined string of each words first letter. 
 * 		
 * @category Data
 * 
 * @param {array}      [input]		The array to iterate through.
 * 
 * @returns  {array}
 */
export function iterateInitials(input) {
	let output = []
	input.forEach(function(item) {
		const fullString = [item.firstname, item.lastname].join(' ')
		const matches = fullString.match(/\b(\w)/g)
		item["initials"] = matches.join('')
		output.push(item)
	})
	return output
}


/**
 * Returns a combined string using an input arrays firstname and lastname
 * 		
 * @category Data
 * 
 * @param {array}      [input]		The array to iterate through.
 * 
 * @returns  {array}
 */
export function iterateFullName(input) {
	let output = []
	input.forEach(function(item) {
		item["fullname"] = item.firstname + " " + item.lastname
		output.push(item)
	})
	return output
}


/**
 * Splits SQL Datetimes into Date and Times
 * 		
 * @category Data
 * 
 * @param {array}		[input]		The array to iterate through.
 * @param {string}		[key]		Field/column name.
 * @param {string}		[pre]		A name to prepend the date and time properties with to avoid collisions when
 * 									using multiple datetimes in the same dataset
 * 
 * @returns  {array}
 */
 export function iterateDatesTimes(input, key, prefix) {
	let output = []
	input.forEach(function(item) {
		let datetime = item[key].split(' ')
		item[prefix + "_date"] = datetime[0]
		item[prefix + "_time"] = datetime[1]
		output.push(item)
	})
	return output
}

/**
 * Iterates through an array and groups objects together by a spaecified parameter. Used with 
 * formatting data for SectionList components.
 * 		
 * @category Data
 * 
 * @param {array}		[input]			The array to iterate through.
 * @param {string}		[key]			Object property to group objects by.
 * 
 * @returns  {array}
 */
export function groupArrayObjects(input, key, delimeter = ' ', part = 0) {
	const groups = input.reduce((groups, item) => {
		//const header = item[key].split(delimeter)[part]
		const header = item[key]
		if(!groups[header]) {
			groups[header] = []
		}
		groups[header].push(item)
		return groups
	}, {})
	const groupArrays = Object.keys(groups).map((header) => {
		return {
			header,
			data: groups[header]
		}
	})
	return groupArrays
}


/**
 * Because console.log is too hard to type. Also because nested objects are reduced to [Object object] and
 * thats annoying
 * 		
 * @category Data
 * 
 * @param {array}      [input]		The thing to log.
 * 
 * @returns  {void}
 */
export function log($input) {
	console.log(JSON.stringify($input, null, 4))
}


export function getRemainingLoginTime(expiry) {
	const timeNow = Math.floor(Date.now()/1000)
	const untilExpire = expiry - timeNow
	return untilExpire
}

export function formatCurrency(input, countryCode, currency) {
	const intlObj = new Intl.NumberFormat(countryCode, { style: 'currency', currency: currency})
	let rawNumberObj
	if(typeof input !== 'undefined') {
		let rawInput = null
		if(typeof input === 'string') {
			rawInput = Number(input.replace(/[^0-9\.-]+/g, ""))
		} else {
			rawInput = Number(input)
		}
		rawNumberObj = intlObj.formatToParts(rawInput)
	} else {
		rawNumberObj = intlObj.formatToParts("0.00")
	}
	let amountObj = { symbol: '', value: []}
	rawNumberObj.map(({type, value}) => {
		switch(type) {
			case 'currency': amountObj.symbol = value; break
			default: amountObj.value.push(value); break
		}
	})
	amountObj.value = amountObj.value.reduce((string, part) => string + part)
	amountObj.full = amountObj.symbol + amountObj.value
	return amountObj
}


export function formatFloat(input) {
	let newInput = input.toString().replaceAll(',', '')
	return newInput
}

export function valueIsBetween(input, conditions) {
	let lowerLimit, upperLimit
	if(typeof conditions.min !== 'undefined') { lowerLimit = Number(conditions.min) } else { lowerLimit = 0 }
	if(typeof conditions.max !== 'undefined') { upperLimit = Number(conditions.max) } else { upperLimit = Number.MAX_SAFE_INTEGER }
	if( Number(input) >= lowerLimit &&  Number(input) <= upperLimit ) { return true } else { return false }
}