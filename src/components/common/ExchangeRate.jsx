import React, { useContext, useEffect, useReducer } from 'react'

//components
import { Box, Heading, HStack, Popover, Pressable, Spacer, Text } from 'native-base'
import Icon from './Icon'
import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'

//data
import { AuthContext } from '../../data/Context'
import { formatCurrency } from '../../data/Actions'
import { useRecoilValue }  from 'recoil'
import { globalState } from '../../data/recoil/system'
import { userState } from '../../data/recoil/user'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const ExchangeRate = (props) => {
	const { nb, size = "lg" } = props
	const { auth } = useContext(AuthContext)
	const globals = useRecoilValue(globalState)
	const user = useRecoilValue(userState)
	let formatted = formatCurrency(globals.rate, "th-TH", "THB")
	let rateValue = formatted.symbol + formatted.value
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)
	//en-AU only returns 2 digit year values even though it is supposed to display 4 digits. Beyond our control.
	let rateAsOf = new Date().toLocaleDateString(user.lang == 'en-AU' ? 'en-GB' : user.lang, { year: 'numeric', month: 'numeric', day: 'numeric'}).split(',')[0]

	switch(size) {
		case "lg": xr = xrStyles.lg; break;
		case "sm": xr = xrStyles.sm; break;
	}

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			forceUpdate()
		}
	}, [language, user])

	return (
		<Box backgroundColor={"gray.200"} w={"100%"} borderRadius={"8"} {...nb} {...xr.padding}>
			<HStack justifyContent={"space-between"} alignItems={"center"} borderBottomColor={"coolGray.400"} borderBottomWidth={"1"} pb={"2"}>
				<Heading {...xr.heading}>{ language.components.exchangeRateCardTitle }</Heading>
				<Popover placement={"top"} trigger={triggerProps => { return (
						<Pressable {...triggerProps}>
							<Icon type={"Ionicon"} color={"coolGray.500"} name={"information-circle-outline"} fontSize={"md"} ml={"1"} />
						</Pressable>
					) }} >
						<Popover.Content>
							<Popover.Arrow />
							<Popover.Body>
								{ language.components.exchangeRateCardToolTip }
							</Popover.Body>
						</Popover.Content>
					</Popover>
				<Spacer />
				<Heading {...xr.heading}>{rateAsOf}</Heading>
			</HStack>
			<HStack {...xr.row}>
				<Box {...xr.icon}>
					<AuSVG size={{width: xr.svg.w, height: xr.svg.h}} />
					<Text {...xr.iconTxt}>{ language.components.exchangeRateCardAud }</Text>
				</Box>
				<HStack alignItems={"center"} justifyContent={"center"}>
					<Text {...xr.eq}>$1 = {rateValue}</Text>
				</HStack>
				<Box {...xr.icon}>
					<ThSVG size={{width: xr.svg.w, height: xr.svg.h}} />
					<Text {...xr.iconTxt}>{ language.components.exchangeRateCardThb }</Text>
				</Box>
			</HStack>
		</Box>
	)
}

/**
 * 
 */


const xrStyles = {
	lg: {
		padding: {
			pl: "4",
			pr: "4",
			pt: "4"
		},
		heading: {
			fontSize: "lg"
		},
		row: {
			justifyContent: "center",
			alignItems: "center",
			pb: "4",
			pt: "4"
		},
		eq: {
			fontSize: "3xl",
			textAlign: "center",
		} ,
		icon: {
			alignItems: "center",
			flex: "1",
			flexDirection: "column"
		},
		iconTxt: { fontSize: "lg" },
		svg: { h: 40, w: 40 }
	},
	sm: {
		padding: {
			pl: "3",
			pr: "3",
			pt: "3"
		},
		heading: {
			fontSize: "sm"
		},
		row: {
			justifyContent: "center",
			alignItems: "center",
			my: "2"
		},
		eq: {
			fontSize: "xl",
			textAlign: "center",
		} ,
		icon: {
			justifyContent: "space-evenly",
			alignItems: "center",
			flex: "1",
			flexDirection: "row"
		},
		iconTxt: { fontSize: "md" },
		svg: { h: 24, w: 24 }
	}
}

export default ExchangeRate
