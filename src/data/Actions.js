import * as Keychain from "react-native-keychain"
import { Buffer } from 'buffer'


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
 * Builds the url path of a Fetch request
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
export const buildDataPath = (endpoint, uid, action, args = {}) => {
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
				if(args['to'] !== undefined) { path = path + `/${args['to']}` } //TODO: do these need a fail condition?
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
	const props = arguments

	const dynamicSort = (property) => {
		let sortOrder = 1
		if(property[0] === "-") {
			sortOrder = -1
			property = property.substr(1)
		}
		return function(a, b) {
			let result = (a[property] < b[property] ? -1 : (a[property] > b[property]) ? 1 : 0)
			return result * sortOrder
		}
	}

	return function(obj1, obj2) {
		let i = 0, result = 0, numberOfProperties = props.length
		while(result === 0 && i < numberOfProperties) {
			result = dynamicSort(props[i])(obj1, obj2)
			i++
		}
		return result
	}
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
 * Iterates through an array of transaction or beneficiary records and adds extra record properties using existing
 * record data. Examples include separating datetime strings into dates and times, as well as
 * computing initials from firstname and last name.
 * 
 * @category Data
 * 
 * @param {array}		[input]		An array of objects to iterate through.
 * 
 * @returns {array}
 */
export function addExtraRecordData(input) {
	output = input.map(item => {
		return addObjectExtraData(item)
	})
	return output
}


/**
 * Iterates through the properties of an object and adds extra properties using existing
 * data. Examples include separating datetime strings into dates and times, as well as
 * computing initials from firstname and last name.
 * 
 * @category Data
 * 
 * @param {object}		[input]		An array of objects to iterate through.
 * 
 * @returns {object}
 */
export function addObjectExtraData(input) {
	if(input.hasOwnProperty('created_date')) {
		let datetime = input.created_date
		let [ cr_date, cr_time ] = input.created_date.split(" ")
		input = { ...input, created_date: cr_date, created_time: cr_time, created_datetime: datetime }
	}

	if(input.hasOwnProperty('processed_date')) {
		let datetime = input.processed_date
		let [ pr_date, pr_time ] = input.processed_date.split(" ")
		input = { ...input, processed_date: pr_date, processed_time: pr_time, processed_datetime: datetime }
	}

	if(input.hasOwnProperty('completed_date')) {
		let datetime = input.completed_date
		let [ co_date, co_time ] = input.completed_date.split(" ")
		input = { ...input, completed_date: co_date, completed_time: co_time, completed_datetime: datetime }
	}

	if(input.hasOwnProperty('transfer_amount')) {
		//thanks to https://stackoverflow.com/questions/8976627/how-to-add-two-strings-as-if-they-were-numbers
		input = { ...input, amount_paid: parseFloat(+input.transfer_amount + +input.fee_AUD).toFixed(2) }
	}

	//fullname and initials
	let fullname = [input.firstname, input.lastname].join(' ')
	let match = fullname.match(/\b(\w)/g)
	input = { ...input, fullname: fullname, initials: match.join('') }
	return input
}


/**
 * Iterates through an array of transaction records and groups them by date. Returns an array of dates
 * with a child array of tranactions with that date. Used in formatting tranaction data for list display.
 * 
 * @category Data
 * 
 * @param {array}		[input]		An indexed array of transaction objects loaded straight from a data source.
 * 
 * @returns {array}
 */
export function groupTransactionsByDate(input) {
	const groups = input.reduce((groups, item) => {
		const header = item.created_date
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
 * Maps data from one object to corresponding properties in a template object. Used for populating
 * SectionList components with external key/value array data
 * 
 * @category Data
 * 
 * @param {object}			[data]		The data to transform and map.
 * @param {object|array}	[template]	Structure for the data to fit into.
 * 
 * @returns {object|array}
 */
export function mapSectionDataFromTemplate(data, template) {
	//check if input data is a valid object
	if(Object.keys(data).length !== 0) {
		//map the input data values over the top of the template. first by section
		let mappedTemplate = template.map((section, index) => {
			let obj = {}, title = section.title
			//then by individual item
			let mappedSection = section.data.map((item, index2) => {
				//loop through the data, extracting the property name and value
				for(const [key, value] of Object.entries(data)) {
					//match the data property name to the template property name and copy the value.
					//this should run for every property in the template...
					if(key === item.key) {
						item.value = value
					}
					//ignore everything else and repeat
				}
				return item
			})
			let sectionData = mappedSection.filter(mappedItem => mappedItem.value != "0000-00-00 00:00:00")
			obj.title = title
			obj.data = sectionData
			return obj
		})
		return mappedTemplate
	} else {
		return template
	}
}


/**
 * Iterates over an object, removing properties with date values of "0000-00-00 00:00:00".
 * 
 * @category Data
 * 
 * @param {object}		[input]			Object to iterate over
 * 
 * @returns	{object}
 * 
 */
export function removeEmptyDateEntries(input) {
	output = input.map(obj => {
		for (const property in obj) {
			if (obj[property] == "0000-00-00 00:00:00") {
				delete obj[property]
			}
		}
		return obj
	})
	return output
}


/**
 * Replaces an item within an array at a specified index with a new value. 
 * Used for updating Recoil atoms
 *
 * @category Data
 * 
 * @param {array}		[atom]				The list to update
 * @param {integer}		[indexToReplace]	The position of the item to replace
 * @param {object}		[newItem]			The payload data to replace the item with
 * 
 * @returns {array}
 */
export function atomReplaceItemAtIndex(atom, indexToReplace, newItem) {
	const newAtom = atom.map((item, index) => {
		if(index == indexToReplace) {
			let quark = {}
			Object.assign(quark, item, newItem)
			return quark
		}
		return item
	})
	return newAtom
}


/**
 * Removes an item within an array at a specified. 
 * Used for updating Recoil atoms
 * 
 * @category Data
 * 
 * @param {array} 		[atom]				The list to remove the item from
 * @param {int} 		[indexToRemove]		The position of the item to remove
 * 
 * @returns {array}
 */
export function atomRemoveItemAtIndex(atom, indexToRemove) {
	let newAtom = [...atom]
	//don't combined the lines below! they produce different results otherwise.
	//splice on its own performs the removal, whereas receiveing a value from splice returns just the removed item
	newAtom.splice(indexToRemove, 1)
	return newAtom
}


/**
 * Adds an item to an array and reorders/reindexes the array according to a specified key
 * 
 * @category Data
 * 
 * @param {array}		[atom]				The list to add the item to
 * @param {object}		[newItem]			The payload data to add
 * @param {string}		[reorderKey]		The name of the object property to reorder the list by
 * 
 * @returns {array}
 */
export function atomAddNewItem(atom, newItem, reorderKey) {
	let newData = [...atom]
	newData.push(newItem)
	newData.sort(sortByParam(reorderKey))
	return newData
}


/**
 * Formats a flat array into an object with named properties and null values, then JSON stringifies 
 * it. An over-engineered solution to a problem that should be resolved in other ways.
 * 
 * @category Data
 * 
 * @param {array}		[input]				The array to transform.
 * 
 * @returns {object}
 */
export function stringifyArray(input) {
	const output = input.reduce((accumulator, value) => {
		return {...accumulator, [value]: ''}
	}, {})
	return JSON.stringify(output)
}


/**
 * Takes in an input value and a set of modifiers and performs a series of comparisons
 * against each modifier. Each modifier consist of a range (min and max value), an operation to perform, 
 * and optionally a secondary value to apply to the input value.
 * 
 * The purpose of this function allows the upstream API to change the rules and values of exchange rates and
 * fees on the server without having to update the mobile app every time a change is needed. The app itself
 * will store no data regarding fees and exchange rates.
 * 
 * @category Data
 * 
 * @param {string|int}		[input]			The initial input value to modify
 * @param {object}			[modifier]		A modifier object that may contain min, max, function, and value properties
 * @param {string|int}		[secondary]		(Optional) An additional input to use in the calculation of the output value
 * 
 * @returns {string|int}		
 *
 */
export function modifyTransferVariables(input, ruleset, secondary = null) {
	let modifiedValue = 0
	if(secondary != null) { modifiedValue = Number(secondary) }
	ruleset.filter((element, index) => {
		let condition = element.conditions, upperLimit = Number.MAX_SAFE_INTEGER, lowerLimit = 0
		if('max' in condition) { upperLimit = condition.max }
		if('min' in condition) { lowerLimit = condition.min }
		if(!input == "" || !Number(input) == 0 || input == "0") {
			if(Number(input) > lowerLimit && Number(input) < upperLimit) {
				switch(element.function) {
					case 'add':
						modifiedValue = Number(secondary) + Number(element.value)
					break;
					case 'subtract':
						modifiedValue = Number(secondary) - Number(element.value)
					break;
					case 'set':
						modifiedValue = element.value
					break;
					case 'passthrough': 
						modifiedValue = secondary
					break;
				}
			}
		}
	})
	return modifiedValue
}


/**
 * Formats an input number to a localised currency as specified by a locale. This function is
 * a little more complicated than we'd like however the limiting factor is this app is built
 * on React Native 0.70.4 and uses the Hermes engine which (as of November 2022) has no support
 * for ECMA-402 (Intl). Gotta make do with what is available to us.
 * 
 * @category i18n
 * 
 * @param {string}		[input]			The numerical value to convert into a localised currency.
 * @param {string}		[currencyCode]	A string representation of the country code/region to convert to. e.g "en-AU" or "th-TH"
 * @param {string}		[currency]		The three letter currency code. e.g "AUD", "THB"
 * 
 * @returns {object}
*/
export function formatCurrency(input, countryCode, currency) {
	const intlObj = new Intl.NumberFormat(countryCode, {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 4
	})
	let rawNumberObj
	if (typeof input !== 'undefined') {
		let rawInput = null
		if (typeof input === 'string') {
			rawInput = Number(input.replace(/[^0-9\.-]+/g, ""))
		} else {
			rawInput = Number(input)
		}
		rawNumberObj = intlObj.formatToParts(toFixedWithoutRounding(rawInput))
	} else {
		rawNumberObj = intlObj.formatToParts("0.00")
	}
	let amountObj = { symbol: '', value: [] }
	rawNumberObj.map(({ type, value }) => {
		switch (type) {
			case 'currency': amountObj.symbol = value.replace('A', ''); break
			default: amountObj.value.push(value); break
		}
	})
	amountObj.value = amountObj.value.reduce((string, part) => string + part)
	amountObj.full = amountObj.symbol + amountObj.value
	return amountObj
}


/**
 * Polyfill to bypass Intl.NumberFormat automatically rounding numbers up, which is not ideal
 * considering we're primarily dealing with currency to 2 decimal places and we live in an
 * age of electronic transfers NOT cash and coins.
 * 
 * @category i18n
 * 
 * @param {string|int}		[input]		The input value to format
 * 
 * @returns {int|float}
 */
function toFixedWithoutRounding(input) {
	if (!isNaN(input)) {
		return parseFloat(input.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
	} else {
		return 0
	}
}


/**
 * Formats values of an input object to their 'localized' variants, using a template object stored in 
 * config, and the current user interface lang. Used for converting dates, numbers, and currency to 
 * local readable formats.
 * 
 * @category i18n
 * 
 * @param {object}		[input]				Input object to iterate over each property and modify values
 * @param {object}		[template]			Template object of property names, action names, and formating options
 * @param {string}		[lang]				The current UI language (either 'en-AU' or 'th-TH')
 * 
 * @returns {object}
 *  
 */
export function localiseObjectData(input, template, lang) {
	const localiseFormats = template
	for (const property in input) {
		if (property in localiseFormats) {
			let rule = localiseFormats[property], value = input[property], newValue
			switch (rule.type) {
				case 'currency':
					newValue = formatCurrency(value, rule.options[0], rule.options[1]).full
					input[property] = newValue + ' ' + rule.options[1]
					break
				case 'date':
					if (value != '0000-00-00 00:00:00') {
						let newValue = new Date(Date.parse(value.replace(' ', 'T')))
						input[property] = newValue.toLocaleString(lang, rule.options)
					}
					break
			}
		}
	}
}