import React, { useContext } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../components/common/AppSafeArea'
import { Heading, HStack, Spinner, Text, VStack } from 'native-base'
import LoadingSpinner from '../../components/common/LoadingSpinner'

//data
import { AuthContext } from '../../data/Context'
import { api, beneficiaryColumns, keychain } from '../../config'
import Config from 'react-native-config'
import * as Hooks from '../../data/Hooks'
import { keychainReset, buildDataPath, sortByParam, addExtraRecordData, stringifyArray, dateFormat } from '../../data/Actions'
import { getNotice } from '../../data/handlers/Status'
import { useRecoilValue, useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil'
import { userState } from '../../data/recoil/user'
import { beneficiaryList } from '../../data/recoil/beneficiaries'
import { transactionList } from '../../data/recoil/transactions'
import { promoAtom } from '../../data/recoil/transfer'
import { globalState, noticeState, langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const LoadingScreen = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = useContext(AuthContext)
	const [user, setUser] = useRecoilState(userState)
	const setGlobals = useSetRecoilState(globalState)
	const setNotices = useSetRecoilState(noticeState)
	const setTransactions = useSetRecoilState(transactionList)
	const setBeneficiaries = useSetRecoilState(beneficiaryList)
	const setPromo = useSetRecoilState(promoAtom)
	const resetNotices = useResetRecoilState(noticeState)
	const lang = useRecoilValue(langState)

	Hooks.useEffectOnce(() => {
		console.group('Preflight Check')
		console.log('--starting preflight check--')

		console.log('authenticated:', auth.token !== 'undefined' ? '🔑 yes' : '🔒 no')
		resetNotices()
		api.setHeader('Authorization', 'Bearer ' + auth.token)

		const verifyLoggedIn = new Promise((resolve, reject) => {
			api.get(Config.BASEURL + '/' + Config.APIVERSION + '/check/token')
				.then(response => {
					if(response.status == 200) {
						resolve()
					} else {
						console.log("status", response.status)
						switch(response.status) {
							case 403:
								reject(response.data)
							break
						}
					}
				})
				.catch(error => {
					console.log(error)
				})
		})
		
		const loadUser = new Promise((resolve, reject) => {
			api.get(buildDataPath('users', auth.uid, 'view'))
				.then(response => {
					//fetch userdata from API. also need to convert $logins from string to an array
					let [logins, daily_limit, newObj] = [JSON.parse(response.data.logins), JSON.parse(response.data.daily_limit), {}]
					newObj = {...response.data, daily_limit_max: daily_limit.max, daily_limit_remaining: daily_limit.remaining, logins: logins, uid: auth.uid }
					
					let app_flags = JSON.parse(response.data.app_flags)
					if (app_flags !== null) { newObj.app_flags = app_flags }
					
					if(newObj.hasOwnProperty('idexpiry')) {
						if (newObj.idexpiry != "") {
							let today = new Date().getTime()
							let expiry = new Date(newObj.idexpiry).getTime()
							if(today > expiry) {
								newObj.preventTransfer = true
								setNotices((prev) => ([...prev, getNotice('idExpired', lang)]))
							}	
						}
					}

					if(newObj.hasOwnProperty('blocked')) {
						if(newObj.blocked == true) {
							console.log("Blocked user found!")
							setNotices((prev) => ([...prev, getNotice('blockedUser', lang)]))
							resolve('💣 Blocked User incoming. Handle with care.')
						}
					}

					delete newObj.daily_limit
					authDispatch({ type: 'SET_LANG', payload: { lang: lang } })
					
					if(app_flags === null) {
						console.log("New user found!")
						setNotices((prev) => ([...prev, getNotice('verifyIdentity', lang)]))
						newObj.preventTransfer = true
						setNotices((prev) => ([...prev, getNotice('redirectToTermsConditions', lang)]))
						setUser((initial) => ({ ...initial, ...newObj }))
						resolve('🔒 Redirect To Terms')
					} else {
						if(!app_flags.hasOwnProperty('idUploaded')) {
							newObj.preventTransfer = true
							setNotices((prev) => ([...prev, getNotice('verifyIdentity', lang)]))
						}
					}
					setUser((initial) => ({ ...initial, ...newObj }))
					resolve('✅ Loaded User Data 👤')
			 	})
				.catch(error => { reject('🚫👤 ' + error) })
		})

		const loadBeneficiaries = new Promise((resolve, reject) => {
			api.post(buildDataPath('beneficiaries', auth.uid, 'list'), stringifyArray(beneficiaryColumns))
				.then(response => {
					let responseData = addExtraRecordData(response.data)
					responseData.sort(sortByParam("initials", "firstname"))
					setBeneficiaries((init) => ([ ...responseData ]))
					resolve('✅ Loaded Beneficiaries 🗃')
				})
				.catch(error => { reject('🚫🗃 ' + error) })
		})

		const loadTransactions = new Promise((resolve, reject) => {
			api.get(buildDataPath('transactions', auth.uid, 'list', { from: 'now' }))
				.then(response => {
					let data = response.data, newData
					newData = addExtraRecordData(data)
					setTransactions(newData)
					resolve('✅ Loaded Recent Transactions 💰')
				})
				.catch(error => { reject('🚫💰 ' + error) })
		})

		const loadGlobals = new Promise((resolve, reject) => {
			const branch = new Promise((branchResolve, branchReject) => {
				api.get(buildDataPath('globals', null, 'branch'))
					.then(response => {
						let [ lastReset, newObj ] = [ response.data[0].lastDailyLimitReset, {} ]
						let date = new Date(Date.parse(lastReset.replace(' ', 'T')))
						let limitReset = Math.floor(date.getTime() / 1000)
						console.log("Limit was last reset at: ", date, limitReset)
						newObj = {...response.data[0], lastDailyLimitReset: limitReset }
						setGlobals((initial) => ({ ...initial, ...newObj }))
						branchResolve(true)
					})
					.catch(error => { branchReject(error) })
			})

			const blocked = new Promise((blockResolve, blockReject) => {
				api.get(buildDataPath('globals', null, 'customer_blocklist'))
					.then(response => {
						blockResolve(true)
					})
					.catch(error => { blockReject(error) })
			})

			const promos = new Promise((promoResolve, promoReject) => {
				api.get(Config.BASEURL + '/' + Config.APIVERSION + '/check/promocodes')
					.then(response => {
						if(typeof response.data == "object") {
							setPromo(response.data)
						}
					})
					.catch(error => { promoReject(error) })
			})

			Promise.all([branch, blocked])
			.then(() => {
				resolve('✅ Loaded Globals 🌏')
			})
			.catch(error => {
				reject('🚫🌏 ' + error)
			})
		})

		verifyLoggedIn
			.then(() => {
				Promise.all([loadGlobals, loadUser, loadBeneficiaries, loadTransactions])
				.then(values => {
					values.forEach(value => {
						console.log(value)
					})
					console.log('finished loading data')
					console.log('--preflight check complete--')
					console.groupEnd()
					return values
				})
				.then(results => {
					if (results.indexOf('🔒 Redirect To Terms') == -1) {
						navigation.navigate('AppDrawer')
					} else {
						navigation.navigate('TermsAndConditions')
					}
				})
				.catch(error => {
					handleLogout('serverError')
				})
			})
			.catch(error => {
				handleLogout('sessionExpired')
			})
		
		return () => { }
	})

	const handleLogout = async (reason) => {
		const reset = await keychainReset(keychain.token) //shutup vscode, await DOES do something here
		if(reset === true) {
			//TODO: update this to use the new Alert system
			authDispatch({ type: 'SET_STATUS', payload: { data: reason }}) //leave this here
			authDispatch({ type: 'LOGOUT'})
		}
	}



	return (
		<AppSafeArea styles={{ w: "100%", h: "100%", alignItems:"center", justifyContent:"center" }}>	
			<LoadingSpinner message={language.loading.title} subtitle={language.loading.subtitle} />
		</AppSafeArea>
	)
}

export default LoadingScreen