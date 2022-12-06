import React from 'react'
import { AlertDialog, Button, Factory, Heading, HStack, Pressable, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../../data/Context'
import { useNavigation } from '@react-navigation/native'

Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)

import * as Recoil from 'recoil'
import { loadingState } from '../../data/recoil/system'
import { beneficiaryObj, beneficiaryList } from '../../data/recoil/beneficiaries'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListSwipeHiddenItem = (props) => {
	const { auth } = React.useContext(AuthContext)
	const { id, firstname, lastname } = props.data.item
	let index = props.data.index
	const setBeneficiary = Recoil.useSetRecoilState(beneficiaryObj)
	const beneficiaries = Recoil.useRecoilValue(beneficiaryList)
	const setLoading = Recoil.useSetRecoilState(loadingState)
	const navigation = useNavigation()
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	//AlertDialog
	const [ isOpen, setIsOpen ] = React.useState(false)
	const onClose = () => setIsOpen(false)
	const cancelRef = React.createRef(null)

	const handleEdit = (item) => {
		setBeneficiary(item)
		navigation.navigate('BeneficiariesEdit')
	}
	
	const handleDelete = (item) => { 
		onClose()
		setBeneficiary(item)
		navigation.navigate('BeneficiariesDelete')
	}

	let corners
	if(index === 0) {
		corners = "top"
	} else if(index === beneficiaries.length - 1) {
		corners = "bottom"
	} else {
		corners = "none"
	}

	return (
		<HStack backgroundColor={"coolGray.100"} key={ index } justifyContent={"flex-end"} flex={"1"}
			roundedTop={ corners == "top" ? "8" : false } roundedBottom={ corners == "bottom" ? "8" : false }>
			<Pressable onPress={() => handleEdit({...props.data.item, index: props.data.index }) }>
				<VStack w={"80px"} h={"80px"} backgroundColor={"warmGray.300"} alignItems={"center"} justifyContent={"center"}>
					<NBIonicon name={"create-outline"} fontSize={"3xl"} />
					<Text>{ language.beneficiariesList.slideButtonEdit }</Text>
				</VStack>
			</Pressable>
			<Pressable onPress={() => setIsOpen(!isOpen)}>					
				<VStack w={"80px"} h={"80px"} backgroundColor={"danger.600"} alignItems={"center"} justifyContent={"center"}
				roundedTopRight={ corners == "top" ? "8" : false } roundedBottomRight={ corners == "bottom" ? "8" : false }>
					<NBIonicon name={"trash-outline"} fontSize={"3xl"} color={"white"} />
					<Text color={"white"}>{ language.beneficiariesList.slideButtonDelete }</Text>
				</VStack>
			</Pressable>
			<AlertDialog leastDestructiveRef={ cancelRef.current } isOpen={ isOpen } onClose={ onClose }>
				<AlertDialog.Content>
					<AlertDialog.CloseButton />
					<AlertDialog.Header>
						<HStack>
							<NBIonicon name={"alert-circle"} fontSize={"2xl"} mr={"1"} color={"danger.600"} />
							<Heading fontSize={"lg"} mt={"0.5"}>{ language.beneficiariesList.alertDeleteHeading }</Heading>
						</HStack>
					</AlertDialog.Header>
					<AlertDialog.Body>{ language.beneficiariesList.alertDeleteMessageLine1 + " " + firstname + " " + 
						lastname + ". " +  language.beneficiariesList.alertDeleteMessageLine2 }
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button variant="unstyled" colorScheme="coolGray" onPress={ onClose } ref={ cancelRef.current }>{ language.beneficiariesList.alertDeleteButtonCancel }</Button>
							<Button colorScheme="danger" onPress={() => handleDelete({...props.data.item, index: props.data.index }) }>{ language.beneficiariesList.alertDeleteButtonConfirm }</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</HStack>
	)
}

export default React.memo(ListSwipeHiddenItem)