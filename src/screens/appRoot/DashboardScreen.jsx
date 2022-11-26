import React from 'react'
import { ImageBackground, Platform, StyleSheet } from 'react-native'
import { Box, Button, Divider, Heading, HStack, ScrollView, Text, VStack } from 'native-base'
import HeaderItem from '../../components/dashboard/HeaderItem'
import ListItem from '../../components/dashboard/ListItem'

import { AuthContext, DataContext } from '../../data/Context'
import { formatCurrency, groupTransactionsByDate } from '../../data/Actions'

import * as Recoil from 'recoil'
import * as Atoms from '../../data/recoil/Atoms'

import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const DashboardScreen = ({ navigation }) => {
	const { auth } = React.useContext(AuthContext)
	const globals = Recoil.useRecoilValue(Atoms.globals)
	const transactions = Recoil.useRecoilValue(Atoms.transactions)
	const user = Recoil.useRecoilValue(Atoms.user)

 	const [ transferList , setTransferList ] = React.useState([])
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
	
	let formatted = formatCurrency(globals.rate, "th-TH", "THB")
	let rateValue = formatted.symbol + formatted.value
	let rateAsOf = new Date().toLocaleString('en-GB').split(',')[0]
	
	React.useEffect(() => {
		const listData = transactions.list.slice(0, 10)
		let grouped = groupTransactionsByDate(listData)
		let output = []
		grouped.forEach(section => {
			output.push(<HeaderItem key={section.header} header={section.header}/>)
			section.data.forEach(item => {
				output.push(<ListItem key={item.transaction_number} data={item} />)
				if(item !== section.data[section.data.length - 1]) {
					output.push(<Divider key={Math.random()} />)
				}
			})
		})
		setTransferList(output)
	}, [transactions.list])

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
			<ScrollView>
				<VStack px={"2.5%"} py={"5%"} space={"4"}>
					<Box justifItems={"flex-start"}>
						<Box p={"5%"} backgroundColor={"white"} rounded={"lg"}>
							<Heading>{ language.dashboard.greeting } {user.firstname} {user.lastname}!</Heading>
							<Box backgroundColor={"gray.200"} borderRadius={"8"} p={"4"} my={"4"}>
								<HStack justifyContent={"space-between"} borderBottomColor={"coolGray.400"} borderBottomWidth={"1"} pb={"2"}>
									<Heading fontSize={"lg"}>{ language.dashboard.currentRate }</Heading>
									<Heading fontSize={"lg"}>{rateAsOf}</Heading>
								</HStack>
								<HStack justifyContent={"center"} alignItems={"center"} py={"4"}>
									<VStack alignItems={"center"}>
										<AuSVG size={{width: 40, height: 40}} />
										<Text>{ language.dashboard.audCode }</Text>
									</VStack>
									<Text fontSize={"4xl"} textAlign={"center"} mx={"4"}>$1 = {rateValue}</Text>
									<VStack alignItems={"center"}>
										<ThSVG size={{width: 40, height: 40}} />
										<Text>{ language.dashboard.thbCode }</Text>
									</VStack>
								</HStack>
							</Box>
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
					<Box backgroundColor={"white"} rounded={"lg"}>
						<Heading p={"4"} fontSize={"xl"}>{ language.dashboard.recentTransfersTitle }</Heading>
						<Box>
							{transferList}
						</Box>
					</Box>
					<Box w={"100%"} alignItems={"center"} justifItems={"flex-start"}>
						<Button size={"lg"} w={"75%"} onPress={() => navigation.navigate('Transactions', {screen: 'TransactionsList'})}>{ language.dashboard.buttonViewTransactions }</Button>
					</Box>
				</VStack>
			</ScrollView>
		</ImageBackground>
	)
}

export default DashboardScreen