import React from 'react'
import FocusRender from 'react-navigation-focus-render'
import { AlertDialog, Avatar, Box, Button, Center, Divider, Fab, Factory,
	 Heading, HStack, Pressable, StatusBar, Text, VStack } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()

import { AuthContext, DataContext } from '../../../data/Context'
import { Notice } from '../../../components/common/Notice'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const NBIonicon = Factory(Ionicon)

export default function BeneficiariesList({navigation}) {
	const { auth } = React.useContext(AuthContext)
	const { data } = React.useContext(DataContext)
	const renderSeparator = () => <Divider />
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	ListItem.contextType = DataContext
	ListHiddenItem.contextType = DataContext

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	return (
		<>	
			<StatusBar barStyle={"dark-content"}/>
			<Center flex={1} justifyContent={"center"}>
				<VStack flex="1" w={"100%"} justifyContent={"flex-start"}>
					{ (auth.status !== null && auth.status !== "") && <Notice /> }
					<FocusRender>
						<SwipeListView
							data={data.beneficiaries}
							renderItem={(item, rowMap) => <ListItem data={item} rowMap={rowMap} navigation={navigation} />}
							renderHiddenItem={(item, rowMap) => <ListHiddenItem data={item} rowMap={rowMap} navigation={navigation}  />}
							rightOpenValue={-160}
							previewRowKey={'0'}
							previewOpenValue={0}
							previewOpenDelay={3000}
							ItemSeparatorComponent={renderSeparator}
							keyExtractor={item => item.id}
							getItemLayout={(item, index) => {
								return { length: 80, offset: 80 * index, index }
							}}
							initialNumToRender={20}
							maxToRenderPerBatch={20}
							removeClippedSubviews={false}
							/>
					</FocusRender>
					<Fab
						renderInPortal={false}
						placement={"bottom-right"}
						shadow={"2"}
						backgroundColor={"primary.400"}
						icon={<Ionicon color={"#FFFFFF"} name={"add"} size={24} />}
						onPress={() => navigation.navigate('BeneficiariesAdd')}/>
				</VStack>
			</Center>
		</>						
	)
}

class ListItem extends React.PureComponent {

	static contextType = DataContext

	handlePress() {
		const dataProp = this.props.data
		const { navigation } = this.props
		navigation.navigate('BeneficiariesDetail', { beneficiary: dataProp.item.id })
	}
	render() {
		const data = this.props.data
		return (
			<Pressable onPress={() => this.handlePress() }>
				<HStack key={data.item.id} alignItems={"center"} py={"4"} pl={"4"} space={"3"} backgroundColor={"coolGray.100"}>
					<Avatar size={"48px"} backgroundColor={ data.item.status == 'Verified' ? '#8B6A27' : 'light.600' }>{data.item.initials}</Avatar>
					<VStack>
						<Text mb={"2"} bold>{data.item.fullname}</Text>
						{ data.item.status != 'Verified' && (
							<Text fontSize={"xs"} >{ language.beneficiariesList.labelAwaitingVerify }</Text>
						)}

					</VStack>
				</HStack>
			</Pressable>
		)
	}
}

class ListHiddenItem extends React.PureComponent {
	static contextType = DataContext

	constructor(props) {
		super(props)
		this.onClose = this.onClose.bind(this)
		this.state = {
			isOpen: false
		}
		this.cancelRef = React.createRef()
	}

	handleEdit(item) {
		const { navigation } = this.props
		navigation.navigate('BeneficiariesEdit', { id: item.id })
	}

	handleDelete(item) { 
		this.onClose()
		const { navigation } = this.props
		navigation.navigate('BeneficiariesDelete', { id: item.id })
	}

	onClose() {
		this.setState({ isOpen: false })
	}

	render() {
		const data = this.props.data
		return(
			<>
				<HStack key={data.item.id} justifyContent={"flex-end"} flex={"1"}>
					<Pressable onPress={() => this.handleEdit(data.item) }>
						<VStack w={"80px"} h={"80px"} backgroundColor={"warmGray.300"} alignItems={"center"} justifyContent={"center"}>
							<NBIonicon name={"create-outline"} fontSize={"3xl"} />
							<Text>{ language.beneficiariesList.slideButtonEdit }</Text>
						</VStack>
					</Pressable>
					<Pressable onPress={() => this.setState({ isOpen: !this.state.isOpen }) }>					
						<VStack w={"80px"} h={"80px"} backgroundColor={"danger.600"} alignItems={"center"} justifyContent={"center"}>
							<NBIonicon name={"trash-outline"} fontSize={"3xl"} color={"white"} />
							<Text color={"white"}>{ language.beneficiariesList.slideButtonDelete }</Text>
						</VStack>
					</Pressable>
				</HStack>
					<AlertDialog leastDestructiveRef={this.cancelRef.current} isOpen={this.state.isOpen} onClose={this.onClose}>
					<AlertDialog.Content>
						<AlertDialog.CloseButton />
						<AlertDialog.Header>
							<HStack>
								<NBIonicon name={"alert-circle"} fontSize={"2xl"} mr={"1"} color={"danger.600"} />
								<Heading fontSize={"lg"} mt={"0.5"}>{ language.beneficiariesList.alertDeleteHeading }</Heading>
							</HStack>
						</AlertDialog.Header>
						<AlertDialog.Body>{ language.beneficiariesList.alertDeleteMessageLine1 + " " + data.item.firstname + " " + 
							data.item.lastname + ". " +  language.beneficiariesList.alertDeleteMessageLine2 }
						</AlertDialog.Body>
						<AlertDialog.Footer>
							<Button.Group space={2}>
								<Button variant="unstyled" colorScheme="coolGray" onPress={this.onClose} ref={this.cancelRef.current}>{ language.beneficiariesList.alertDeleteButtonCancel }</Button>
								<Button colorScheme="danger" onPress={() => this.handleDelete(data.item)}>{ language.beneficiariesList.alertDeleteButtonConfirm }</Button>
							</Button.Group>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog>
			</>
		)
	}
}