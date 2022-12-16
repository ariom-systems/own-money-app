import React from 'react'
import { ImageBackground } from 'react-native'
import { Box, Button, Center, Divider, Factory,
	Heading, HStack, Pressable, SectionList, Spacer, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import DetailRowItem from '../../../components/beneficiaries/DetailRowItem'
import DetailHeaderItem from '../../../components/beneficiaries/DetailHeaderItem'
import AlertModal from '../../../components/common/AlertModal'

import { mapSectionDataFromTemplate } from '../../../data/Actions'
import { AuthContext } from '../../../data/Context'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { loadingState } from '../../../data/recoil/system'
import { beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { BeneficiaryBlank } from '../../../data/templates/BeneficiariesDetailSectionList'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const NBIonicon = Factory(Ionicon)

const icon = <NBIonicon name={"alert-circle"} fontSize={"2xl"} mr={"1"} color={"danger.600"} />

export default function BeneficiariesDetail({ route, navigation }) {
	const { auth } = React.useContext(AuthContext)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const setLoading = useSetRecoilState(loadingState)

	const sections = mapSectionDataFromTemplate(beneficiary, BeneficiaryBlank)

	const [ isOpen, setIsOpen ] = React.useState(false)
	const onClose = () => setIsOpen(false)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const cancelRef = React.useRef(null)

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

	const handleBack = (navigation) => {
		setLoading({ status: false, text: "" })
		navigation.popToTop()
	}

	const handleDelete = () => {
		navigation.navigate('BeneficiariesDelete')
	}

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>	
			<StatusBar barStyle={"dark-content"}/>
				<Box w={"100%"} p={"4"} bgColor={"warmGray.200"} zIndex={"2"}>
					<HStack alignItems={"center"} space={"3"} flexDir={"row"}>
						<Button flex={"1"} onPress={() => handleBack(navigation)}>{ language.beneficiariesDetail.buttonBack }</Button>
						<Spacer />
						<Pressable onPress={() => handleEdit()}>
							<NBIonicon name={"create-outline"} fontSize={"3xl"} />
						</Pressable>
						<Pressable onPress={() => setIsOpen(!isOpen)}>
							<NBIonicon name={"trash-outline"} fontSize={"3xl"} pl={"1"} />
						</Pressable>
					</HStack>
				</Box>

				<Center flex={1} justifyContent={"center"} zIndex={"1"}>
					<VStack w={"100%"} flex={"1"} px={"4"} space={"4"}>
						<SectionList
							sections={ sections }
							keyExtractor={(item, index) => item + index }
							renderItem={(item, index) => <DetailRowItem data={item} key={index} nb={{ bgColor: "white" }} />}
							renderSectionHeader={({section: { title }}) => <DetailHeaderItem title={title} nb={{ mt: "4"}}  />}
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