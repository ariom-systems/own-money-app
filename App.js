import 'react-native-gesture-handler'
//Core
import React from 'react'
import { ActivityIndicator, useColorScheme, LogBox, Image, ImageBackground } from 'react-native'

//Navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

//Screens - splash
import SplashScreen from './src/screens/SplashScreen';

//Screens - external
import ForgotPasswordScreen from './src/screens/authRoot/ForgotPasswordScreen'
import LoginScreen from './src/screens/authRoot/LoginScreen'
import RegisterScreen from './src/screens/authRoot/RegisterScreen'

//Screens - authenticated
import BeneficiariesScreen from './src/screens/appRoot/BeneficiariesScreen'
import DashboardScreen from './src/screens/appRoot/DashboardScreen'
import LoadingScreen from './src/screens/appRoot/LoadingScreen'
import PinCodeScreen from './src/screens/appRoot/PinCodeScreen'
import ProfileScreen from './src/screens/appRoot/ProfileScreen'
import SettingsScreen from './src/screens/appRoot/SettingsScreen'
import TransactionsScreen from './src/screens/appRoot/TransactionsScreen'
import TransferScreen from './src/screens/appRoot/TransferScreen'

//Context
import { AuthContext, AuthProvider, DataProvider, TransferProvider } from './src/data/Context'
import { NativeBaseProvider, extendTheme } from 'native-base'

//Other
import { NativeBaseTheme, ReactNavigationThemeDark, ReactNavigationThemeDefault } from './src/config'
import { getRemainingLoginTime, initialCheckConnection, keychainLoad, keychainReset, parseToken } from './src/data/Actions'
import { useInterval } from './src/data/Hooks';
import { optionsDashboard, optionsBeneficiaries, optionsTransfer, optionsTransactions, optionsProfile } from './src/components/dashboard/TabOptions'
import LogoutScreen from './src/screens/appRoot/LogoutScreen';

import LocalizedStrings from 'react-native-localization'
const auStrings = require('./src/i18n/en-AU.json')
const thStrings = require('./src/i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

LogBox.ignoreLogs(["Could not find Fiber with id"])

const RootStack = createNativeStackNavigator()
const AuthStack = createNativeStackNavigator()
const AppStack = createNativeStackNavigator()

export default function App() {
	return (
        <NativeBaseProvider theme={NativeBaseTheme}>
            <AuthProvider>
                <DataProvider>
                    <TransferProvider>
                        <RootNavigator />
                    </TransferProvider>
                </DataProvider>
            </AuthProvider>
        </NativeBaseProvider>
	)
}

//Root navigation container. To separate Splash screen from the rest of the app.
const RootNavigator = ({navigation}) => {
    return (
        <NavigationContainer fallback={<ActivityIndicator color={"#8B6A27"} size={"large"} />}>
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
                const keychainResponse = await keychainLoad("com.ariom.ownmoney.token")
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

    useInterval(() => {
        const timeLeft = getRemainingLoginTime(auth.expire) 
        checkTokenExpiry(timeLeft)
    }, auth.expire > 0 ? 60000 : null)

    async function checkTokenExpiry(timestamp) {
        if(timestamp <= 0) {
            const reset = await keychainReset("com.ariom.ownmoney.token") //shutup vscode, await DOES do something here
            if(reset === true) {
                authDispatch({ type: 'SET_STATUS', payload: { data: 'sessionExpired' }})
                authDispatch({ type: 'LOGOUT'})
            }
        }
    }

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
                    <AppStack.Screen options={{ title: language.screens.settings, headerBackTitle: language.settings.headerBack }} name='Settings' component={ SettingsScreen } />
                    <AppStack.Screen options={{ headerShown: false }} name={'AppTabs'} component={ AppTabs } />
                    <AppStack.Screen options={{ headerShown: false }} name={'LogoutScreen'} component={ LogoutScreen } />
                </AppStack.Navigator>
            )}
        </>
    )
}

const Tabs = createBottomTabNavigator()
const AppTabs = ({navigation}) => {
    const { auth } = React.useContext(AuthContext)
    const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
    
    React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

    return (
        <Tabs.Navigator>
            <Tabs.Screen options={{...optionsDashboard(navigation), title: language.screens.dashboard }} name='Dashboard' component={ DashboardScreen } />
            <Tabs.Screen options={{...optionsBeneficiaries(navigation), title: language.screens.beneficiaries }} name='Beneficiaries' component={ BeneficiariesScreen } />
            <Tabs.Screen options={{...optionsTransfer(navigation), title: language.screens.transfer }} name='Transfer' component={ TransferScreen } />
            <Tabs.Screen options={{...optionsTransactions(navigation), title: language.screens.transactions }} name='Transactions' component={ TransactionsScreen } />
            <Tabs.Screen options={{...optionsProfile(navigation), title: language.screens.profile }} name='Your Profile' component={ ProfileScreen } />
        </Tabs.Navigator>
    )
}