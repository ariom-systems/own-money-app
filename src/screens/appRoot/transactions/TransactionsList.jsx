import React, { useContext, useEffect, useReducer } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import FocusRender from 'react-navigation-focus-render'
import { Button, Center, Divider, HStack, SectionList, Spinner, VStack } from 'native-base'
import AlertBanner from '../../../components/common/AlertBanner'
import ListRowItem from '../../../components/transactions/ListRowItem'
import Toolbar from '../../../components/common/Toolbar'
import ListHeader from '../../../components/common/ListHeader'

//data
import { AuthContext } from '../../../data/Context'
import { buildDataPath, groupTransactionsByDate, mapActionsToConfig, addExtraRecordData, dateFormat } from '../../../data/Actions'
import { api, transactionsListToolbarConfig } from '../../../config'
import { selector, useRecoilValue, useRecoilState } from 'recoil'
import { transactionList } from '../../../data/recoil/transactions'
import { noticeState, loadingState } from '../../../data/recoil/system'
import { userState } from '../../../data/recoil/user'

//lang
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

const TransactionsList = () => {
	const navigation = useNavigation()
	const { auth } = useContext(AuthContext)
	const groupedList = useRecoilValue(transactionsGrouped)
	const [ transactions, setTransactions ] = useRecoilState(transactionList)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const notices = useRecoilValue(noticeState)
	const user = useRecoilValue(userState)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	const actions = [() => handleRefresh()]
	const toolbarConfig = mapActionsToConfig(transactionsListToolbarConfig, actions)

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, user])

	const handleRefresh = () => {
		const oldest = transactions.slice(-1)[0]
		let oldestDate = new Date(oldest.created_datetime)
		let formatted = dateFormat('Y-m-d H:i:s', oldestDate)
		let queryDate = encodeURIComponent(formatted)
		api.get(buildDataPath('transactions', user.uid, 'list', { from: queryDate, count: 10 }))
		.then(response => {
			let data = response.data, newData
			newData = addExtraRecordData(data)
			setTransactions((prev) => ([...prev, ...newData]))
		})
		.catch(error => { reject('🚫 ' + error) })
	}


	return (
		<AppSafeArea>
			<SectionList
				sections={groupedList.map((section, index) => ({ ...section, index }))}
				renderItem={(item, index) => <ListRowItem data={item} />}
				renderSectionHeader={({ section }) => {
					return <ListHeader title={section.header} index={section.index} date={true} styles={{ mt: "4", roundedTop: "8" }} />
				}}
				ItemSeparatorComponent={() => <Divider />}
				keyExtractor={item => item.transaction_number}
				getItemLayout={(item, index) => {
					return { length: 80, offset: 80 * index, index }
				}}
				showsVerticalScrollIndicator={false}
				initialNumToRender={10}
				maxToRenderPerBatch={10}
				removeClippedSubviews={true}
				stickySectionHeadersEnabled={false}
				ListHeaderComponent={() => (
					<VStack space={"4"}>
						{notices && <AlertBanner />}
					</VStack>
				)}
				ListFooterComponent={() => (
					<Toolbar config={toolbarConfig} nb={{ mt: "4" }} />
				)}
				contentContainerStyle={{ padding: "2.5%", justifyContent: "flex-start" }}
			/>
		</AppSafeArea>
	)
}

export default TransactionsList