import React from 'react'
import { Button, HStack, Text, Factory } from 'native-base';

import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'
import { AuthContext } from '../../data/Context';

export const LanguageToggle = () => {
	
	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ selected, setSelected ] = React.useState(auth.lang)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	// let status = auth.status
	// React.useEffect(() => {
	// 	authDispatch({ type: 'SET_STATUS', payload: { data: status }})
	// }, [selected])

	React.useEffect(() => {
		setSelected(auth.lang)
	}, [auth])

	const handleLanguageChange = (lang) => {
		setSelected(lang)
		authDispatch({ type: 'SET_LANG', payload: { lang: lang }})
		forceUpdate()
	}

	return (
		<HStack>
			<Button size={"xs"} roundedLeft={"3xl"} flexGrow={"1"} roundedRight={"none"} variant={selected == 'en-AU' ? "solid" : "outline"} onPress={() => handleLanguageChange('en-AU')}>
				<HStack space={"3"}>
					<AuSVG />
					<Text color={ selected == 'en-AU' ? "white" : "black" }>English</Text>
				</HStack>
			</Button>
			<Button size={"xs"} roundedLeft={"none"} flexGrow={"1"} roundedRight={"3xl"} variant={selected == 'th-TH' ? "solid" : "outline"} onPress={() => handleLanguageChange('th-TH')}>
				<HStack space={"2"}>
					<Text color={ selected == 'th-TH' ? "white" : "black" }>ภาษาไทย</Text>
					<ThSVG/>
				</HStack>
			</Button>
		</HStack>
	)
}