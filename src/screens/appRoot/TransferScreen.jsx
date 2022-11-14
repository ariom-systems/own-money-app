import React from 'react'
import { ImageBackground } from 'react-native'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TransferStepOne from './transfer/TransferStepOne'
import TransferStepTwo from './transfer/TransferStepTwo'
import TransferStepThree from './transfer/TransferStepThree'
import TransferStepFour from './transfer/TransferStepFour'
import { background } from 'native-base/lib/typescript/theme/styled-system'

const Stack = createNativeStackNavigator()

const navTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'transparent'
	}
}

export default TransferScreen = () => {
	return (
		<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<NavigationContainer independent={true} theme={navTheme}>
				<Stack.Navigator>
					<Stack.Screen options={{ headerShown: false }} name="TransferStepOne" component={TransferStepOne} />
					<Stack.Screen options={{ headerShown: false }} name="TransferStepTwo" component={TransferStepTwo} />
					<Stack.Screen options={{ headerShown: false }} name="TransferStepThree" component={TransferStepThree} />
					<Stack.Screen options={{ headerShown: false }} name="TransferStepFour" component={TransferStepFour} />
				</Stack.Navigator>
			</NavigationContainer>
		</ImageBackground>
	)
}