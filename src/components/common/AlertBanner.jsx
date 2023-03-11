import React, { useContext, useEffect, useState } from 'react'

//components
import { Alert, Box, Button, CloseIcon, Collapse, HStack, IconButton, Text, VStack } from 'native-base'
import Icon from './Icon'

//data
import { useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { AuthContext } from '../../data/Context'
import { getNotice } from '../../data/handlers/Status'
import { atomRemoveItemAtIndex } from '../../data/Actions'
import { userState } from '../../data/recoil/user'
import { noticeState, langState } from '../../data/recoil/system'
import { Sizes } from '../../config'

export const AlertItem = (props) => {
	const [ show, setShow ] = useState(true)
	const [ notices, setNotices ] = useRecoilState(noticeState)

	const { icon, iconType = 'Ionicon', title, message, style = "info", canClose = false, bannerAction = null, timeout = 10000, id } = props.data
	const { label, fn } = bannerAction ?? { label: "none", fn: () => {} }
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
			<Alert space={Sizes.spacing} status={style} variant={"top-accent"}>
				<VStack space={Sizes.spacingSmall} flexShrink={"1"} w={"100%"}>
					<HStack alignItems={"center"} flexShrink={"1"} space={Sizes.spacingSmall} justifyContent={"space-between"}>
						<HStack alignItems={"center"} flexShrink={"1"} space={Sizes.spacingSmall}>
							<Icon type={iconType} name={icon} fontSize={"lg"} />
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
	const { auth } = useContext(AuthContext)
	const lang = useRecoilValue(langState)
	let notices = useRecoilValue(noticeState)
	let noticeList = []

	const removeDuplicates = (notices) => {
		let unique = []
		let output = notices.filter((notice) => {
			const isDuplicate = unique.includes(notice['id'])
			if (!isDuplicate) {
				unique.push(notice['id'])
				return true
			}
			return false
		})
		return output
	}

	function processNotices() {
		if (auth.token != null) {
			notices = removeDuplicates(notices)
			noticeList = notices.map((element, index) => {
				return <AlertItem key={index} index={index} data={element} />
			})
		} else {
			if (auth.status != null) {
				let contextNotice = getNotice(auth.status, lang)
				noticeList.push(<AlertItem key={'from_context'} index={0} data={contextNotice} />)
			} else {
				notices = removeDuplicates(notices)
				noticeList = notices.map((element, index) => {
					return <AlertItem key={index} index={index} data={element} />
				})
			}
		}
	}

	processNotices()

	useEffect(() => {
		processNotices()
	},[auth, notices])

	return (
		<VStack {...props} space={Sizes.spacing}>
			{ noticeList }
		</VStack>
	)
}

export default AlertBanner