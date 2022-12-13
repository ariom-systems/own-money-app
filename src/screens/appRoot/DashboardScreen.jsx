import React from 'react'
import { ImageBackground, Platform, StyleSheet } from 'react-native'
import { Box, Button, Divider, Heading, SectionList, ScrollView, Text, VStack } from 'native-base'
import StaticSectionList from '../../components/dashboard/StaticSectionList'

import { AuthContext } from '../../data/Context'
import { formatCurrency, groupTransactionsByDate } from '../../data/Actions'

import { selector, useRecoilState, useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'
import { transactionList } from '../../data/recoil/transactions'
import { globalState } from '../../data/recoil/system'

import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'

import LocalizedStrings from 'react-native-localization'
import ExchangeRate from '../../components/common/ExchangeRate'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const dashboardTransactions = selector({
	key: 'dashboardTransactions',
	get: ({get}) => {
		let unsorted = get(transactionList)
		const listData = unsorted.slice(0, 10)
		return groupTransactionsByDate(unsorted)
	}
})

const DashboardScreen = ({ navigation }) => {
	const { auth } = React.useContext(AuthContext)
	const transactions = useRecoilValue(dashboardTransactions)
	const user = useRecoilValue(userState)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	let styles = StyleSheet.create({})

	const generateBoxShadow = (xOffset, yOffset, shadowColorIos, shadowOpacity, shadowRadius, elevation, shadowColorAndroid) => {
		if ( Platform.OS === 'ios' ) {
			styles.boxShadow = {
				shadowColor: shadowColorIos,
				shadowOffset: { width: xOffset, height: yOffset },
				shadowOpacity,
				shadowRadius
			}
		} else if (Platform.OS === 'android') {
			styles.boxShadow = {
				elevation,
				shadowColor: shadowColorAndroid
			}
		}
	}

	generateBoxShadow(-2, 4, '#2b2b2b', 0.2, 3, 4, '#2b2b2b')

	return (
		<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<ScrollView nestedScrollEnabled={false} keyboardShouldPersistTaps={"handled"}>
				<VStack px={"2.5%"} py={"5%"} space={"4"}>
					<Box justifItems={"flex-start"}>
						<Box p={"5%"} backgroundColor={"white"} rounded={"10"}>
							<Heading>{ language.dashboard.greeting } {user.firstname} {user.lastname}!</Heading>
							<ExchangeRate size={"lg"} nb={{my: "4"}} />
							<Box backgroundColor={"primary.200"} borderRadius={"8"} p={"4"} mt={"4"}>
								<Heading fontSize={"lg"}>{ language.dashboard.yourPointsTitle }</Heading>
								<Box pt={"4"} pb={"8"}>
									<Text
										textAlign={"center"}
										fontSize={"3xl"}
										bold
										style={[styles.boxShadow, { transform: [{ rotate: "-8deg"}], backgroundColor: "#FFFFFF" }]}>{ language.dashboard.yourPointsPlaceholder }</Text>
								</Box>
							</Box>
						</Box>
					</Box>
					<Box backgroundColor={"white"} rounded={"10"}>
						<Heading p={"4"} fontSize={"xl"}>{ language.dashboard.recentTransfersTitle }</Heading>
					</Box>
					<StaticSectionList
						sections={transactions} sectionProps={{ mb: "4", roundedTop: "10", roundedBottom: "10" }} />
					<Box w={"100%"} alignItems={"center"} justifItems={"flex-start"}>
						<Button size={"lg"} w={"75%"} onPress={() => navigation.navigate('Transactions', {screen: 'TransactionsList'})}>{ language.dashboard.buttonViewTransactions }</Button>
					</Box>
				</VStack>
			</ScrollView>
		</ImageBackground>
	)
}

export default DashboardScreen