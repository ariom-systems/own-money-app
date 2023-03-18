import React, { useEffect } from 'react'

//components
import AppSafeArea from '../../components/common/AppSafeArea'
import { Box, Divider, Heading, SectionList, VStack } from 'native-base'
import AlertBanner from '../../components/common/AlertBanner'
import ExchangeRate from '../../components/common/ExchangeRate'
import Toolbar from '../../components/common/Toolbar'
import ListItem from '../../components/dashboard/ListItem'
import ListHeader from '../../components/common/ListHeader'

//data
import { selector, useRecoilValue, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { Sizes, dashboardToolbarConfigBottom, dashboardToolbarConfigTop } from '../../config'
import { groupTransactionsByDate, mapActionsToConfig } from '../../data/Actions'
import { transactionList } from '../../data/recoil/transactions'
import { userState } from '../../data/recoil/user'
import { loadingState, noticeState, langState } from '../../data/recoil/system'

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
	const forceUpdate = useForceUpdate()
	const transactions = useRecoilValue(dashboardTransactions)
	const user = useRecoilValue(userState)
	const setLoading = useSetRecoilState(loadingState)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	useEffect(() => {
		setLoading({ status: false, message: 'none' })
	},[])
	

	const actionsBottom = [() => navigation.navigate('Transactions', { screen: 'TransactionsList' })]
	const toolbarBottomConfig = mapActionsToConfig(dashboardToolbarConfigBottom, actionsBottom)
	
	const actionsTop = [() => navigation.navigate('Transfer', { screen: 'TransferStepOne' })]
	const toolbarTopConfig = mapActionsToConfig(dashboardToolbarConfigTop, actionsTop)
	
	return (
		<AppSafeArea>
			<SectionList
				sections={transactions.map((section, index) => ({ ...section, index }))} 
				ListHeaderComponent={() => 
					<VStack space={Sizes.spacing}>
						{notices && <AlertBanner />}
						<VStack p={"4"} bgColor={"white"} space={Sizes.spacing} rounded={"8"}>
							<Heading>{language.dashboard.ui.greeting} {user.firstname} {user.lastname}!</Heading>
							<ExchangeRate size={"lg"}/>
						</VStack>
						<Toolbar config={toolbarTopConfig} />
						<Box bgColor={"white"} roundedTop={"8"}>
							<Heading p={"4"} fontSize={"xl"}>{language.dashboard.ui.recentTransfersTitle}</Heading>
						</Box>
					</VStack>
				}
				stickySectionHeadersEnabled={false}
				ItemSeparatorComponent={() => <Divider />}
				renderItem={({item, index, section}) => <ListItem key={index} data={{...item, index: index, section: { count: transactions.length, sectionIndex: section.index, sectionItemLength: section.data.length }}} /> }
				renderSectionHeader={({section}) => <ListHeader title={section.header} index={section.index} date={true} />}
				ListFooterComponent={() => <Toolbar nb={{ mt: "4" }} config={toolbarBottomConfig} />}
				contentContainerStyle={{ padding: "2.5%", justifyContent: "flex-start"}}
			/>
			
		</AppSafeArea>
	)
}

export default DashboardScreen