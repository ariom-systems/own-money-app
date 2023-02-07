import React, { memo } from "react"

//screens
import AppTabs from './AppTabs'
import SettingsScreen from '../../screens/appRoot/SettingsScreen'

//components
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer'

const Drawer = createDrawerNavigator()
const AppDrawer = ({ navigation }) => {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <DrawerComponent {...props} />}
			screenOptions={{
				drawerPosition: 'right',
				drawerStyle: { width: '90%' },
				headerShown: false
			}}
		>
			<Drawer.Screen name={'AppTabs'} component={AppTabs} />
		</Drawer.Navigator>
	)
}

export default memo(AppDrawer)

const DrawerComponent = (props) => {
	return (
		<DrawerContentScrollView>
			<SettingsScreen />
		</DrawerContentScrollView>
	)
}