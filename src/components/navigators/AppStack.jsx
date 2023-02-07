import React, { memo } from "react"

//navigators
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppDrawer from './AppDrawer'

//screens
import PinCodeScreen from '../../screens/appRoot/PinCodeScreen'
import LoadingScreen from '../../screens/appRoot/LoadingScreen'
import TermsAndConditionsScreen from '../../screens/appRoot/TermsAndConditionsScreen'
import LogoutScreen from '../../screens/appRoot/LogoutScreen'

const AppStack = () => {
	const Stack = createNativeStackNavigator()
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen options={{ orientation: 'portrait' }} name={'PinCode'} component={PinCodeScreen} />
			<Stack.Screen options={{ orientation: 'all' }} name={'Loading'} component={LoadingScreen} />
			<Stack.Screen options={{ orientation: 'all' }} name={'TermsAndConditions'} component={TermsAndConditionsScreen} />
			<Stack.Screen options={{ orientation: 'all' }} name={'AppDrawer'} component={AppDrawer} />
			<Stack.Screen options={{ orientation: 'all' }} name={'LogoutScreen'} component={LogoutScreen} />
		</Stack.Navigator>
	)
}

export default memo(AppStack)
