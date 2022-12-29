import React from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import { Button, Center, Divider, Factory, HStack, Pressable, 
	SectionList, Spacer, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import AlertBanner from '../../../components/common/AlertBanner'
import DetailHeaderItem from '../../../components/profile/DetailHeaderItem'
import DetailRowItem from '../../../components/profile/DetailRowItem'

//data
import { AuthContext } from '../../../data/Context'
import { mapSectionDataFromTemplate } from '../../../data/Actions'
import { UserTemplate } from '../../../config'
import { useRecoilValue } from 'recoil'
import { userState } from '../../../data/recoil/user'
import { noticeState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ProfileDetails = () => {
	const navigation = useNavigation()
	const { auth } = React.useContext(AuthContext)
	const userData = useRecoilValue(userState)
	const notices = useRecoilValue(noticeState)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const sections = mapSectionDataFromTemplate(userData, UserTemplate)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	const HeaderComponent = () => {
		return (
			<>
				{ notices && <AlertBanner w={"100%"} my={"2.5%"} /> }
				<HStack w={"100%"} justifyContent={"center"} alignItems={"center"} bgColor={"primary.800:alpha.80"} p={"4"} mb={"4"} rounded={"8"}>
					<Button size={"lg"} leftIcon={<Ionicon name={"create-outline"} color={"#FFF"} size={22} />}
						onPress={() => navigation.navigate('ProfileEdit')}>{language.profileDetails.buttonUpdateProfile}</Button>
				</HStack>
			</>
		)
	}

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{ width: '100%', height: '100%' }} resizeMode={"cover"}>
			<StatusBar barStyle={"dark-content"} />
			<Center flex={1} justifyContent={"center"}>
				
				<VStack flex="1" space={"4"} w={"100%"} px={"2.5%"}>
					<SectionList
						sections={sections.map((section, index) => ({ ...section, index }))}
						keyExtractor={(item, index) => item + index }
						stickySectionHeadersEnabled={false}
						ItemSeparatorComponent={() => <Divider />}
						renderItem={(item, index) => <DetailRowItem data={item} key={index} /> }
						renderSectionHeader={({section}) => <DetailHeaderItem title={section.title} index={section.index} /> }
						ListHeaderComponent={HeaderComponent}
					/>
				</VStack>
			</Center>
		</ImageBackground>					
	)
}

export default React.memo(ProfileDetails)