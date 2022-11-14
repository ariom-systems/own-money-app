import React from 'react';
import { AlertDialog, Box, Button, Center, Divider, Factory,
	Heading, HStack, Pressable, SectionList, Spacer, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()

import { api } from '../../../config';
import { buildDataPath } from '../../../data/Actions';
import { AuthContext, DataContext } from '../../../data/Context'
import LoadingOverlay from '../../../components/common/LoadingOverlay';

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const NBIonicon = Factory(Ionicon)

export default function BeneficiariesDetail({ route, navigation }) {
	const { beneficiary } = route.params
	const { auth, authDispatch } = React.useContext(AuthContext)
	const { data, dataDispatch } = React.useContext(DataContext)
	
	const [ currentName, setCurrentName ] = React.useState("")
	const [ isLoading, setIsLoading ] = React.useState(true)
	const [ isOpen, setIsOpen ] = React.useState(false)
	const onClose = () => setIsOpen(false)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
	
	const cancelRef = React.useRef(null)
	const mountRef = React.useRef(false)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	React.useEffect(() => {
		mountRef.current = true
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('beneficiaries', auth.uid, 'view', {id: beneficiary} ))
			.then(response => {
				let BeneficiaryData = [
					{
						title: language.beneficiariesDetail.listDataHeaderPersonalDetails,
						data: [
							{ label: language.beneficiariesDetail.listDataLabelFirstName, value: response.data != "undefined" ? response.data.firstname : "" },
							{ label: language.beneficiariesDetail.listDataLabelLastName, value: response.data != "undefined" ? response.data.lastname : "" },
							{ label: language.beneficiariesDetail.listDataLabelThaiName, value: response.data != "undefined" ? response.data.thainame : "" },
							{ label: language.beneficiariesDetail.listDataLabelPhone, value: response.data != "undefined" ? response.data.phone : "" }
						]
					},
					{
						title: language.beneficiariesDetail.listDataHeaderBankDetails,
						data: [
							{ label: language.beneficiariesDetail.listDataLabelAccountNumber, value: response.data != "undefined" ? response.data.accountnumber : "" },
							{ label: language.beneficiariesDetail.listDataLabelAccountType, value: response.data != "undefined" ? response.data.accounttype : "" },
							{ label: language.beneficiariesDetail.listDataLabelBankName, value: response.data != "undefined" ? response.data.bankname : "" },
							{ label: language.beneficiariesDetail.listDataLabelBankBranch, value: response.data != "undefined" ? response.data.branchname : "" },
							{ label: language.beneficiariesDetail.listDataLabelBankCity, value: response.data != "undefined" ? response.data.branchcity : "" }
						]
					},
					{
						title: language.beneficiariesDetail.listDataHeaderAddressDetails,
						data: [
							{ label: language.beneficiariesDetail.listDataLabelThaiAddress, value: response.data != "undefined" ? response.data.address : "" },
							{ label: language.beneficiariesDetail.listDataLabelProvince, value: response.data != "undefined" ? response.data.state : "" },
							{ label: language.beneficiariesDetail.listDataLabelDistrict, value: response.data != "undefined" ? response.data.city : "" },
							{ label: language.beneficiariesDetail.listDataLabelPostCode, value: response.data != "undefined" ? response.data.postcode : "" },
							{ label: language.beneficiariesDetail.listDataLabelCountry, value: response.data != "undefined" ? response.data.country : "" }
						]
					}
				]
				setCurrentName(response.data != "undefined" ? response.data.firstname + " " + response.data.lastname : "")
				dataDispatch({ type: 'SET_BENEFICIARY', payload: { data: BeneficiaryData }})
				
			})
			.then(response => setIsLoading(false))
			.catch(error => console.log(error))
			return () => {
				mountRef.current = false
			}
	}, [isLoading])

	const handleEdit = (id) => {
		navigation.navigate('BeneficiariesEdit', { id: id })
	}

	const handleDelete = (id) => {
		navigation.navigate('BeneficiariesDelete', { id: id })
	}

	return (
		<>	
			<StatusBar barStyle={"dark-content"}/>
			<Center flex={1} justifyContent={"center"} pb={"4"}>
				{ isLoading == true && <LoadingOverlay /> }
				<HStack alignItems={"center"} space={"3"} flexDir={"row"} py={"4"} px={"4"}>
					<Button flex={"1"} onPress={() => { navigation.popToTop() }}>{ language.beneficiariesDetail.buttonBack }</Button>
					<Spacer />
					<Pressable onPress={() => handleEdit(beneficiary)}>
						<NBIonicon name={"create-outline"} fontSize={"3xl"} />
					</Pressable>
					<Pressable onPress={() => setIsOpen(!isOpen)}>
						<NBIonicon name={"trash-outline"} fontSize={"3xl"} pl={"1"} />
					</Pressable>
				</HStack>
				<VStack flex="1" space={"4"} w={"100%"}>
					<SectionList
						sections={data.beneficiaryCurrent}
						extraData={isLoading}
						keyExtractor={(item, index) => item + index }
						renderItem={(item, index) => <ListItem data={item} key={index} />}
						renderSectionHeader={({section: { title }}) => <HeaderItem title={title} />} 
						stickySectionHeadersEnabled={false}
					/>
				</VStack>
			</Center>
			<AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose} size={"xl"}>
				<AlertDialog.Content>
					<AlertDialog.CloseButton />
					<AlertDialog.Header>
						<HStack>
							<NBIonicon name={"alert-circle"} fontSize={"2xl"} mr={"1"} color={"danger.600"} />
							<Heading fontSize={"lg"} mt={"0.5"} pr={"4"}>{ language.beneficiariesDetail.alertDeleteHeading + " " + currentName}?</Heading>
						</HStack>
					</AlertDialog.Header>
					<AlertDialog.Body>{ language.beneficiariesDetail.alertDeleteMessageLine1 + " " + currentName + ". " +  language.beneficiariesDetail.alertDeleteMessageLine2 }</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>{ language.beneficiariesDetail.alertDeleteButtonCancel }</Button>
							<Button colorScheme="danger" onPress={() => {onClose(); handleDelete(beneficiary)}}>{ language.beneficiariesDetail.alertDeleteButtonConfirm }</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</>
	)
}

class HeaderItem extends React.PureComponent {
	render() {
		return (
			<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"} key={this.props.title.replace(' ', '_').toLowerCase()}>
				<Heading size={"sm"}>{this.props.title}</Heading>
			</Box>
		)
	}
}

class ListItem extends React.PureComponent {
	render() {
		const item = this.props.data
		return (
			<>
				<VStack px={"4"} py={"2"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{item.item.label}</Text>
					<Text fontSize={"lg"}>{item.item.value}</Text>
				</VStack>
				<Divider />
			</>
		)
	}
}