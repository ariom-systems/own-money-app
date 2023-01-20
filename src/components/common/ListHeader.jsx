import React, { useContext, useEffect, useReducer } from 'react'

//components
import { Heading, HStack } from 'native-base'

//data
import { useRecoilValue } from 'recoil'
import { userState } from '../../data/recoil/user'

const ListHeader = (props) => {
	const user = useRecoilValue(userState)
	let { title, index, styles = null, date = false } = props
	if (typeof title === 'object') {  title = title.value }
	if (date == true) { title = new Date(title).toLocaleDateString(user.lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }

	return (
		<HStack key={index || Math.random() * 1000 } p={"4"} bgColor={"primary.200"} {...styles}>
			<Heading size={"sm"}>{title}</Heading>
		</HStack>
	)
}

export default ListHeader
