import React, { useContext, useState, useEffect, useReducer } from 'react'

//components
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { ScrollView, VStack } from 'native-base'
import * as Forms from '../../../components/common/Forms'
import Toolbar from '../../../components/common/Toolbar'

//data
import { AuthContext } from '../../../data/Context'
import { buildDataPath, mapActionsToConfig } from '../../../data/Actions'
import { api, profileEditToolbarConfig, validationRulesProfileEdit } from '../../../config'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userState } from '../../../data/recoil/user'
import { noticeState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

export default function ProfileEdit() {
	const [user, setUser] = useRecoilState(userState)
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
	const navState = useNavigationState(state => state)
	const route = useRoute()
	const { control, handleSubmit, formState } = useFormContext()
	const [ isLoading, setIsLoading ] = useState(false)
	const notices = useRecoilValue(noticeState)
	const user = useRecoilValue(userState)
	const { auth, authDispatch } = useContext(AuthContext)
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	
	const actions = [
		() => navigation.popToTop(),null,
		handleSubmit((data) => onSubmit(data))
	]
	const toolbarConfig = mapActionsToConfig(profileEditToolbarConfig, actions)

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, user])

	const onSubmit = data => {
		setIsLoading(true)
		api.put(buildDataPath('users', auth.uid, 'edit'), data)
		.then(response => {
			authDispatch({ type: 'SET_STATUS', payload: { data: 'profileUpdated' }})
			navigation.popToTop()
		})
	}

	return (
		<AppSafeArea>
			<ScrollView w={"100%"}>
				<VStack space={"4"} m={"2.5%"}>
					<Toolbar config={toolbarConfig} />
					<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{ roundedTop: "8" }}>{language.profileEdit.listDataHeaderPersonalDetails}</Forms.HeaderItem>
						<Forms.TextInput
							name={"firstname"}
							control={control}
							rules={validationRulesProfileEdit.firstname}
							errors={formState.errors.firstname}
							label={language.profileEdit.listDataFirstNameLabel}
							placeholder={language.profileEdit.listDataFirstNamePlaceholder}
							required={true}
						/>
						<Forms.TextInput
							name={"middlename"}
							control={control}
							rules={validationRulesProfileEdit.middlename}
							errors={formState.errors.middlename}
							label={language.profileEdit.listDataMiddleNameLabel}
							placeholder={language.profileEdit.listDataMiddleNamePlaceholder}
							required={true}
						/>
						<Forms.TextInput
							name={"lastname"}
							control={control}
							rules={validationRulesProfileEdit.lastname}
							errors={formState.errors.lastname}
							label={language.profileEdit.listDataLastNameLabel}
							placeholder={language.profileEdit.listDataLastNamePlaceholder}
							required={true}
						/>
						<Forms.TextInput
							name={"nickname"}
							control={control}
							label={language.profileEdit.listDataNickNameLabel}
							placeholder={language.profileEdit.listDataNickNamePlaceholder}
						/>
						<Forms.DatePickerInput
							name={"dateofbirth"}
							control={control}
							rules={validationRulesProfileEdit.dateofbirth}
							label={language.profileEdit.listDataDateOfBirthLabel}
							title={language.profileEdit.listDataDateOfBirthModalTitle}
							errors={formState.errors.dateofbirth}
							required={true}
						/>
						<Forms.TextInput
							name={"occupation"}
							control={control}
							rules={validationRulesProfileEdit.occupation}
							errors={formState.errors.occupation}
							label={language.profileEdit.listDataOccupationLabel}
							placeholder={language.profileEdit.listDataOccupationPlaceholder}
							required={true}
						/>
					</VStack>
					<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{ roundedTop: "8" }}>{language.profileEdit.listDataHeaderContactDetails}</Forms.HeaderItem>
						<Forms.TextInput
							name={"phone"}
							control={control}
							rules={validationRulesProfileEdit.phone}
							errors={formState.errors.phone}
							label={language.profileEdit.listDataPhoneLabel}
							placeholder={language.profileEdit.listDataPhonePlaceholder}
							required={true}
							type={"phone-pad"}
						/>
						<Forms.TextInput
							name={"email"}
							control={control}
							errors={formState.errors.email}
							label={language.profileEdit.listDataEmailLabel}
							required={true}
							helperText={language.profileEdit.listDataEmailSubLabel}
							isReadOnly={true}
						/>
					</VStack>
					<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{ roundedTop: "8" }}>{language.profileEdit.listDataHeaderAddressDetails}</Forms.HeaderItem>

						<Forms.TextInput
							name={"address"}
							control={control}
							rules={validationRulesProfileEdit.address}
							errors={formState.errors.address}
							label={language.profileEdit.listDataAddressLabel}
							placeholder={language.profileEdit.listDataAddressPlaceholder}
							required={true}
							isReadOnly={true}
						/>
						<Forms.TextInput
							name={"city"}
							control={control}
							rules={validationRulesProfileEdit.city}
							errors={formState.errors.city}
							label={language.profileEdit.listDataSuburbLabel}
							placeholder={language.profileEdit.listDataSuburbPlaceholder}
							required={true}
							isReadOnly={true}
						/>
						<Forms.SelectInput
							name={"state"}
							control={control}
							component={"State"}
							rules={validationRulesProfileEdit.state}
							errors={formState.errors.state}
							label={language.profileEdit.listDataStateLabel}
							placeholder={language.profileEdit.listDataStatePlaceholder}
							required={true}
						/>
						<Forms.TextInput
							name={"postcode"}
							control={control}
							rules={validationRulesProfileEdit.postcode}
							errors={formState.errors.postcode}
							label={language.profileEdit.listDataPostCodeLabel}
							placeholder={language.profileEdit.listDataPostCodePlaceholder}
							required={true}
							isReadOnly={true}
						/>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}