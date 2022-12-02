import React from 'react'
import { Alert, Box, Collapse, Factory, Heading, HStack, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import { AuthContext } from '../../data/Context'
import { getNotice } from '../../data/handlers/Status'
import { BounceIn } from 'react-native-reanimated'
import * as Hooks from '../../data/Hooks'

const NBIonicon = Factory(Ionicon)

export const Notice = (props) => {
	const { auth, authDispatch } = React.useContext(AuthContext)
	const { wrap, showClose, timeout, children } = props
	let content = getNotice(auth.status, auth.lang)

	if(!(content instanceof Array)) {
		if(content.hasOwnProperty('message')) {
			return <NoticeBox content={content} wrap={wrap} showClose={showClose} timeout={timeout} extra={children} />
		} else {
			let notice = getNotice(content.reason, auth.lang)
			return <NoticeBox content={notice} wrap={wrap} showClose={showClose} timeout={timeout} extra={children} />
		}
	} else if(noticeContent instanceof Array) {
		let notices = []
		noticeContent.forEach(notice => {
			let single = getNotice(notice.reason, auth.lang)
			notices.push(<NoticeBox content={single} wrap={wrap} showClose={showClose} timeout={timeout} extra={children} />)
		})
		return notices
	}
}

export const NoticeBox = (props) => {
	const { content, wrapProps, showClose = true, timeout, extra } = props
	const { auth, authDispatch } = React.useContext(AuthContext)

	const handleDismiss = () => {
		authDispatch({ type: 'CLEAR_STATUS' })
	}

	Hooks.useInterval(() => {
		handleDismiss()
	}, auth.extra === null ? 10000 : null)

	return (
		<Box {...wrapProps} key={content.title}>
			<Alert justifyContent={"center"} status={content.style} w={"100%"}>
				<VStack space={"2"} w={"100%"}>
					<HStack justifyContent={"space-between"} space={"2"}>
						<HStack flexShrink={"1"} space={"2"} alignItems={"center"}>
							<NBIonicon name={content.icon} fontSize={"xl"} />
							<Heading fontSize={"md"} fontWeight={"medium"}>{content.title}</Heading>
						</HStack>
						{ showClose == true && (
							<NBIonicon name={"close"} fontSize={"xl"} onPress={handleDismiss}/>
						)}
					</HStack>
					<Box pl={ typeof extra == "undefined" ? "6" : "0"}>
						<Text color={"info.600"} fontWeight={"medium"}>{content.message}</Text>
					</Box>

					{ extra && (
						<Box p={"4"} bgColor={"primary.300"}>
							<Text bold>Server Response:</Text>
							{ extra }
						</Box>
					) }
				</VStack>
			</Alert>
		</Box>
	)
}