import React, { useContext, useState, useEffect, useReducer } from 'react'

//components
import { Button, HStack, Text } from 'native-base'
import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'

//data
import { AuthContext } from '../../data/Context'
import { useRecoilState } from 'recoil'
import { userState } from '../../data/recoil/user'
import { noticeState } from '../../data/recoil/system'
import { api } from '../../config'
import Config from 'react-native-config'
import { getNotice } from '../../data/handlers/Status'

export const LanguageToggle = () => {
	const { auth, authDispatch } = useContext(AuthContext)
	const [ user, setUser ] = useRecoilState(userState)
	const [ notices, setNotices ] = useRecoilState(noticeState)
	const [ selected, setSelected ] = useState(auth.lang)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	useEffect(() => {
		setSelected(auth.lang)
	}, [auth])

	const handleLanguageChange = (lang) => {
		setSelected(lang)
		setUser((prev) => ({...prev, lang: lang }))
		if(notices.length > 0) {
			let tmpNotices = notices.map((element) => { return getNotice(element.id, lang) })
			setNotices((prev) => ([...tmpNotices]))
		}
		authDispatch({ type: 'SET_LANG', payload: { lang: lang }})
		if(auth.token !== 'undefined') {
			api.setHeader('Authorization', 'Bearer ' + auth.token)
			api.post(Config.BASEURL + '/changelang', { lang: lang })
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