import React from 'react'
import { Button, Factory, HStack, Pressable, Text, VStack } from 'native-base'
import PINCode, { hasUserSetPinCode, deleteUserPinCode } from '@haskkor/react-native-pincode'
import TouchID from 'react-native-touch-id'
import Ionicon from 'react-native-vector-icons/Ionicons'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import AlertModal from '../../components/common/AlertModal'
import { keychainSave, keychainReset, log } from '../../data/Actions'
import { AuthContext } from '../../data/Context'
import { LanguageToggle } from '../../components/common/LanguageToggle'

import * as Recoil from 'recoil';
import { globalState } from '../../data/recoil/system'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

Ionicon.loadFont()
MaterialCommunity.loadFont()

const NBIonicon = Factory(Ionicon)
const NBMaterial = Factory(MaterialCommunity)

const PinCodeScreen = ({ navigation }) => {

	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ show1, setShow1 ] = React.useState(false)
	const [ show2, setShow2 ] = React.useState(false)
	const [ hasPin, setHasPin ] = React.useState(false)
	const [ key, setKey ] = React.useState(0)
	const [ biometry, setBiometry ] = React.useState(null)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	const onClose1 = () => setShow1(false)
	const onClose2 = () => setShow2(false)
	const pincodeRef = React.useRef()
	const cancelRef = React.useRef()

	React.useEffect(() => {
		const checkForTouchID = async () => {
			TouchID.isSupported({ passcodeFallback: false, unifiedErrors: true })
				.then(biometryType => {
					setBiometry(biometryType)
				})
				.catch(error => {
					setBiometry("none")
				})
		}
		checkForTouchID()
	}, [])

	React.useEffect(() => {
		const checkKeychainForPin = async () => {
			const result = await hasUserSetPinCode('com.ariom.ownmoney')
			if(typeof result !== 'undefined') {
				if (result === true) {
					setHasPin(true)
				}
			} else {
				setHasPin(false)
			}
		}
		checkKeychainForPin()
	}, [])

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			forceUpdate()
		}
	}, [language, auth])

	const handlePinSet = async (pin) => {
		//use our own keychain entry. don't have time to figure out how to use the one in react-native-pincode
		const saveResponse = await keychainSave('pin', auth.email, pin)
		authDispatch({ type: 'SET_PIN', payload: { pin: pin } })
		navigation.navigate('Loading')
	}

	const handleEnterPin = async (pin) => {
		authDispatch({ type: 'SET_PIN', payload: { data: pin } })
		navigation.navigate('Loading')
	}

	const handleResetPinCheck = async () => {
		setShow2(true)
	}

	const handleResetPinAction = async () => {
		await keychainReset('pin')
		await keychainReset('token')
		await deleteUserPinCode('com.ariom.ownmoney')
		authDispatch({ type: 'RESET_PIN' })
		authDispatch({ type: 'SET_STATUS', payload: { data: 'pinReset' }})
		authDispatch({ type: 'LOGOUT' })
	}

	const handleTouchError = e => {
		switch (e.name) {
			case 'LAErrorUserCancel':
			case 'LAErrorSystemCancel':
			case 'LAErrorAuthenticationFailed':
				setShow1(true)
			break
			case 'LAErrorTouchIDNotEnrolled':
				console.log('touch user not enrolled')
				//fail silently. the user can still use their PIN code
			break
			default:
				console.log('failing for some reason')
				console.log(e)
			break
		}
	}

	const handleLogout = async () => {
		const reset = await keychainReset('token')
		if (reset === true) {
			authDispatch({ type: 'LOGOUT' })
		}
	}

	const BackButton = () => {
		return (
			<Pressable onPress={handleLogout}>
				<VStack w={"100%"} h={"100%"} alignItems={"center"} justifyContent={"center"}>
					<NBIonicon name={"exit-outline"} fontSize={"2xl"} ml={"1"} />
					<Text>{ language.pinCode.pinPadButtonBack }</Text>
				</VStack>
			</Pressable>
		)
	}

	const DeleteButton = (props) => {
		return (
			<Pressable onPress={props.handleOnPress}>
				<VStack w={"100%"} h={"100%"} alignItems={"center"} justifyContent={"center"}>
					<NBIonicon name={"backspace"} fontSize={"2xl"} />
					<Text>{ language.pinCode.pinPadButtonDelete }</Text>
				</VStack>
			</Pressable>
		)
	}

	return (
		<>
			<PINCode
				key={key}
				ref={pincodeRef}
				status={hasPin ? "enter" : "choose"}
				passwordLength={4}
				bottomLeftComponent={() => <BackButton />}
				buttonDeleteComponent={(erase) => <DeleteButton handleOnPress={erase} />}
				touchIDDisabled={false}
				delayBetweenAttempts={500}
				callbackErrorTouchId={handleTouchError}
				passcodeFallback={false}
				pinCodeKeychainName={"com.ariom.ownmoney"}
				finishProcess={(pin) => hasPin ? handleEnterPin(pin) : handlePinSet(pin)}
				disableLockScreen={true}
				//Styles
				colorCircleButtons={"#CDA14D"}
				numbersButtonOverlayColor={"#3D2D0D"}
				stylePinCodeButtonNumber={"#FFFFFF"}
				stylePinCodeCircle={{ backgroundColor: "#CDA14D" }}
				stylePinCodeColorTitle={"#3D2D0D"}
				stylePinCodeDeleteButtonColorHideUnderlay={"#3D2D0D"}
				stylePinCodeDeleteButtonColorShowUnderlay={"#3D2D0D"}
				stylePinCodeTextTitle={{ fontWeight: "bold" }}
				//strings
				subtitleChoose={language.pinCode.subtitleChoose}
				subtitleError={language.pinCode.subtitleError}
				textCancelButtonTouchID={language.pinCode.textCancelButtonTouchID}
				titleAttemptFailed={language.pinCode.titleAttemptFailed}
				titleChoose={language.pinCode.titleChoose}
				titleConfirm={language.pinCode.titleConfirm}
				titleConfirmFailed={language.pinCode.titleConfirmFailed}
				titleEnter={language.pinCode.titleEnter}
				touchIDSentence={language.pinCode.touchIDSentence}
			/>
			{ hasPin == true && (
				<VStack space={"10"} w={"100%"} h={"30%"} pb={"2%"} justifyContent={"center"} alignItems={"center"}>
					<Pressable onPress={handleResetPinCheck}>
						<Text color={"primary.600"}>{ language.pinCode.forgotPincodeLink }</Text>
					</Pressable>
					{biometry !== 'none' && (
					<Pressable onPress={() => setKey(Math.random()) /* this doesn't feel right */}>
						{biometry == 'TouchID' ? (
							<NBIonicon name={'finger-print'} fontSize={"4xl"} />
						) : (
							<NBMaterial name={'face-recognition'} fontSize={"4xl"} />
						)}
					</Pressable>
					)}
					<HStack>
						<LanguageToggle />
					</HStack>
				</VStack>
			)}
			<AlertModal
				show={show1}
				close={onClose1}
				header={ language.pinCode.biometricDialogTitle }
				content={<Text>{ language.pinCode.biometricDialogMessage }</Text>}
			>
				<Button.Group>
					<Button onPress={() => setKey(Math.random())}>{ language.pinCode.biometricDialogButtonTryAgain }</Button>
					<Button onPress={onClose1}>{ language.pinCode.biometricDialogButtonEnterPin }</Button>
				</Button.Group>
			</AlertModal>
			<AlertModal
				show={show2}
				close={onClose2}
				header={language.pinCode.resetPinDialogTitle}
				ldRef={cancelRef}
				content={<Text>{language.pinCode.resetPinDialogMessageLine1}{`\n\n`}{language.pinCode.resetPinDialogMessageLine2}</Text>}
			>
				<Button.Group>
					<Button onPress={handleResetPinAction} >{ language.pinCode.resetPinDialogButtonReset}</Button>
					<Button onPress={onClose2} ref={cancelRef}>{ language.pinCode.resetPinDialogButtonCancel}</Button>
				</Button.Group>
			</AlertModal>
		</>)
}

export default PinCodeScreen