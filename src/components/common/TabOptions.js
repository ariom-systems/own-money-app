import React from 'react'
import { Platform } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconSettingsCog from '../../components/common/IconSettingsCog'

Ionicons.loadFont()

export const Dashboard = (navigation) => ({
	headerShown: true,
	headerRight: () => (<IconSettingsCog props={navigation} />),
	tabBarIcon: ({focused, color, size = 24}) => {
		if(Platform.OS === 'ios') {
			return focused ? (
				<Ionicons name={"ios-home"} size={size} color={color} />
			) : (
				<Ionicons name={"ios-home-outline"} size={size} color={color} />
			)
		} else {
			
			return <Ionicons name={"md-home"} size={size} color={color} />
		}
	},
	tabBarActiveTintColor: 'tomato',
	tabBarInactiveTintColor: 'gray',
})

export const Beneficiaries = (navigation) => ({
	headerShown: true,
	headerRight: () => (<IconSettingsCog props={navigation} />),
	tabBarIcon: ({focused, color, size = 24}) => {
		if(Platform.OS === 'ios') {
			return focused ? (
				<Ionicons name={"ios-people"} size={size} color={color} />
			) : (
				<Ionicons name={"ios-people-outline"} size={size} color={color} />
			)
		} else {
			return <Ionicons name={"md-people"} size={size} color={color} />
		}
	},
	tabBarActiveTintColor: 'tomato',
	tabBarInactiveTintColor: 'gray',
})

export const Transfer = (navigation) => ({
	headerRight: () => (<IconSettingsCog props={navigation} />),
	tabBarIcon: ({focused, color, size = 24}) => {
		if(Platform.OS === 'ios') {
			return focused ? (
				<Ionicons name={"ios-wallet"} size={size} color={color} />
			) : (
				<Ionicons name={"ios-wallet-outline"} size={size} color={color} />
			)
		} else {
			return <Ionicons name={"md-wallet"} size={size} color={color} />
		}
	},
	tabBarActiveTintColor: 'tomato',
	tabBarInactiveTintColor: 'gray',
})

export const Transactions = (navigation) => ({
	headerRight: () => (<IconSettingsCog props={navigation} />),
	tabBarIcon: ({focused, color, size = 24}) => {
		if(Platform.OS === 'ios') {
			return focused ? (
				<Ionicons name={"ios-list"} size={size} color={color} />
			) : (
				<Ionicons name={"ios-list-outline"} size={size} color={color} />
			)
		} else {
			return <Ionicons name={"md-list"} size={size} color={color} />
		}
	},
	tabBarActiveTintColor: 'tomato',
	tabBarInactiveTintColor: 'gray',
})

export const Profile = (navigation) => ({
	headerRight: () => (<IconSettingsCog props={navigation} />),
	tabBarIcon: ({focused, color, size = 24}) => {
		if(Platform.OS === 'ios') {
			return focused ? (
				<Ionicons name={"ios-person-circle"} size={size} color={color} />
			) : (
				<Ionicons name={"ios-person-circle-outline"} size={size} color={color} />
			)
		} else {
			return <Ionicons name={"md-person-circle"} size={size} color={color} />
		}
	},
	tabBarActiveTintColor: 'tomato',
	tabBarInactiveTintColor: 'gray',
	//tabBarBadge: notificationCount || null

})