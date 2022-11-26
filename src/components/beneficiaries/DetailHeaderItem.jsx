import React from 'react'
import { Box, Heading } from 'native-base'

const DetailHeaderItem = (data) => {
	const title = data.title
	return (
		<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"} key={title.replace(' ', '_').toLowerCase()}>
			<Heading size={"sm"}>{title}</Heading>
		</Box>
	)
}

export default React.memo(DetailHeaderItem)