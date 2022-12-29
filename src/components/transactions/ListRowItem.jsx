import React from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Avatar, Badge, HStack, Pressable, Spacer, Text, VStack } from 'native-base'

//data
import { AuthContext } from '../../data/Context'
import { formatCurrency, localiseObjectData } from '../../data/Actions'
import { useSetRecoilState, useRecoilCallback } from 'recoil'
import { transactionObj } from '../../data/recoil/transactions'
import { loadingState } from '../../data/recoil/system'
import { TransactionObjFormats } from '../../config'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ListRowItem = (props) => {
	const navigation = useNavigation()
	const { auth } = React.useContext(AuthContext)
	const { transaction_number, initials, fullname, status, transfer_amount, received_amount } = props.data.item
	const setTransaction = useSetRecoilState(transactionObj)
	const setLoading = useSetRecoilState(loadingState)
	const index = props.data.index
	const listLength = props.data.section.data.length - 1 //now THATS a mouthfull
	const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0)

	const handlePress = (item) => {
		setTransaction(item)
		localiseObjectData(item, TransactionObjFormats, auth.lang)
		setLoading({ status: true, text: 'Loading' })
		navigation.navigate('TransactionsDetail')
	}

	let statusBadge
	switch(status) {
		case 'Wait for payment': statusBadge = 'default'; break
		case 'Cancelled': statusBadge = 'danger'; break
		case 'Completed': statusBadge = 'success'; break
	}

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			//navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	return (
		<Pressable bgColor={"white"} px={"4"} onPress={() => handlePress(props.data.item) } borderBottomRadius={ index == listLength ? "8" : "0"}>
			<HStack key={transaction_number} alignItems={"center"} space={"3"} py={"4"}>
				<Avatar size={"48px"} bgColor={"primary.600"}>{ initials }</Avatar>
				<VStack>
					<Text mb={"2"} bold>{ fullname }</Text>
				</VStack>
				<Spacer />
				<VStack alignContent={"flex-end"} space={"2"}>
					<Badge colorScheme={statusBadge} variant={"outline"}>{ status }</Badge>
					<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>
						{ formatCurrency(transfer_amount, "en-AU", "AUD").full } { language.transactionsList.currencyCodeAUD }
					</Text>
					<Text fontSize={"sm"} color={"coolGray.800"} _dark={{ color: "warmGray.50" }} textAlign={"right"}>
						{ formatCurrency(received_amount, "th-TH", "THB").full } { language.transactionsList.currencyCodeTHB }
					</Text>
				</VStack>
			</HStack>
		</Pressable>
	)
}

export default React.memo(ListRowItem)


