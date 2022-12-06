import React from 'react'
import { Button, Center, Heading, HStack, Spinner, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import Config from 'react-native-config'
import { AuthContext, DataContext } from '../../data/Context'
import { keychainReset, buildDataPath, sortByParam,	iterateInitials, iterateFullName, 
	iterateDatesTimes, groupArrayObjects, addExtraRecordData, stringifyArray } from '../../data/Actions'
import { api, beneficiaryColumns } from '../../config'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import * as Hooks from '../../data/Hooks'

import * as Recoil from 'recoil'
import { userState } from '../../data/recoil/user'
import { beneficiaryList } from '../../data/recoil/beneficiaries'
import { transactionList } from '../../data/recoil/transactions'
import { globalState } from '../../data/recoil/system'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const LoadingScreen = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ user, setUser ] = Recoil.useRecoilState(userState)
	const [ globals, setGlobals ] = Recoil.useRecoilState(globalState)
	const setTransactions = Recoil.useSetRecoilState(transactionList)
	const setBeneficiaries = Recoil.useSetRecoilState(beneficiaryList)

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
					setUser((initial) => ({...initial, ...response.data}))
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
			api.get(buildDataPath('transactions', auth.uid, 'list', { from: today, count: 10 }))		
				.then(response => {
					setTransactions(addExtraRecordData(response.data))
					resolve('✅ Loaded Recent Transactions')
				})
				.catch(error => { reject('🚫 ' + error) })
		})

		const loadGlobals = new Promise((resolve, reject) => {
			api.get(buildDataPath('globals', null, 'branch'))
				.then(response => {					
					setGlobals((initial) => ({
						...initial,
						...response.data[0]
					}))
					resolve('✅ Loaded Globals')
				})
				.catch(error => { reject('🚫 ' + error) })
		})

		verifyLoggedIn
			.then(verified => {
				Promise.all([loadGlobals, loadUser, loadBeneficiaries, loadTransactions])
					.then(values => {
						values.forEach(value => {
							console.log(value)
						})
						console.log('finished loading data')
						console.log('--preflight check complete--')
					})
					.catch(error => {
						console.log("promise.all error", error)
						handleLogout('server-error')
					})
			})
			.then(result => {

			})
			.finally(loaded => {
				navigation.navigate('AppTabs')
			})
			.catch(error => {
				handleLogout('session-expired')
			})

		return () => {}
	})

	// React.useEffect(() => {		
	// 	let userMeta = data.userMeta
	// 	if(typeof userMeta !== 'undefined') {
	// 		//only do this if there is no daily limit set
	// 		if(userMeta['daily_limit'] == "") {
	// 			let now = new Date(Date.now()).toISOString()
	// 			let last_reset = now.slice(0, 19).replace('T', ' ')
	// 			if(userMeta.firsttime_rate == 0) {
	// 				userMeta['daily_limit'] = { max: 1000, remaining: 1000, last_reset: last_reset }
	// 			} else {
	// 				userMeta['daily_limit'] = { max: 9000, remaining: 9000, last_reset: last_reset }
	// 			}
	// 		}
	// 		if (typeof userMeta.logins !== 'undefined' && Array.isArray(userMeta.logins)) {
	// 			if(userMeta.logins.length >= 2) {
	// 				const loginTimes = userMeta.logins.slice(-2)
	// 				const oneDay = 1000 * 60 * 60 * 24
	// 				loginTimes.forEach((time, index) => {
	// 					loginTimes[index] = time.replace(' ', 'T')
	// 				})
	// 				const lasttime = new Date(loginTimes[1])
	// 				const timebefore = new Date(loginTimes[0])
	// 				const timediff = lasttime.getTime() - timebefore.getTime()
	// 				const previous = Math.round(timediff / oneDay)
	// 				//if the time between the last login and this one is greater than/equal to 1 (day), reset the daily limit
	// 				if( previous >= 1 ) {
	// 					userMeta['daily_limit'] = {
	// 						...userMeta.daily_limit,
	// 						//TODO: Fix this! This sometimes breaks!!!
	// 						remaining: userMeta.daily_limit.max 
	// 					}
	// 				}
	// 			} else {
	// 				userMeta['daily_limit'] = {
	// 					...userMeta.daily_limit,
	// 					remaining: userMeta.daily_limit.max 
	// 				}
	// 			}
	// 		}
			
	// 		dataDispatch({ type: 'LOAD_USER_META', payload: { data: userMeta } })
	// 	}
				
	// }, [data.userMeta])

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