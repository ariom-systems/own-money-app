import React from 'react'
import { AlertDialog, Button, Factory, Heading, HStack, Pressable, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../../data/Context'
import { useNavigation } from '@react-navigation/native'

Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)

import * as Recoil from 'recoil'
import * as Atoms from '../../data/recoil/Atoms'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListSwipeHiddenItem = (props) => {
	const { id, firstname, lastname } = props.data.item
	const [ beneficiaries, setBeneficiaries ] = Recoil.useRecoilState(Atoms.beneficiaries)
	const setLoading = Recoil.useSetRecoilState(Atoms.loading)
	const navigation = useNavigation()
	const { auth } = React.useContext(AuthContext)

	//AlertDialog
	const [ isOpen, setIsOpen ] = React.useState(false)
	const onClose = () => setIsOpen(false)
	const cancelRef = React.createRef(null)

	const handleEdit = (item) => {
		setBeneficiaries(prev => ({
			...prev,
			edit: item
		}))
		navigation.navigate('BeneficiariesEdit')
	}
	
	const handleDelete = (id) => { 
		onClose()
		//navigation.navigate('BeneficiariesDelete')
	}

	return (
		<HStack key={ id } justifyContent={"flex-end"} flex={"1"}>
			<Pressable onPress={() => handleEdit( beneficiaries.edit ) }>
				<VStack w={"80px"} h={"80px"} backgroundColor={"warmGray.300"} alignItems={"center"} justifyContent={"center"}>
					<NBIonicon name={"create-outline"} fontSize={"3xl"} />
					<Text>{ language.beneficiariesList.slideButtonEdit }</Text>
				</VStack>
			</Pressable>
			<Pressable onPress={() => setIsOpen(!isOpen)}>					
				<VStack w={"80px"} h={"80px"} backgroundColor={"danger.600"} alignItems={"center"} justifyContent={"center"}>
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
							<Button colorScheme="danger" onPress={() => handleDelete( id ) }>{ language.beneficiariesList.alertDeleteButtonConfirm }</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</HStack>
	)
}

export default React.memo(ListSwipeHiddenItem)