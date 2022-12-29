import React from 'react'

//components
import { ImageBackground } from 'react-native'
import { Box, Button, HStack, ScrollView, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import StaticFlatList from '../../../components/transfers/StaticFlatList'
import { useNavigation } from '@react-navigation/native'

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
			<ScrollView>
				<Box mx={"2.5%"} mt={"5%"} p={"5%"} backgroundColor={"white"} rounded={"2xl"}>
					<TransferStepIndicator />
					<VStack justifyContent={"space-between"} flexGrow={"1"}>
						<Box w={"100%"} p={"2"} mb={"4"}>
							<Text textAlign={"center"}>{language.transferSteptwo.titleTop }</Text>
						</Box>
						<Box borderColor={"primary.600"} borderWidth={"1"} rounded={"lg"}>
							<StaticFlatList data={beneficiaries} listProps={{ mb: "4", roundedTop: "10", roundedBottom: "10" }} />
						</Box>
						<HStack w={"100%"} space={"4"} mt={"4"} alignItems={"center"}>
							<Button flex={"1"} onPress={()=> handlePrevious()}>
								<Text fontSize={"17"} color={"#FFFFFF"}>{language.transferSteptwo.buttonPrevious }</Text>
							</Button>
							<Button flex={"1"} onPress={()=> handleNext()} isDisabled={buttonState}
								_disabled={{ backgroundColor:"primary.500", borderColor:"primary.600", borderWidth:1 }}>
									<Text fontSize={"17"} color={"#FFFFFF"}>{language.transferSteptwo.buttonNext }</Text>
							</Button>	
						</HStack>
					</VStack>
				</Box>
			</ScrollView>
		</ImageBackground>
	)
}