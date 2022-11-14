import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { Box } from 'native-base'

export const ThSVG = (props) => {
	const { size, ...nbprops } = props
	return <Box {...nbprops}>
		<SVG size={size} />
	</Box>
}

const SVG = ({size}) => {
	let width = (typeof size === 'undefined' || size.width == 'undefined') ? 24 : size.width
	let height = (typeof size === 'undefined' || size.height == 'undefined') ? 24 : size.height
	return (
		<Svg
			viewBox="0 0 53 36"
			xmlns="http://www.w3.org/2000/svg"
			xmlSpace="preserve"
			style={{
				fillRule: "evenodd",
				clipRule: "evenodd",
				strokeLinejoin: "round",
				strokeMiterlimit: 2,
			}}
			width={width}
			height={height}
		>
			<Path
				style={{
					fill: "#ed5565",
				}}
				d="M0 0h2551.18v1700.79H0z"
				transform="scale(.02058 .02073)"
			/>
			<Path
				style={{
					fill: "#fff",
				}}
				d="M0 283.465h2551.18v1133.86H0z"
				transform="scale(.02058 .02073)"
			/>
			<Path
				style={{
					fill: "#4758a9",
				}}
				d="M0 566.929h2551.18v566.929H0z"
				transform="scale(.02058 .02073)"
			/>
		</Svg>
	)
}