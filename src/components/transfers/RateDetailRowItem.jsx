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

		let yourRate = data.find(element => element.key == 'yourrate')
		let todayRate = data.find(element => element.key == 'todayrate')
		let bonusRate = data.find(element => element.key == 'bonusrate')

		return (
			<VStack flexWrap={"wrap"} width={"100%"} justifyContent={'space-between'} alignItems={spacing} bgColor={"white"} p={Sizes.padding} space={Sizes.spacing}>
				<HStack justifyContent={"space-between"}>
					<Text bold flex={"1"}>{yourRate.label}</Text>
					<Text textAlign={"right"} flex={"1"}>{yourRate.value}</Text>
				</HStack>
				<HStack justifyContent={"space-between"}>
					<Text italic flex={"1"}>{todayRate.label}</Text>
					<Text italic textAlign={"right"} flex={"1"}>{formatCurrency(todayRate.value, "th-TH", "THB").long}</Text>
				</HStack>
				{ bonusRate.value > 0 && (
				<HStack justifyContent={"space-between"}>
					<Text color={"success.600"} italic flex={"1"}>{bonusRate.label}</Text>
					<Text color={"success.600"} italic textAlign={"right"} flex={"1"}>+{formatCurrency(bonusRate.value, "th-TH", "THB").long}</Text>
				</HStack>
				)}
			</VStack>
		)
	}
	
}

export default memo(RateDetailRowItem)
