import React from 'react'

//screens
import TransferStepOne from './transfer/TransferStepOne'
import TransferStepTwo from './transfer/TransferStepTwo'
import TransferStepThree from './transfer/TransferStepThree'
import TransferStepFour from './transfer/TransferStepFour'
import TransferStepFive from './transfer/TransferStepFive'

//components
import { ImageBackground } from 'react-native' //do not replace with AppSafeArea
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export default TransferScreen = () => {
	return (
		<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<Stack.Navigator>
				<Stack.Screen options={{ headerShown: false }} name="TransferStepOne" component={TransferStepOne} />
				<Stack.Screen options={{ headerShown: false }} name="TransferStepTwo" component={TransferStepTwo} />
				<Stack.Screen options={{ headerShown: false }} name="TransferStepThree" component={TransferStepThree} />
				<Stack.Screen options={{ headerShown: false }} name="TransferStepFour" component={TransferStepFour} />
				<Stack.Screen options={{ headerShown: false }} name="TransferStepFive" component={TransferStepFive} />
			</Stack.Navigator>
		</ImageBackground>
	)
}