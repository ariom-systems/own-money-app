import React from 'react';

//components
import { ImageBackground } from 'react-native'
import { Box, Button, Center, Divider, HStack, Pressable, SectionList, Spacer, StatusBar, VStack } from 'native-base'
import DetailHeaderItem from '../../../components/transactions/DetailHeaderItem'
import DetailRowItem from '../../../components/transactions/DetailRowItem'
import StatusBanner from '../../../components/transactions/StatusBanner'
import { useNavigation } from '@react-navigation/native'

//data
import { AuthContext} from '../../../data/Context'
import { mapSectionDataFromTemplate } from '../../../data/Actions'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import { transactionObj } from '../../../data/recoil/transactions'
import { TransactionTemplate } from '../../../config'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransactionsDetail = () => {
	const navigation = useNavigation()
	const { auth } = React.useContext(AuthContext)
	const transaction = useRecoilValue(transactionObj)
	const resetTransaction = useResetRecoilState(transactionObj)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const sections = mapSectionDataFromTemplate(transaction, TransactionTemplate)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	const handleBack = () => {
		navigation.goBack()
		resetTransaction()
	}

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{ width: '100%', height: '100%' }} resizeMode={"cover"}>
			<StatusBar barStyle={"dark-content"} />
			<Center flex={1} justifyContent={"center"}>
				<Box w={"100%"} p={"4"} bgColor={"warmGray.200"} zIndex={"2"}>
					<HStack alignItems={"center"} space={"3"} flexDir={"row"}>
						<Button flex={"1"} onPress={() => handleBack(navigation)}>{language.transactionsDetail.buttonBack}</Button>
					</HStack>
				</Box>
				<VStack flex="1" w={"100%"} px={"2.5%"} justifyContent={"flex-start"}>
					<SectionList
						sections={sections}
						keyExtractor={(item, index) => item + index }
						renderItem={(item, index) => {
							if(item.section.title == "Status") {
								return <StatusBanner status={transaction.status} />
							} else { 
								return <DetailRowItem data = { item } key = { index } nb = {{ bgColor: "white" } } /> 
							}}}
						renderSectionHeader={({ section: { title } }) => {
							if (title != "Status") {
								return <DetailHeaderItem title={title} nb={{ mt: "4" }} />
							}}}
						stickySectionHeadersEnabled={false}
						showsVerticalScrollIndicator={false}
						ItemSeparatorComponent={() => <Divider />}
					/>
				</VStack>
			</Center>
		</ImageBackground>
	)
}

export default TransactionsDetail;