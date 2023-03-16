import React from 'react'

//components
import { AlertDialog, Text } from 'native-base'

//data
import { Sizes } from '../../config'

const AlertModal = (props) => {
	let { show, ldRef = "", close, header, content = "something", children } = props

	return (
		<AlertDialog isOpen={show} leastDestructiveRef={ldRef} onClose={close}>
			<AlertDialog.Content>
				<AlertDialog.CloseButton />
				<AlertDialog.Header>
					{header}
				</AlertDialog.Header>
				<AlertDialog.Body>
					<Text>{content}</Text>
				</AlertDialog.Body>
				<AlertDialog.Footer justifyContent={"center"}>
					{ children }
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog>
	)
}

export default AlertModal