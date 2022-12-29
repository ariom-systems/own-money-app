import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'


import ProfileDetails from './profile/ProfileDetails';
import ProfileEdit from './profile/ProfileEdit';

const Stack = createNativeStackNavigator();

const ProfileScreen = ({navigation}) => {
	return (
		
		<Stack.Navigator id="Profile">
			<Stack.Screen options={{ headerShown: false }} name="ProfileDetails" component={ProfileDetails} />
			<Stack.Screen options={{ headerShown: false }} name="ProfileEdit" component={ProfileEdit} />
		</Stack.Navigator>
		
	)
}

export default ProfileScreen;