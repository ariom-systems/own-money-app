import React, { useContext, useEffect, memo } from 'react'

//components
import AppSafeArea from '../../components/common/AppSafeArea'
import { Center, Heading, HStack, Spinner, Text, VStack } from 'native-base'

//data
import { AuthContext } from '../../data/Context'

const LogoutScreen = () => {
	const { authDispatch } = useContext(AuthContext)

	useEffect(() => {
		authDispatch({ type: 'SET_STATUS', payload: { data: 'logout' }})
		authDispatch({ type: 'LOGOUT'})
	},[])


	return (
		<AppSafeArea>
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
		</AppSafeArea>
	)
}

export default memo(LogoutScreen)