import React from "react"

//components
import { Box, Heading } from 'native-base'

const DetailHeaderItem = (props) => {
	const { title, index } = props
	return (
		<Box mt={index == 0 ? "0" : "4"} bgColor={"primary.200"} p={"4"} w={"100%"} roundedTop={"8"}>
			<Heading size={"sm"}>{title}</Heading>
		</Box>
	)
}

export default React.memo(DetailHeaderItem)
