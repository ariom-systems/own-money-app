import React from 'react'
import { ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { Box, Button, Center, HStack, ScrollView, Spacer, StatusBar, VStack } from 'native-base'

import * as Forms from '../../../components/common/Forms'
import { Notice } from '../../../components/common/Notice'
import LoadingOverlay from '../../../components/common/LoadingOverlay'

import { buildDataPath, sortByParam, addObjectExtraData, stringifyArray } from '../../../data/Actions'
import { api, beneficiaryColumns } from '../../../config'
import { AuthContext } from '../../../data/Context'
import { useRecoilState } from 'recoil'
import { loadingState } from '../../../data/recoil/system'
import { beneficiaryList } from '../../../data/recoil/beneficiaries'
import { validationRulesBeneficiariesAdd } from '../../../config'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

export default function BeneficiariesAdd() {
	const methods = useForm({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			country: 'Thailand'
		}
	})
	return (
		<FormProvider {...methods}>
			<BeneficiariesAddInner />
		</FormProvider>
	)
}

function BeneficiariesAddInner() {
	const navigation = useNavigation()
	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = useRecoilState(beneficiaryList)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const { control, handleSubmit, setValue, formState } = useFormContext()
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	
	const onSubmit = data => {
		setLoading({ status: true, text: 'Saving' })
		//push changes to remote
		api.post(buildDataPath('beneficiaries', auth.uid, 'add'), JSON.stringify(data))
		.then(response => {
			if (response.ok == true) {
				api.post(buildDataPath('beneficiaries', auth.uid, 'view', { id: response.data}), stringifyArray(beneficiaryColumns))
				.then(response2 => {
					let result = addObjectExtraData(response2.data)
					let newList = [...beneficiaries, result]
					newList.sort(sortByParam("initials", "firstname"))
					setBeneficiaries((init) => ([ ...newList ]))
					authDispatch({ type: 'SET_STATUS', payload: { data: 'beneficiarySaved' }})
					navigation.popToTop()
				})
			} else {
				throw response.data
			}
		})
		.catch(error => {
			console.log(error)
			authDispatch({ type: 'SET_STATUS_DETAILED', payload: { data: 'serverError', extra: error }})
		})
	}

	//TODO: improve the list of errors shown to the user
	const onError = (errors, e) => console.log(errors, e)

	const handleBack = () => {
		navigation.goBack()
	}

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<StatusBar barStyle={"light-content"} backgroundColor={"#8B6A27"} />
			{ loading.status && <LoadingOverlay /> }
			<Center flex={1} justifyContent={"center"}>
				<VStack flex={"1"} space={"4"} w={"100%"}>

					<Box p={"4"} bgColor={"warmGray.200"}>
						<HStack space={"3"} flexDir={"row"}>
							<Button
								flex={"1"}
								variant={"subtle"}
								onPress={() => navigation.popToTop()}>{ language.beneficiariesAdd.buttonBack }</Button>
							<Spacer />
							<Button
								flex={"1"}
								isLoadingText={"Saving..."}
								onPress={handleSubmit(onSubmit, onError)}>{ language.beneficiariesAdd.buttonSave }</Button>
						</HStack>
					</Box>

					{ (auth.status !== null && auth.status !== "") && (
						<Box px={"4"}>
							<Notice nb={{w:"90%", m: "4"}}></Notice>
						</Box>
					)}
					
					<ScrollView w={"100%"}>
						<Box px={"4"}>
							<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
								
								<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiariesAdd.listDataHeaderPersonalDetails }</Forms.HeaderItem>
								
								<Forms.TextInput
									name={ "firstname" }
									control={ control }
									rules={ validationRulesBeneficiariesAdd.firstname }
									errors={ formState.errors.firstname }
									label={ language.beneficiariesAdd.listDataFirstNameLabel }
									placeholder={ language.beneficiariesAdd.listDataFirstNamePlaceholder }
									required={true}
								/>

								<Forms.TextInput
									name={ "lastname" }
									control={ control }
									rules={ validationRulesBeneficiariesAdd.lastname }
									errors={ formState.errors.lastname }
									label={ language.beneficiariesAdd.listDataLastNameLabel }
									placeholder={ language.beneficiariesAdd.listDataLastNamePlaceholder }
									required={true}
								/>

								<Forms.TextInput
									name={ "thainame" }
									control={ control }
									errors={ formState.errors.thainame }
									label={ language.beneficiariesAdd.listDataThaiNameLabel }
									placeholder={ language.beneficiariesAdd.listDataThaiNamePlaceholder }
									required={false}
								/>

								<Forms.TextInput
									name={ "phone" }
									control={ control }
									rules={ validationRulesBeneficiariesAdd.phone }
									errors={ formState.errors.phone }
									label={ language.beneficiariesAdd.listDataPhoneLabel }
									placeholder={ language.beneficiariesAdd.listDataPhonePlaceholder }
									required={false}
								/>

							</VStack>
						</Box>
						<Box p={"4"}>
							<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>

								<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiariesAdd.listDataHeaderBankDetails }</Forms.HeaderItem>

								<Forms.TextInput
									name={ "accountnumber" }
									control={ control }
									rules={ validationRulesBeneficiariesAdd.accountnumber }
									errors={ formState.errors.accountnumber }
									label={ language.beneficiariesAdd.listDataAccountNumberLabel }
									placeholder={ language.beneficiariesAdd.listDataAccountNumberPlaceholder }
									required={true}
								/>

								<Forms.SelectInput
									name={ "accounttype" }
									control={ control }
									component={"AccountType"}
									rules={ validationRulesBeneficiariesAdd.accounttype }
									errors={ formState.errors.accounttype }
									label={ language.beneficiariesAdd.listDataAccountTypeLabel }
									placeholder={ language.beneficiariesAdd.listDataAccountTypePlaceholder }
									required={true}
									context={"Beneficiaries"}
								/>

								<Forms.SelectInput
									name={ "bankname" }
									control={ control }
									component={"BankName"}
									rules={ validationRulesBeneficiariesAdd.bankname }
									errors={ formState.errors.bankname }
									label={ language.beneficiariesAdd.listDataBankNameLabel }
									placeholder={ language.beneficiariesAdd.listDataBankNamePlaceholder }
									required={true}
									context={"Beneficiaries"}
								/>

								<Forms.TextInput
									name={ "branchname" }
									control={ control }
									rules={ validationRulesBeneficiariesAdd.branchname }
									errors={ formState.errors.branchname }
									label={ language.beneficiariesAdd.listDataBranchNameLabel }
									placeholder={ language.beneficiariesAdd.listDataBranchNamePlaceholder }
									required={true}
									context={"Beneficiaries"}
								/>

								<Forms.SelectInput
									name={ "branchcity" }
									control={ control }
									component={"BranchCity"}
									rules={ validationRulesBeneficiariesAdd.branchcity }
									errors={ formState.errors.branchname }
									label={ language.beneficiariesAdd.listDataBranchCityLabel }
									placeholder={ language.beneficiariesAdd.listDataBranchCityPlaceholder }
									required={true}
									context={"Beneficiaries"}
								/>
								
							</VStack>
						</Box>
						<Box p={"4"}>
							<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
						
								<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiariesAdd.listDataHeaderAddressDetails }</Forms.HeaderItem>

								<Forms.TextInput
									name={ "address" }
									control={ control }
									rules={ validationRulesBeneficiariesAdd.address }
									errors={ formState.errors.address }
									label={ language.beneficiariesAdd.listDataThaiAddressLabel }
									placeholder={ language.beneficiariesAdd.listDataThaiAddressPlaceholder }
									required={true}
								/>

								<Forms.SelectInput
									name={ "state" }
									control={ control }
									component={"Province"}
									rules={ validationRulesBeneficiariesAdd.state }
									errors={ formState.errors.state }
									label={ language.beneficiariesAdd.listDataProvinceLabel }
									placeholder={ language.beneficiariesAdd.listDataProvincePlaceholder }
									required={true}
									context={"Beneficiaries"}
								/>

								<Forms.SelectInput
									name={ "city" }
									control={ control }
									component={"District"}
									rules={ validationRulesBeneficiariesAdd.city }
									errors={ formState.errors.city }
									label={ language.beneficiariesAdd.listDataDistrictLabel }
									placeholder={ language.beneficiariesAdd.listDataDistrictPlaceholder }
									required={true}
									context={"Beneficiaries"}
								/>

								<Forms.TextInput
									name={ "postcode" }
									control={ control }
									rules={ validationRulesBeneficiariesAdd.postcode }
									errors={ formState.errors.postcode }
									label={ language.beneficiariesAdd.listDataPostCodeLabel }
									placeholder={ language.beneficiariesAdd.listDataPostCodePlaceholder }
									required={true}
								/>

								<Forms.TextInput
									name={ "country" }
									control={ control }
									errors={ formState.errors.country }
									label={ language.beneficiariesAdd.listDataCountryLabel }
									placeholder={ language.beneficiariesAdd.listDataCountryPlaceholder }
									required={true}
								/>

							</VStack>
						</Box>
						<Box p={"4"} bgColor={"warmGray.200"}>
							<HStack space={"3"} flexDir={"row"}>
								<Button
									flex={"1"}
									variant={"subtle"}
									onPress={() => navigation.popToTop() }>{ language.beneficiariesAdd.buttonBack }</Button>
								<Spacer />
								<Button
									flex={"1"}
									isLoadingText={"Saving..."}
									onPress={handleSubmit(onSubmit, onError)}>{ language.beneficiariesAdd.buttonSave }</Button>
							</HStack>
						</Box>
					</ScrollView>
				</VStack>
			</Center>
		</ImageBackground>
	)
}