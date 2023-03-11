import React, { useEffect, memo } from 'react'

//components
import { Heading, HStack, Popover, Pressable, Text, VStack } from 'native-base'
import Icon from '../common/Icon'

//data
import { useFormContext } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { formatCurrency } from '../../data/Actions'
import { promoAtom, feeSelector, rateSelector, limitSelector } from '../../data/recoil/transfer'
import { userState } from '../../data/recoil/user'
import { globalState, langState } from '../../data/recoil/system'
import { Sizes } from '../../config'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const TransferDetails = (props)  => {
	const forceUpdate = useForceUpdate()
	const { setValue, setError, clearErrors, formState } = useFormContext()
	const user = useRecoilValue(userState)
	const promo = useRecoilValue(promoAtom)
	const fee = useRecoilValue(feeSelector)
	const rate = useRecoilValue(rateSelector)
	const limit = useRecoilValue(limitSelector)
	const globals = useRecoilValue(globalState)
	const lang = useRecoilValue(langState)

	let totalLimit = Number(user.daily_limit_remaining) + Number(promo.limit)

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	useEffect(() => {
		setValue("remaining", Number(limit))
		setValue("fee", Number(fee))
		setValue("rate", Number(rate))
		if(Number(limit) < 0) {
			setError('remaining', { type: 'custom', message: language.transferStepOne.errors.limitExceeded})
		} else {
			clearErrors()
		}
	}, [language, lang, limit])

	const PopoverIcon = () => {
		return (
			<Popover placement={"top"} trigger={triggerProps => {
				return (
					<Pressable {...triggerProps}>
						<Icon type={"Ionicon"} color={"coolGray.500"} name={"information-circle-outline"} fontSize={"md"} ml={"1"} />
					</Pressable>
				)
			}} >
				<Popover.Content>
					<Popover.Arrow />
					<Popover.Body>
						{language.components.exchangeRateCardToolTip}
					</Popover.Body>
				</Popover.Content>
			</Popover>
		)
	}

	return (
		<VStack width={"100%"} p={"4"} borderColor="coolGray.300" borderWidth={"1"} rounded={"8"} alignItems={"center"} space={Sizes.spacing}>
			<Heading fontSize={"md"}>{ language.transferStepOne.headings.transferDetails }</Heading>			
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text>{ language.transferStepOne.labels.fee }:</Text>
				<Text>{ formatCurrency(fee, "en-AU", "AUD").full }</Text>
			</HStack>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text>{ language.transferStepOne.labels.yourRate }:</Text>
				<Text>{ formatCurrency(rate, "th-TH", "THB").full }</Text>
			</HStack>
			{promo.rate > 0 && (
				<HStack w={"100%"} justifyContent={"space-between"}>
					<Text italic color={"success.600"}>({language.promo.labels.bonusRate}:</Text>
					<Text italic color={"success.600"}>+{formatCurrency(promo.rate, "th-TH", "THB").full})</Text>
				</HStack>
			)}
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text italic color={"coolGray.500"}>{language.transferStepOne.labels.todayRate}<PopoverIcon />:</Text>
				
				<Text italic color={"coolGray.500"}>{formatCurrency(globals.rate, "th-TH", "THB").full}</Text>
			</HStack>
			<Heading fontSize={"md"}>{language.transferStepOne.headings.acountLimits}</Heading>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text>{language.transferStepOne.labels.dailyLimit}:</Text>
				<Text>{formatCurrency(user.daily_limit_max, "en-AU", "AUD").full}</Text>
			</HStack>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text>{language.transferStepOne.labels.remainingLimit}:</Text>
				<Text>{formatCurrency(totalLimit, "en-AU", "AUD").full}</Text>
			</HStack>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Text color={formState.errors.remaining ? "danger.600" : "black"}>{language.transferStepOne.labels.limitAfterTransfer}:</Text>
				<Text color={formState.errors.remaining ? "danger.600" : "black"}>{formatCurrency(limit, "en-AU", "AUD").full}</Text>
			</HStack>
			{promo.limit > 0 && (
				<HStack w={"100%"} justifyContent={"space-between"}>
					<Text italic color={"success.600"}>({language.promo.labels.limitIncrease}:</Text>
					<Text italic color={"success.600"}>+{formatCurrency(promo.limit, "en-AU", "AUD").full})</Text>
				</HStack>
			)}
			{(formState.errors.remaining) && (
				<HStack w={"100%"}><Text color={"danger.600"}>{formState.errors.remaining.message}</Text></HStack>)}
		</VStack>
	)
}

export default memo(TransferDetails)