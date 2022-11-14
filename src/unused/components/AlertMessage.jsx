import React from 'react'
import { Alert, Text, VStack, HStack } from 'native-base'

function AlertMessage({message}) {
	return (
		<Alert status={"info"} colorScheme={"primary.200"} py={"9"} px={"5"}> 
			<VStack flexShrink={1} space={2} alignItems={"center"}>
				<HStack flexShrink={1} space={2} alignItems={"center"}>
					<Alert.Icon size={"lg"} />
					<Text fontSize={"16"}>{message}</Text>
				</HStack>
			</VStack>
		</Alert>
	)
}

export default AlertMessage