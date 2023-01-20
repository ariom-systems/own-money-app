import React, { useContext, useEffect, useReducer } from 'react'
import { Avatar, HStack, Pressable, Text, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import { AuthContext } from '../../data/Context'
import { useRecoilValue, useSetRecoilState} from 'recoil'
import { loadingState } from '../../data/recoil/system'
import { beneficiaryObj, beneficiaryList } from '../../data/recoil/beneficiaries'
import { userState } from '../../data/recoil/user'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListSwipeItem = (props) => {
	let { id, status, initials, fullname } = props.data.item
	let index = props.data.index
	const beneficiaries = useRecoilValue(beneficiaryList)
	const setBeneficiary = useSetRecoilState(beneficiaryObj)
	const setLoading = useSetRecoilState(loadingState)
	const user = useRecoilValue(userState)
	const navigation = useNavigation()
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	const handlePress = (item) => {
		setBeneficiary(item)
		setLoading({ status: true, type: 'loading' })
		navigation.navigate('BeneficiariesDetail')
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
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			forceUpdate()
		}
	}, [language, user])

	return (
		<Pressable key={ index } onPress={() => handlePress({...props.data.item, index: props.data.index }) }>
			<HStack alignItems={"center"} py={"4"} pl={"4"} space={"3"} backgroundColor={"coolGray.100"}
				roundedTop={ corners == "top" ? "8" : false } roundedBottom={ corners == "bottom" ? "10" : false }>
				<Avatar size={"48px"} backgroundColor={ status == 'Verified' ? '#8B6A27' : 'light.600' }>{ initials }</Avatar>
				<VStack>
					<Text mb={"2"} bold>{ fullname }</Text>
					{ status != 'Verified' && (
						<Text fontSize={"xs"} >{ language.beneficiaryList.labels.awaitingVerify }</Text>
					)}
				</VStack>
			</HStack>
		</Pressable>
	)
}

export default ListSwipeItem