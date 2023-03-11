import React, { memo } from 'react'

//components
import { Divider, HStack, Text, VStack } from 'native-base'
import LabelValue from '../common/LabelValue'

//data
import { Sizes } from '../../config'
import { formatCurrency } from '../../data/Actions'

const RateDetailRowItem = (props) => {
	if(typeof props.item.data == 'undefined') {
		const { item, section } = props
		const { label, value } = item
		return (
			<LabelValue label={label} value={value} />
		)
	} else {
		let { data, key } = props.item

		let maxLimit = data.find(element => element.key == 'maxlimit')
		let limitBefore = data.find(element => element.key == 'limitbefore')
		let limitBonus = data.find(element => element.key == 'limitbonus')
		let limitAfter = data.find(element => element.key == 'limitafter')

		return (
			<VStack flexWrap={"wrap"} width={"100%"} justifyContent={'space-between'} alignItems={spacing} bgColor={"white"} p={Sizes.padding} space={Sizes.spacing}>
				<HStack justifyContent={"space-between"}>
					<Text bold flex={"1"}>{maxLimit.label}</Text>
					<Text textAlign={"right"} flex={"1"}>{formatCurrency(maxLimit.value, "en-AU", "AUD").long}</Text>
				</HStack>
				<HStack justifyContent={"space-between"}>
					<Text italic flex={"1"}>{limitBefore.label}</Text>
					<Text italic textAlign={"right"} flex={"1"}>{formatCurrency(limitBefore.value, "en-AU", "AUD").long}</Text>
				</HStack>
				{ limitBonus.value > 0 && (
				<HStack justifyContent={"space-between"}>
					<Text color={"success.600"} italic flex={"1"}>{limitBonus.label}</Text>
					<Text color={"success.600"} italic textAlign={"right"} flex={"1"}>+{formatCurrency(limitBonus.value, "en-AU", "AUD").long}</Text>
				</HStack>
				)}
				<HStack justifyContent={"space-between"}>
					<Text italic flex={"1"}>{limitAfter.label}</Text>
					<Text italic textAlign={"right"} flex={"1"}>{formatCurrency(limitAfter.value, "en-AU", "AUD").long}</Text>
				</HStack>
			</VStack>
		)
	}
	
}

export default memo(RateDetailRowItem)
