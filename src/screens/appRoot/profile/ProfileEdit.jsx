import React, { useContext, useState, useEffect } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { ScrollView, VStack } from 'native-base'
import * as Forms from '../../../components/common/Forms'
import Toolbar from '../../../components/common/Toolbar'

//data
import { useRecoilState, useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { AuthContext } from '../../../data/Context'
import { api, profileEditToolbarConfig, validationRulesProfileEdit } from '../../../config'
import { buildDataPath, mapActionsToConfig } from '../../../data/Actions'
import { userState } from '../../../data/recoil/user'
import { loadingState, noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

export default function ProfileEdit() {
	const user = useRecoilValue(userState)
	const methods = useForm({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			firstname: user.firstname,
			middlename: user.middlename,
			lastname: user.lastname,
			nickname: user.nickname,
			dateofbirth: user.dateofbirth,
			occupation: user.occupation,
			phone: user.phone,
			email: user.email,
			address: user.address,
			city: user.city,
			state: user.state,
			postcode: user.postcode
		}
	})
	return (
		<FormProvider {...methods}>
			<ProfileEditInner />
		</FormProvider>
	)
}

function ProfileEditInner() {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const { control, handleSubmit, getValues, formState } = useFormContext()
	const { auth } = useContext(AuthContext)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const [ notices, setNotices ] = useRecoilState(noticeState) //might still need this
	const [ user, setUser] = useRecoilState(userState)
	const lang = useRecoilValue(langState)

	const actions = [
		() => navigation.popToTop(),null,
		() => {
			new Promise((resolve) => {
				setLoading({ status: true, type: 'saving' })
				forceUpdate()
				setTimeout(() => {
					if (loading.status == false) { resolve() }
				}, 1000)
			}).then(result => {
				handleSubmit((data) => onSubmit(data), (error) => onError(error))()
			})
		}
	]
	const toolbarConfig = mapActionsToConfig(profileEditToolbarConfig, actions)

	const onSubmit = data => {
		api.put(buildDataPath('users', auth.uid, 'edit'), data)
		.then(response => {
			console.log(response.data)
			//setNotices((prev) => ([...prev, getNotice('beneficiaryUpdated', lang)]))
			//navigation.popToTop()
		})
	}

	const onError = (error) => {
		setLoading({ status: false, message: 'none' })
	}

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	return (
		<AppSafeArea>
			<ScrollView w={"100%"}>
				<VStack space={"4"} m={"2.5%"}>
					<Toolbar config={toolbarConfig} />
					<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{ roundedTop: "8" }}>{language.profileEdit.headings.personaldetails}</Forms.HeaderItem>
						<VStack space={"4"} px={"2.5%"}>	
							<Forms.TextInput
								name={"firstname"}
								control={control}
								rules={validationRulesProfileEdit.firstname}
								errors={formState.errors.firstname}
								label={language.profileEdit.labels.firstname}
								placeholder={language.profileEdit.placeholders.firstname}
								required={true}
							/>
							<Forms.TextInput
								name={"middlename"}
								control={control}
								rules={validationRulesProfileEdit.middlename}
								errors={formState.errors.middlename}
								label={language.profileEdit.labels.middlename}
								placeholder={language.profileEdit.placeholders.middlename}
								required={true}
							/>
							<Forms.TextInput
								name={"lastname"}
								control={control}
								rules={validationRulesProfileEdit.lastname}
								errors={formState.errors.lastname}
								label={language.profileEdit.labels.lastname}
								placeholder={language.profileEdit.placeholders.lastname}
								required={true}
							/>
							<Forms.TextInput
								name={"nickname"}
								control={control}
								label={language.profileEdit.labels.nickname}
								placeholder={language.profileEdit.placeholders.nickname}
							/>
							<Forms.DatePickerInput
								name={"dateofbirth"}
								control={control}
								rules={validationRulesProfileEdit.dateofbirth}
								label={language.profileEdit.labels.dateofbirth}
								title={language.profileEdit.ui.dateofbirthtitle}
								errors={formState.errors.dateofbirth}
								required={true}
							/>
							<Forms.TextInput
								name={"occupation"}
								control={control}
								rules={validationRulesProfileEdit.occupation}
								errors={formState.errors.occupation}
								label={language.profileEdit.labels.occupation}
								placeholder={language.profileEdit.placeholders.occupation}
								required={true}
							/>
						</VStack>
					</VStack>
					<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{ roundedTop: "8" }}>{language.profileEdit.headings.contactdetails}</Forms.HeaderItem>
						<VStack space={"4"} px={"2.5%"}>
							<Forms.TextInput
								name={"phone"}
								control={control}
								rules={validationRulesProfileEdit.phone}
								errors={formState.errors.phone}
								label={language.profileEdit.labels.phone}
								placeholder={language.profileEdit.placeholders.phone}
								required={true}
								type={"phone-pad"}
							/>
							<Forms.TextInput
								name={"email"}
								control={control}
								errors={formState.errors.email}
								label={language.profileEdit.labels.email}
								required={true}
								helperText={language.profileEdit.labels.emailhelper}
								isReadOnly={true}
							/>
						</VStack>
					</VStack>
					<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{ roundedTop: "8" }}>{language.profileEdit.headings.addressdetails}</Forms.HeaderItem>
						<VStack space={"4"} px={"2.5%"}>
							<Forms.TextInput
								name={"address"}
								control={control}
								rules={validationRulesProfileEdit.address}
								errors={formState.errors.address}
								label={language.profileEdit.labels.address}
								placeholder={language.profileEdit.placeholders.address}
								required={true}
								isReadOnly={true}
							/>
							<Forms.TextInput
								name={"city"}
								control={control}
								rules={validationRulesProfileEdit.city}
								errors={formState.errors.city}
								label={language.profileEdit.labels.suburb}
								placeholder={language.profileEdit.placeholders.suburb}
								required={true}
								isReadOnly={true}
							/>
							<Forms.SelectInput
								name={"state"}
								control={control}
								component={"State"}
								rules={validationRulesProfileEdit.state}
								errors={formState.errors.state}
								label={language.profileEdit.labels.state}
								placeholder={language.profileEdit.placeholders.state}
								required={true}
							/>
							<Forms.TextInput
								name={"postcode"}
								control={control}
								rules={validationRulesProfileEdit.postcode}
								errors={formState.errors.postcode}
								label={language.profileEdit.labels.postcode}
								placeholder={language.profileEdit.placeholders.postcode}
								required={true}
								isReadOnly={true}
							/>
						</VStack>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}