import React from 'react'

//screens
import BeneficiariesScreen from '../../screens/appRoot/BeneficiariesScreen'
import DashboardScreen from '../../screens/appRoot/DashboardScreen'
import ProfileScreen from '../../screens/appRoot/ProfileScreen'
import TransactionsScreen from '../../screens/appRoot/TransactionsScreen'
import TransferScreen from '../../screens/appRoot/TransferScreen'

//components
import IconSettingsCog from '../../components/common/IconSettingsCog'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
const Tabs = createBottomTabNavigator()
import { Factory, Text, useToken } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)

//data
import { AuthContext } from '../../data/Context'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })


const AppTabs = ({ navigation }) => {
	const { auth } = React.useContext(AuthContext)
	const [active, inactive] = useToken('colors', ['primary.600', 'black'])
	const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0)

	React.useEffect(() => {
		if (language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	const tabOptions = (navigation, icon) => ({
		headerShown: true,
		headerRight: () => (<IconSettingsCog props={navigation} />),
		tabBarIcon: ({ focused, color, size = 32 }) => {
			return focused ? (<NBIonicon name={icon} fontSize={size} color={color} />) : (<NBIonicon name={icon + '-outline'} fontSize={size} color={"coolGray.400"} />)
		},
		tabBarStyle: { height: 90, paddingTop: "2.5%" },
		tabBarActiveTintColor: active,
		tabBarInactiveTintColor: inactive
	})

	return (
		<Tabs.Navigator>
			<Tabs.Screen options={{ ...tabOptions(navigation, 'home'), title: language.screens.dashboard }} name='Dashboard' component={DashboardScreen} />
			<Tabs.Screen options={{ ...tabOptions(navigation, 'people'), title: language.screens.beneficiaries }} name='Beneficiaries' component={BeneficiariesScreen} />
			<Tabs.Screen options={{ ...tabOptions(navigation, 'wallet'), title: language.screens.transfer }} name='Transfer' component={TransferScreen} />
			<Tabs.Screen options={{ ...tabOptions(navigation, 'list'), title: language.screens.transactions }} name='Transactions' component={TransactionsScreen} />
			<Tabs.Screen options={{ ...tabOptions(navigation, 'person-circle'), title: language.screens.profile }} name='Your Profile' component={ProfileScreen} />
		</Tabs.Navigator>
	)
}

export default React.memo(AppTabs)
