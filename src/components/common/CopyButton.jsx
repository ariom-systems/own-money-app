import React from "react"
import Clipboard from '@react-native-clipboard/clipboard'

//components
import { Pressable, useToast } from 'native-base'
import Icon from './Icon'

const CopyButton = (props) => {
	const toast = useToast()
	let { payload } = props

	const handlePress = (data) => {
		Clipboard.setString(data)
		toast.show({ description: "Copied"})
	}

	return (
		<Pressable onPress={() => handlePress(payload)}>
			<Icon type={"Ionicon"} name={"copy-outline"} fontSize={"lg"} />
		</Pressable>
	)
}

export default CopyButton
