import React from 'react'

//components
import { ImageBackground } from 'react-native'
import { Box, Button, Center, Factory, Heading, HStack, Pressable, SectionList, Spacer, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import DetailRowItem from '../../../components/beneficiaries/DetailRowItem'
import DetailHeaderItem from '../../../components/beneficiaries/DetailHeaderItem'
import AlertModal from '../../../components/common/AlertModal'
import { useNavigation } from '@react-navigation/native'

//data
import { AuthContext } from '../../../data/Context'
import { mapSectionDataFromTemplate } from '../../../data/Actions'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { loadingState } from '../../../data/recoil/system'
import { beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { BeneficiaryTemplate } from '../../../config'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const NBIonicon = Factory(Ionicon)
const icon = <NBIonicon name={"alert-circle"} fontSize={"2xl"} mr={"1"} color={"danger.600"} />

export default function BeneficiariesDetail() {
	const navigation = useNavigation()
	const { auth } = React.useContext(AuthContext)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const setLoading = useSetRecoilState(loadingState)
	const [ isOpen, setIsOpen ] = React.useState(false)
	const onClose = () => setIsOpen(false)
	const cancelRef = React.useRef(null)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const sections = mapSectionDataFromTemplate(beneficiary, BeneficiaryTemplate)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	React.useEffect(() => {
		setLoading({ status: false, text: "" })
	},[])

	const handleEdit = () => {
		setLoading({ status: true, text: 'Loading' })
		navigation.navigate('BeneficiariesEdit')
	}

	const handleBack = () => {
		setLoading({ status: false, text: "" })
		navigation.popToTop()
	}

	const handleDelete = () => {
		navigation.navigate('BeneficiariesDelete')
	}

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>	
			<StatusBar barStyle={"dark-content"}/>
				<Box w={"100%"} p={"4"} bgColor={"primary.700:alpha.80"} zIndex={"2"}>
					<HStack alignItems={"center"} space={"3"} flexDir={"row"}>
						<Button flex={"1"} onPress={() => handleBack(navigation)}>{ language.beneficiariesDetail.buttonBack }</Button>
						<Spacer />
						<Button onPress={() => handleEdit()}>
							<HStack alignItems={"center"} space={"2"}>
								<NBIonicon name={"create-outline"} fontSize={"2xl"} />
								<Text>Edit</Text>
							</HStack>
						</Button>
						<Button onPress={() => setIsOpen(!isOpen)}>
							<NBIonicon name={"trash-outline"} fontSize={"2xl"} pl={"1"} />
						</Button>
					</HStack>
				</Box>

				<Center flex={1} justifyContent={"center"} zIndex={"1"}>
					<VStack w={"100%"} flex={"1"} px={"4"} space={"4"}>
						<SectionList
							sections={sections.map((section, index) => ({ ...section, index })) }
							keyExtractor={(item, index) => item + index }
							renderItem={(item, index, section) => <DetailRowItem data={item} key={index} nb={{ bgColor: "white" }} />}
							renderSectionHeader={({section}) => <DetailHeaderItem title={section.title} index={section.index} nb={{ mt: "4"}}  />}
							stickySectionHeadersEnabled={false}
							showsVerticalScrollIndicator={false}
						/>
					</VStack>
				</Center>
			
			<AlertModal show={isOpen} close={onClose} ldRef={cancelRef}
				header={(
					<HStack>
						{icon}
						<Heading fontSize={"lg"} mt={"0.5"} pr={"4"}>{language.beneficiariesDetail.alertDeleteHeading} { sections.fullname }?</Heading>
					</HStack>
				)}
				content={ language.beneficiariesDetail.alertDeleteMessageLine1 + " " + sections.fullname + ". " + language.beneficiariesDetail.alertDeleteMessageLine2 }>
				<Button.Group space={2}>
					<Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>{ language.beneficiariesDetail.alertDeleteButtonCancel }</Button>
					<Button colorScheme="danger" onPress={() => {onClose(); handleDelete()}}>{ language.beneficiariesDetail.alertDeleteButtonConfirm }</Button>
				</Button.Group>
			</AlertModal>
		</ImageBackground>
	)
}