import React, { useState, useContext } from 'react'

import { Center, Box, Heading, VStack, Text, Input, Button, HStack, FormControl, WarningOutlineIcon, Alert, Image, CheckCircleIcon } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()

import { AuthContext } from '../data/Context'
import { pushPasswordChange } from '../data/Actions'

import image from '../../assets/img/logo.png'

const ResetPasswordScreen = ({route, navigation}) => {

	const { email, hash } = route.params

	const [emailText, setEmailText] = useState(email)
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const [hashValue, setHashValue] = useState(hash)

	const [notices, setNotices] = useState({
		general: {},
		email: {},
		password: {},
		password2: {}
	})
	
	const [showPass, setShowPass] = React.useState(false)
	const [showPass2, setShowPass2] = React.useState(false)

	const { auth, authDispatch } = useContext(AuthContext)
	
	const handlePassShow = () => setShowPass(!showPass)
	const handlePassShow2 = () => setShowPass2(!showPass2)

	const handleResetPassword = async (password, password2) => {

		function extractNotices(payload, marker, key) {
			return payload.find(p => p[marker] === key)
		}

		authDispatch({ type: 'LOADING' })
		const response = await pushPasswordChange(emailText, hashValue, password, password2)	

		//console.log(response)

		if(Array.isArray(response.notices)) {

			//TODO: this is kind of ugly but works. 
			let e_general, e_email, e_password, e_password2
			e_general = extractNotices(response.notices, 'origin', 'system')
			e_password = extractNotices(response.notices, 'origin', 'password')
			e_password2 = extractNotices(response.notices, 'origin', 'password2')
			if(e_general !== undefined) { setNotices((notices) => { return {...notices, general: e_general } }) } else { setNotices((notices) => { return {...notices, general: {} } }) }
			if(e_password !== undefined) { setNotices((notices) => { return {...notices, password: e_password } }) } else { setNotices((notices) => { return {...notices, password: {} } }) }
			if(e_password2 !== undefined) { setNotices((notices) => { return {...notices, password2: e_password2 } }) } else { setNotices((notices) => { return {...notices, password2: {} } }) }

			authDispatch({ type: 'ERROR' })
		}
	}

	return (
		<Center w="100%" flex={"1"} alignItems={"center"} justifyContent={"center"}>
			<Box safeArea p={"2"} py={"8"} w={"90%"} maxW={"290"}>
				<Image alignSelf={"center"} source={image} mb={"4"} w={"60%"} h={"30%"} resizeMode={"contain"} alt={"Own Money Services"} />
				<Heading mt={"1"} mb={"4"} _dark={{ color: "warmGray.200" }} color={"coolGray.600"} fontWeight={"medium"} size={"xs"}>Please enter a new password.</Heading>
				{ notices.general.message && (
				<Box borderColor={notices.general.type == 'error' ? "error.600" : "success.600"} borderWidth={"1"} borderRadius={"4"} padding={"4"} mb={"2"}>
					<HStack>
					{ notices.general.type == 'error' ? (
						<WarningOutlineIcon size={"xs"} color={"error.600"} mr={"1"} mt={"1"} />
					) : (
						<CheckCircleIcon size={"xs"} color={"success.600"} mr={"1"} mt={"1"} />
					)}
						<Text color={notices.general.type == 'error' ? "error.600" : "success.600"}>{notices.general.message}</Text>
					</HStack>
				</Box>
				)}
				<VStack space={"3"} w={"100%"}>
					
					<FormControl isInvalid={ notices.password.message ? true : false }>
						<FormControl.Label>Password</FormControl.Label>
						<Input value={password} type={showPass ? "text" : "password"}
							onChangeText={newPassword => setPassword(newPassword)} autoCapitalize={"none"}
							InputRightElement={<Ionicon name={showPass ? "eye-sharp" : "eye-outline"} size={19} color={"#8B6A27"} style={{marginRight: 8}} onPress={handlePassShow} />}/>
					{ notices.password.message && (
						<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
							{ notices.password.message }
						</FormControl.ErrorMessage>
					)}
					</FormControl>
					
					<FormControl isInvalid={ notices.password2.message ? true : false }>
						<FormControl.Label>Confirm Password</FormControl.Label>
						<Input value={password2} type={showPass2 ? "text" : "password"}
							onChangeText={newPassword2 => setPassword2(newPassword2)} autoCapitalize={"none"}
							InputRightElement={<Ionicon name={showPass2 ? "eye-sharp" : "eye-outline"} size={19} color={"#8B6A27"} style={{marginRight: 8}} onPress={handlePassShow2}/>}/>
					{ notices.password2.message && (
						<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
							{ notices.password2.message }
						</FormControl.ErrorMessage>
					)}
					</FormControl>
					<HStack space={"3"} flexDir={"row"}>
						{ auth.loading ? 
							<Button mt={"2"} flex={"1"} isLoading colorScheme={"indigo"} onPress={() => handleResetPassword(password, password2)}>Reset Password</Button>
						: 
							<Button mt={"2"} flex={"1"} colorScheme={"indigo"} onPress={() => handleResetPassword(password, password2)}>Reset Password</Button>
						}
					</HStack>
				</VStack>
			</Box>
		</Center>
	)
}

export default ResetPasswordScreen