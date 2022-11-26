import React from 'react'
import { Box, Heading } from 'native-base'

const EditHeaderItem = (props) => {
	const heading = props.heading
	return (
		<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"}>
			<Heading size={"sm"}>{ heading }</Heading>
		</Box>
	)
}

export default React.memo(EditHeaderItem)
