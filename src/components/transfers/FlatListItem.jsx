import React, { memo } from 'react'

//components
import { Avatar, HStack, Pressable, Spacer, Text } from 'native-base'
import Icon from '../../components/common/Icon'

//data
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Sizes } from '../../config'
import { beneficiaryObj } from '../../data/recoil/beneficiaries'
import { transferAtom, buttonState } from '../../data/recoil/transfer'

const FlatListItem = (props) => {
	const { fullname, id, initials, status } = props.data
	const [ beneficiary, setBeneficiary ] = useRecoilState(beneficiaryObj)
	const setButton = useSetRecoilState(buttonState)
	const setTransfer = useSetRecoilState(transferAtom)

	const handlePress = (data) => {
		setButton((prev) => ({
			...prev,
			transferStepTwo: false
		}))
		setBeneficiary(data)
		setTransfer((prev) => ({
			...prev,
			receiver: data.fullname,
			id_receivers: data.id,
			accountnumber: data.accountnumber,
			bankname: data.bankname 
		}))
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
					<Icon type={"Ionicon"} name="ellipse-outline" fontSize={36} color={"#CCC"} />
				) : (
					<Icon type={"Ionicon"} name="checkmark-circle" fontSize={36} color={"#16A34A"} />
				)}
			</HStack>
		</Pressable>
	)
}

export default memo(FlatListItem)