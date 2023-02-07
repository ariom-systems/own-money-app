import React, { memo } from 'react'

//components
import LabelValue from '../common/LabelValue'

const DetailRowItem = (props) => {
	const { index, item, section } = props
	const sectionLength = section.data.length - 1
	const { label, value } = item

	let styles = {}

	if (index == sectionLength) { styles = { borderBottomRadius: "8" } }

	return (
		<LabelValue label={label} value={value} styles={styles} />
	)
}

export default DetailRowItem
