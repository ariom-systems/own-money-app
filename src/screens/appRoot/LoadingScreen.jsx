import React from 'react'

//components
import { ImageBackground } from 'react-native'
import { Center, Heading, HStack, Spinner, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import { useNavigation } from '@react-navigation/native'

//data
import { AuthContext } from '../../data/Context'
import { api, beneficiaryColumns } from '../../config'
import Config from 'react-native-config'
import * as Hooks from '../../data/Hooks'
import { keychainReset, buildDataPath, sortByParam, addExtraRecordData, stringifyArray, removeEmptyDateEntries } from '../../data/Actions'
import { getNotice } from '../../data/handlers/Status'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { userState } from '../../data/recoil/user'
import { beneficiaryList } from '../../data/recoil/beneficiaries'
import { transactionList } from '../../data/recoil/transactions'
import { globalState, noticeState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'

const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const LoadingScreen = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = React.useContext(AuthContext)
	const [user, setUser] = useRecoilState(userState)
	const setGlobals = useSetRecoilState(globalState)
	const setNotices = useSetRecoilState(noticeState)
	const setTransactions = useSetRecoilState(transactionList)
	const setBeneficiaries = useSetRecoilState(beneficiaryList)

	Hooks.useEffectOnce(() => {
		console.log('--statring preflight check--')
		console.log('authenticated:', auth.token !== 'undefined' ? 'yes' : 'no')
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
					newObj = {...response.data, daily_limit_max: daily_limit.max, daily_limit_remaining: daily_limit.remaining, logins: logins }
					
					let app_flags = JSON.parse(response.data.app_flags)
					if (app_flags !== null) { newObj.app_flags = app_flags }
					
					delete newObj.daily_limit
					setUser((initial) => ({...initial, ...newObj}))
					authDispatch({ type: 'SET_LANG', payload: { lang: newObj.lang }})
					
					if(app_flags === null) {
						console.log("new user!")
						setNotices((prev) => ([...prev, getNotice('verifyIdentity', auth.lang)]))
						setNotices((prev) => ([...prev, getNotice('redirectToTermsConditions', auth.lang)]))
						resolve('🔒 Redirect To Terms')
					} else {
						if(!app_flags.hasOwnProperty('idUploaded')) {
							setNotices((prev) => ([...prev, getNotice('verifyIdentity', auth.lang)]))
						}
					}
					resolve('✅ Loaded User Data')
			 	})
				.catch(error => { reject('🚫 ' + error) })
		})

		const loadBeneficiaries = new Promise((resolve, reject) => {
			api.post(buildDataPath('beneficiaries', auth.uid, 'list'), stringifyArray(beneficiaryColumns))
				.then(response => {
					let responseData = addExtraRecordData(response.data)
					responseData.sort(sortByParam("initials", "firstname"))
					setBeneficiaries((init) => ([ ...responseData ]))
					resolve('✅ Loaded Beneficiaries')
				})
				.catch(error => { reject('🚫 ' + error) })
		})

		const loadTransactions = new Promise((resolve, reject) => {
			const today = new Date(Date.parse(new Date())).getTime() / 1000
			api.get(buildDataPath('transactions', auth.uid, 'list', { from: today }))
				.then(response => {
					let data = response.data, newData
					newData = addExtraRecordData(data)
					setTransactions(newData)
					resolve('✅ Loaded Recent Transactions')
				})
				.catch(error => { reject('🚫 ' + error) })
		})

		const loadGlobals = new Promise((resolve, reject) => {
			api.get(buildDataPath('globals', null, 'branch'))
				.then(response => {
					let [ lastReset, newObj ] = [ response.data[0].lastDailyLimitReset, {} ]
					let date = new Date(Date.parse(lastReset.replace(' ', 'T')))
					newObj = {...response.data[0], lastDailyLimitReset: Math.floor(date.getTime() / 1000) }
					setGlobals((initial) => ({ ...initial, ...newObj }))
					resolve('✅ Loaded Globals')
				})
				.catch(error => { reject('🚫 ' + error) })
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
			authDispatch({ type: 'SET_STATUS', payload: { data: reason }})
			authDispatch({ type: 'LOGOUT'})
		}
	}

	return (
		<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>	
			<StatusBar barStyle={"dark-content"}/>
			<Center safeArea flex={1} justifyContent={"center"}>
				<VStack flex="1" space={"4"} w={"100%"} alignItems="center" justifyContent={"center"}>
					<VStack p={"10"} backgroundColor={"white"} rounded={"2xl"} space={"3"}>
						<HStack space={"3"} alignItems={"center"}>
							<Spinner size={"lg"} />
							<Heading color={"primary.500"} fontSize={"xl"}>{ language.loading.title }</Heading>
							{/* <Button onPress={() => navigation.navigate('AppTabs')}>(debug) Continue</Button> */}
						</HStack>
						<Text>{ language.loading.subtitle }</Text>
					</VStack>
				</VStack>	
			</Center>
		</ImageBackground>
	)
}

export default LoadingScreen