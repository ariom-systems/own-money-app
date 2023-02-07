import Config from 'react-native-config'
import NetInfo from '@react-native-community/netinfo'

export function initialCheckConnection(authDispatch) {
	checkConnection()
	setTimeout(() => {
		NetInfo.fetch().then(state => {
			if(state.isInternetReachable !== true) {
				console.log('isInternetReachable: ' + state.isInternetReachable)
				retryConnection(authDispatch)
			} else {
				console.log('🛰  Connected to ' + Config.BASEURL)
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
	authDispatch({ type: 'SET_STATUS', payload: { data: 'offline' }}) //leave this here
	const reconnecting = setInterval(() => {
		NetInfo.fetch().then(state => {
			if(state.isInternetReachable === true) {
				authDispatch({ type: 'CLEAR_STATUS' }) //leave this here
				clearInterval(reconnecting)
			} else {
				console.log('network connection issue')
			}
		})
	}, 30000)
}