import React from 'react'

//components
import { ImageBackground } from 'react-native'
import { Box, Button, Heading, HStack, ScrollView, StatusBar, VStack } from 'native-base'
import AlertBanner from '../../components/common/AlertBanner'
import StaticSectionList from '../../components/dashboard/StaticSectionList'
import ExchangeRate from '../../components/common/ExchangeRate'
import YourPointSummary from '../../components/points/YourPointSummary'
import Toolbar, { ToolbarItem } from '../../components/common/Toolbar'


//data
import { AuthContext } from '../../data/Context'
import { groupTransactionsByDate } from '../../data/Actions'
import { selector, useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'
import { noticeState } from '../../data/recoil/system'
import { transactionList } from '../../data/recoil/transactions'

//lang
import LocalizedStrings from 'react-native-localization'
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

	return (
		<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<StatusBar barStyle={"dark-content"} />
			<ScrollView>
				<AlertBanner m={"2.5%"} mb={"0"} />
				<VStack p={"2.5%"} space={"4"}>
					<Box justifItems={"flex-start"}>
						<Box p={"5%"} backgroundColor={"white"} rounded={"8"}>
							<Heading>{ language.dashboard.greeting } {user.firstname} {user.lastname}!</Heading>
							<ExchangeRate size={"lg"} nb={{my: "4"}} />
							<YourPointSummary />
						</Box>
					</Box>
					<Box backgroundColor={"white"} rounded={"8"}>
						<Heading p={"4"} fontSize={"xl"}>{ language.dashboard.recentTransfersTitle }</Heading>
					</Box>
					<StaticSectionList sections={transactions} sectionProps={{ roundedTop: "8", roundedBottom: "8" }} listProps={{ space: "4" }} />
					<Toolbar>
						<ToolbarItem
							label={language.dashboard.buttonViewTransactions}
							buttonProps={{ w: "50%" }}
							action={() => navigation.navigate('Transactions', { screen: 'TransactionsList' })} />
					</Toolbar>
				</VStack>
			</ScrollView>
		</ImageBackground>
	)
}

export default DashboardScreen