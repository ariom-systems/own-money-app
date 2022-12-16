import React from 'react'
import { Avatar, HStack, Pressable, Spacer, Text } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()

import { useRecoilState, useSetRecoilState } from 'recoil'
import { beneficiaryObj } from '../../data/recoil/beneficiaries'
import { stepTwoButtonAtom } from '../../data/recoil/transfer'

const FlatListItem = (props) => {
	const { fullname, id, initials, status } = props.data
	const [ beneficiary, setBeneficiary ] = useRecoilState(beneficiaryObj)
	const setButtonState = useSetRecoilState(stepTwoButtonAtom)

	const handlePress = (data) => {
		setButtonState(false)
		setBeneficiary(data)
	}

	return (
		<Pressable onPress={() => handlePress(props.data)}>
			<HStack alignItems={"center"} px={"4"}>
				<HStack key={id} alignItems={"center"} py={"3"} space={"3"}>
					<Avatar size={"32px"} backgroundColor={ status == 'Verified' ? '#8B6A27' : 'light.600' }>{initials}</Avatar>
					<Text bold>{fullname}</Text>
				</HStack>
				<Spacer />
				{ beneficiary.fullname != fullname ? (
					<Ionicon name="ellipse-outline" size={36} color={"#CCC"} />
				) : (
					<Ionicon name="checkmark-circle" size={36} color={"#16A34A"} />
				)}
			</HStack>
		</Pressable>
	)
}

export default React.memo(FlatListItem)