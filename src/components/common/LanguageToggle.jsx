import React from 'react'
import { Button, HStack, Text } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'
import { AuthContext } from '../../data/Context';
import { api } from '../../config';
import Config from 'react-native-config';

export const LanguageToggle = () => {
	
	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ selected, setSelected ] = React.useState(auth.lang)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {

		setSelected(auth.lang)
	}, [auth])

	

	const handleLanguageChange = (lang) => {
		console.log("lang", lang)
		setSelected(lang)
		authDispatch({ type: 'SET_LANG', payload: { lang: lang }})
		if(auth.token !== 'undefined') {
			api.setHeader('Authorization', 'Bearer ' + auth.token)
			api.post(Config.BASEURL + '/changelang', { lang: lang }).then(response => { console.log("response", response.data) })
		}
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