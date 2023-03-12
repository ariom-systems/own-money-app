import React, { useContext, useState, useEffect } from 'react'

//hardware
import DocumentScanner from 'react-native-document-scanner-plugin'

//components
import AppSafeArea from '../../../components/common/AppSafeArea'
import { useNavigation } from '@react-navigation/native'
import { Flex, Image, ScrollView, Text, VStack } from 'native-base'
import * as Forms from '../../../components/common/Forms'
import Toolbar, { ToolbarItem } from '../../../components/common/Toolbar'
import AlertLabel from '../../../components/common/AlertLabel'

//data
import Config from 'react-native-config'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Platform } from 'react-native'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { useForceUpdate } from '../../../data/Hooks'
import { AuthContext } from '../../../data/Context'
import { api, Sizes, profileEditToolbarConfig, profileEditIdentityToolbarConfig, validationRulesProfileEdit, validationRulesProfileEditIdentity } from '../../../config'
import { buildDataPath, addObjectExtraData, mapActionsToConfig } from '../../../data/Actions'
import { getNotice } from '../../../data/handlers/Status'
import { userState, imageState } from '../../../data/recoil/user'
import { loadingState, noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
import IdentityPreview from '../../../components/profile/IdentityPreview'
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
			postcode: user.postcode,
			img_name: user.img_name,
			created_date: user.created_date,
			idtype: user.idtype,
			idnumber: user.idnumber,
			idexpiry: user.idexpiry,
			idissuer: user.idissuer
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
	const { control, handleSubmit, formState, setValue } = useFormContext()
	const { auth } = useContext(AuthContext)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const [ user, setUser ] = useRecoilState(userState)
	const [ image, setImage ] = useRecoilState(imageState)
	const lang = useRecoilValue(langState)
	const setNotices = useSetRecoilState(noticeState) //might still need this
	let identityStatus

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

	const identityActions = [() => onScanDocument()]
	const identityToolbarConfig = mapActionsToConfig(profileEditIdentityToolbarConfig, identityActions)

	const onSubmit = async data => {
		//check for the img_name first. this lets a user edit their details now while allowing them to upload a file later.
		if(data.img_name == "") {
			console.log('📦 sending payload to API: JSON')
			//no image filename provided. user is not uploading an image. do a normal JSON payload.
			doJSONPayload(data)
		} else {
			//an image file name was found. now, is it new or old?
			if(data.created_date == "") {
				//no created_date, therefore this must be new. do a form-data payload instead
				console.log('🖼  sending payload to API: FormData')
				doFormDataPayload(data)
			} else {
				//there is a created_date entry, so this must be an existing image. no need to upload it, so do a normal JSON payload.
				console.log('📦 sending payload to API: JSON')
				doJSONPayload(data)
			}
		}
	}

	function doJSONPayload(data) {
		api.put(buildDataPath('users', auth.uid, 'edit'), data)
			.then(response => {
				if(response.ok == true) {
					let data = response.data, newData
					newData = addObjectExtraData(data)
					setUser((prev) => ({...prev, ...newData}))
					setTimeout(() => {
						setLoading({ status: false, message: 'none' })
						setNotices((prev) => ([...prev, getNotice('profileUpdated', lang)]))
						navigation.popToTop()
					}, 500)
				}
			})
			.catch(error => { console.log("error found:", error) })
	}

	async function doFormDataPayload(data) {	
		
		let filename = data.img_name.substring(data.img_name.lastIndexOf('/') + 1)
		const image = {
			name: filename,
			type: 'image/jpeg',
			uri: Platform.OS === 'ios' ? data.img_name.replace('file://', '') : data.img_name
		}

		const formData = new FormData()
		formData.append('firstname', data.firstname)
		formData.append('middlename', data.middlename)
		formData.append('lastname', data.lastname)
		formData.append('nickname', data.nickname)
		formData.append('dateofbirth', data.dateofbirth)
		formData.append('occupation', data.occupation)
		formData.append('phone', data.phone)
		formData.append('email', data.email)
		formData.append('address', data.address)
		formData.append('city', data.city)
		formData.append('state', data.state)
		formData.append('postcode', data.postcode)
		formData.append('img_name', image)
		formData.append('created_date', data.created_date)
		formData.append('idtype', data.idtype)
		formData.append('idnumber', data.idnumber)
		formData.append('idexpiry', data.idexpiry)
		formData.append('idissuer', data.idissuer)

		const url = Config.BASEURL + '/' + Config.APIVERSION + '/' + buildDataPath('users', auth.uid, 'edit')
		console.log('👤 Sending user data to API: ', url)
		
		const headers = new Headers()
		headers.append('Authorization', `Bearer ${auth.token}`)
		headers.append('Accept', 'application/json')

		const request = new Request(url, {
			headers,
			method: 'POST',
			mode: 'cors',
			body: formData
		})
		
		let response = fetch(request)
			.then(response => response.json())
			//.then(response => response.text())
			.then(response => {
				setTimeout(() => {
					newObj = { ...response, uid: auth.uid }
					let app_flags = JSON.parse(response.app_flags)
					if (app_flags !== null) { newObj.app_flags = app_flags }
					setUser((previous) => ({ ...previous, ...newObj }))

					setLoading({ status: false, message: 'none' })
					setNotices((prev) => ([...prev, getNotice('profileUpdated', lang)]))
					navigation.popToTop()
				}, 500)
				
			})
			.catch((error) => console.log('fetch error: ', error))
	}

	const onError = (error) => {
		setLoading({ status: false, message: 'none' })
	}

	const onScanDocument = async () => {
		const { scannedImages } = await DocumentScanner.scanDocument({ croppedImageQuality: 75 })
		if(scannedImages.length > 0) {
			let file = scannedImages[0]
			setImage(file)
			setValue('img_name', file)
		}
	}

	useEffect(() => {
		if (language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	if (user.img_name == '' || user.created_date == '' || user.idtype == '' || user.idnumber == '' || user.idexpiry == '' || user.idissuer == '') {
		let styles = { pt: "1", justifyContent: "center" }, iconStyles = { fontSize: "2xl" }, labelStyles = { fontSize: "lg" }
		let label = language.profileEdit.ui.identityTitle, icon = "alert-circle-outline"
		identityStatus = <AlertLabel icon={icon} label={label} color={"error.600"} styles={styles} iconStyles={iconStyles} labelStyles={labelStyles} />
	}
	
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
								range={"past"}
								rules={validationRulesProfileEdit.dateofbirth}
								label={language.profileEdit.labels.dateofbirth}
								title={language.profileEdit.ui.dateofbirthTitle}
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
							/>
							<Forms.TextInput
								name={"city"}
								control={control}
								rules={validationRulesProfileEdit.city}
								errors={formState.errors.city}
								label={language.profileEdit.labels.suburb}
								placeholder={language.profileEdit.placeholders.suburb}
								required={true}
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
							/>
						</VStack>
					</VStack>
					<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{ roundedTop: "8" }}>{language.profileEdit.headings.identityInfo}</Forms.HeaderItem>			
							{ (user.img_name != "" || image != "") && (
								<VStack space={"4"} px={"2.5%"}>
								{user.img_name != "" && <Text fontSize={"xs"} color={"warmGray.600"}>{language.profileEdit.labels.identityHelper}</Text>}
									<IdentityPreview />
									{user.img_name == "" && <ToolbarItem label={"Re-scan Document"} action={() => onScanDocument()} />}									
									<Forms.SelectInput
										name={"idtype"}
										control={control}
										component={"IDType"}
										rules={validationRulesProfileEditIdentity.idtype}
										errors={formState.errors.idtype}
										label={language.profileEdit.labels.idtype}
										placeholder={language.profileEdit.placeholders.idtype}
										isDisabled={ user.img_name != "" ? true : false }
									/>
									<Forms.TextInput
										name={"idnumber"}
										control={control}
										rules={validationRulesProfileEditIdentity.idnumber}
										errors={formState.errors.idnumber}
										label={language.profileEdit.labels.idnumber}
										placeholder={language.profileEdit.placeholders.idnumber}
										isReadOnly={user.img_name != "" ? true : false}
									/>

									<Forms.DatePickerInput
										name={"idexpiry"}
										control={control}
										range={'future'}
										rules={validationRulesProfileEditIdentity.idexpiry}
										label={language.profileEdit.labels.idexpiry}
										title={language.profileEdit.labels.idexpiry}
										errors={formState.errors.idexpiry}
										isDisabled={user.img_name != "" ? true : false}
									/>
								
									<Forms.SelectInput
										name={"idissuer"}
										control={control}
										component={"IDIssuer"}
										rules={validationRulesProfileEditIdentity.idissuer}
										errors={formState.errors.idissuer}
										label={language.profileEdit.labels.idissuer}
										placeholder={language.profileEdit.placeholders.idissuer}
										isDisabled={user.img_name != "" ? true : false}
									/>
								</VStack>
							) || (
								<VStack space={Sizes.spacing}>
									{identityStatus}
									<Text textAlign={"center"} fontSize={"xs"} color={"coolGray.500"}>{language.profileEdit.ui.identityDescription}</Text>
									<Toolbar config={identityToolbarConfig} nb={{ bgColor: "white", py: "0" }} />
								</VStack>
							)}
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}