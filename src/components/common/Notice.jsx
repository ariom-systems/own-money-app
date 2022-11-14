import React from 'react'
import { Alert, Box, Collapse, Factory, Heading, HStack, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import { AuthContext } from '../../data/Context'
import { getNotice } from '../../data/handlers/Status'

const NBIonicon = Factory(Ionicon)

export const Notice = (props) => {
	const { auth, authDispatch } = React.useContext(AuthContext)
	
	let wrapProps = props.wrap
	let showClose = props.showClose || true
	let noticeContent = getNotice(auth.status, auth.lang)
	if(!(noticeContent instanceof Array)) {
		if(noticeContent.hasOwnProperty('message')) {
			return renderNotice(noticeContent, wrapProps, showClose, authDispatch)
		} else {
			let notice = getNotice(noticeContent.reason, auth.lang)
			return renderNotice(notice, wrapProps, showClose, authDispatch)
		}
		
	} else if(noticeContent instanceof Array) {
		let notices = []
		noticeContent.forEach(notice => {
			let single = getNotice(notice.reason, auth.lang)
			notices.push(renderNotice(single, wrapProps, showClose, authDispatch))
		})
		return notices
	}
}

function renderNotice(props, wrapProps, showClose, authDispatch) {

	const handleClose = () => {
		authDispatch({ type: 'CLEAR_STATUS' })
	}

	if(props !== 'undefined') {
		//allow noticeContent to be overridden by props if required.
		let noticeContent = {}
		if(typeof props.style !== 'undefined') { noticeContent.style = props.style }
		if(typeof props.icon !== 'undefined') { noticeContent.icon = props.icon }
		if(typeof props.message !== 'undefined') { noticeContent.message = props.message }
		if(typeof props.title !== 'undefined') { noticeContent.title = props.title }
	
		return (
			<Box {...wrapProps} key={noticeContent.title}>
				<Alert justifyContent={"center"} status={noticeContent.style} w={"100%"}>
					<VStack space={"2"} w={"100%"}>
						<HStack justifyContent={"space-between"} space={"2"}>
							<HStack flexShrink={"1"} space={"2"} alignItems={"center"}>
								<NBIonicon name={noticeContent.icon} fontSize={"xl"} />
								<Heading fontSize={"md"} fontWeight={"medium"}>{noticeContent.title}</Heading>
							</HStack>
							{ showClose == true && (
								<NBIonicon name={"close"} fontSize={"xl"} onPress={handleClose}/>
							)}
						</HStack>
						<Box pl={"6"}>
							<Text color={"info.600"} fontWeight={"medium"}>{noticeContent.message}</Text>
						</Box>
					</VStack>
				</Alert>
			</Box>
		)
	} else {
		return false
	}
}