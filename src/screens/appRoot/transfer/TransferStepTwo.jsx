import React from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import { Box, Button, HStack, ScrollView, StatusBar, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import StaticFlatList from '../../../components/transfers/StaticFlatList'
import Toolbar, { ToolbarItem, ToolbarSpacer } from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'

//data
import { AuthContext } from '../../../data/Context'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beneficiaryList } from '../../../data/recoil/beneficiaries'
import { stepAtom, stepTwoButtonAtom } from '../../../data/recoil/transfer'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export default TransferStepTwo = () => {
	const navigation = useNavigation()
	const { auth } = React.useContext(AuthContext)
	const beneficiaries = useRecoilValue(beneficiaryList)
	const setStep = useSetRecoilState(stepAtom)
	const buttonState = useRecoilValue(stepTwoButtonAtom)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	const handleNext = () => {
		setStep(2)
		navigation.navigate('TransferStepThree')
	}

	const handlePrevious = () => {
		setStep(0)
		navigation.goBack()
	}

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<StatusBar barStyle={"dark-content"} />
			<ScrollView>
				<AlertBanner m={"2.5%"} mb={"0"} />
				<VStack p={"2.5%"} space={"4"}>
					<VStack bgColor={"white"} p={"4"} rounded={"8"}>
						<TransferStepIndicator />
						<VStack justifyContent={"space-between"} flexGrow={"1"}>
							<Box w={"100%"} p={"2"} mb={"4"}>
								<Text textAlign={"center"}>{language.transferSteptwo.titleTop }</Text>
							</Box>
							<Box borderColor={"primary.600"} borderWidth={"1"} rounded={"lg"}>
								<StaticFlatList data={beneficiaries} listProps={{ mb: "4", roundedTop: "10", roundedBottom: "10" }} />
							</Box>

							{/* <HStack w={"100%"} space={"4"} mt={"4"} alignItems={"center"}>
								<Button flex={"1"} onPress={()=> handlePrevious()}>
									<Text fontSize={"17"} color={"#FFFFFF"}>{ }</Text>
								</Button>
								<Button flex={"1"} onPress={()=> handleNext()} isDisabled={buttonState}
									_disabled={{ backgroundColor:"primary.500", borderColor:"primary.600", borderWidth:1 }}>
										<Text fontSize={"17"} color={"#FFFFFF"}>{language.transferSteptwo.buttonNext }</Text>
								</Button>	
							</HStack> */}
						</VStack>
					</VStack>
					<Toolbar>
						<ToolbarItem
							label={language.transferSteptwo.buttonPrevious}
							icon={"chevron-back-outline"}
							space={"1"}
							iconProps={{ ml: "-4" }}
							buttonProps={{ flex: "1" }}
							action={() => handlePrevious()} />
						<ToolbarSpacer />
						<ToolbarItem
							label={language.transferSteptwo.buttonNext}
							icon={"chevron-forward-outline"}
							iconPosition={"right"}
							buttonProps={{ flex: "1", isDisabled: buttonState, _disabled: { style: "subtle" } }}
							action={() => handleNext()} />
					</Toolbar>
				</VStack>
			</ScrollView>
		</ImageBackground>
	)
}