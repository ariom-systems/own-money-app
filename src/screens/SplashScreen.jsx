import React, { useState, useEffect, memo } from 'react'
import { View, Image, StatusBar, StyleSheet } from 'react-native'
import Animated, { Pinwheel, useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated'
import { runOnJS } from 'react-native-reanimated/lib/reanimated2/core'

const SplashScreen = ({navigation}) => {
	const [state, setState ] = useState(false)
	const bgOpacity = useSharedValue(0)
	const boxSize = useSharedValue(0)
	const containerOpacity = useSharedValue(1)
	const contailerSize = useSharedValue(1)

	const handleAnimateFinish = () => {
		navigation.navigate('AppNavigator')
	}

	const backgroundReanimated = useAnimatedStyle(() => {
		return { opacity: bgOpacity.value }
	}, [state])

	const boxReanimated = useAnimatedStyle(() => {
		return { transform: [{ scale: boxSize.value }] }
	}, [state])

	const containerReanimated = useAnimatedStyle(() => {
		return {
			opacity: containerOpacity.value,
			transform: [{ scale: contailerSize.value }]
		}
	}, [state])
	
	useEffect(() => {
		bgOpacity.value = withTiming(1, { duration: 750 }, () => {
			boxSize.value = withTiming(1, { duration: 750 }, () => {
				boxSize.value = withDelay(1000, withTiming(0, { duration: 500 }, () => {
					runOnJS(handleAnimateFinish)()
				}))
			})
		})
	}, [state])

	return (
		<View style={styles.outer}>
			<StatusBar hidden={true} />
			<Animated.View style={[styles.container, containerOpacity]} exiting={Pinwheel}>
				<Animated.Image
					source={require("../assets/img/app_background.jpg")}
					resizeMode={"cover"}
					style={[backgroundReanimated]}>
				</Animated.Image>
				<View style={styles.logoWrap}>
					<Animated.View style={[styles.logoBox, boxReanimated]}>
						<Image
							source={require("../assets/img/logo.png")}
							style={styles.logo}
						/>
					</Animated.View>
				</View>
			</Animated.View>
		</View>
	)
}

const styles = StyleSheet.create({
	outer: {
		...StyleSheet.absoluteFill,
	},
	container: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		backgroundColor: '#8B6A27',
		justifyContent: 'center'
	},
	logoWrap: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'center'
	},
	logoBox: {
		transform: [{ scale: 0 }],
		backgroundColor: '#FFFFFF',
		padding: 20,
		borderRadius: 180,
		height:240,
		width:240,
		alignItems: 'center',
		justifyContent: 'center'
	},
	logo: {
		resizeMode: 'contain',
		height: 160,
		width: 160
	}
})

export default memo(SplashScreen)