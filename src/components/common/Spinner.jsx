import React from 'react'
import { Modal } from 'react-native'
import { Box, Heading, HStack, Spinner as NBSpinner} from 'native-base'

const Spinner = (props) => {
	const { text = "Loading" } = props
	return (
		<Modal>
			<Box
				backgroundColor={"primary.100"}
				h={"100%"}
				w={"100%"}
				justifyContent={"center"}>
				<HStack space={2} justifyContent={"center"}>
					<NBSpinner size={"lg"} />
					<Heading color={"primary.700"}>{text}</Heading>
				</HStack>
			</Box>
		</Modal>
	)
}

export default Spinner
