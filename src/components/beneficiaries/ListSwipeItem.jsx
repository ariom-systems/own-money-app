import React from 'react'
import { Avatar, HStack, Pressable, Text, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import * as Recoil from 'recoil'
import { loadingState } from '../../data/recoil/system'
import { beneficiaryObj, beneficiaryList } from '../../data/recoil/beneficiaries'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListSwipeItem = (props) => {
	let { id, status, initials, fullname } = props.data.item
	let index = props.data.index
	const beneficiaries = Recoil.useRecoilValue(beneficiaryList)
	const setBeneficiary = Recoil.useSetRecoilState(beneficiaryObj)
	const setLoading = Recoil.useSetRecoilState(loadingState)
	const navigation = useNavigation()

	const handlePress = (item) => {
		setBeneficiary(item)
		setLoading({ status: true, text: 'Loading' })
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

	return (
		<Pressable key={ index } onPress={() => handlePress({...props.data.item, index: props.data.index }) }>
			<HStack alignItems={"center"} py={"4"} pl={"4"} space={"3"} backgroundColor={"coolGray.100"}
				roundedTop={ corners == "top" ? "8" : false } roundedBottom={ corners == "bottom" ? "10" : false }>
				<Avatar size={"48px"} backgroundColor={ status == 'Verified' ? '#8B6A27' : 'light.600' }>{ initials }</Avatar>
				<VStack>
					<Text mb={"2"} bold>{ fullname }</Text>
					{ status != 'Verified' && (
						<Text fontSize={"xs"} >{ language.beneficiariesList.labelAwaitingVerify }</Text>
					)}
				</VStack>
			</HStack>
		</Pressable>
	)
}

export default React.memo(ListSwipeItem)