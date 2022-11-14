import React from 'react'
import { Box, Button, Center, Divider, Heading, HStack, Pressable, 
	SectionList, Spacer, StatusBar, Text, VStack } from 'native-base'
import { Factory } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import { AuthContext, DataContext } from '../../../data/Context'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const NBIonicon = Factory(Ionicon)			

export default function ProfileDetails({navigation}) {

	const { auth } = React.useContext(AuthContext)
	const { data } = React.useContext(DataContext)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const UserData = [
		{
			title: language.profileDetails.listDataHeaderPersonalDetails,
			data: [
				{ label: language.profileDetails.listDataFirstNameLabel, value: data.user.firstname },
				{ label: language.profileDetails.listDataMiddleNameLabel, value: data.user.middlename },
				{ label: language.profileDetails.listDataLastNameLabel, value: data.user.lastname },
				{ label: language.profileDetails.listDataNickNameLabel, value: data.user.nickname },
				{ label: language.profileDetails.listDataDateOfBirthLabel, value: data.user.dateofbirth },
				{ label: language.profileDetails.listDataOccupationLabel, value: data.user.occupation }
			]
		},
		{
			title: language.profileDetails.listDataHeaderContactDetails,
			data: [
				{ label: language.profileDetails.listDataPhoneLabel, value: data.user.phone },
				{ label: language.profileDetails.listDataEmailLabel, value: data.user.email, readonly: true }
			]
		},
		{
			title: language.profileDetails.listDataHeaderAddressDetails,
			data: [
				{ label: language.profileDetails.listDataAddressLabel, value: data.user.address },
				{ label: language.profileDetails.listDataSuburbLabel, value: data.user.city },
				{ label: language.profileDetails.listDataStateLabel, value: data.user.state },
				{ label: language.profileDetails.listDataPostCodeLabel, value: data.user.postcode },
				{ label: language.profileDetails.listDataCountryLabel, value: data.user.country }
			]
		},
		{
			title: language.profileDetails.listDataHeaderAccountInfo,
			data: [
				{ label: language.profileDetails.listDataMemberIDLabel, value: data.user.memberid, readonly: true },
				{ label: language.profileDetails.listDataDateRegisteredLabel, value: data.user.date_regis, readonly: true },
				{ label: language.profileDetails.listDataDateVerifiedLabel, value: data.user.date_regis_completed, readonly: true },
				{ label: language.profileDetails.listDataAccountStatusLabel, value: data.user.status, readonly: true }
			]
		}
	]

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	return (
		<>	
			<StatusBar barStyle={"dark-content"}/>
			<Center flex={1} justifyContent={"center"} pb={"4"}>
				<HStack alignItems={"center"} space={"3"} flexDir={"row"} py={"4"} px={"4"}>
					<Button
					size={"lg"}
						leftIcon={<Ionicon name={"create-outline"} color={"#FFF"} size={22} />}
						onPress={() => navigation.navigate('ProfileEdit')}>{ language.profileDetails.buttonUpdateProfile }</Button>
				</HStack>
				<VStack flex="1" space={"4"} w={"100%"}>
					<SectionList
						sections={UserData}
						keyExtractor={(item, index) => item + index }
						renderItem={(item, index) => <ListItem data={item} key={index} /> }
						renderSectionHeader={({section: { title }}) => <HeaderItem title={title} /> }
					/>
				</VStack>
			</Center>
		</>						
	)
}

class HeaderItem extends React.PureComponent {
	render() {
		return (
			<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"} key={this.props.title.replace(' ', '_').toLowerCase()}>
				<Heading size={"sm"}>{this.props.title}</Heading>
			</Box>
		)
	}
}

class ListItem extends React.PureComponent {
	render() {
		const item = this.props.data
		return (
			<>
				<HStack px={"4"} py={"2"} w={"100%"} alignItems={"center"} justifyContent={"space-between"}>
					<VStack>
						<Text fontSize={"xs"} color={"coolGray.500"}>{item.item.label}</Text>
						<Text fontSize={"lg"}>{item.item.value}</Text>
					</VStack>
					{ (item.item.value == "" && item.item.label != "Nickname (Optional)") && (
					<HStack>
						<NBIonicon name="alert-circle-outline" color={"info.500"} fontSize={"lg"} pr={"1"} />
						<Text color={"info.500"} fontSize={"xs"} mt={"0.25"}>{ item.item.label == "Member ID Number" ? language.profileDetails.statusVerifyIdentity : language.profileDetails.statusUpdateDetails }</Text>
					</HStack>
					)}
				</HStack>
				<Divider />
			</>
		)
	}
}
