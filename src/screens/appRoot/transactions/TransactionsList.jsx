import React from 'react'
import { ImageBackground } from 'react-native'
import FocusRender from 'react-navigation-focus-render'

import { Button, Center, Divider, HStack, SectionList, StatusBar, VStack } from 'native-base'

import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()


import { AuthContext } from '../../../data/Context'
import { Notice } from '../../../components/common/Notice'

import { buildDataPath, formatCurrency, groupTransactionsByDate } from '../../../data/Actions'
import { api } from '../../../config'

import ListHeaderItem from '../../../components/transactions/ListHeaderItem'
import ListRowItem from '../../../components/transactions/ListRowItem'

import { selector, useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { transactionList } from '../../../data/recoil/transactions'
import { loadingState } from '../../../data/recoil/system'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const transactionsGrouped = selector({
	key: 'transactionsGrouped',
	get: ({get}) => {
		let unsorted = get(transactionList)
		return groupTransactionsByDate(unsorted)
	}
})

const handleRefresh = (transactions) => {
	const datetime = [transactions.created_date, transactions.created_time]

	const timestamp = new Date(datetime.join('T')).getTime()
	console.log(timestamp)
	//api.get(buildDataPath('transactions', auth.uid, 'list', { from: today, count: 10 }))
	//api.get(buildDataPath('transactions', auth.uid, 'list', { from: data.transactionTimestamp, count: 11 }))
}

const TransactionsList = ({ navigation }) => {
	const { auth } = React.useContext(AuthContext)
	const groupedList = useRecoilValue(transactionsGrouped)
	const [ transactions, setTransactions ] = useRecoilState(transactionList)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>	
			<StatusBar barStyle={"dark-content"}/>
			<Center flex={1} justifyContent={"center"}>
				<VStack flex="1" w={"100%"} px={"2.5%"} justifyContent={"flex-start"}>
					{ (auth.status !== null && auth.status !== "") && (
						<Notice nb={{w:"100%", mb: "4"}} />
					)}
					<FocusRender>
						<SectionList
							sections={groupedList}
							renderItem={(item, index) => <ListRowItem data={item} />}
							renderSectionHeader={({section: {header}}) => <ListHeaderItem date={header} />}
							ListFooterComponent={() => <ListFooterItem />}
							ItemSeparatorComponent={() => <Divider />}
							keyExtractor={item => item.transaction_number}
							getItemLayout={(item, index) => {
								return { length: 80, offset: 80 * index, index }
							}}
							showsVerticalScrollIndicator={false}
							initialNumToRender={10}
							maxToRenderPerBatch={10}
							removeClippedSubviews={true}
							refreshing={loading}
							onEndReached={handleRefresh(transactions)}
							onEndReachedThreshold={0.001}
							stickySectionHeadersEnabled={false}
							/>
					</FocusRender>
				</VStack>
			</Center>
		</ImageBackground>					
	)
}

const ListFooterItem = () => {
	const { auth } = React.useContext(AuthContext)
	const transactions = useRecoilValue(transactionList)
	const loading = useRecoilValue(loadingState)


	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	return (
		<HStack justifyContent={"center"} py={"8"} alignItems={"center"}>
			{ loading.status == true && <Spinner size={"lg"} /> }
			<Button onPress={handleRefresh(transactions)}>
				{ loading.status == true ? language.transactionsList.labelLoading : language.transactionsList.labelLoadMore }
			</Button>
		</HStack>
	)
}

export default TransactionsList


// const getData = () => {
	// 	dataDispatch({ type: 'LOADING '})
	// 	if(initialLoaded == false) {
	// 		setDataSource(data.transactions)
	// 		setInitialLoaded(true)
	// 		dataDispatch({ type: 'END_LOADING '})
	// 	} else {
	// 		clearTimeout(dataTimeout)
	// 		const dataTimeout = setTimeout(() => {
	// 			
	// 			.then(response => {
	// 				if(response.data !== null) {
	// 					const oldData = data.transactions
	// 					let newResponse = iterateFullName(response.data)
	// 					newResponse = iterateInitials(newResponse)			
	// 					newResponse = iterateDatesTimes(newResponse, 'created_date', 'cr')
	// 					newResponse = iterateDatesTimes(newResponse, 'processed_date', 'pr')
	// 					newResponse = iterateDatesTimes(newResponse, 'completed_date', 'co')
	// 					const groupArrays = groupArrayObjects(newResponse, 'cr_date')
					
	// 					let combined = [...oldData, ...groupArrays]
	// 					let output = []
	// 					//TODO: clean this up if possible
	// 					combined.forEach(function(item) {
	// 						let existing = output.filter(function(value, index) {
	// 							return value.header == item.header
	// 						})
	// 						if(existing.length) {
	// 							let e_index = output.indexOf(existing[0])
	// 							output[e_index].data = output[e_index].data.concat(item.data)
	// 							output[e_index].data = output[e_index].data.filter((value, index, self) => 
	// 								index === self.findIndex((t) => (
	// 									t.transaction_number === value.transaction_number
	// 								))
	// 							)
	// 						} else {
	// 							output.push(item)
	// 						}
	// 					})
	// 					//TODO: make this into a function and move it to 'actions'
	// 					combined = combined.filter((value, index, self) =>
	// 						index === self.findIndex((t) => (
	// 							t.header === value.header
	// 						))
	// 					)
	// 					const lastDate = combined.slice(-1)
	// 					const latest = lastDate[0].data.slice(-1)
	// 					let dateStr = latest[0].created_date.replace(' ', 'T') + 'Z'
	// 					let timestamp = new Date(Date.parse(dateStr)).getTime() / 1000
	// 					//log('timestamp :' + timestamp)
	// 					const lastTimestamp = data.transactionTimestamp
	
	// 					dataDispatch({ type: 'LOAD_TRANSACTIONS', payload: { data: combined, index: timestamp, last: lastTimestamp } })
	// 					setDataSource(combined)
	// 					dataDispatch({ type: 'END_LOADING '})
	// 				}
	// 			})
	// 			.catch(error => console.error(error))
	// 		}, 1000)
	// 	}
	// }

	// const handleRefresh = () => {
	// 	dataDispatch({ type: 'LOADING '})
	// 	getData()
	// 	dataDispatch({ type: 'END_LOADING '})
	// }

	// React.useEffect(() => {	
		
	// }, [])