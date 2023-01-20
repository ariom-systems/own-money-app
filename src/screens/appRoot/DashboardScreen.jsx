import React, { useContext, useEffect, useReducer } from 'react'

//components
import AppSafeArea from '../../components/common/AppSafeArea'
import { Box, Divider, Heading, SectionList, VStack } from 'native-base'
import AlertBanner from '../../components/common/AlertBanner'
import ExchangeRate from '../../components/common/ExchangeRate'
import Toolbar from '../../components/common/Toolbar'
import ListItem from '../../components/dashboard/ListItem'
import ListHeader from '../../components/common/ListHeader'

//data
import { AuthContext } from '../../data/Context'
import { groupTransactionsByDate, mapActionsToConfig } from '../../data/Actions'
import { selector, useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'
import { transactionList } from '../../data/recoil/transactions'
import { noticeState } from '../../data/recoil/system'
import { dashboardToolbarConfig } from '../../config'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const dashboardTransactions = selector({
	key: 'dashboardTransactions',
	get: ({get}) => {
		let unsorted = get(transactionList)
		unsorted.slice(0, 10)
		return groupTransactionsByDate(unsorted)
	}
})

const DashboardScreen = ({ navigation }) => {
	const { auth } = useContext(AuthContext)
	const transactions = useRecoilValue(dashboardTransactions)
	const user = useRecoilValue(userState)
	const notices = useRecoilValue(noticeState)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, user])


	const actions = [() => navigation.navigate('Transactions', { screen: 'TransactionsList' })]
	const toolbarConfig = mapActionsToConfig(dashboardToolbarConfig, actions)
	
	return (
		<AppSafeArea>
			<SectionList
				sections={transactions.map((section, index) => ({ ...section, index }))} 
				ListHeaderComponent={() => 
					<VStack space={"4"}>
						{notices && <AlertBanner />}
						<VStack p={"4"} bgColor={"white"} space={"4"} rounded={"8"}>
							<Heading>{language.dashboard.ui.greeting} {user.firstname} {user.lastname}!</Heading>
							<ExchangeRate size={"lg"}/>
						</VStack>
						<Box bgColor={"white"} roundedTop={"8"}>
							<Heading p={"4"} fontSize={"xl"}>{language.dashboard.ui.recentTransfersTitle}</Heading>
						</Box>
					</VStack>
				}
				stickySectionHeadersEnabled={false}
				ItemSeparatorComponent={() => <Divider />}
				renderItem={({item, index, section}) => <ListItem key={index} data={{...item, index: index, section: { count: transactions.length, sectionIndex: section.index, sectionItemLength: section.data.length }}} /> }
				renderSectionHeader={({section}) => <ListHeader title={section.header} index={section.index} date={true} />}
				ListFooterComponent={() => <Toolbar nb={{ mt: "4" }} config={toolbarConfig} />}
				contentContainerStyle={{ padding: "2.5%", justifyContent: "flex-start"}}
			/>
			
		</AppSafeArea>
	)
}

export default DashboardScreen