//Core
import React from 'react'
import 'react-native-gesture-handler'
import { ActivityIndicator, useColorScheme, LogBox, Image, ImageBackground } from 'react-native'

//Navigation
import { navigationRef } from './src/data/handlers/Navigation'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer'
import { useFlipper } from '@react-navigation/devtools'
import AppTabs from './src/components/navigators/AppTabs'

//Screens - splash
import SplashScreen from './src/screens/SplashScreen';

//Screens - external
import ForgotPasswordScreen from './src/screens/authRoot/ForgotPasswordScreen'
import LoginScreen from './src/screens/authRoot/LoginScreen'
import RegisterScreen from './src/screens/authRoot/RegisterScreen'

//Screens - authenticated
import LoadingScreen from './src/screens/appRoot/LoadingScreen'
import PinCodeScreen from './src/screens/appRoot/PinCodeScreen'
import SettingsScreen from './src/screens/appRoot/SettingsScreen'
import TermsAndConditionsScreen from './src/screens/appRoot/TermsAndConditionsScreen'

//Context
import { AuthContext, AuthProvider } from './src/data/Context'
import { NativeBaseProvider, extendTheme, Text } from 'native-base'

//Other
import { NativeBaseTheme, ReactNavigationThemeDark, ReactNavigationThemeDefault } from './src/config'
import { keychainLoad, keychainReset, parseToken } from './src/data/Actions'
import { initialCheckConnection } from './src/data/handlers/Connection'

import * as Hooks from './src/data/Hooks';
import LogoutScreen from './src/screens/appRoot/LogoutScreen';

//Recoil
import { RecoilRoot } from 'recoil'
import RecoilFlipperClient from 'react-recoil-flipper-client'

//Lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('./src/i18n/en-AU.json')
const thStrings = require('./src/i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

LogBox.ignoreLogs(["Could not find Fiber with id"])
LogBox.ignoreLogs(["Duplicate atom key"])

const RootStack = createNativeStackNavigator()
const AuthStack = createNativeStackNavigator()
const AppStack = createNativeStackNavigator()

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

//Root navigation container. To separate Splash screen from the rest of the app.
const RootNavigator = ({navigation}) => {
    useFlipper(navigationRef)
    return (
        <NavigationContainer fallback={<ActivityIndicator color={"#8B6A27"} size={"large"} />} ref={navigationRef} >
            <RootStack.Navigator>
                <RootStack.Screen options={{ headerShown: false }} name="Splash" component={ SplashScreen } />
                <RootStack.Screen options={{ headerShown: false }} name="AppNavigator" component={ AppNavigator } />
            </RootStack.Navigator>
        </NavigationContainer>
    )
}

//App navigation container. To separate external facing screens from internal authenticated screens.
const AppNavigator = ({navigation}) => {    
    const { auth, authDispatch } = React.useContext(AuthContext)
    const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

    React.useEffect(() => {
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

    React.useEffect(() => {
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
    
    return (
        <>
            { auth.token === null ? (
                <AuthStack.Navigator id="AuthRoot">
                    <AuthStack.Screen options={{ headerShown: false }} name={'Login'} component={ LoginScreen } />
                    <AuthStack.Screen options={{ headerShown: false }} name={'ForgotPassword'} component={ ForgotPasswordScreen } />
                    <AuthStack.Screen options={{ headerShown: false }} name={'Register'} component={ RegisterScreen } />
                </AuthStack.Navigator>
            ) : (
                <AppStack.Navigator id="AppRoot">
                    <AppStack.Screen options={{ headerShown: false }} name={'PinCode'} component={ PinCodeScreen } />
                    <AppStack.Screen options={{ headerShown: false }} name={'Loading'} component={ LoadingScreen } />
                    <AppStack.Screen options={{ headerShown: false }} name={'TermsAndConditions'} component={ TermsAndConditionsScreen } />
                    <AppStack.Screen options={{ headerShown: false }} name={'AppDrawer'} component={ AppDrawer } />
                    <AppStack.Screen options={{ headerShown: false }} name={'LogoutScreen'} component={ LogoutScreen } />
                </AppStack.Navigator>
            )}
        </>
    )
}

const Drawer = createDrawerNavigator()
const AppDrawer = ({navigation}) => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerComponent {...props} />}
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: { width: '90%'}
            }}
        >
            <Drawer.Screen options={{ headerShown: false }} name={'AppTabs'} component={AppTabs} />
        </Drawer.Navigator>
    )
}

const DrawerComponent = (props) => {
    return (
        <DrawerContentScrollView>
            <SettingsScreen />
        </DrawerContentScrollView>
    )
}