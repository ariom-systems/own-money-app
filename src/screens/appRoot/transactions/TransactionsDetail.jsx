import React, { useContext, useReducer, useEffect } from 'react';

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Divider, SectionList, VStack } from 'native-base'
import ListHeader from '../../../components/common/ListHeader';
import DetailRowItem from '../../../components/transactions/DetailRowItem'
import Toolbar from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner';

//data
import { mapSectionDataFromTemplate, mapActionsToConfig } from '../../../data/Actions'
import { useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil'
import { transactionObj } from '../../../data/recoil/transactions'
import { noticeState, loadingState } from '../../../data/recoil/system'
import { userState } from '../../../data/recoil/user'
import { transactionsDetailToolbarConfig, TransactionTemplate } from '../../../config'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransactionsDetail = () => {
	const navigation = useNavigation()
	const transaction = useRecoilValue(transactionObj)
	const notices = useRecoilValue(noticeState)
	const [ loading, setLoading ] = useRecoilState(loadingState)

	const user = useRecoilValue(userState)
	const resetTransaction = useResetRecoilState(transactionObj)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	const actions = [() => handleBack(navigation)]
	const toolbarConfig = mapActionsToConfig(transactionsDetailToolbarConfig, actions)

	let labels = language.transactionsDetail.labels
	let headings = language.transactionsDetail.headings
	const sections = mapSectionDataFromTemplate(TransactionTemplate, transaction, labels, headings)

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, user])

	useEffect(() => {
		setLoading({ status: false, text: 'none' })
	}, [transaction])

	const handleBack = () => {
		navigation.goBack()
		resetTransaction()
	}

	return (
		<AppSafeArea>
			<SectionList
				sections={sections}
				keyExtractor={(item, index) => item + index }
				renderItem={({item, index, section}) => <DetailRowItem item={item} index={index} section={section} />}
				renderSectionHeader={({ section }) => {
					if (section.title != "Status") {
						return <ListHeader title={section.title} id={section.id} index={section.index} styles={{ mt: "4", roundedTop: "8" }} />
					}
				}}
				stickySectionHeadersEnabled={false}
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={() => <Divider />}
				ListHeaderComponentStyle={{ marginTop: "2.5%"}}
				ListHeaderComponent={() => (
					<VStack space={"4"} mb={"4"}>
						{notices && <AlertBanner />}
						<Toolbar config={toolbarConfig} />
					</VStack>
				)}
				contentContainerStyle={{ padding: "2.5%", justifyContent: "flex-start" }}
			/>
		</AppSafeArea>
	)
}

export default TransactionsDetail;