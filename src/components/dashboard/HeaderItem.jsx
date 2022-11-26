import React from 'react'
import { Box, Heading } from 'native-base';
import { AuthContext } from '../../data/Context';

const HeaderItem = (props) => {
	const { auth } = React.useContext(AuthContext)
	const { header } = props
	let formattedDate = new Date(header).toLocaleDateString(auth.lang, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

	return (
		<Box backgroundColor={"primary.200"} p={"4"} w={"100%"}>
			<Heading size={"sm"}>{formattedDate}</Heading>
		</Box>
	)
}

export default React.memo(HeaderItem)