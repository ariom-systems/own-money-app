import React, { createRef, useContext, useEffect, useState, useReducer } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Button, Heading, HStack, Pressable, Text, VStack } from 'native-base'
import AlertModal from '../common/AlertModal'
import Icon from '../common/Icon'

//data
import { AuthContext } from '../../data/Context'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from '../../data/recoil/user'
import { loadingState } from '../../data/recoil/system'
import { beneficiaryObj, beneficiaryList } from '../../data/recoil/beneficiaries'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListSwipeHiddenItem = (props) => {
	const { auth } = useContext(AuthContext)
	let { id, fullname } = props.data.item
	let index = props.data.index
	const setBeneficiary = useSetRecoilState(beneficiaryObj)
	const beneficiaries = useRecoilValue(beneficiaryList)
	const user = useRecoilValue(userState)
	const setLoading = useSetRecoilState(loadingState)
	const navigation = useNavigation()
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	//AlertDialog
	const [ isOpen, setIsOpen ] = useState(false)
	const onClose = () => setIsOpen(false)
	const cancelRef = createRef(null)
	let deleteMessage = ""

	const handleDeletePress = (item) => {
		fullname = item.fullname
		deleteMessage = language.formatString(language.beneficiaryList.ui.alertDeleteMessage, fullname)
		setIsOpen(!isOpen)
	}

	const handleEdit = (item) => {
		setBeneficiary(item)
		setLoading({ status: true, type: "loading" })
		navigation.navigate('BeneficiariesEdit')
	}
	
	const handleDelete = (item) => { 
		onClose()
		setLoading({ status: true, type: "deleting" })
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

	useEffect(() => {
		if (fullname != "") {
			deleteMessage = language.formatString(language.beneficiaryList.ui.alertDeleteMessage, fullname)
		}
	}, [language, props.data.item])

	useEffect(() => {
		if (language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			forceUpdate()
		}
	}, [language, user])

	return (
		<HStack backgroundColor={"coolGray.100"} key={ index } justifyContent={"flex-end"} flex={"1"}
			roundedTop={ corners == "top" ? "8" : false } roundedBottom={ corners == "bottom" ? "8" : false }>
			<Pressable onPress={() => handleEdit({...props.data.item, index: props.data.index }) }>
				<VStack w={"80px"} h={"80px"} backgroundColor={"warmGray.300"} alignItems={"center"} justifyContent={"center"}>
					<Icon type={"Ionicon"} name={"create-outline"} fontSize={"3xl"} />
					<Text>{ language.beneficiaryList.ui.slideButtonEdit }</Text>
				</VStack>
			</Pressable>
			<Pressable onPress={() => handleDeletePress(props.data.item)}>
				<VStack w={"80px"} h={"80px"} backgroundColor={"danger.600"} alignItems={"center"} justifyContent={"center"}
				roundedTopRight={ corners == "top" ? "8" : false } roundedBottomRight={ corners == "bottom" ? "8" : false }>
					<Icon type={"Ionicon"} name={"trash-outline"} fontSize={"3xl"} color={"white"} />
					<Text color={"white"}>{language.beneficiaryList.ui.slideButtonDelete }</Text>
				</VStack>
			</Pressable>
			<AlertModal show={isOpen} ldRef={cancelRef.current} close={onClose} header={language.beneficiaryList.ui.alertDeleteHeading} content={deleteMessage}>
				<Button.Group space={2}>
					<Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef.current}>{language.beneficiaryList.ui.alertDeleteButtonCancel}</Button>
					<Button colorScheme="danger" onPress={() => handleDelete({ ...props.data.item, index: props.data.index })}>{language.beneficiaryList.ui.alertDeleteButtonConfirm}</Button>
				</Button.Group>
			</AlertModal>
		</HStack>
	)
}

export default ListSwipeHiddenItem