import React, { useState, useEffect, useRef } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Button, Divider, Heading, HStack, SectionList, VStack } from 'native-base'
import Icon from '../../../components/common/Icon'
import DetailRowItem from '../../../components/beneficiaries/DetailRowItem'
import AlertModal from '../../../components/common/AlertModal'
import AlertBanner from '../../../components/common/AlertBanner'
import Toolbar from '../../../components/common/Toolbar'
import ListHeader from '../../../components/common/ListHeader'

//data
import { useRecoilValue, useRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { BeneficiaryTemplate, beneficiaryDetailToolbarConfig } from '../../../config'
import { mapSectionDataFromTemplate, mapActionsToConfig } from '../../../data/Actions'
import { beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { loadingState, noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export default function BeneficiariesDetail() {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const cancelRef = useRef(null)
	const [ isOpen, setIsOpen ] = useState(false)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const notices = useRecoilValue(noticeState)
	const lang = useRecoilValue(langState)
	
	const onClose = () => setIsOpen(false)
	
	let labels = language.beneficiaryDetail.labels
	let headings = language.beneficiaryDetail.headings
	let sections = mapSectionDataFromTemplate(BeneficiaryTemplate, beneficiary, labels, headings)
	sections = sections.map((section, index) => ({ ...section, index }))
	
	let actions = [
		() => handleBack(navigation),, //note the double comma. second element is a spacer and has no action
		() => handleEdit(),
		() => setIsOpen(!isOpen)
	]
	const toolbarConfig = mapActionsToConfig(beneficiaryDetailToolbarConfig, actions)
	
	let deleteMessage = language.formatString(language.beneficiaryDetail.ui.alertDeleteMessage, beneficiary.fullname || "no name")
	
	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	useEffect(() => {
		setLoading({ status: false, type: "none" })
	},[])

	useEffect(() => {
		if(beneficiary.fullname != "") {
			deleteMessage = language.formatString(language.beneficiaryDetail.ui.alertDeleteMessage, beneficiary.fullname || "no name")
		}
	}, [language, beneficiary])


	const handleEdit = () => {
		new Promise((resolve) => {
			setLoading({ status: true, type: 'loading' })
			forceUpdate()
			setTimeout(() => {
				if (loading.status == false) { resolve() }
			}, 1000)
		}).then(result => {
			navigation.navigate('BeneficiariesEdit')
		})
	}

	const handleDelete = () => {
		new Promise((resolve) => {
			setLoading({ status: true, type: 'loading' })
			forceUpdate()
			setTimeout(() => {
				if (loading.status == false) { resolve() }
			}, 1000)
		}).then(result => {
			navigation.navigate('BeneficiariesDelete')
		})
	}

	const handleBack = () => {
		setLoading({ status: false, type: "none" })
		navigation.popToTop()
	}


	return (
		<AppSafeArea>
			<SectionList
				sections={sections}
				keyExtractor={(item, index) => item + index }
				renderItem={(item, index, section) => { return <DetailRowItem data={item} key={index} nb={{ bgColor: "white" }} />}}
				renderSectionHeader={({section}) => { return <ListHeader title={section.title} index={section.index} styles={{ mt: "4", roundedTop: "8" }} />
				}}
				stickySectionHeadersEnabled={false}
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={() => <Divider />}
				ListHeaderComponent={() => (
					<VStack key={beneficiary.id} space={"4"}>
						{notices && <AlertBanner />}
						<Toolbar config={toolbarConfig} />
					</VStack>
				)}
				ListFooterComponent={() => <Toolbar config={toolbarConfig} />}
				contentContainerStyle={{ padding: "2.5%", justifyContent: "flex-start" }}
			/>
			<AlertModal show={isOpen} close={onClose} ldRef={cancelRef}
				content={ deleteMessage }
				header={(
					<HStack>
						<Icon type={"Ionicon"} name={"alert-circle"} fontSize={"2xl"} mr={"1"} color={"danger.600"} />
						<Heading fontSize={"lg"} mt={"0.5"} pr={"4"}>{language.beneficiaryDetail.ui.alertDeleteHeading} { beneficiary.fullname }?</Heading>
					</HStack>
				)}
			>
				<Button.Group space={2}>
					<Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>{language.beneficiaryDetail.ui.alertDeleteButtonCancel }</Button>
					<Button colorScheme="danger" onPress={() => { onClose(); handleDelete() }}>{language.beneficiaryDetail.ui.alertDeleteButtonConfirm }</Button>
				</Button.Group>
			</AlertModal>
		</AppSafeArea>
	)
}