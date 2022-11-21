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
	let close = props.showClose || true
	let content = getNotice(auth.status, auth.lang)
	if(!(content instanceof Array)) {
		if(content.hasOwnProperty('message')) {
			return <NoticeBox content={content} wrap={wrapProps} showClose={close} />
		} else {
			let notice = getNotice(content.reason, auth.lang)
			return <NoticeBox content={notice} wrap={wrapProps} showClose={close} />
		}
	} else if(noticeContent instanceof Array) {
		let notices = []
		noticeContent.forEach(notice => {
			let single = getNotice(notice.reason, auth.lang)
			notices.push(<NoticeBox content={single} wrap={wrapProps} showClose={close} />)
		})
		return notices
	}
}

export const NoticeBox = ({ content, wrapProps, showClose = true, timeout = 10000 }) => {
	const { authDispatch } = React.useContext(AuthContext)

	const handleDismiss = () => {
		authDispatch({ type: 'CLEAR_STATUS' })
	}

	React.useEffect(() => {
		if(timeout !== false) {
			setTimeout(() => {
				handleDismiss()
			}, timeout)	
		}
	}, [])

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
					<Box pl={"6"}>
						<Text color={"info.600"} fontWeight={"medium"}>{content.message}</Text>
					</Box>
				</VStack>
			</Alert>
		</Box>
	)
}