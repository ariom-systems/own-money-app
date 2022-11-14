import React from 'react'
import { Box, Spinner } from 'native-base'

export default function LoadingOverlay() {
	return (
		<Box
			backgroundColor={"primary.300"}
			bottom={"0"}
			h={"100%"}
			left={"0"}
			position={"absolute"}
			right={"0"}
			top={"0"}
			w={"100%"}
			zIndex={"1"}
			justifyContent={"center"}>
			<Spinner size={"lg"} style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
		</Box>
	)
}