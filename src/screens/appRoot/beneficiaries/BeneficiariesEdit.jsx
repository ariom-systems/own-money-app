import React from 'react'
import { ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { Box, Button, Center, HStack, ScrollView, Spacer, Spinner, StatusBar, VStack } from 'native-base'

import * as Forms from '../../../components/common/Forms'
import { Notice } from '../../../components/common/Notice'


import { api } from '../../../config'
import { buildDataPath, atomReplaceItemAtIndex, addObjectExtraData } from '../../../data/Actions'
import { AuthContext } from '../../../data/Context'
import { useRecoilState, useRecoilValue } from 'recoil'
import { beneficiaryList, beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { loadingState } from '../../../data/recoil/system'
import { validationRulesBeneficiariesEdit } from '../../../config'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export default function BeneficiariesEdit() {
	const methods = useForm({
		mode: 'onBlur',
		criteriaMode: 'all'
	})
	return (
		<FormProvider {...methods}>
			<BeneficiariesEditInner />
		</FormProvider>
	)
}

function BeneficiariesEditInner() {
	const navigation = useNavigation()
	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = useRecoilState(beneficiaryList)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const { control, handleSubmit, setValue, formState } = useFormContext()
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(beneficiary !== null) {
			setValue('id', beneficiary.id, { shouldTouch: true }) //passthrough only
			setValue('index', beneficiary.index, { shouldTouch: true }) //passthrough only
			setValue('status', beneficiary.status, { shouldTouch: true }) //passthrough only
			setValue('firstname', beneficiary.firstname, { shouldTouch: true })
			setValue('lastname', beneficiary.lastname, { shouldTouch: true })
			setValue('thainame', beneficiary.thainame, { shouldTouch: true })
			setValue('phone', beneficiary.phone, { shouldTouch: true })
			setValue('accountnumber', beneficiary.accountnumber, { shouldTouch: true })
			setValue('accounttype', beneficiary.accounttype, { shouldTouch: true })
			setValue('bankname', beneficiary.bankname, { shouldTouch: true })
			setValue('branchname', beneficiary.branchname, { shouldTouch: true })
			setValue('branchcity', beneficiary.branchcity, { shouldTouch: true })
			setValue('address', beneficiary.address, { shouldTouch: true })
			setValue('state', beneficiary.state, { shouldTouch: true })
			setValue('city', beneficiary.city, { shouldTouch: true })
			setValue('postcode', beneficiary.postcode, { shouldTouch: true })
			setValue('country', beneficiary.country, { shouldTouch: true })
		}
	},[beneficiary])

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	const handleBack = () => {
		navigation.goBack()
	}

	const onSubmit = data => {
		setLoading({ status: true, text: 'Saving' })
		//push changes to remote
		api.put(buildDataPath('beneficiaries', auth.uid, 'edit', {id: data.id} ), data)
		.then(response => {
			if(response.ok == true) {			
				if(response.data == true) {
					//if update is successful, re-parse submitted form data and send it to beneficiaryList atom
					let newData = addObjectExtraData(data)				
					const newList = atomReplaceItemAtIndex(beneficiaries, data.index, newData)
					setBeneficiaries(newList)
					setLoading({ status: false, text: "" })
					authDispatch({ type: 'SET_STATUS', payload: { data: 'beneficiaryUpdated' }})
					navigation.popToTop()
				} else {
					throw response.data
				}
			} else {
				throw response.data
			}
			
		})
		.catch(error => {
			console.log(error)
			authDispatch({ type: 'SET_STATUS', payload: { data: 'serverError' }})
		})
	}

	//TODO: improve the list of errors shown to the user
	const onError = (errors, e) => console.log(errors, e)

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<StatusBar barStyle={"light-content"} backgroundColor={"#8B6A27"} />
			<Center flex={1} justifyContent={"center"}>
				<VStack flex={"1"} space={"4"} w={"100%"}>

					<Box p={"4"} bgColor={"warmGray.200"}>
						<HStack space={"3"} flexDir={"row"}>
							<Button
								flex={"1"}
								variant={"subtle"}
								onPress={() => handleBack()}>{ language.beneficiariesEdit.buttonBack }</Button>
							<Spacer />
							<Button
								flex={"1"}
								isLoadingText={"Saving..."}
								onPress={handleSubmit(onSubmit, onError)}>{ language.beneficiariesEdit.buttonSave }</Button>
							
						</HStack>
					</Box>
					
					{ (auth.status !== null && auth.status !== "") && (
						<Box px={"4"} pb={"4"}>
							<Notice nb={{w:"90%", m: "4"}}></Notice>
						</Box>
					)}

					<ScrollView w={"100%"}>
						<Box px={"4"} mb={"4"}>
							<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>

								<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiariesEdit.listDataHeaderPersonalDetails }</Forms.HeaderItem>

								<Forms.TextInput
									name={ "firstname" }
									control={ control }
									rules={ validationRulesBeneficiariesEdit.firstname }
									errors={ formState.errors.firstname }
									label={ language.beneficiariesEdit.listDataFirstNameLabel }
									placeholder={ language.beneficiariesEdit.listDataFirstNamePlaceholder }
									required={true}
								/>

								<Forms.TextInput
									name={ "lastname" }
									control={ control }
									rules={ validationRulesBeneficiariesEdit.lastname }
									errors={ formState.errors.lastname }
									label={ language.beneficiariesEdit.listDataLastNameLabel }
									placeholder={ language.beneficiariesEdit.listDataLastNamePlaceholder }
									required={true}
								/>

								<Forms.TextInput
									name={ "thainame" }
									control={ control }
									errors={ formState.errors.thainame }
									label={ language.beneficiariesEdit.listDataThaiNameLabel }
									placeholder={ language.beneficiariesEdit.listDataThaiNamePlaceholder }
									required={false}
								/>

								<Forms.TextInput
									name={ "phone" }
									control={ control }
									rules={ validationRulesBeneficiariesEdit.phone }
									errors={ formState.errors.phone }
									label={ language.beneficiariesEdit.listDataPhoneLabel }
									placeholder={ language.beneficiariesEdit.listDataPhonePlaceholder }
									required={false}
								/>

							</VStack>
						</Box>

						<Box px={"4"} mb={"4"}>

							<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>

								<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiariesEdit.listDataHeaderBankDetails }</Forms.HeaderItem>

								<Forms.TextInput
									name={ "accountnumber" }
									control={ control }
									rules={ validationRulesBeneficiariesEdit.accountnumber }
									errors={ formState.errors.accountnumber }
									label={ language.beneficiariesEdit.listDataAccountNumberLabel }
									placeholder={ language.beneficiariesEdit.listDataAccountNumberPlaceholder }
									required={true}
								/>

								<Forms.SelectInput
									name={ "accounttype" }
									control={ control }
									component={"AccountType"}
									rules={ validationRulesBeneficiariesEdit.accounttype }
									errors={ formState.errors.accounttype }
									label={ language.beneficiariesEdit.listDataAccountTypeLabel }
									placeholder={ language.beneficiariesEdit.listDataAccountTypePlaceholder }
									required={true}
								/>

								<Forms.SelectInput
									name={ "bankname" }
									control={ control }
									component={"BankName"}
									rules={ validationRulesBeneficiariesEdit.bankname }
									errors={ formState.errors.bankname }
									label={ language.beneficiariesEdit.listDataBankNameLabel }
									placeholder={ language.beneficiariesEdit.listDataBankNamePlaceholder }
									required={true}
								/>

								<Forms.TextInput
									name={ "branchname" }
									control={ control }
									rules={ validationRulesBeneficiariesEdit.branchname }
									errors={ formState.errors.branchname }
									label={ language.beneficiariesEdit.listDataBranchNameLabel }
									placeholder={ language.beneficiariesEdit.listDataBranchNamePlaceholder }
									required={true}
								/>

								<Forms.SelectInput
									name={ "branchcity" }
									control={ control }
									component={"BranchCity"}
									rules={ validationRulesBeneficiariesEdit.branchcity }
									errors={ formState.errors.branchname }
									label={ language.beneficiariesEdit.listDataBranchCityLabel }
									placeholder={ language.beneficiariesEdit.listDataBranchCityPlaceholder }
									required={true}
								/>
								
							</VStack>
						</Box>
						<Box px={"4"} mb={"4"}>

							<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
							
								<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiariesEdit.listDataHeaderAddressDetails }</Forms.HeaderItem>

								<Forms.TextInput
									name={ "address" }
									control={ control }
									rules={ validationRulesBeneficiariesEdit.address }
									errors={ formState.errors.address }
									label={ language.beneficiariesEdit.listDataThaiAddressLabel }
									placeholder={ language.beneficiariesEdit.listDataThaiAddressPlaceholder }
									required={true}
								/>

								<Forms.SelectInput
									name={ "state" }
									control={ control }
									component={"Province"}
									rules={ validationRulesBeneficiariesEdit.state }
									errors={ formState.errors.state }
									label={ language.beneficiariesEdit.listDataProvinceLabel }
									placeholder={ language.beneficiariesEdit.listDataProvincePlaceholder }
									required={true}
								/>

								<Forms.SelectInput
									name={ "city" }
									control={ control }
									component={"District"}
									rules={ validationRulesBeneficiariesEdit.city }
									errors={ formState.errors.city }
									label={ language.beneficiariesEdit.listDataDistrictLabel }
									placeholder={ language.beneficiariesEdit.listDataDistrictPlaceholder }
									required={true}
								/>

								<Forms.TextInput
									name={ "postcode" }
									control={ control }
									rules={ validationRulesBeneficiariesEdit.postcode }
									errors={ formState.errors.postcode }
									label={ language.beneficiariesEdit.listDataPostCodeLabel }
									placeholder={ language.beneficiariesEdit.listDataPostCodePlaceholder }
									required={true}
								/>

								<Forms.TextInput
									name={ "country" }
									control={ control }
									errors={ formState.errors.country }
									label={ language.beneficiariesEdit.listDataCountryLabel }
									placeholder={ language.beneficiariesEdit.listDataCountryPlaceholder }
									required={true}
								/>
								
							</VStack>
						</Box>
						<Box p={"4"} bgColor={"warmGray.200"}>
							<HStack space={"3"} flexDir={"row"}>
								<Button
									flex={"1"}
									variant={"subtle"}
									onPress={() => navigation.popToTop() }>{ language.beneficiariesEdit.buttonBack }</Button>
								<Spacer />
								<Button
									flex={"1"}
									isLoadingText={"Saving..."}
									onPress={handleSubmit(onSubmit, onError)}>{ language.beneficiariesEdit.buttonSave }</Button>
							</HStack>
						</Box>
					</ScrollView>
				</VStack>
			</Center>
		</ImageBackground>
	)
}