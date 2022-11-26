import React from 'react';
import { Box, Button, Center, Divider, Factory,
	Heading, HStack, Pressable, SectionList, Spacer, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import DetailRowItem from '../../../components/beneficiaries/DetailRowItem'
import DetailHeaderItem from '../../../components/beneficiaries/DetailHeaderItem'
import AlertModal from '../../../components/common/AlertModal'

import { mapSectionDataFromTemplate } from '../../../data/Actions'
import * as Recoil from 'recoil'
import * as Atoms from '../../../data/recoil/Atoms'
import { BeneficiaryBlank } from '../../../data/templates/BeneficiariesDetailSectionList'

import { AuthContext } from '../../../data/Context'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const NBIonicon = Factory(Ionicon)

const icon = <NBIonicon name={"alert-circle"} fontSize={"2xl"} mr={"1"} color={"danger.600"} />

export default function BeneficiariesDetail({ route, navigation }) {
	const { auth } = React.useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = Recoil.useRecoilState(Atoms.beneficiaries)
	const setLoading = Recoil.useSetRecoilState(Atoms.loading)
	const [ sections, setSections ] = React.useState(BeneficiaryBlank)
	const [ currentName, setCurrentName ] = React.useState("")
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
		let newSections = mapSectionDataFromTemplate(beneficiaries, BeneficiaryBlank)
		setSections(newSections)
		setCurrentName(beneficiaries.view.fullname)
	},[beneficiaries.view])

	const handleEdit = (item) => {
		setLoading({ status: true, text: 'Loading' })
		setBeneficiaries(prev => ({
			...prev,
			edit: item
		}))
		navigation.navigate('BeneficiariesEdit')
	}

	const handleBack = (navigation) => {
		setLoading({ status: false, text: "" })
		setBeneficiaries((prev) => ({
			...prev,
			view: {}
		}))
		navigation.popToTop()
	}

	const handleDelete = (id) => {
		//navigation.navigate('BeneficiariesDelete', { id: id })
	}

	return (
		<>	
			<StatusBar barStyle={"dark-content"}/>
			<Center flex={1} justifyContent={"center"} pb={"4"}>
				
				<HStack alignItems={"center"} space={"3"} flexDir={"row"} py={"4"} px={"4"}>
					<Button flex={"1"} onPress={() => handleBack(navigation)}>{ language.beneficiariesDetail.buttonBack }</Button>
					<Spacer />
					<Pressable onPress={() => handleEdit(beneficiaries.view)}>
						<NBIonicon name={"create-outline"} fontSize={"3xl"} />
					</Pressable>
					<Pressable onPress={() => setIsOpen(!isOpen)}>
						<NBIonicon name={"trash-outline"} fontSize={"3xl"} pl={"1"} />
					</Pressable>
				</HStack>
				<VStack flex="1" space={"4"} w={"100%"}>
					<SectionList
						sections={ sections }
						keyExtractor={(item, index) => item + index }
						renderItem={(item, index) => <DetailRowItem data={item} key={index} />}
						renderSectionHeader={({section: { title }}) => <DetailHeaderItem title={title} />}
						stickySectionHeadersEnabled={false}
					/>
				</VStack>
			</Center>
			<AlertModal show={isOpen} close={onClose} ldRef={cancelRef}
				header={(
					<HStack>
						{icon}
						<Heading fontSize={"lg"} mt={"0.5"} pr={"4"}>{language.beneficiariesDetail.alertDeleteHeading} {currentName}?</Heading>
					</HStack>
				)}
				content={ language.beneficiariesDetail.alertDeleteMessageLine1 + " " + currentName + ". " + language.beneficiariesDetail.alertDeleteMessageLine2 }>
				<Button.Group space={2}>
					<Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>{ language.beneficiariesDetail.alertDeleteButtonCancel }</Button>
					<Button colorScheme="danger" onPress={() => {onClose(); handleDelete(beneficiaries.view.id)}}>{ language.beneficiariesDetail.alertDeleteButtonConfirm }</Button>
				</Button.Group>
			</AlertModal>
		</>
	)
}