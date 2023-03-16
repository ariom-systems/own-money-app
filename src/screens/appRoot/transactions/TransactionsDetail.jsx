import React, { useEffect } from 'react';

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Divider, SectionList, VStack, useBreakpointValue } from 'native-base'
import ListHeader from '../../../components/common/ListHeader';
import DetailRowItem from '../../../components/transactions/DetailRowItem'
import Toolbar from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner';

//data
import { useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { Sizes, transactionsDetailToolbarConfig, TransactionTemplate } from '../../../config'
import { mapSectionDataFromTemplate, mapActionsToConfig } from '../../../data/Actions'
import { transactionObj } from '../../../data/recoil/transactions'
import { noticeState, loadingState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransactionsDetail = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const resetTransaction = useResetRecoilState(transactionObj)
	const transaction = useRecoilValue(transactionObj)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)
	const flexDir = useBreakpointValue({ base: 'row', sm: 'column', md: 'row' })

	const actions = [() => handleBack(navigation)]
	const toolbarConfig = mapActionsToConfig(transactionsDetailToolbarConfig, actions)

	let labels = language.transactionsDetail.labels
	let headings = language.transactionsDetail.headings
	const sections = mapSectionDataFromTemplate(TransactionTemplate, transaction, labels, headings)

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

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
					<VStack space={Sizes.spacing} mb={"4"}>
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