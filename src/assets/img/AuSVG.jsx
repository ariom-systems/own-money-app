import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { Box } from 'native-base'

export const AuSVG = (props) => {
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
					fill: "#4758a9",
					fillRule: "nonzero",
				}}
				d="M0 0h63833.7v42859.8H0z"
				transform="scale(.00082)"
			/>
			<Path
				d="m-19.946-15.906 15.026 5.69L0-25.512l4.92 15.296 15.026-5.69-8.892 13.383 13.818 8.2L8.865 7.069l2.204 15.916L0 11.339l-11.069 11.646 2.204-15.916-16.007-1.392 13.818-8.2-8.892-13.383Z"
				style={{
					fill: "#fff",
					fillRule: "nonzero",
				}}
				transform="matrix(.20726 0 0 .20726 13.125 26.63)"
			/>
			<Path
				d="m-19.946-15.906 15.026 5.69L0-25.512l4.92 15.296 15.026-5.69-8.892 13.383 13.818 8.2L8.865 7.069l2.204 15.916L0 11.339l-11.069 11.646 2.204-15.916-16.007-1.392 13.818-8.2-8.892-13.383Z"
				style={{
					fill: "#fff",
					fillRule: "nonzero",
				}}
				transform="matrix(.0987 0 0 .0987 39.75 29.467)"
			/>
			<Path
				d="m-19.946-15.906 15.026 5.69L0-25.512l4.92 15.296 15.026-5.69-8.892 13.383 13.818 8.2L8.865 7.069l2.204 15.916L0 11.339l-11.069 11.646 2.204-15.916-16.007-1.392 13.818-8.2-8.892-13.383Z"
				style={{
					fill: "#fff",
					fillRule: "nonzero",
				}}
				transform="matrix(.0987 0 0 .0987 30.937 15.514)"
			/>
			<Path
				d="m-19.946-15.906 15.026 5.69L0-25.512l4.92 15.296 15.026-5.69-8.892 13.383 13.818 8.2L8.865 7.069l2.204 15.916L0 11.339l-11.069 11.646 2.204-15.916-16.007-1.392 13.818-8.2-8.892-13.383Z"
				style={{
					fill: "#fff",
					fillRule: "nonzero",
				}}
				transform="matrix(.0987 0 0 .0987 39.75 5.967)"
			/>
			<Path
				d="m-19.946-15.906 15.026 5.69L0-25.512l4.92 15.296 15.026-5.69-8.892 13.383 13.818 8.2L8.865 7.069l2.204 15.916L0 11.339l-11.069 11.646 2.204-15.916-16.007-1.392 13.818-8.2-8.892-13.383Z"
				style={{
					fill: "#fff",
					fillRule: "nonzero",
				}}
				transform="matrix(.0987 0 0 .0987 47.583 13.164)"
			/>
			<Path
				d="M24.263-7.884 10.784 3.504l4.211 17.135L0 11.339l-14.995 9.3 4.211-17.135-13.479-11.388 17.598-1.289L0-25.512 6.665-9.173l17.598 1.289Z"
				style={{
					fill: "#fff",
					fillRule: "nonzero",
				}}
				transform="matrix(.05758 0 0 .05758 43.274 19.197)"
			/>
			<Path
				d="M13298.7 0h5319.5v7143.31h13298.7v7143.29H18618.2v7143.3h-5319.5v-7143.3H0V7143.31h13298.7V0Z"
				style={{
					fill: "#fff",
					fillRule: "nonzero",
				}}
				transform="scale(.00082)"
			/>
			<Path
				d="M0 0h3568.41L31916.9 19034v2395.9h-3568.5L0 2395.94V0Z"
				style={{
					fill: "#fff",
					fillRule: "nonzero",
				}}
				transform="scale(.00082)"
			/>
			<Path
				d="M0 0h3568.41L31916.9 19034v2395.9h-3568.5L0 2395.94V0Z"
				style={{
					fill: "#fff",
					fillRule: "nonzero",
				}}
				transform="matrix(-.00082 0 0 .00082 26.25 0)"
			/>
			<Path
				d="M14362.6 0h3191.7v8571.97h14362.6V12858H17554.3v8571.9h-3191.7V12858H0V8571.97h14362.6V0Z"
				style={{
					fill: "#ed5565",
					fillRule: "nonzero",
				}}
				transform="scale(.00082)"
			/>
			<Path
				d="m0 0 10639 7143.31H8260.01L0 1597.29V0Zm31916.9 0h-2379L18899 7143.31h2378.9L31916.9 0Z"
				style={{
					fill: "#ed5565",
					fillRule: "nonzero",
				}}
				transform="scale(.00082)"
			/>
			<Path
				d="m0 0 10639 7143.31H8260.01L0 1597.29V0Zm31916.9 0h-2379L18899 7143.31h2378.9L31916.9 0Z"
				style={{
					fill: "#ed5565",
					fillRule: "nonzero",
				}}
				transform="rotate(-180 13.105 8.8) scale(.00082)"
			/>
		</Svg>
	)
}