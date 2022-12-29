import React from 'react'

//components
import { ImageBackground } from 'react-native'
import FocusRender from 'react-navigation-focus-render'
import { Button, Center, Divider, HStack, SectionList, Spinner, StatusBar, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import AlertBanner from '../../../components/common/AlertBanner'
import { Notice } from '../../../components/common/Notice'
import ListHeaderItem from '../../../components/transactions/ListHeaderItem'
import ListRowItem from '../../../components/transactions/ListRowItem'

//data
import { AuthContext } from '../../../data/Context'
import { buildDataPath, groupTransactionsByDate } from '../../../data/Actions'
import { api } from '../../../config'
import { selector, useRecoilValue, useRecoilState } from 'recoil'
import { transactionList } from '../../../data/recoil/transactions'
import { noticeState, loadingState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
import { useNavigation } from '@react-navigation/native'
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

const handleRefresh = (transactions, uid) => {
	const oldest = transactions.slice(-1)[0]
	const datetime = [oldest.created_date, oldest.created_time]
	const timestamp = new Date(datetime.join('T')).getTime() / 1000

	api.get(buildDataPath('transactions', uid, 'list', { from: timestamp, count: 10 }))
	.then(response => {
		//console.log(response.data)
		//setTransactions(addExtraRecordData(response.data))
		//resolve('✅ Loaded Recent Transactions')
	})
	.catch(error => { reject('🚫 ' + error) })
}

const TransactionsList = () => {
	const navigation = useNavigation()
	const { auth } = React.useContext(AuthContext)
	const groupedList = useRecoilValue(transactionsGrouped)
	const [ transactions, setTransactions ] = useRecoilState(transactionList)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const notices = useRecoilValue(noticeState)
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
					<FocusRender>
						<SectionList
							sections={groupedList.map((section, index) => ({...section, index}))}
							renderItem={(item, index) => <ListRowItem data={item} />}
							renderSectionHeader={({section}) => {							
								return <ListHeaderItem date={section.header} index={section.index} />
							}}
							ListFooterComponent={() => <ListFooterItem />}
							ItemSeparatorComponent={() => <Divider />}
							keyExtractor={item => item.transaction_number}
							getItemLayout={(item, index) => {
								return { length: 80, offset: 80 * index, index }
							}}
							showsVerticalScrollIndicator={false}
							// initialNumToRender={10}
							// maxToRenderPerBatch={10}
							// removeClippedSubviews={true}
							// refreshing={loading}
							// onEndReached={handleRefresh(transactions, auth.uid)}
							// onEndReachedThreshold={0.001}
							stickySectionHeadersEnabled={false}
							ListHeaderComponent={notices ? <AlertBanner w={"100%"} my={"2.5%"} /> : null}
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
			<Button onPress={handleRefresh(transactions, auth.uid)}>
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