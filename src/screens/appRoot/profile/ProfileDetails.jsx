import React, { useEffect } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Divider, SectionList,VStack } from 'native-base'
import AlertBanner from '../../../components/common/AlertBanner'
import Toolbar from '../../../components/common/Toolbar'
import ListHeader from '../../../components/common/ListHeader'
import DetailRowItem from '../../../components/profile/DetailRowItem'

//data
import { useRecoilValue, useRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { ProfileObjFormats, UserTemplate, profileDetailToolbarConfig } from '../../../config'
import { mapSectionDataFromTemplate, mapActionsToConfig, localiseObjectData } from '../../../data/Actions'
import { userState } from '../../../data/recoil/user'
import { loadingState, noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ProfileDetails = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const user = useRecoilValue(userState)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)

	let actions = [() => navigation.navigate('ProfileEdit', { showBack: true })]
	const toolbarConfig = mapActionsToConfig(profileDetailToolbarConfig, actions)
	
	let labels = language.profileDetails.labels
	let headings = language.profileDetails.headings
	let localisedData = localiseObjectData(user, ProfileObjFormats, lang)
	let sections = mapSectionDataFromTemplate(UserTemplate, localisedData, labels, headings)

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	useEffect(() => {
		setLoading({ status: false, type: "none" })
	}, [user])

	return (
		<AppSafeArea>
			<SectionList
				sections={sections}
				keyExtractor={(item, index) => item + index}
				stickySectionHeadersEnabled={false}
				ItemSeparatorComponent={() => <Divider />}
				renderItem={({ item, index, section }) => <DetailRowItem item={item} index={index} section={section} />}
				renderSectionHeader={({ section }) => <ListHeader title={section.title} id={section.id} index={section.index} styles={{ mt: "4", roundedTop: "8" }}  /> }
				ListHeaderComponent={() => (
					<VStack key={Math.random() * 100} space={"4"}>
						{notices && <AlertBanner />}
						<Toolbar config={toolbarConfig} />
					</VStack>
				)}
				ListFooterComponent={() => <Toolbar config={toolbarConfig} nb={{ mt: "4" }} />}
				contentContainerStyle={{ padding: "2.5%", justifyContent: "flex-start" }}
			/>
		</AppSafeArea>
	)
}

export default ProfileDetails