import * as React from "react"
import Svg, { Path, G } from "react-native-svg"
import { Box } from 'native-base'

const PayIDSVG = (props) => {
	const { size, ...nbprops } = props
	return <Box {...nbprops} w={"100%"}>
		<SVG />
	</Box>
}

const SVG = ({size}) => {
	return (
		<Svg
			viewBox={"0 0 122 62"}
			x={"0"}
			y={"0"}
			xmlns={"http://www.w3.org/2000/svg"}
			xmlSpace={"preserve"}
			style={{
				fillRule: "evenodd",
				clipRule: "evenodd",
				strokeLinejoin: "round",
				strokeMiterlimit: 2,
			}}
			width={"100%"}
			height={"100%"}
			>
			<G>
				<Path
					style={{
						fill: "#000",
						fillRule: "nonzero",
					}}
					d="M5.46,18.96h8.45c1.49,0,2.83,0.14,4.02,0.4c1.19,0.27,2.22,0.71,3.07,1.33c0.85,0.61,1.51,1.4,1.98,2.36
		c0.46,0.96,0.69,2.11,0.69,3.46c0,1.45-0.27,2.66-0.8,3.64c-0.54,0.98-1.26,1.77-2.18,2.37c-0.92,0.6-1.98,1.04-3.2,1.31
		c-1.22,0.27-2.51,0.4-3.88,0.4h-3.55v10.79H5.46V18.96z M13.29,30.34c0.75,0,1.48-0.05,2.16-0.17c0.68-0.11,1.29-0.31,1.83-0.59
		c0.54-0.28,0.96-0.67,1.28-1.16c0.32-0.49,0.48-1.13,0.48-1.92c0-0.76-0.16-1.38-0.48-1.86c-0.32-0.48-0.74-0.85-1.26-1.12
		c-0.53-0.27-1.12-0.45-1.79-0.53c-0.67-0.09-1.36-0.13-2.07-0.13h-3.37v7.47H13.29z"/>
				<Path
					style={{
						fill: "#000",
						fillRule: "nonzero",
					}}
					d="M36.41,42.78H36.3c-0.44,0.79-1.15,1.43-2.12,1.93c-0.98,0.5-2.08,0.76-3.33,0.76c-0.71,0-1.44-0.09-2.21-0.28
		s-1.48-0.49-2.12-0.92c-0.65-0.43-1.18-0.99-1.61-1.69c-0.43-0.7-0.64-1.57-0.64-2.6c0-1.33,0.37-2.38,1.12-3.17s1.7-1.39,2.87-1.8
		c1.17-0.42,2.47-0.69,3.9-0.83c1.43-0.13,2.82-0.2,4.19-0.2v-0.44c0-1.1-0.4-1.92-1.19-2.45c-0.79-0.53-1.74-0.79-2.84-0.79
		c-0.93,0-1.82,0.2-2.67,0.59c-0.85,0.39-1.56,0.87-2.12,1.43l-2.27-2.69c1-0.93,2.15-1.63,3.46-2.1c1.31-0.47,2.63-0.7,3.97-0.7
		c1.56,0,2.85,0.22,3.86,0.66c1.01,0.44,1.81,1.02,2.4,1.73c0.59,0.71,0.99,1.51,1.23,2.39c0.23,0.88,0.35,1.77,0.35,2.65v10.75
		h-4.1L36.41,42.78L36.41,42.78z M36.34,36.96h-0.99c-0.71,0-1.45,0.03-2.23,0.09c-0.78,0.06-1.5,0.2-2.16,0.4
		c-0.66,0.21-1.21,0.5-1.65,0.88c-0.44,0.38-0.66,0.9-0.66,1.57c0,0.42,0.09,0.77,0.28,1.05c0.18,0.28,0.42,0.51,0.71,0.68
		c0.29,0.17,0.62,0.29,0.99,0.37c0.37,0.07,0.73,0.11,1.1,0.11c1.51,0,2.66-0.4,3.44-1.21c0.78-0.81,1.17-1.92,1.17-3.31
		L36.34,36.96L36.34,36.96z"/>
				<Path
					style={{
						fill: "#000",
						fillRule: "nonzero",
					}}
					d="M41.81,27.35h4.87l4.9,12.85h0.07l4.35-12.85h4.57l-8.31,21.46c-0.32,0.81-0.66,1.53-1.02,2.15
		c-0.36,0.63-0.8,1.15-1.32,1.58c-0.51,0.43-1.12,0.76-1.81,0.98c-0.69,0.22-1.53,0.33-2.51,0.33c-0.37,0-0.74-0.02-1.12-0.05
		c-0.38-0.04-0.76-0.1-1.15-0.2l0.36-3.83c0.29,0.1,0.58,0.17,0.86,0.2c0.28,0.04,0.54,0.05,0.79,0.05c0.46,0,0.85-0.05,1.17-0.17
		c0.32-0.11,0.59-0.28,0.8-0.52c0.22-0.23,0.41-0.52,0.59-0.86c0.17-0.34,0.35-0.75,0.55-1.21l0.88-2.25L41.81,27.35z"/>
			</G>
			<Path
				style={{
					fill: "#000",
					fillRule: "nonzero",
				}}
				d="M106.75,4.23H77.43c-6.68,0-12.1,5.45-12.1,12.18v29.51c0,6.73,5.42,12.18,12.1,12.18h29.32c6.68,0,12.1-5.45,12.1-12.18
	V16.4C118.85,9.68,113.43,4.23,106.75,4.23z M88.01,17.33l1.52-0.19c0.13-0.01,3.19-0.38,6.74,0.37c4.91,1.04,8.38,3.69,10.05,7.67
	l-3.19,1.35c-2.27-5.43-8.71-6.04-11.66-6.02v16.15h-3.46L88.01,17.33L88.01,17.33z M77.09,19.54c0-1.44,1.16-2.6,2.59-2.6
	c1.43,0,2.59,1.16,2.59,2.6c0,1.44-1.16,2.6-2.59,2.6C78.25,22.14,77.09,20.98,77.09,19.54z M107.17,34.36
	c-0.19,1.23-0.47,2.34-0.83,3.2c-2.34,5.54-7.81,8.35-16.24,8.35H77.82V26.69h3.46v15.74h8.81c6.91,0,11.31-2.1,13.05-6.23
	c0.2-0.48,0.38-1.12,0.51-1.84l-2.87,0l4.94-6.24l4.95,6.25L107.17,34.36z"/>
		</Svg>
	)

}

export default PayIDSVG
