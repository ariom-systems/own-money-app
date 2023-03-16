import React, { useEffect } from 'react'

//screens
import TransferStepOne from './transfer/TransferStepOne'
import TransferStepTwo from './transfer/TransferStepTwo'
import TransferStepThree from './transfer/TransferStepThree'
import TransferStepFour from './transfer/TransferStepFour'
import PaymentSelect from './payment/PaymentSelect'
import PaymentShowBankDetails from './payment/PaymentShowBankDetails'
import PaymentShowPoliPayment from './payment/PaymentShowPoliPayment'
import PaymentShowPayID from './payment/PaymentShowPayID'

//components
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native' //do not replace with AppSafeArea
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//data
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const Stack = createNativeStackNavigator()

const TransferScreen = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const lang = useRecoilValue(langState)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	return (
		<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<Stack.Navigator>
				<Stack.Screen options={{ headerShown: false }} name="TransferStepOne" component={TransferStepOne} />
				<Stack.Screen options={{ headerShown: false }} name="TransferStepTwo" component={TransferStepTwo} />
				<Stack.Screen options={{ headerShown: false }} name="TransferStepThree" component={TransferStepThree} />
				<Stack.Screen options={{ headerShown: false }} name="TransferStepFour" component={TransferStepFour} />
				<Stack.Group
					screenOptions={() => ({ title: language.screens.payment })}>
					<Stack.Screen options={{ headerShown: false }} name="PaymentSelect" component={PaymentSelect} />
					<Stack.Screen options={{ headerShown: false }} name="PaymentShowBankDetails" component={PaymentShowBankDetails} />
					<Stack.Screen options={{ headerShown: false }} name="PaymentShowPoliPayment" component={PaymentShowPoliPayment} />
					<Stack.Screen options={{ headerShown: false }} name="PaymentShowPayID" component={PaymentShowPayID} />
				</Stack.Group>
			</Stack.Navigator>
		</ImageBackground>
	)
}

export default TransferScreen