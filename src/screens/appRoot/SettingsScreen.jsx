import React, { useContext, useState, useEffect, useRef } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { Button, Divider, Pressable, Spinner, Text, VStack } from 'native-base'
import { LanguageToggle } from '../../components/common/LanguageToggle'
import AlertModal from '../../components/common/AlertModal'
import ListHeader from '../../components/common/ListHeader'
import LabelValue from '../../components/common/LabelValue'

//data
import Config from 'react-native-config'
import { deleteUserPinCode } from '@haskkor/react-native-pincode'
import { atom, useRecoilValue, useRecoilState } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { AuthContext } from '../../data/Context'
import { api } from '../../config'
import { keychainReset } from '../../data/Actions'
import { langState } from '../../data/recoil/system'


//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const pinSpinnerState = atom({
	key: 'pinSpinner',
	default: false
})

const passwordSpinnerState = atom({
	key: 'passwordSpinner',
	default: false
})

function SettingsScreen() {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const { auth, authDispatch } = useContext(AuthContext)
	const [ pinSpinner, setPinSpinner ] = useRecoilState(pinSpinnerState)
	const [ passwordSpinner, setPasswordSpinner ] = useRecoilState(passwordSpinnerState)
	const lang = useRecoilValue(langState)
	const [ showLogout, setShowLogout ] = useState(false)
	const [ showResetPass, setShowResetPass ] = useState(false)
	const [ showResetPin, setShowResetPin ] = useState(false)
	const onCloseLogout = () => setShowLogout(false)
	const onCloseResetPass = () => setShowResetPass(false)
	const onCloseResetPin = () => setShowResetPin(false)
	const refLogout = useRef()
	const refResetPass = useRef()
	const refResetPin = useRef()

	const handleLogout = () => {
		new Promise((resolve) => {
			setPinSpinner(true)
			forceUpdate()
			setTimeout(() => {
				resolve()
			}, 2000)
		}).then((result) => {
			navigation.navigate('LogoutScreen')
		})
	}

	const handleResetPin = () => {
		new Promise((resolve) => {
		 	setPinSpinner(true)
		 	forceUpdate()
		 	setTimeout(() => {
				resolve()
			}, 2000)
		}).then((result) => {
			authDispatch({ type: 'SET_STATUS', payload: { data: 'pinReset' } }) //leave this here
			doPinReset()
		})
	}

	const handleResetPassword = () => {
		new Promise((resolve) => {
			setPasswordSpinner(true)
			forceUpdate()
			setTimeout(() => {
				resolve()
			}, 2000)
		}).then((result) => {
			api.post(Config.BASEURL + '/forgotpassword', {
				email: auth.email,
				lang: lang
			})
			.then(response => {
				if (response.ok == true) {
					authDispatch({ type: 'SET_STATUS', payload: { data: 'passwordReset' } }) //leave this here
					doPinReset()
				}
			})
		})
	}

	const doPinReset = () => {
		deleteUserPinCode('com.ariom.ownmoney')
		keychainReset('pin')
		keychainReset('token')
		authDispatch({ type: 'RESET_PIN' })
		authDispatch({ type: 'LOGOUT' })
	}

	useEffect(() => {
		if(pinSpinner || passwordSpinner) {
			setTimeout(() => {
				if(pinSpinner == true || passwordSpinner == true) {
					setPinSpinner(false)
					setPasswordSpinner(false)
				}
			}, 5000)
		}
	}, [pinSpinner, passwordSpinner])

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

  	return (
		<VStack flex="1" w={"100%"} justifyContent={"flex-start"}>
			<ListHeader title={language.settings.headings.preferences} />
			<LabelValue label={language.settings.labels.language} styles={{ alignItems: "center", space: "4"}} labelStyles={{ flexShrink: 1, bold: false }}>
				<LanguageToggle />
			</LabelValue>

			<ListHeader title={language.settings.headings.account} />
			<Pressable onPress={() => setShowLogout(!showLogout) }>
				<LabelValue label={language.settings.labels.logout} labelStyles={{ bold: false }}/>
			</Pressable>

			<Divider />
			<Pressable onPress={() => setShowResetPin(!showResetPin)}>
				<LabelValue label={language.settings.labels.resetpin} labelStyles={{ bold: false }}>{ pinSpinner && <Spinner />}</LabelValue>
			</Pressable>
			<Divider />
			<Pressable onPress={() => setShowResetPass(!showResetPass) }>
					<LabelValue label={language.settings.labels.resetpassword} labelStyles={{ bold: false }}>{ passwordSpinner && <Spinner /> }</LabelValue>
			</Pressable>

			<ListHeader title={language.settings.headings.about} />
			<LabelValue label={language.settings.labels.appversion} labelStyles={{ bold: false }} value={
				Config.MAJOR_VERSION + '.' + Config.MINOR_VERSION + '.' + Config.PATCH_VERSION + '-' + Config.STAGE + '.' + Config.BUILD_NUMBER
			} />

			<AlertModal
				show={showLogout}
				close={onCloseLogout}
				ldref={refLogout}
				header={language.settings.ui.alertLogoutTitle}
				content={<Text>{language.settings.ui.alertLogout}</Text>}
			>
				<Button.Group>
					<Button onPress={() => { onCloseLogout(); handleLogout()} }>{language.settings.ui.buttonConfirm}</Button>
					<Button onPress={onCloseLogout} ref={refLogout}>{language.settings.ui.buttonCancel}</Button>
				</Button.Group>
			</AlertModal>

			<AlertModal
				show={showResetPass}
				close={onCloseResetPass}
				ldref={refResetPass}
				header={language.settings.ui.alertResetPasswordTitle}
				content={<Text>{language.settings.ui.alertResetPassword}</Text>}
			>
				<Button.Group>
					<Button onPress={() => { onCloseResetPass(); handleResetPassword() } }>{language.settings.ui.buttonConfirm}</Button>
					<Button onPress={onCloseResetPass} ref={refResetPass}>{language.settings.ui.buttonCancel}</Button>
				</Button.Group>
			</AlertModal>

			<AlertModal
				show={showResetPin}
				close={onCloseResetPin}
				ldref={refResetPin}
				header={language.settings.ui.alertResetPinTitle}
				content={<Text>{language.settings.ui.alertResetPin}</Text>}
			>
				<Button.Group>
					<Button onPress={() => { onCloseResetPin(); handleResetPin() } }>{language.settings.ui.buttonConfirm}</Button>
					<Button onPress={onCloseResetPin} ref={refResetPin}>{language.settings.ui.buttonCancel}</Button>
				</Button.Group>
			</AlertModal>
		</VStack>
  	)
}

export default SettingsScreen