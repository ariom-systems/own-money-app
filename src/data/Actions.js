import * as Keychain from "react-native-keychain"
import { Buffer } from 'buffer'
import { cloneDeep } from 'lodash'

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
 * Deletes a fragment of sensitive data from the iOS Keychain/Android Keystore. 
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
 * Check for the presense of a particular data value in the iOS Keychain/Android Keystore. 
 * 		
 * @category Auth
 * 
 * @param {string} key			Identifier. Selects the fragment to be deleted, e.g 'Token', 'Pin'
 * 
 * @returns {Boolean}
 */
export const keychainCheck = async (key) => {
	try {
		const checkResult = await Keychain.hasInternetCredentials(key)
		return checkResult
	} catch (error) {
		console.log('keychain check returned an error: ' + error)
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
 * SectionList components with external key/value array data. Updated January 2023 to account for
 * i18n string handling for labels and headings.
 * 
 * @category Data
 * 
 * @param {object}			[template]		Structure for the data to fit into.
 * @param {object|array}	[inputData]		Data to map into the template.
 * @param {object}			[labels]		A collection of translated label to map into the template
 * @param {object}			[headings]		A collection of translated headings to map into the template
 * 
 * @returns {object|array}
 */
export function mapSectionDataFromTemplate(template, inputData, labels, headings) {
	//make an unattached copy of the template
	let newTemplate = cloneDeep(template)
	//check if inputData is a valid object
	if (Object.keys(inputData).length !== 0) {
		//iterate through the blank template and map the data values over the top of it. first by section
		let mappedTemplate = newTemplate.map((section, index) => {
			let output = { title: "", data: {} }, title = section.title, id = section.id, renderItem = section.renderItem
			//then by individual item
			let mappedSection = section.data.map((item, index2) => {
				//loop through the data, extracting the property name and value
				if(item.hasOwnProperty("data")) {
					let data = item.data
					let mappedSubSection = data.map((subitem, index3) => {
						let subLabelKey = Object.keys(labels).find(subkey => subkey == subitem.key)
						subitem.label = labels[subLabelKey] ?? ""
						for (const [subkey, subvalue] of Object.entries(inputData)) {
							//match the data property name to the template property name and copy the value.
							if (subkey === subitem.key) { subitem.value = subvalue }
						}
						return subitem
					})
					item.data = mappedSubSection
				} else {
					let labelKey = Object.keys(labels).find(key => key == item.key)
					item.label = labels[labelKey] ?? ""
					for (const [key, value] of Object.entries(inputData)) {
						//match the data property name to the template property name and copy the value.
						if (key === item.key) { item.value = value }
					}
				}
				return item
			})
			let headingKey = Object.keys(headings).find(key => key == title.key), obj = {}
			output.title = headings[headingKey]
			output.data = mappedSection.filter(mappedItem => mappedItem.value != "0000-00-00 00:00:00")
			output.raw = inputData
			if (id) { output.id = id }
			if (renderItem) { output.renderItem = renderItem }
			return output
		})
		return mappedTemplate
	} else {
		//if the data isn't valid, return a blank template
		return newTemplate
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
export function findMatchingCriteriaAndModify(input, ruleset, secondary = null) {
	let output = 0
	
	if(secondary != null) { output = Number(secondary) }
	ruleset.find((element, index) => {
		let { min = 0, max = Number.MAX_SAFE_INTEGER } = element.conditions
		if (input) {
			if (Number(input) >= Number(min) && Number(input) <= Number(max)) {
				switch (element.function) {
					case 'add':
						output = (Number(secondary) + Number(element.value)).toFixed(2)
					break
					case 'subtract':
						output = (Number(secondary) - Number(element.value)).toFixed(2)
					break
					case 'set':
						output = Number(element.value).toFixed(2)
					break
					default:
						output = Number(secondary).toFixed(2)
					break
				}
			}
		}
	})
	return output
}


/**
 * Merges an array of functions into a 'config' array. Solely used for adding 'action' callback to a Toolbar component
 * config array.
 * 
 * @category Data
 * 
 * @param {array}		[config]		The 'config' array to merge into.
 * @param {array}		[actions]		A set of actions to add to the config
 * 
 * @returns {array}
 * 
 */
export function mapActionsToConfig(config, actions) {
	const newConfig = config.map((element, index) => {
		if (actions[index] != null) {
			element['action'] = actions[index]
		}
		return element
	})
	return newConfig
}


/**
 * Merges an array of object properties into a 'config' array. Solely used for adding dynamic properties to a Toolbar component
 * config array.
 * 
 * @category Data
 * 
 * @param {array}		[config]		The 'config' array to merge into.
 * @param {array}		[properties]	A set of object properties to add to the config
 * 
 * @returns {array}
 * 
 */
export function mapPropertiesToConfig(config, properties) {
	const newConfig = config.map((element, index) => {
		if (properties[index] != null) {
			let obj = properties[index]
			return {...element, ...obj}
		} else {
			return element
		}
	})
	return newConfig
}


/**
 * Given an input string with dot notation, return the value of an object property using the input as a path. Used to forward
 * 'path' to traverse for language objects. A convoluted workaround for updating language strings in deeply nested React
 * components that are shared across multiple parts of the app (e.g. <Toolbar />). Used where the component need to remain
 * independant of the content it is displaying.
 * 
 * @category Data
 * 
 * @param {object}		[obj]		The object to traverse
 * @param {string} 		[path] 		Path of object properties to traverse through (e.g 'language.dashboard.ui.button' will 
 * 									get a value located in language: { dashboard: { ui: { button: "value"}}})
 * 
 * @returns {string}
 */
export function traverseObjectByPath(obj, path, def = null) {
	let stringToPath = (path) => {
		if(typeof path !== 'string') return path
		let output = []
		path.split('.').forEach((item, index) => {
			item.split(/\[([^}]+)\]/g).forEach((key) =>{
				if(key.length > 0) {
					output.push(key)
				}
			})
		})
		return output
	}
	path = stringToPath(path)
	let current = obj
	for(let x = 0; x < path.length; x++) {
		if(!current[path[x]]) return def
		current = current[path[x]]
	}
	return current
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
	amountObj.long = amountObj.symbol + amountObj.value + " " + currency
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
	let output = cloneDeep(input)
	const localiseFormats = template
	for (const property in output) {
		if (property in localiseFormats) {
			let rule = localiseFormats[property], value = output[property], newValue
			switch (rule.type) {
				case 'currency':
					newValue = formatCurrency(value, rule.options[0], rule.options[1]).full
					output[property] = newValue + ' ' + rule.options[1]
					break
				case 'date':
					if (value != '0000-00-00 00:00:00') {
						let newValue = new Date(Date.parse(value.replace(' ', 'T'))), tmpLang = lang
						if (rule.options.dateStyle == 'short') { tmpLang = 'en-GB' }
						output[property] = newValue.toLocaleString(tmpLang, rule.options)
					}
					break
			}
		}
	}
	return output
}


/**
 * Return a formated string from a date Object mimicking PHP's date() functionality
 *
 * @author Gospel Chinyereugo <https://gist.github.com/Ebugo/10b5c1a87b2dac685603dc5af7168782>
 * 
 * @param {string} format "Y-m-d H:i:s" or similar PHP-style date format string
 * @param {* | null} date Date Object, Datestring, or milliseconds 
 *
 */
export function dateFormat(format, date) {
	if (!date || date === "") {
		date = new Date()
	} else if (typeof date !== 'object') {
		// attempt to convert string/number to date object
		try {
			if (typeof date === 'number') date = new Date(date)
			else date = new Date(date.replace(/-/g, "/"))
		} catch (e) {
			date = new Date()
		}
	}

	let string = '',
		mo = date.getMonth(), // month (0-11)
		m1 = mo + 1, // month (1-12)
		dow = date.getDay(), // day of week (0-6)
		d = date.getDate(), // day of the month (1-31)
		y = date.getFullYear(), // 1999 or 2003
		h = date.getHours(), // hour (0-23)
		mi = date.getMinutes(), // minute (0-59)
		s = date.getSeconds() // seconds (0-59)

	for (let i of format.match(/(\\)*./g)) {
		switch (i) {
			case 'j': // Day of the month without leading zeros  (1 to 31)
				string += d
				break

			case 'd': // Day of the month, 2 digits with leading zeros (01 to 31)
				string += (d < 10) ? "0" + d : d
				break

			case 'l': // (lowercase 'L') A full textual representation of the day of the week
				var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
				string += days[dow]
				break

			case 'w': // Numeric representation of the day of the week (0=Sunday,1=Monday,...6=Saturday)
				string += dow
				break

			case 'D': // A textual representation of a day, three letters
				var days = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"]
				string += days[dow]
				break

			case 'm': // Numeric representation of a month, with leading zeros (01 to 12)
				string += (m1 < 10) ? "0" + m1 : m1
				break

			case 'n': // Numeric representation of a month, without leading zeros (1 to 12)
				string += m1
				break

			case 'F': // A full textual representation of a month, such as January or March 
				var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
				string += months[mo]
				break

			case 'M': // A short textual representation of a month, three letters (Jan - Dec)
				var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
				string += months[mo]
				break

			case 'Y': // A full numeric representation of a year, 4 digits (1999 OR 2003)	
				string += y
				break

			case 'y': // A two digit representation of a year (99 OR 03)
				string += y.toString().slice(-2)
				break

			case 'H': // 24-hour format of an hour with leading zeros (00 to 23)
				string += (h < 10) ? "0" + h : h
				break

			case 'g': // 12-hour format of an hour without leading zeros (1 to 12)
				var hour = (h === 0) ? 12 : h
				string += (hour > 12) ? hour - 12 : hour
				break

			case 'h': // 12-hour format of an hour with leading zeros (01 to 12)
				var hour = (h === 0) ? 12 : h
				hour = (hour > 12) ? hour - 12 : hour
				string += (hour < 10) ? "0" + hour : hour
				break

			case 'a': // Lowercase Ante meridiem and Post meridiem (am or pm)
				string += (h < 12) ? "am" : "pm"
				break

			case 'i': // Minutes with leading zeros (00 to 59)
				string += (mi < 10) ? "0" + mi : mi
				break

			case 's': // Seconds, with leading zeros (00 to 59)
				string += (s < 10) ? "0" + s : s
				break

			case 'c': // ISO 8601 date (eg: 2012-11-20T18:05:54.944Z)
				string += date.toISOString()
				break

			default:
				if (i.startsWith("\\")) i = i.substr(1)
				string += i
		}
	}
	return string
}