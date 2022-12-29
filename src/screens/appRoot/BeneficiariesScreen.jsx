import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//Screens
import BeneficiariesList from './beneficiaries/BeneficiariesList'
import BeneficiariesDetail from './beneficiaries/BeneficiariesDetail'
import BeneficiariesEdit from './beneficiaries/BeneficiariesEdit'
import BeneficiariesAdd from './beneficiaries/BeneficiariesAdd'
import BeneficiariesDelete from './beneficiaries/BeneficiariesDelete'

const Stack = createNativeStackNavigator()

const BeneficiariesScreen = () => {

	return (
		<Stack.Navigator>
			<Stack.Screen options={{ headerShown: false, unmountOnBlur: true }} name="BeneficiariesList" component={BeneficiariesList} />
			<Stack.Screen options={{ headerShown: false }} name="BeneficiariesDetail" component={BeneficiariesDetail} />
			<Stack.Screen options={{ headerShown: false }} name="BeneficiariesEdit" component={BeneficiariesEdit} />
			<Stack.Screen options={{ headerShown: false }} name="BeneficiariesAdd" component={BeneficiariesAdd} />
			<Stack.Screen options={{ headerShown: false }} name="BeneficiariesDelete" component={BeneficiariesDelete} />
		</Stack.Navigator>
	)
}

export default BeneficiariesScreen;