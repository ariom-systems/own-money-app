import React, { useContext, useState, useEffect } from 'react'

//components
import { Button, HStack, Text, Spinner } from 'native-base'
import { AuSVG } from '../../assets/img/AuSVG'
import { ThSVG } from '../../assets/img/ThSVG'

//data
import Config from 'react-native-config'
import { atom, useRecoilState } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { AuthContext } from '../../data/Context'
import { getNotice } from '../../data/handlers/Status'
import { api } from '../../config'
import { userState } from '../../data/recoil/user'
import { noticeState, langState } from '../../data/recoil/system'

const langButtonState = atom({
	key: 'langButton',
	default: 'en-AU'
})

const langChangeState = atom({
	key: 'langChange',
	default: false
})

export const LanguageToggle = (props) => {
	const forceUpdate = useForceUpdate()
	const { auth, authDispatch } = useContext(AuthContext)
	const [ notices, setNotices ] = useRecoilState(noticeState)
	const [ selected, setSelected ] = useRecoilState(langButtonState)
	const [ lang, setLang ] = useRecoilState(langState)
	const [ change, setChange ] = useRecoilState(langChangeState)
	const { styles } = props

	useEffect(() => {
		setSelected(lang)
	}, [lang])

	//changes spinner state back to false after language change
	useEffect(() => {
		if(change == true) {
			new Promise((resolve) => {
				setChange(false)
				forceUpdate()
				setTimeout(() => {
					if (change == false) { resolve() }
				}, 1000)
			})
		}
	}, [auth, lang])

	const handleLanguageChange = async (newlang) => {	
		new Promise((resolve) => {
			setChange(true)
			forceUpdate()
			setTimeout(() => {
				if(change == false) { resolve() }
			}, 1000)
		})
		.then(result => {
			setLang(newlang)
			setSelected(newlang)
			authDispatch({ type: 'SET_LANG', payload: { lang: newlang } })
			updateAPIwithLang(auth, newlang)
		})
		
	}

	function updateAPIwithLang(auth, newlang) {
		if (notices.length > 0) {
			let tmpNotices = notices.map((element) => { return getNotice(element.id, newlang) })
			setNotices((prev) => ([...tmpNotices]))
		}
		if (auth.token !== 'undefined') {
			api.setHeader('Authorization', 'Bearer ' + auth.token)
			api.post(Config.BASEURL + '/changelang', { lang: lang })
				.then(response => {
					return response.ok
				})
		}
	}

	return (
		<HStack {...styles}>
			{change && <Spinner mr={"2"} /> }
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