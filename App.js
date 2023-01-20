import React, { useContext, useEffect, useReducer } from 'react'
import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ActivityIndicator, LogBox } from 'react-native'

//navigation
import { navigationRef } from './src/data/handlers/Navigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useFlipper } from '@react-navigation/devtools'

//navigators
import AuthStack from './src/components/navigators/AuthStack'
import AppStack from './src/components/navigators/AppStack'

//screens
import SplashScreen from './src/screens/SplashScreen';

//data
import { AuthContext, AuthProvider } from './src/data/Context'
import { NativeBaseProvider, extendTheme, Text } from 'native-base'
import { NativeBaseTheme, ReactNavigationThemeDark, ReactNavigationThemeDefault } from './src/config'
import { keychainLoad, keychainReset, parseToken } from './src/data/Actions'
import { initialCheckConnection } from './src/data/handlers/Connection'
import * as Hooks from './src/data/Hooks';
import { RecoilRoot } from 'recoil'
import RecoilFlipperClient from 'react-recoil-flipper-client'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('./src/i18n/en-AU.json')
const thStrings = require('./src/i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

LogBox.ignoreLogs(["Could not find Fiber with id"])
LogBox.ignoreLogs(["Duplicate atom key"])

export default function App() {
	return (
        <RecoilRoot>
            <RecoilFlipperClient />
            <NativeBaseProvider theme={NativeBaseTheme}>
                <AuthProvider>
                    <RootNavigator />
                </AuthProvider>
            </NativeBaseProvider>
        </RecoilRoot>
	)
}

const RootStack = createNativeStackNavigator()
const RootNavigator = ({navigation}) => {
    useFlipper(navigationRef)
    return (
        <SafeAreaProvider>
            <NavigationContainer fallback={<ActivityIndicator color={"#8B6A27"} size={"large"} />} ref={navigationRef} >
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="Splash" component={ SplashScreen } />
                    <RootStack.Screen name="AppNavigator" component={ AppNavigator } />
                </RootStack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

const AppNavigator = ({navigation}) => {    
    const { auth, authDispatch } = useContext(AuthContext)
    const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

    useEffect(() => {
        //check if we can connect to the API first
        initialCheckConnection(authDispatch)
        // begin authentication run: is token present in Context?
        if(auth.token === null) {
            //no? lets check the Keychain/Keystore
            const getKeychainCredentials = async () => {
                const keychainResponse = await keychainLoad('token')
                //does the Keychain/Keystore have something (not undefined) for us?
                if(keychainResponse !== undefined) {
                    //is there a "password"? (it actually should be a serialised string with token, uid, and expiry). needs pin as well
                    if(keychainResponse.password !== null) {
                        //parse the "password" aka jwt token
                        const jwt_data = parseToken(keychainResponse.password)
                        authDispatch({ type: 'LOGIN', payload: {
                            uid: jwt_data.uid,
                            email: jwt_data.eml,
                            token: keychainResponse.password,
                            expire: jwt_data.exp,
                            status: null
                        }})
                    }
                }
            }
            getKeychainCredentials()
        }
    }, [])

    useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

    Hooks.useInterval(() => {
        async function checkTokenExpiry(timestamp) {
            if(timestamp <= 0) {
                const reset = await keychainReset('token') //shutup vscode, await DOES do something here
                if(reset === true) {
                    authDispatch({ type: 'SET_STATUS', payload: { data: 'sessionExpired' }})
                    authDispatch({ type: 'LOGOUT'})
                }
            }
        }
        const timeNow = Math.floor(Date.now()/1000)
	    const timeLeft = auth.expire - timeNow
        checkTokenExpiry(timeLeft)
    }, auth.expire > 0 ? 60000 : null)

    // const scheme = useColorScheme()
    // theme={scheme === 'dark' ? ReactNavigationThemeDark : ReactNavigationThemeDefault}
   
    if (auth.token === null) {
        return <AuthStack />
    } else {
        return <AppStack />
    }
}