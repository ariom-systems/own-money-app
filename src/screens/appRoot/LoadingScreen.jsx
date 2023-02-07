import React, { useContext } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../components/common/AppSafeArea'
import { Heading, HStack, Spinner, Text, VStack } from 'native-base'
import LoadingSpinner from '../../components/common/LoadingSpinner'

//data
import { AuthContext } from '../../data/Context'
import { api, beneficiaryColumns } from '../../config'
import Config from 'react-native-config'
import * as Hooks from '../../data/Hooks'
import { keychainReset, buildDataPath, sortByParam, addExtraRecordData, stringifyArray, dateFormat } from '../../data/Actions'
import { getNotice } from '../../data/handlers/Status'
import { useRecoilValue, useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil'
import { userState } from '../../data/recoil/user'
import { beneficiaryList } from '../../data/recoil/beneficiaries'
import { transactionList } from '../../data/recoil/transactions'
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
	const resetNotices = useResetRecoilState(noticeState)
	const lang = useRecoilValue(langState)

	Hooks.useEffectOnce(() => {
		console.log('--starting preflight check--')
		console.log('authenticated:', auth.token !== 'undefined' ? '🔑 yes' : '🔒 no')
		resetNotices()
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		const verifyLoggedIn = new Promise((resolve, reject) => {
			api.get(Config.BASEURL + '/checktoken')
				.then(response => { response.data.result == 'success' ? resolve() : reject(response.data.result) })
		})
		
		const loadUser = new Promise((resolve, reject) => {
			api.get(buildDataPath('users', auth.uid, 'view'))
				.then(response => {
					//fetch userdata from API. also need to convert $logins from string to an array
					let [logins, daily_limit, newObj] = [JSON.parse(response.data.logins), JSON.parse(response.data.daily_limit), {}]
					newObj = {...response.data, daily_limit_max: daily_limit.max, daily_limit_remaining: daily_limit.remaining, logins: logins, uid: auth.uid }
					
					let app_flags = JSON.parse(response.data.app_flags)
					if (app_flags !== null) { newObj.app_flags = app_flags }
					
					delete newObj.daily_limit
					setUser((initial) => ({...initial, ...newObj}))
					authDispatch({ type: 'SET_LANG', payload: { lang: lang }})
					
					if(app_flags === null) {
						console.log("New user found!")
						setNotices((prev) => ([...prev, getNotice('verifyIdentity', lang)]))
						setNotices((prev) => ([...prev, getNotice('redirectToTermsConditions', lang)]))
						resolve('🔒 Redirect To Terms')
					} else {
						if(!app_flags.hasOwnProperty('idUploaded')) {
							setNotices((prev) => ([...prev, getNotice('verifyIdentity', lang)]))
						}
					}
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
			const today = new Date(Date.parse(new Date()))
			let time = encodeURIComponent(dateFormat('Y-m-d H:i:s', today))
			api.get(buildDataPath('transactions', auth.uid, 'list', { from: time }))
				.then(response => {
					let data = response.data, newData
					newData = addExtraRecordData(data)
					setTransactions(newData)
					resolve('✅ Loaded Recent Transactions 💰')
				})
				.catch(error => { reject('🚫💰 ' + error) })
		})

		const loadGlobals = new Promise((resolve, reject) => {
			api.get(buildDataPath('globals', null, 'branch'))
				.then(response => {
					let [ lastReset, newObj ] = [ response.data[0].lastDailyLimitReset, {} ]
					let date = new Date(Date.parse(lastReset.replace(' ', 'T')))
					let limitReset = Math.floor(date.getTime() / 1000)
					console.log("Limit was last reset at: ", date, limitReset)
					newObj = {...response.data[0], lastDailyLimitReset: limitReset }
					setGlobals((initial) => ({ ...initial, ...newObj }))
					resolve('✅ Loaded Globals 🌏')
				})
				.catch(error => { reject('🚫🌏 ' + error) })
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
					console.log("promise.all error", error)
					handleLogout('server-error')
				})
			})
			.catch(error => {
				handleLogout('session-expired')
			})
		
		return () => {
			
		}
	})

	const handleLogout = async (reason) => {
		const reset = await keychainReset('token') //shutup vscode, await DOES do something here
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