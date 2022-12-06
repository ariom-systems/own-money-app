import React from 'react'
import { Box, Heading } from 'native-base'

export default ListHeaderItem = (props) => {
	const date = new Date(props.date).toLocaleDateString('en-AU', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
	return (
		<Box mt={"4"} bgColor={"primary.200"} p={"4"} w={"100%"} roundedTop={"8"}>
			<Heading size={"sm"}>{date}</Heading>
		</Box>
	)
}
