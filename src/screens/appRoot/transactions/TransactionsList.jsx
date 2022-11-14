import React from 'react'
import { Avatar, Badge, Box, Divider, Heading, HStack, Pressable, SectionList,
	Spacer, Spinner, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { AuthContext, DataContext } from '../../../data/Context'
import { buildDataPath, formatCurrency, groupArrayObjects, iterateDatesTimes, iterateFullName, iterateInitials, log } from '../../../data/Actions'
import { api } from '../../../config'

Ionicon.loadFont()

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransactionsList = ({ navigation }) => {

	const { auth } = React.useContext(AuthContext)
	const { data, dataDispatch } = React.useContext(DataContext)
	const [ initialLoaded, setInitialLoaded ] = React.useState(false)
	const [ dataSource, setDataSource ] = React.useState([])
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const renderSeparator = () => <Divider />

	ListItem.contextType = DataContext
	FooterItem.contextType = DataContext

	const getData = () => {
		dataDispatch({ type: 'LOADING '})
		if(initialLoaded == false) {
			setDataSource(data.transactions)
			setInitialLoaded(true)
			dataDispatch({ type: 'END_LOADING '})
		} else {
			clearTimeout(dataTimeout)
			const dataTimeout = setTimeout(() => {
				api.setHeader('Authorization', 'Bearer ' + auth.token)
				api.get(buildDataPath('transactions', auth.uid, 'list', { from: data.transactionTimestamp, count: 11 }))
				.then(response => {
					if(response.data !== null) {
						const oldData = data.transactions
						let newResponse = iterateFullName(response.data)
						newResponse = iterateInitials(newResponse)			
						newResponse = iterateDatesTimes(newResponse, 'created_date', 'cr')
						newResponse = iterateDatesTimes(newResponse, 'processed_date', 'pr')
						newResponse = iterateDatesTimes(newResponse, 'completed_date', 'co')
						const groupArrays = groupArrayObjects(newResponse, 'cr_date')
					
						let combined = [...oldData, ...groupArrays]
						let output = []
						//TODO: clean this up if possible
						combined.forEach(function(item) {
							let existing = output.filter(function(value, index) {
								return value.header == item.header
							})
							if(existing.length) {
								let e_index = output.indexOf(existing[0])
								output[e_index].data = output[e_index].data.concat(item.data)
								output[e_index].data = output[e_index].data.filter((value, index, self) => 
									index === self.findIndex((t) => (
										t.transaction_number === value.transaction_number
									))
								)
							} else {
								output.push(item)
							}
						})
						//TODO: make this into a function and move it to 'actions'
						combined = combined.filter((value, index, self) =>
							index === self.findIndex((t) => (
								t.header === value.header
							))
						)
						const lastDate = combined.slice(-1)
						const latest = lastDate[0].data.slice(-1)
						let dateStr = latest[0].created_date.replace(' ', 'T') + 'Z'
						let timestamp = new Date(Date.parse(dateStr)).getTime() / 1000
						//log('timestamp :' + timestamp)
						const lastTimestamp = data.transactionTimestamp
	
						dataDispatch({ type: 'LOAD_TRANSACTIONS', payload: { data: combined, index: timestamp, last: lastTimestamp } })
						setDataSource(combined)
						dataDispatch({ type: 'END_LOADING '})
					}
				})
				.catch(error => console.error(error))
			}, 1000)
		}
	}

	const handleRefresh = () => {
		dataDispatch({ type: 'LOADING '})
		getData()
		dataDispatch({ type: 'END_LOADING '})
	}

	React.useEffect(() => {	
		getData()
	}, [])

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
			<SectionList
				sections={dataSource}
				renderItem={item => <ListItem data={item} navigation={navigation} auth={auth} />}
				renderSectionHeader={({section: {header}}) => <HeaderItem header={header} />}
				ListFooterComponent={() => <FooterItem />}
				ItemSeparatorComponent={renderSeparator}
				keyExtractor={item => item.transaction_number}
				getItemLayout={(item, index) => {
					return { length: 80, offset: 80 * index, index }
				}}
				initialNumToRender={10}
				maxToRenderPerBatch={10}
				removeClippedSubviews={true}
				refreshing={data.loading}
				onEndReached={handleRefresh}
				onEndReachedThreshold={0.001}
				stickySectionHeadersEnabled={false}
				/>
		</>						
	)
}

class HeaderItem extends React.PureComponent {
	render() {
		const date = new Date(this.props.header).toLocaleDateString('en-AU', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
		return(
			<Box backgroundColor={"primary.200"} p={"4"} w={"100%"}>
				<Heading size={"sm"}>{date}</Heading>
			</Box>
		)
	}
}

class ListItem extends React.PureComponent {

	static contextType = DataContext

	handlePress() {
		const dataProp = this.props.data
		const { navigation } = this.props
		navigation.navigate('TransactionsDetail', { transactionNumber: dataProp.item.transaction_number })
	}

	render() {
		const data = this.props.data
		let statusBadge
		switch(data.item.status) {
			case 'Wait for payment': statusBadge = 'default'; break
			case 'Cancelled': statusBadge = 'danger'; break
			case 'Completed': statusBadge = 'success'; break
		}
		return (
			<Pressable px={"4"} onPress={() => this.handlePress() }>
				<HStack key={data.item.transaction_number} alignItems={"center"} space={"3"} py={"4"}>
					<Avatar size={"48px"} backgroundColor={"primary.600"}>{data.item.initials}</Avatar>
					<VStack>
						<Text mb={"2"} bold>{data.item.fullname}</Text>
					</VStack>
					<Spacer />
					<VStack alignContent={"flex-end"} space={"2"}>
						<Badge colorScheme={statusBadge} variant={"outline"}>{data.item.status}</Badge>
						<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{formatCurrency(data.item.transfer_amount, "en-AU", "AUD").full} { language.transactionsList.currencyCodeAUD }</Text>
						<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>{formatCurrency(data.item.received_amount, "th-TH", "THB").full} { language.transactionsList.currencyCodeTHB }</Text>
					</VStack>
				</HStack>
			</Pressable>
		)
	}
}

class FooterItem extends React.PureComponent {
	static contextType = DataContext
	render() {
		const data = this.context
		if(data.loading == true) {
			return (
				<HStack justifyContent={"center"} py={"8"} alignItems={"center"}>
					<Spinner size={"lg"} />
					<Text ml={"4"} fontSize={"lg"} color={"primary.600"} bold>{ language.transactionsList.labelLoading }</Text>
				</HStack>
			)
		} else {
			return (
				<HStack justifyContent={"center"} py={"8"} alignItems={"center"}>
					<Text ml={"4"} fontSize={"lg"} color={"primary.600"} bold>{ language.transactionsList.labelScrollDown }</Text>
				</HStack>
			)
		}
	}
}

export default TransactionsList;