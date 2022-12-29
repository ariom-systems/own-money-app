import React from 'react'

//components
import { Alert, Box, Button, CloseIcon, Collapse, Factory, HStack, IconButton, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)

//data
import { useRecoilValue } from 'recoil'
import { noticeState } from '../../data/recoil/system'
import { Pressable } from 'react-native'

export const AlertItem = (props) => {
	let { icon, title, message, style = "info", canClose = false, bannerAction = null } = props.data
	let { label, fn } = bannerAction
	
	const [ show, setShow ] = React.useState(true)

	const handleBannerAction = () => {
		fn()
	}

	return (
		<Collapse isOpen={show} width={"100%"}>
			<Alert my={"2.5%"} space={"4"} status={style} variant={"top-accent"}>
				<VStack space={"1"} flexShrink={"1"} w={"100%"}>
					<HStack alignItems={"center"} flexShrink={"1"} space={"2"} justifyContent={"space-between"}>
						<HStack alignItems={"center"} flexShrink={"1"} space={"2"}>
							<NBIonicon name={icon} fontSize={"lg"} />
							<Text fontSize={"md"} fontWeight={"medium"}>{title}</Text>
						</HStack>
						{ canClose && (
							<IconButton
								variant={"unstyled"}
								_focus={{ borderWidth: 0 }}
								icon={<CloseIcon size={"3"} />}
								_icon={{ color: "coolGray.600" }}
								onPress={() => setShow(false)}
							/>)
						}
					</HStack>
					<Box pl={"6"}>{message}</Box>
					{ bannerAction && (
						<Button
							variant={"outline"}
							borderColor={style+".700"}
							mt={"2.5%"}
							_text={{ color: style+".900"}}
							_pressed={{ bgColor: style + ".700", _text: { color: "white" }}}
							onPress={() => handleBannerAction()}>{label}</Button>
					)}
				</VStack>
			</Alert>
		</Collapse>
	)
}

const AlertBanner = (props) => {
	const notices = useRecoilValue(noticeState)
	let noticeList = []
	notices.forEach((element, index) => {
	 	noticeList.push(<AlertItem key={index} data={element} />)
	})
	return noticeList.length > 0 ? (
		<Box {...props}>
			{noticeList}
		</Box>
	) : ({noticeList})
}

export default React.memo(AlertBanner)

