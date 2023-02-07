import React, { memo } from 'react'

//navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//screen
import LoginScreen from '../../screens/authRoot/LoginScreen'
import ForgotPasswordScreen from '../../screens/authRoot/ForgotPasswordScreen'
import RegisterScreen from '../../screens/authRoot/RegisterScreen'

const AuthStack = () => {
	const Stack = createNativeStackNavigator()
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name={'Login'} component={LoginScreen} />
			<Stack.Screen name={'ForgotPassword'} component={ForgotPasswordScreen} />
			<Stack.Screen name={'Register'} component={RegisterScreen} />
		</Stack.Navigator>
	)
}

export default memo(AuthStack)
