import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Avatar, Box, Button, Divider, FlatList, HStack, Pressable, ScrollView, Spacer, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
import StepIndicator from 'react-native-step-indicator'
Ionicon.loadFont()
import { api } from '../../../config'
import { buildDataPath } from '../../../data/Actions'
import { AuthContext, DataContext, TransferContext } from '../../../data/Context'

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

export default TransferStepTwo = () => {
	const navigation = useNavigation()
	const { auth } = React.useContext(AuthContext)
	const { data } = React.useContext(DataContext)
	const { transfer, transferDispatch } = React.useContext(TransferContext)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)
	const renderSeparator = () => <Divider />

	ListItem.contextType = TransferContext
	ListItemBeneficiary.contextType = DataContext

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

	return (
		
		<Box mx={"2.5%"} mt={"5%"} p={"5%"} backgroundColor={"white"} rounded={"2xl"}>
			<VStack justifyContent={"space-between"} flexGrow={"1"}>
				<StepIndicator
					stepCount={4}
					currentPosition={transfer.step}
					labels={labels} />
				<Box p={"2"}>
					<Text w={"100%"} textAlign={"center"}>{language.transferSteptwo.titleTop }</Text>
				</Box>
				<Box h={"70%"} borderColor={"primary.600"} borderWidth={"1"} rounded={"lg"}>
					<FlatList
						flexGrow={"0"}
						data={data.beneficiaries}
						renderItem={item => <ListItem data={item} auth={auth} />}
						ItemSeparatorComponent={renderSeparator}
						keyExtractor={item => item.id}
						getItemLayout={(item, index) => {
							return { length: 60, offset: 60 * index, index }
						}}
						initialNumToRender={20}
						maxToRenderPerBatch={20}
						removeClippedSubviews={false}
						showsVerticalScrollIndicator={true}
					/>
				</Box>
				<HStack w={"100%"} space={"4"} mt={"4"} alignItems={"center"}>
					<Button flex={"1"} onPress={()=> {
						transferDispatch({ type: 'GO_TO', payload: { step: 0 }})
						navigation.goBack()
					}}>
						<Text fontSize={"17"} color={"#FFFFFF"}>{language.transferSteptwo.buttonPrevious }</Text>
					</Button>
					<Button
						isDisabled={ transfer.stepTwo.beneficiary == "" ? true : false }
						_disabled={{ backgroundColor:"primary.500", borderColor:"primary.600", borderWidth:1 }}
						flex={"1"}
						onPress={()=> {
							transferDispatch({ type: 'GO_TO', payload: { step: 2 }})
							navigation.navigate('TransferStepThree')
						}}>
							<Text fontSize={"17"} color={"#FFFFFF"}>{language.transferSteptwo.buttonNext }</Text>
					</Button>	
				</HStack>
			</VStack>
		</Box>
	)
}

class ListItem extends React.PureComponent {
	constructor(props) {
		super(props)
	}

	static contextType = TransferContext

	handlePress(data, auth) {
		let transfer = this.context
		let receiverData = {}
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.post(buildDataPath('beneficiaries', auth.uid, 'view', { id: data.item.id } ), ["accountnumber", "branchname"])
		.then(response => {
			let newData = (({ accountnumber, branchname }) => ({ accountnumber, branchname }))(response.data)
			let oldData = data.item
			receiverData = {...oldData, ...newData}
		})
		.then(result => {
			transfer.transferDispatch({ type: 'SET_STEP_TWO', payload: { data: receiverData } })
		})
		.catch(error => console.log('fetch error: ', error))
	}

	render() {
		let transfer = this.context
		const data = this.props.data
		const auth = this.props.auth
		return (
			<Pressable onPress={() => this.handlePress(data, auth)}>
				<HStack alignItems={"center"} px={"4"}>
					<ListItemBeneficiary data={data} />
					<Spacer />
					{ transfer.transfer.stepTwo.beneficiary.fullname != data.item.fullname ? (
						<Ionicon name="ellipse-outline" size={36} color={"#CCC"} />
					) : (
						<Ionicon name="checkmark-circle" size={36} color={"#16A34A"} />
					)}
				</HStack>
			</Pressable>
		)
	}
}

class ListItemBeneficiary extends React.PureComponent {
	static contextType = DataContext
	render() {
		const data = this.props.data
		return (
			<HStack key={data.item.id} alignItems={"center"} py={"3"} space={"3"}>
				<Avatar size={"32px"} backgroundColor={ data.item.status == 'Verified' ? '#8B6A27' : 'light.600' }>{data.item.initials}</Avatar>
				<Text bold>{data.item.fullname}</Text>
			</HStack>
		)
	}

}