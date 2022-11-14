import React from 'react';
import { ImageBackground, Platform, StyleSheet } from 'react-native'
import { Avatar, Badge, Box, Button, Column, Divider, Heading, HStack,
	Modal, Pressable, ScaleFade, ScrollView, SectionList, Spacer, Text, VStack } from 'native-base'

import { AuthContext, DataContext } from '../../data/Context'
import { formatCurrency } from '../../data/Actions'

import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const DashboardScreen = ({ navigation }) => {
	const { auth } = React.useContext(AuthContext)
	const { data } = React.useContext(DataContext)
	const [ transferList , setTransferList ] = React.useState([])
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
	
	HeaderItem.contextType = AuthContext
	ListItem.contextType = DataContext

	let rateAsOf, rateValue

	if(data.globals.length !== 0) {
		let formatted = formatCurrency(data.globals.rate, "th-TH", "THB")
		rateValue = formatted.symbol + formatted.value
	} else {
		rateValue = 0.00
	}
	rateAsOf = new Date().toLocaleString('en-GB').split(',')[0]
	
	React.useEffect(() => {
		let output = []
		const listData = data.transactions
		if(listData.length !== 0) {
			listData.forEach(section => {
				output.push(<HeaderItem key={section.header} header={section.header}/>)
				section.data.forEach(item => {
					output.push(<ListItem key={item.transaction_number} data={item} />)
					if(item !== section.data[section.data.length - 1]) {
						output.push(<Divider key={Math.random()} />)
					}
				})
			})
		}
		setTransferList(output)
	}, [data.transactions])

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
							<Heading>{ language.dashboard.greeting } {data.user.firstname} {data.user.lastname}!</Heading>
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



class HeaderItem extends React.PureComponent {
	static contextType = AuthContext
	render() {
		const auth = this.context.auth
		const date = this.props.header
		let formattedDate = new Date().toLocaleDateString(auth.lang, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
		return(
			<Box backgroundColor={"primary.200"} p={"4"} w={"100%"}>
				<Heading size={"sm"}>{formattedDate}</Heading>
			</Box>
		)
	}
}

class ListItem extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			showModal: false
		}
	}

	static contextType = DataContext

	handlePress() {
		this.setState({ showModal: true })
	}

	render() {
		const data = this.props.data
		let statusBadge
		switch(data.status) {
			case 'Wait for payment': statusBadge = 'default'; break
			case 'Cancelled': statusBadge = 'danger'; break
			case 'Completed': statusBadge = 'success'; break
		}
		const sendAmount = formatCurrency(data.transfer_amount, "en-AU", "AUD").full
		const receiveAmount = formatCurrency(data.received_amount, "th-TH", "THB").full
		const rate = formatCurrency(data.rate, "en-AU", "AUD").full
		const fees = formatCurrency(data.fee_AUD, "en-AU", "AUD").full
		const totalToPay = formatCurrency((Number.parseFloat(data.transfer_amount) + Number.parseFloat(data.fee_AUD)), "en-AU", "AUD").full

		return (
			<Box>
				<Pressable px={"4"} onPress={() => this.handlePress() }>
					<HStack alignItems={"center"} space={"3"} py={"4"}>
						<Avatar size={"48px"} backgroundColor={"primary.600"}>{data.initials}</Avatar>
						<VStack>
							<Text mb={"2"} bold>{data.fullname}</Text>
						</VStack>
						<Spacer />
						<VStack alignContent={"flex-end"} space={"2"}>
							<Badge colorScheme={statusBadge} variant={"outline"}>{data.status}</Badge>
							<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{sendAmount} AUD</Text>
							<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{receiveAmount} THB</Text>
						</VStack>
					</HStack>
				</Pressable>
				<Modal isOpen={this.state.showModal} onClose={() => this.setState({ showModal: false }) } size={"lg"}>
					<Modal.Content w={"95%"} >
						<Modal.CloseButton />
						<Modal.Header>{"Transaction: " + data.transaction_number}</Modal.Header>
						<Modal.Body>
							<HStack justifyContent={"space-between"} py={"4"}>
								<Text bold>{ language.dashboard.modalLabelBeneficiaryName }</Text>
								<Text textAlign={"right"} >{ data.fullname }</Text>
							</HStack>
							<HStack justifyContent={"space-between"} py={"4"}>
								<Text bold>{ language.dashboard.modalLabelAccountNumber }</Text>
								<Text textAlign={"right"} >{ data.accountnumber }</Text>
							</HStack>
							<HStack justifyContent={"space-between"} py={"4"} borderBottomWidth={"1"} borderBottomColor={"coolGray.300"}>
								<Text bold>{ language.dashboard.modalLabelBank }</Text>
								<Text textAlign={"right"}>{ data.bankname }</Text>
							</HStack>
							<HStack justifyContent={"space-between"} py={"4"}>
								<Text bold>{ language.dashboard.modalLabelSendAmount }</Text>
								<Text textAlign={"right"} >{sendAmount} { language.dashboard.audCode }</Text>
							</HStack>
							<HStack justifyContent={"space-between"} py={"4"}>
								<Text bold>{ language.dashboard.modalLabelRate }</Text>
								<Text textAlign={"right"} >{rate} { language.dashboard.thbCode }</Text>
							</HStack>
							<HStack justifyContent={"space-between"} py={"4"}>
								<Text bold>{ language.dashboard.modalLabelFees }</Text>
								<Text textAlign={"right"} >{fees} { language.dashboard.audCode }</Text>
							</HStack>
							<HStack justifyContent={"space-between"} py={"4"}>
								<Text bold>{ language.dashboard.modalLabelTotalToPay }</Text>
								<Text textAlign={"right"} >{totalToPay} { language.dashboard.audCode }</Text>
							</HStack>
							<HStack justifyContent={"space-between"} py={"4"} borderBottomWidth={"1"} borderBottomColor={"coolGray.300"}>
								<Text bold>{ language.dashboard.modalLabelReceivableAmount }</Text>
								<Text textAlign={"right"}>{receiveAmount} { language.dashboard.thbCode }</Text>
							</HStack>
							<HStack justifyContent={"space-between"} py={"4"}>
								<Text bold>{ language.dashboard.modalLabelStatus }</Text>
								<Badge colorScheme={statusBadge} variant={"solid"} textAlign={"right"} >{ data.status }</Badge>
							</HStack>
							<HStack justifyContent={"space-between"} py={"4"}>
								<Text bold>{ language.dashboard.modalLabelCreatedDate }</Text>
								<Text textAlign={"right"} >{ data.created_date }</Text>
							</HStack>
							{ data.status == 'Completed' && ( 
							<HStack justifyContent={"space-between"} py={"4"}>
								<Text bold>{ language.dashboard.modalLabelCompletedDate }</Text>
								<Text textAlign={"right"} >{ data.completed_date }</Text>
							</HStack>)}
						</Modal.Body>
					</Modal.Content>
				</Modal>
			</Box>
		)
	}
}

export default DashboardScreen