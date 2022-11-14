import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TransactionsList from './transactions/TransactionsList'
import TransactionsDetail from './transactions/TransactionsDetail'

const Stack = createNativeStackNavigator()

const TransactionsScreen = ({ navigation }) => {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator>
				<Stack.Screen options={{ headerShown: false }} name="TransactionsList" component={TransactionsList} />
				<Stack.Screen options={{ headerShown: false }} name="TransactionsDetail" component={TransactionsDetail} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default TransactionsScreen;