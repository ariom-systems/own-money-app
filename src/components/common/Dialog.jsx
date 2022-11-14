import React from 'react'
import { AlertDialog, Text, VStack } from 'native-base'

const Dialog = (props) => {
	return (
		<AlertDialog isOpen={props.show} leastDestructiveRef={props.ldRef} onClose={props.close}>
			<AlertDialog.Content>
				<AlertDialog.CloseButton />
				<AlertDialog.Header>{props.header}</AlertDialog.Header>
				<AlertDialog.Body>
					<VStack space={"3"}>
						{props.body}
					</VStack>
				</AlertDialog.Body>
				<AlertDialog.Footer justifyContent={"center"}>
					{ props.buttons == undefined ? (
						<Text>( nothing here. use the 'buttons' property )</Text>
					) : (props.buttons) }
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog>
	)
}

export default Dialog