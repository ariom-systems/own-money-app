import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { Box, Button, Center, Factory, HStack, ScrollView, Spacer, StatusBar, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import { AuthContext } from '../../../data/Context'
import { buildDataPath, atomReplaceItemAtIndex, addObjectExtraData } from '../../../data/Actions'
import { api } from '../../../config'
import Spinner from '../../../components/common/Spinner'
import { Notice } from '../../../components/common/Notice'

import * as Recoil from 'recoil'
import * as Atoms from '../../../data/recoil/Atoms'
import { beneficiaryList, beneficiaryObj } from '../../../data/recoil/beneficiaries'

import { rulesBeneficiariesEdit } from '../../../data/handlers/Forms'
import EditHeaderItem from '../../../components/beneficiaries/EditHeaderItem'
import EditFormTextInput from '../../../components/beneficiaries/EditFormTextInput'
import EditFormSelectInput from '../../../components/beneficiaries/EditFormSelectInput'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const NBIonicon = Factory(Ionicon)

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
	const [ beneficiaries, setBeneficiaries ] = Recoil.useRecoilState(beneficiaryList)
	const beneficiary = Recoil.useRecoilValue(beneficiaryObj)
	const setLoading = Recoil.useSetRecoilState(Atoms.loading)
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
		<>
			<StatusBar barStyle={"light-content"} backgroundColor={"#8B6A27"} />
			<Center flex={1} justifyContent={"center"}>
				<VStack flex={"1"} space={"4"} w={"100%"}>
					<HStack space={"3"} flexDir={"row"} pt={"4"} px={"4"}>
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
					{ (auth.status !== null && auth.status !== "") && (
						<Box px={"4"}>
							<Notice wrap={{w:"90%", m: "4"}}></Notice>
						</Box>
					)}
					<ScrollView w={"100%"}>
						<VStack py={"4"} space={"4"}>

							<EditHeaderItem heading={ language.beneficiariesEdit.listDataHeaderPersonalDetails } />

							<EditFormTextInput
								name={ "firstname" }
								control={ control }
								rules={ rulesBeneficiariesEdit.firstname }
								errors={ formState.errors.firstname }
								label={ language.beneficiariesEdit.listDataFirstNameLabel }
								placeholder={ language.beneficiariesEdit.listDataFirstNamePlaceholder }
								required={true}
							/>

							<EditFormTextInput
								name={ "lastname" }
								control={ control }
								rules={ rulesBeneficiariesEdit.lastname }
								errors={ formState.errors.lastname }
								label={ language.beneficiariesEdit.listDataLastNameLabel }
								placeholder={ language.beneficiariesEdit.listDataLastNamePlaceholder }
								required={true}
							/>

							<EditFormTextInput
								name={ "thainame" }
								control={ control }
								errors={ formState.errors.thainame }
								label={ language.beneficiariesEdit.listDataThaiNameLabel }
								placeholder={ language.beneficiariesEdit.listDataThaiNamePlaceholder }
								required={false}
							/>

							<EditFormTextInput
								name={ "phone" }
								control={ control }
								rules={ rulesBeneficiariesEdit.phone }
								errors={ formState.errors.phone }
								label={ language.beneficiariesEdit.listDataPhoneLabel }
								placeholder={ language.beneficiariesEdit.listDataPhonePlaceholder }
								required={false}
							/>

						</VStack>
						<VStack py={"4"} space={"4"}>

							<EditHeaderItem heading={ language.beneficiariesEdit.listDataHeaderBankDetails } />

							<EditFormTextInput
								name={ "accountnumber" }
								control={ control }
								rules={ rulesBeneficiariesEdit.accountnumber }
								errors={ formState.errors.accountnumber }
								label={ language.beneficiariesEdit.listDataAccountNumberLabel }
								placeholder={ language.beneficiariesEdit.listDataAccountNumberPlaceholder }
								required={true}
							/>

							<EditFormSelectInput
								name={ "accounttype" }
								control={ control }
								component={"AccountType"}
								rules={ rulesBeneficiariesEdit.accounttype }
								errors={ formState.errors.accounttype }
								label={ language.beneficiariesEdit.listDataAccountTypeLabel }
								placeholder={ language.beneficiariesEdit.listDataAccountTypePlaceholder }
								required={true}
							/>

							<EditFormSelectInput
								name={ "bankname" }
								control={ control }
								component={"BankName"}
								rules={ rulesBeneficiariesEdit.bankname }
								errors={ formState.errors.bankname }
								label={ language.beneficiariesEdit.listDataBankNameLabel }
								placeholder={ language.beneficiariesEdit.listDataBankNamePlaceholder }
								required={true}
							/>

							<EditFormTextInput
								name={ "branchname" }
								control={ control }
								rules={ rulesBeneficiariesEdit.branchname }
								errors={ formState.errors.branchname }
								label={ language.beneficiariesEdit.listDataBranchNameLabel }
								placeholder={ language.beneficiariesEdit.listDataBranchNamePlaceholder }
								required={true}
							/>

							<EditFormSelectInput
								name={ "branchcity" }
								control={ control }
								component={"BranchCity"}
								rules={ rulesBeneficiariesEdit.branchcity }
								errors={ formState.errors.branchname }
								label={ language.beneficiariesEdit.listDataBranchCityLabel }
								placeholder={ language.beneficiariesEdit.listDataBranchCityPlaceholder }
								required={true}
							/>
							
						</VStack>
						<VStack py={"4"} space={"4"}>
							
							<EditHeaderItem heading={ language.beneficiariesEdit.listDataHeaderAddressDetails } />

							<EditFormTextInput
								name={ "address" }
								control={ control }
								rules={ rulesBeneficiariesEdit.address }
								errors={ formState.errors.address }
								label={ language.beneficiariesEdit.listDataThaiAddressLabel }
								placeholder={ language.beneficiariesEdit.listDataThaiAddressPlaceholder }
								required={true}
							/>

							<EditFormSelectInput
								name={ "state" }
								control={ control }
								component={"Province"}
								rules={ rulesBeneficiariesEdit.state }
								errors={ formState.errors.state }
								label={ language.beneficiariesEdit.listDataProvinceLabel }
								placeholder={ language.beneficiariesEdit.listDataProvincePlaceholder }
								required={true}
							/>

							<EditFormSelectInput
								name={ "city" }
								control={ control }
								component={"District"}
								rules={ rulesBeneficiariesEdit.city }
								errors={ formState.errors.city }
								label={ language.beneficiariesEdit.listDataDistrictLabel }
								placeholder={ language.beneficiariesEdit.listDataDistrictPlaceholder }
								required={true}
							/>

							<EditFormTextInput
								name={ "postcode" }
								control={ control }
								rules={ rulesBeneficiariesEdit.postcode }
								errors={ formState.errors.postcode }
								label={ language.beneficiariesEdit.listDataPostCodeLabel }
								placeholder={ language.beneficiariesEdit.listDataPostCodePlaceholder }
								required={true}
							/>

							<EditFormTextInput
								name={ "country" }
								control={ control }
								errors={ formState.errors.country }
								label={ language.beneficiariesEdit.listDataCountryLabel }
								placeholder={ language.beneficiariesEdit.listDataCountryPlaceholder }
								required={true}
							/>
							
						</VStack>
						<HStack space={"3"} flexDir={"row"} pt={"4"} px={"4"}>
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
					</ScrollView>
				</VStack>
			</Center>
		</>
	)
}