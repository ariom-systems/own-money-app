import React from 'react'
import { Box, Button, Divider, Heading, HStack, ScrollView, Text, VStack} from 'native-base'
import StepIndicator from 'react-native-step-indicator'
import { AuthContext, TransferContext } from '../../../data/Context'
import { useNavigation } from '@react-navigation/native'
import { Notice } from '../../../components/common/Notice'
import { useAspect } from '../../../data/Hooks'
import { sum } from 'lodash'
import { formatCurrency } from '../../../data/Actions'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

let labels = [
	language.transferProgress.labelAmount,
	language.transferProgress.labelBeneficiary,
	language.transferProgress.labelReview,
	language.transferProgress.labelFinish
]

export default TransferStepFour = () => {
	const navigation = useNavigation()
	const { auth, authDispatch } = React.useContext(AuthContext)
	const { transfer, transferDispatch } = React.useContext(TransferContext)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
	
	let summary = useAspect(transfer.stepThree.summary)

	React.useEffect(() => {
		let tmp = summary.get()
		let total = Number(tmp.totalsend) + Number(tmp.fee_AUD)
		summary.set({...summary.get(), total_to_pay: total})
	}, [])

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			labels = [
				language.transferProgress.labelAmount,
				language.transferProgress.labelBeneficiary,
				language.transferProgress.labelReview,
				language.transferProgress.labelFinish
			]
			forceUpdate()
		}
	}, [language, auth, labels])

	const handleFinishTransfer = () => {
		authDispatch({ type: 'CLEAR_STATUS'})
		transferDispatch({ type: 'RESTART' })
		navigation.navigate('TransferStepOne')
	}

	return (
		<ScrollView w={"100%"} flex={"1"}>
			<Box mx={"2.5%"} mt={"5%"} px={"5%"} pt={"5%"}  backgroundColor={"white"} h={"100%"} rounded={"2xl"}>
				{ (auth.status !== null && auth.status !== "") && <Notice nb={{w:"100%", mb: "4"}} showClose={false} />}
				<StepIndicator
					stepCount={4}
					currentPosition={transfer.step}
					labels={labels} />
				<VStack my={"5%"} borderColor={"primary.600"} borderWidth={"1"} rounded={"lg"} overflow={"hidden"}>
					<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
						<Heading size={"sm"}>{ language.transferStepFour.currencyCodeAUD }</Heading>
					</Box>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
						<Text fontSize={"md"}>{ summary.get().sender }</Text>
					</HStack>
					<Divider />
					<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
						<Heading size={"sm"}>{ language.transferStepFour.currencyCodeAUD }</Heading>
					</Box>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
						<Text fontSize={"md"}>{ summary.get().receiver }</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
						<Text fontSize={"md"}>{ summary.get().accountnumber }</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
						<Text fontSize={"md"}>{ summary.get().branchname }</Text>
					</HStack>
					<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
						<Heading size={"sm"}>{ language.transferStepFour.currencyCodeAUD }</Heading>
					</Box>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
						<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } ${ summary.get().transfer_amount }</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
						<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } ฿{ summary.get().received_amount }</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
						<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } ${ summary.get().fee_AUD }</Text>
					</HStack>
					<Box px={"2"} py={"2"} backgroundColor={"primary.200"}>
						<Heading size={"sm"}>{ language.transferStepFour.currencyCodeAUD }</Heading>
					</Box>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
						<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } { formatCurrency(summary.get().total_to_pay, "en-AU", "AUD").full }</Text>
					</HStack>
					<HStack px={"4"} py={"2"} justifyContent={"space-between"}>
						<Text fontSize={"md"} color={"coolGray.500"}>{ language.transferStepFour.currencyCodeAUD }</Text>
						<Text fontSize={"md"}>{ language.transferStepFour.currencyCodeAUD } ฿{ summary.get().received_amount }</Text>
					</HStack>
				</VStack>
				<HStack space={"4"} w={"100%"} justifyContent={"center"}>
					<Button alignSelf={"center"} w={"50%"} onPress={handleFinishTransfer}>
						<Text fontSize={"lg"} color={"#FFFFFF"}>{ language.transferStepFour.buttonNewTransfer }</Text>
					</Button>
				</HStack>
			</Box>
		</ScrollView>
	)
}