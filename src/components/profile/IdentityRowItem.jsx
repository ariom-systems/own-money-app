import React from "react"

//components
import { Factory, Flex, HStack, Text, VStack } from 'native-base'
import Material from 'react-native-vector-icons/MaterialIcons'
Material.loadFont()
const NBMaterial = Factory(Material)

const IdentityRowItem = ({data}) => {
	let { index, item, section } = data.data
	let { label, value, subdata} = item
	let { type, expiry, issuer, number, uploaded, file } = subdata

	return (
		<VStack space={"4"}>
			<Text fontSize={"lg"}>{label}</Text>
			<HStack justifyContent={"space-between"}>
				<VStack w={"50%"}>
					<VStack>
						<Text fontSize={"xs"} color={"coolGray.500"}>{ type.label }</Text>
						<Text fontSize={"md"} color={type.value != "" ? "black" : "coolGray.300"}>{type.value || "none"}</Text>
					</VStack>
					<VStack>
						<Text fontSize={"xs"} color={"coolGray.500"}>{expiry.label}</Text>
						<Text fontSize={"md"} color={expiry.value != "" ? "black" : "coolGray.300"}>{expiry.value || "none"}</Text>
					</VStack>
				</VStack>
				<Flex borderStyle={"dashed"} borderWidth={"1"} w={"50%"} h={"100%"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
					<NBMaterial name={"image-not-supported"} fontSize={"6xl"} color={"coolGray.300"} />
				</Flex>
			</HStack>
			<HStack justifyContent={"space-between"}>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{number.label}</Text>
					<Text fontSize={"md"} color={number.value != "" ? "black" : "coolGray.300"}>{number.value || "none"}</Text>
				</VStack>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{issuer.label}</Text>
					<Text fontSize={"md"} color={issuer.value != "" ? "black" : "coolGray.300"}>{issuer.value || "none"}</Text>
				</VStack>
			</HStack>
			<HStack justifyContent={"space-between"}>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{uploaded.label}</Text>
					<Text fontSize={"md"} color={uploaded.value != "" ? "black" : "coolGray.300"}>{uploaded.value || "none"}</Text>
				</VStack>
				<VStack w={"50%"}>
					<Text fontSize={"xs"} color={"coolGray.500"}>{file.label}</Text>
					<Text fontSize={"md"} color={file.value != "" ? "black" : "coolGray.300"}>{file.value || "none"}</Text>
				</VStack>
			</HStack>
		</VStack>
	)
}

export default React.memo(IdentityRowItem)
