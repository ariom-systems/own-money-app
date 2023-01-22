import React, { useContext, useEffect } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Divider, SectionList, VStack } from 'native-base'
import AlertBanner from '../../../components/common/AlertBanner'
import ListRowItem from '../../../components/transactions/ListRowItem'
import Toolbar from '../../../components/common/Toolbar'
import ListHeader from '../../../components/common/ListHeader'

//data
import { selector, useRecoilValue, useRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { AuthContext } from '../../../data/Context'
import { api, transactionsListToolbarConfig } from '../../../config'
import { buildDataPath, groupTransactionsByDate, mapActionsToConfig, addExtraRecordData, dateFormat } from '../../../data/Actions'
import { transactionList } from '../../../data/recoil/transactions'
import { noticeState, loadingState, langState } from '../../../data/recoil/system'

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
	const forceUpdate = useForceUpdate()
	const { auth } = useContext(AuthContext)
	const [ transactions, setTransactions ] = useRecoilState(transactionList)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const groupedList = useRecoilValue(transactionsGrouped)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)

	const actions = [() => {
		new Promise((resolve) => {
			setLoading({ status: true, type: 'loading' })
			forceUpdate()
			setTimeout(() => {
				if (loading.status == false) { resolve() }
			}, 1000)
		}).then(result => {
			handleRefresh()
		})
	}]

	const toolbarConfig = mapActionsToConfig(transactionsListToolbarConfig, actions)

	const handleRefresh = () => {
		const oldest = transactions.slice(-1)[0]
		let oldestDate = new Date(oldest.created_datetime)
		let formatted = dateFormat('Y-m-d H:i:s', oldestDate)
		let queryDate = encodeURIComponent(formatted)
		api.get(buildDataPath('transactions', auth.uid, 'list', { from: queryDate, count: 10 }))
		.then(response => {
			let data = response.data, newData
			newData = addExtraRecordData(data)
			setTransactions((prev) => ([...prev, ...newData]))
			setTimeout(() => {
				setLoading({ status: false, message: 'none' })
			}, 500)
		})
		.catch(error => { reject('🚫 ' + error) })
	}

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	return (
		<AppSafeArea>
			<SectionList
				sections={groupedList.map((section, index) => ({ ...section, index }))}
				renderItem={(item, index) => <ListRowItem data={item} key={index} />}
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