import React from 'react'
import { Button, Center, Heading, HStack, Spinner, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import Config from 'react-native-config'
import { AuthContext, DataContext } from '../../data/Context'
import { keychainReset, buildDataPath, sortByParam,	iterateInitials, iterateFullName, iterateDatesTimes, groupArrayObjects } from '../../data/Actions'
import { api } from '../../config'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import * as Hooks from '../../data/Hooks'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const LoadingScreen = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = React.useContext(AuthContext)
	const { data, dataDispatch } = React.useContext(DataContext)

	Hooks.useEffectOnce(() => {
		console.log('--statring preflight check--')
		console.log('authenticated:', auth.token !== 'undefined' ? 'yes' : 'no')
		api.setHeader('Authorization', 'Bearer ' + auth.token)

		const verifyLoggedIn = new Promise((resolve, reject) => {
			api.get(Config.BASEURL + '/checktoken')
				.then(response => {
					if(response.data.result == 'success') {
						resolve()
					} else {
						reject(response)
					}
				})
				.catch(error => {
					console.log(error)
				})
		})

		const loadGlobals = new Promise((resolve, reject) => {
			api.get(buildDataPath('globals', null, 'branch'))
				.then(response => {					
					//console.log(response.data)
					dataDispatch({ type: 'LOAD_GLOBALS', payload: { data: response.data[0] } });
					resolve('✅ Loaded Globals')
				})
				.catch(error => { 
					console.error(error)
					reject('🚫 ' + error)
				})
		})

		const loadUser = new Promise((resolve, reject) => {
			api.get(buildDataPath('users', auth.uid, 'view'))
				.then(response => {
					dataDispatch({ type: 'LOAD_USER', payload: { data: response.data } })
					resolve('✅ Loaded User Data')
			 	})
				.catch(error => {
					console.error(error)
					reject('🚫 ' + error)
				})
		})

		const loadMetadata = new Promise((resolve, reject) => {
			api.get(buildDataPath('meta', auth.uid, 'view', { endpoint: 'users' }))
				.then(response => {
					dataDispatch({ type: 'LOAD_USER_META', payload: { data: response.data } })
					resolve('✅ Loaded User Metadata Data')
			 	})
				.catch(error => {
					console.error(error)
					reject('🚫 ' + error)
				})
		})

		const loadBeneficiaries = new Promise((resolve, reject) => {
			api.post(buildDataPath('beneficiaries', auth.uid, 'list'), JSON.stringify(Object.assign({}, ["id", "id_users", "firstname", "lastname", "status"])))
				.then(response => {
					let newResponse = []
					newResponse = response.data.filter(function(obj) {
						return obj.status !== 'In-Active'
					})
					newResponse = iterateInitials(newResponse)
					newResponse = iterateFullName(newResponse) 
					newResponse = sortByParam(newResponse, "firstname")
					dataDispatch({ type: 'LOAD_BENEFICIARIES', payload: { data: newResponse } })
					resolve('✅ Loaded Beneficiaries')
				})
				.catch(error => {
					console.error(error)
					reject('🚫 ' + error)
				})
		})

		const loadTransactions = new Promise((resolve, reject) => {
			const today = new Date(Date.parse(new Date())).getTime() / 1000
			api.get(buildDataPath('transactions', auth.uid, 'list', { from: today, count: 10 }))		
				.then(response => {
					const latest = response.data.slice(-1)
					let newResponse = []
					newResponse = iterateFullName(response.data)
					newResponse = iterateInitials(newResponse)
					newResponse = iterateDatesTimes(response.data, 'created_date', 'cr')
					newResponse = iterateDatesTimes(response.data, 'processed_date', 'pr')
					newResponse = iterateDatesTimes(response.data, 'completed_date', 'co')
					let count = newResponse.length
					const groupArrays = groupArrayObjects(newResponse, 'cr_date')
					
					let dateStr = latest[0].created_date.replace(' ', 'T') + 'Z'
					let timestamp = new Date(Date.parse(dateStr)).getTime() / 1000
					dataDispatch({ type: 'LOAD_TRANSACTIONS', payload: { data: groupArrays, index: timestamp, last: 0, count: count } })
					dataDispatch({ type: 'LOAD_LATEST', payload: { data: groupArrays } })
					resolve('✅ Loaded Recent Transactions')
				})
				.catch(error => { reject('🚫 ' + error) })
		})

		verifyLoggedIn
			.then(verified => {
				Promise.all([loadGlobals, loadUser, loadMetadata, loadBeneficiaries, loadTransactions])
					.then(values => {
						values.forEach(value => {
							console.log(value)
						})
						console.log('finished loading data')
						console.log('--preflight check complete--')
					})
					.catch(error => {
						console.error('verifyLoggedIn then:', error)
						handleLogout('server-error')
					})
			})
			.finally(loaded => {
				navigation.navigate('AppTabs')
			})
			.catch(error => {
				console.error('verifyLoggedIn catch:',error)
				handleLogout('session-expired')
			})

		return () => {}
	})

	React.useEffect(() => {		
		let userMeta = data.userMeta
		if(typeof userMeta !== 'undefined') {
			//only do this if there is no daily limit set
			if(userMeta['daily_limit'] == "") {
				let now = new Date(Date.now()).toISOString()
				let last_reset = now.slice(0, 19).replace('T', ' ')
				if(userMeta.firsttime_rate == 0) {
					userMeta['daily_limit'] = { max: 1000, remaining: 1000, last_reset: last_reset }
				} else {
					userMeta['daily_limit'] = { max: 9000, remaining: 9000, last_reset: last_reset }
				}
			}
			if (typeof userMeta.logins !== 'undefined' && Array.isArray(userMeta.logins)) {
				if(userMeta.logins.length >= 2) {
					const loginTimes = userMeta.logins.slice(-2)
					const oneDay = 1000 * 60 * 60 * 24
					loginTimes.forEach((time, index) => {
						loginTimes[index] = time.replace(' ', 'T')
					})
					const lasttime = new Date(loginTimes[1])
					const timebefore = new Date(loginTimes[0])
					const timediff = lasttime.getTime() - timebefore.getTime()
					const previous = Math.round(timediff / oneDay)
					//if the time between the last login and this one is greater than/equal to 1 (day), reset the daily limit
					if( previous >= 1 ) {
						userMeta['daily_limit'] = {
							...userMeta.daily_limit,
							remaining: userMeta.daily_limit.max 
						}
					}
				} else {
					userMeta['daily_limit'] = {
						...userMeta.daily_limit,
						remaining: userMeta.daily_limit.max 
					}
				}
			}
			
			dataDispatch({ type: 'LOAD_USER_META', payload: { data: userMeta } })
		}
				
	}, [data.userMeta])

	const handleLogout = async (reason) => {
		const reset = await keychainReset("com.ariom.ownmoney.token") //shutup vscode, await DOES do something here
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