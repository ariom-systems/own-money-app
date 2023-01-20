import React from 'react'

//components
import LabelValue from '../common/LabelValue'

const DetailRowItem = ({data}) => {
	const index = data.index
	const section = data.section
	const sectionLength = data.section.data.length - 1
	const { label, value } = data.item
	let styles = {}

	if (index == sectionLength) { styles = { borderBottomRadius: "8" } }

	if (section.title == "Address Details") {
		if (index == sectionLength) {
			styles = {...styles, mb: "4" }
		}
	}

	return (
		<LabelValue label={label ?? ""} value={value} styles={styles} />
	)
}

export default DetailRowItem