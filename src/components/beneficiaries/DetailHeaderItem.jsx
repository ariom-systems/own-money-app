import React from 'react'
import { Box, Heading } from 'native-base'

const DetailHeaderItem = (data, props) => {
	const { nb } = props
	const title = data.title
	return (
		<Box {...nb} mt={"4"}  px={"2"} py={"4"} backgroundColor={"coolGray.200"} key={title.replace(' ', '_').toLowerCase()} roundedTop={"8"}>
			<Heading size={"sm"}>{title}</Heading>
		</Box>
	)
}

export default React.memo(DetailHeaderItem)