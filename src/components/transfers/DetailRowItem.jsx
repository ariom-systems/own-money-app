import React, { memo } from 'react'

//components
import { Divider, Text } from 'native-base'
import LabelValue from '../common/LabelValue'

const DetailRowItem = (props) => {
	//console.log('DetailRowItem', props)
	const { index, item, section, sectionCount } = props
	const sectionLength = section.data.length
	const { label, value } = item

	let styles = {}, additionalContent

	if(section.index == sectionCount - 1) {
		if(index == sectionLength - 1) {
			additionalContent = <Divider width={"100%"} />
		}
	}


	return (
		<LabelValue label={label} value={value} styles={styles} additionalContent={additionalContent} />
	)
}

export default memo(DetailRowItem)