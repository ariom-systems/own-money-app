import React, { useEffect, useState, useReducer } from 'react'

//components
import { Alert, Box, Button, CloseIcon, Collapse, Factory, HStack, IconButton, Text, VStack } from 'native-base'
import Icon from './Icon'

//data
import { useRecoilValue, useRecoilState } from 'recoil'
import { noticeState } from '../../data/recoil/system'
import { userState } from '../../data/recoil/user'
import { atomRemoveItemAtIndex } from '../../data/Actions'

export const AlertItem = (props) => {
	const user = useRecoilValue(userState)
	const { icon, title, message, style = "info", canClose = false, bannerAction = null, timeout = 10000, id } = props.data
	const { label, fn } = bannerAction ?? { label: "none", fn: () => {} }
	const [ show, setShow ] = useState(true)
	const [ notices, setNotices ] = useRecoilState(noticeState)
	const handleBannerAction = () => { fn() }

	useEffect(() => {
		setTimeout(() => {
			if(canClose == true) {
				removeBanner()
				setShow(false)
			}
		}, timeout)
	})

	const removeBanner = () => {
		let newNotices = atomRemoveItemAtIndex(notices, props.index)
		setNotices(newNotices)
	}

	return (
		<Collapse isOpen={show} width={"100%"}>
			<Alert space={"4"} status={style} variant={"top-accent"}>
				<VStack space={"1"} flexShrink={"1"} w={"100%"}>
					<HStack alignItems={"center"} flexShrink={"1"} space={"2"} justifyContent={"space-between"}>
						<HStack alignItems={"center"} flexShrink={"1"} space={"2"}>
							<Icon type={"Ionicon"} name={icon} fontSize={"lg"} />
							<Text fontSize={"md"} fontWeight={"medium"}>{title}</Text>
						</HStack>
						{ canClose && (
							<IconButton
								variant={"unstyled"}
								_focus={{ borderWidth: 0 }}
								icon={<CloseIcon size={"3"} />}
								_icon={{ color: "coolGray.600" }}
								onPress={() => {
									removeBanner()
									setShow(false)
								}}
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
	const user = useRecoilValue(userState)
	let noticeList = noticeList = notices.map((element, index) => {
		return <AlertItem key={index} index={index} data={element} />
	})

	useEffect(() => {
		noticeList = notices.map((element, index) => {
			return <AlertItem key={index} index={index} data={element} />
		})
	}, [notices])

	return noticeList.length > 0 ? (
		<VStack {...props} space={"4"}>
			{noticeList}
		</VStack>
	) : ( null )
}

export default AlertBanner

