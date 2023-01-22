import React, { useContext, useEffect, memo } from 'react'
import { useWindowDimensions } from 'react-native'

//screens
import BeneficiariesScreen from '../../screens/appRoot/BeneficiariesScreen'
import DashboardScreen from '../../screens/appRoot/DashboardScreen'
import ProfileScreen from '../../screens/appRoot/ProfileScreen'
import TransactionsScreen from '../../screens/appRoot/TransactionsScreen'
import TransferScreen from '../../screens/appRoot/TransferScreen'

//components
import { useNavigation } from '@react-navigation/native'
import IconSettingsCog from '../../components/common/IconSettingsCog'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from '../common/Icon'

//data
import { useRecoilValue } from 'recoil'
import { useToken } from 'native-base'
import { useForceUpdate } from '../../data/Hooks'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const AppTabs = () => {
	const Tabs = createBottomTabNavigator()
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const { height, width } = useWindowDimensions()
	const [ active, inactive ] = useToken('colors', ['primary.600', 'black'])
	const lang = useRecoilValue(langState)

	let tabBarStyle
	if( height > width ) {
		tabBarStyle = { height: 90, paddingTop: "2.5%" }
	} else {
		tabBarStyle = { height: 60, paddingTop: "1.25%" }
	}

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	const tabOptions = (navigation, icon) => ({
		headerShown: true,
		headerRight: () => (<IconSettingsCog />),
		tabBarIcon: ({ focused, color, size = 32 }) => {
			return focused ? (<Icon type={"Ionicon"} name={icon} fontSize={size} color={color} />) : (<Icon type={"Ionicon"} name={icon + '-outline'} fontSize={size} color={"coolGray.400"} />)
		},
		tabBarStyle: tabBarStyle,
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

export default memo(AppTabs)
