import React from "react"
import { Button, HStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)

const ThemeToggle = () => {
	const [selected, setSelected] = React.useState(false)

	const handleThemeChange = (mode) => {
		console.log(mode)
	}

	return (
		<HStack>
			<Button size={"xs"} roundedLeft={"3xl"} flexGrow={"1"} roundedRight={"none"} variant={selected == 'light' ? "solid" : "outline"} onPress={() => handleThemeChange('light')}>
				<HStack space={"3"}>
					<NBIonicon name={"sunny-outline"} />
				</HStack>
			</Button>
			<Button size={"xs"} roundedLeft={"none"} flexGrow={"1"} roundedRight={"3xl"} variant={selected == 'dark' ? "solid" : "outline"} onPress={() => handleThemeChange('dark')}>
				<HStack space={"2"}>
					<NBIonicon name={"moon-outline"} />
				</HStack>
			</Button>
		</HStack>
	)
}

export default React.memo(ThemeToggle)
