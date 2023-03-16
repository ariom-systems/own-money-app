import React, { memo } from 'react'

//components
import { Box, Heading } from 'native-base'

//data
import { Sizes } from '../../config'

const ReviewListHeader = (props) => {
	let { title, style } = props 

	return (
		<Box p={"2"} backgroundColor={"primary.200"} {...style}>
			<Heading size={"sm"}>{ title }</Heading>
		</Box>
	)
}

export default memo(ReviewListHeader)