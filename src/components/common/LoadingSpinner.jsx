import React from "react"

//components
import { Button, Heading, HStack, Spinner, Text, VStack } from 'native-base'

const LoadingSpinner = ({message, subtitle}) => {
	return (
		<VStack p={"10"} backgroundColor={"white"} rounded={"2xl"} space={"4"} alignItems={"center"}>
			<HStack space={"4"} alignItems={"center"} justifyContent={"center"}>
				<Spinner size={"lg"} />
				<Text color={"primary.500"} fontSize={"xl"}>{message}</Text>
			</HStack>
			{ subtitle && <Text>{subtitle}</Text>}
		</VStack>
	)
}

export default LoadingSpinner

{/* <Button onPress={() => navigation.navigate('AppDrawer')}>(debug) Continue</Button> */}