import React from 'react'

//components
import { ImageBackground } from 'react-native'
import { Center, Heading, HStack, Spinner, StatusBar, Text, VStack } from 'native-base'

//data
import { AuthContext } from '../../data/Context'

const LogoutScreen = () => {
	const { authDispatch } = React.useContext(AuthContext)

	React.useEffect(() => {
		authDispatch({ type: 'SET_STATUS', payload: { data: 'logout' }})
		authDispatch({ type: 'LOGOUT'})
	},[])


	return (
		<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>	
			<StatusBar barStyle={"dark-content"}/>
			<Center safeArea flex={1} justifyContent={"center"}>
				<VStack flex="1" space={"4"} w={"100%"} alignItems="center" justifyContent={"center"}>
					<VStack p={"10"} backgroundColor={"white"} rounded={"2xl"} space={"3"}>
						<HStack space={"3"} alignItems={"center"}>
							<Spinner size={"lg"} />
							<Heading color={"primary.500"} fontSize={"xl"}>Logging Out</Heading>
						</HStack>
						<Text>Please wait.</Text>
					</VStack>
				</VStack>	
			</Center>
		</ImageBackground>
	)
}

export default LogoutScreen