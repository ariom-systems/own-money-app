import React from 'react'
import { AlertDialog } from 'native-base'

const AlertModal = (props) => {
	let { show, ldRef = "", close, header, content, children } = props

	return (
		<AlertDialog isOpen={show} leastDestructiveRef={ldRef} onClose={close}>
			<AlertDialog.Content>
				<AlertDialog.CloseButton />
				<AlertDialog.Header>
					{header}
				</AlertDialog.Header>
				<AlertDialog.Body>
					{content}
				</AlertDialog.Body>
				<AlertDialog.Footer justifyContent={"center"}>
					{ children }
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog>
	)
}

export default AlertModal