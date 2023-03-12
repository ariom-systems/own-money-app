import React, { useEffect, useState, useRef, useContext } from 'react'

//components
import { Box, Button, Input, HStack, Pressable, Spinner, Text, VStack, Heading } from 'native-base'
import * as Forms from '../common/Forms'
import AlertModal from '../common/AlertModal'
import Icon from '../common/Icon'

//data
import Config from 'react-native-config'
import { atom, useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil'
import { useForceUpdate } from '../../data/Hooks'
import { useForm } from 'react-hook-form'
import { api, Sizes } from '../../config'
import { AuthContext } from '../../data/Context'
import { promoAtom } from '../../data/recoil/transfer'
import { langState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const promoChangeState = atom({
	key: 'promoChange',
	default: false
})

const PromoCode = () => {
	const forceUpdate = useForceUpdate()
	const { auth } = useContext(AuthContext)
	const [change, setChange] = useRecoilState(promoChangeState)
	const [promo, setPromo] = useRecoilState(promoAtom)
	const resetPromo = useResetRecoilState(promoAtom)
	const lang = useRecoilValue(langState)
	const [show, setShow] = useState(false)
	const cancelRef = useRef()
	const onClose = () => setShow(false)

	const { control, handleSubmit, setError, formState } = useForm({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			code: ""
		}
	})

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			forceUpdate()
		}
	}, [language, lang])

	useEffect(() => {
		if (change == true) {
			new Promise((resolve) => {
				setChange(false)
				forceUpdate()
				setTimeout(() => {
					if (change == false) { resolve() }
				}, 1000)
			})
		}
	}, [promo])


	const handleApply = () => {
		new Promise((resolve) => {
			setChange(true)
			forceUpdate()
			setTimeout(() => {
				if (change == false) { resolve() }
			}, 1000)
		}).then(result => {
			handleSubmit((data) => onSubmit(data), (error) => onError(error))()
		})
	}

	const handleRemovePromo = () => setShow(true)

	const onSubmit = (data) => {
		api.post(Config.BASEURL + '/' + Config.APIVERSION + '/check/promocodes/', data)
			.then(response => {
				if(response.ok == true) {
					switch(typeof response.data) {
						case 'object':
							setPromo(prev => ({
								...prev,
								id: response.data.id,
								name: response.data.name,
								rate: response.data.rate,
								limit: response.data.limit
							}))
							forceUpdate()
						break
						case 'string':
							switch(response.data) {
								case 'expired': setError('code', { type: 'custom', message: language.promo.errors.expired }); resetPromo(); break;
								case 'invalid': setError('code', { type: 'custom', message: language.promo.errors.invalid }); resetPromo(); break;
							}
						break
					}
				} else {
					resetPromo()
					setError('code', { type: 'custom', message: language.promo.errors.remoteError})
				}
			})
			.catch(error => console.error(error))
		}

	const onError = (error) => { setChange(false) }


	return (
		<VStack w={"100%"} space={Sizes.spacing} alignItems={"flex-end"}>
			{ promo.name == "" && (<Forms.TextInput
				name={"code"}
				control={control}
				errors={formState.errors.code}
				label={language.promo.labels.code}
				addonRight={<Button isLoading={change} onPress={handleApply}>{language.promo.ui.button}</Button>}
			/>)}
			{ promo.name != '' && (
				<HStack w={"100%"} alignItems={"center"} justifyContent={"space-evenly"} p={Sizes.padding} bgColor={"success.600"} rounded={Sizes.rounded} space={Sizes.spacing}>
					<Icon type={"MaterialCommunity"} name={"check-outline"} color={"success.100"} fontSize={"5xl"} />
					<VStack justifyContent={"center"}>
						<Heading fontSize={"md"} color={"success.100"}>{language.promo.messages.valid}</Heading>
						<Text fontSize={"md"} color={"success.100"}>{promo.name}</Text>
					</VStack>
				</HStack>)}
			{promo.name != '' && (
				<Pressable onPress={handleRemovePromo} _pressed={{ color: "black" }}>
					<Text color={"danger.600"}>{language.promo.ui.remove}</Text>
				</Pressable>
			)}
			<AlertModal
				show={show}
				close={onClose}
				header={language.transferStepOne.ui.alertRemoveHeading}
				ldRef={cancelRef}
				content={<Text>{language.transferStepOne.ui.alertRemoveMessage}</Text>}
			>
				<Button.Group>
					<Button onPress={() => { onClose(); resetPromo(); }} >{language.transferStepOne.ui.alertRemoveButtonConfirm}</Button>
					<Button variant="outline" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>{language.transferStepOne.ui.alertRemoveButtonCancel}</Button>
				</Button.Group>
			</AlertModal>
		</VStack>
	)
}

export default PromoCode