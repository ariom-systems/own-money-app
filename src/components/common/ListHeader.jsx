import React from 'react'

//components
import { Heading, HStack } from 'native-base'

//data
import { useRecoilValue } from 'recoil'
import { Sizes } from '../../config'
import { langState } from '../../data/recoil/system'

const ListHeader = (props) => {
	const lang = useRecoilValue(langState)
	let { title, index, styles = null, date = false } = props
	if (typeof title === 'object') {  title = title.value }
	if (date == true) { title = new Date(title).toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }

	return (
		<HStack key={index || Math.random() * 1000 } p={"4"} bgColor={"primary.200"} {...styles}>
			<Heading size={"sm"}>{title}</Heading>
		</HStack>
	)
}

export default ListHeader
