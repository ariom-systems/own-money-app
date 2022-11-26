import React from 'react'
import { Avatar, HStack, Pressable, Text, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import * as Recoil from 'recoil'
import * as Atoms from '../../data/recoil/Atoms'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListSwipeItem = (props) => {
	const { id, status, initials, fullname } = props.data.item
	const setBeneficiaries = Recoil.useSetRecoilState(Atoms.beneficiaries)
	const setLoading = Recoil.useSetRecoilState(Atoms.loading)
	const navigation = useNavigation()

	const handlePress = (item) => {
		setLoading({ status: true, text: 'Loading' })
		setBeneficiaries(prev => ({...prev, view: item}))
		navigation.navigate('BeneficiariesDetail')
	}

	return (
		<Pressable onPress={() => handlePress( props.data.item ) }>
			<HStack key={ id } alignItems={"center"} py={"4"} pl={"4"} space={"3"} backgroundColor={"coolGray.100"}>
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