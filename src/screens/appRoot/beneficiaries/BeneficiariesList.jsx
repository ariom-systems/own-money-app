import React, { useEffect } from 'react'

//components
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Box, Divider, VStack } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view'
import AlertBanner from '../../../components/common/AlertBanner'
import ListSwipeItem from '../../../components/beneficiaries/ListSwipeItem'
import ListSwipeHiddenItem from '../../../components/beneficiaries/ListSwipeHiddenItem'
import Toolbar from '../../../components/common/Toolbar'

//data
import { useNavigation } from '@react-navigation/native'
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { Sizes, beneficiaryListToolbarConfig } from '../../../config'
import { mapActionsToConfig } from '../../../data/Actions'
import { beneficiaryList } from '../../../data/recoil/beneficiaries'
import { noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const BeneficiariesList = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const notices = useRecoilValue(noticeState)
	const beneficiaries = useRecoilValue(beneficiaryList)
	const lang = useRecoilValue(langState)
	
	const actions = [() => navigation.navigate('BeneficiariesAdd')]
	const toolbarConfig = mapActionsToConfig(beneficiaryListToolbarConfig, actions)

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	return (
		<AppSafeArea>
			<Box px={"2.5%"} justifyContent={"flex-start"} w={"100%"} h={"100%"}>
				<SwipeListView
					data={beneficiaries}
					renderItem={(item, rowMap) => <ListSwipeItem data={item} rowMap={rowMap} navigation={navigation} />}
					renderHiddenItem={(item, rowMap) => <ListSwipeHiddenItem data={item} rowMap={rowMap} navigation={navigation} />}
					rightOpenValue={-160}
					previewRowKey={'0'}
					previewOpenValue={0}
					previewOpenDelay={3000}
					
					ItemSeparatorComponent={<Divider />}
					keyExtractor={(item, index) => item + index}
					getItemLayout={(item, index) => {
						return { length: 80, offset: 80 * index, index }
					}}
					initialNumToRender={20}
					maxToRenderPerBatch={20}
					removeClippedSubviews={false}
					ListHeaderComponent={() =>
						<VStack space={Sizes.spacing} mb={"4"}>
							{notices && <AlertBanner />}
							<Toolbar config={toolbarConfig} />
						</VStack>
					}
					ListFooterComponent={() => {
						if(beneficiaries.length > 5) {
							return <Toolbar nb={{ mt: "4" }} config={toolbarConfig} />}
						}
					}
					contentContainerStyle={{ paddingVertical: "2.5%" }}
				/>
			</Box>
		</AppSafeArea>	
	)
}

export default BeneficiariesList