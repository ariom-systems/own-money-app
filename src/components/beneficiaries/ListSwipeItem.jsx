import React, { useEffect } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Avatar, HStack, Pressable, Text, VStack } from 'native-base'

//data
import { useRecoilValue, useRecoilState } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { beneficiaryObj, beneficiaryList } from '../../data/recoil/beneficiaries'
import { userState } from '../../data/recoil/user'
import { loadingState, langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListSwipeItem = (props) => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const [ beneficiary, setBeneficiary] = useRecoilState(beneficiaryObj)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const beneficiaries = useRecoilValue(beneficiaryList)
	const user = useRecoilValue(userState)
	const lang = useRecoilValue(langState)

	let { id, status, initials, fullname } = props.data.item
	let index = props.data.index

	useEffect(() => {
		if (loading == true) {
			new Promise((resolve) => {
				setLoading({ status: false, type: 'none' })
				forceUpdate()
				setTimeout(() => {
					if (loading == false) { resolve() }
				}, 1000)
			})
		}
	}, [beneficiary])

	const handlePress = (item) => {
		new Promise((resolve) => {
			setLoading({ status: true, type: 'loading' })
			forceUpdate()
			setTimeout(() => {
				if (loading.status == false) { resolve() }
			}, 1000)
		}).then(result => {
			setBeneficiary(item)
			navigation.navigate('BeneficiariesDetail')
		})
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
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

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