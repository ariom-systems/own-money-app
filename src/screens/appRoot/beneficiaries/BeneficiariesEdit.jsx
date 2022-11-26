import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { Button, Center, Factory, HStack, ScrollView, Spacer, StatusBar, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import { AuthContext } from '../../../data/Context'
import { buildDataPath, addExtraRecordData } from '../../../data/Actions'
import { api, beneficiaryColumns } from '../../../config'
import Spinner from '../../../components/common/Spinner'

import * as Recoil from 'recoil'
import * as Atoms from '../../../data/recoil/Atoms'

import { defaultsBeneficiariesEdit, rulesBeneficiariesEdit } from '../../../data/handlers/Forms'
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
		criteriaMode: 'all',
		defaultValues: defaultsBeneficiariesEdit
	})

	return (
		<FormProvider {...methods}>
			<BeneficiariesEditInner />
		</FormProvider>
	)
}

function BeneficiariesEditInner() {
	const navigation = useNavigation()
	const [ initialLoad, setInitialLoad ] = React.useState(true)
	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = Recoil.useRecoilState(Atoms.beneficiaries)
	const [ loading, setLoading ] = Recoil.useRecoilState(Atoms.loading)
	const { control, handleSubmit, setValue, formState } = useFormContext()
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	React.useEffect(() => {
		setLoading({ status: false, text: "" })
		if(initialLoad == true) {
			setValue('id', beneficiaries.edit.id, { shouldTouch: true })
			setValue('firstname', beneficiaries.edit.firstname, { shouldTouch: true })
			setValue('lastname', beneficiaries.edit.lastname, { shouldTouch: true })
			setValue('thainame', beneficiaries.edit.thainame, { shouldTouch: true })
			setValue('phone', beneficiaries.edit.phone, { shouldTouch: true })
			setValue('accountnumber', beneficiaries.edit.accountnumber, { shouldTouch: true })
			setValue('accounttype', beneficiaries.edit.accounttype, { shouldTouch: true })
			setValue('bankname', beneficiaries.edit.bankname, { shouldTouch: true })
			setValue('branchname', beneficiaries.edit.branchname, { shouldTouch: true })
			setValue('branchcity', beneficiaries.edit.branchcity, { shouldTouch: true })
			setValue('address', beneficiaries.edit.address, { shouldTouch: true })
			setValue('state', beneficiaries.edit.state, { shouldTouch: true })
			setValue('city', beneficiaries.edit.city, { shouldTouch: true })
			setValue('postcode', beneficiaries.edit.postcode, { shouldTouch: true })
			setValue('country', beneficiaries.edit.country, { shouldTouch: true })
			setInitialLoad(false)
		}
	}, [initialLoad, beneficiaries])

	const onSubmit = data => {
		setLoading({ status: true, text: 'Saving' })
		api.put(buildDataPath('beneficiaries', auth.uid, 'edit', {id: data.id} ), data)
			.then(response => {
				if(response.data == true) {
					authDispatch({ type: 'SET_STATUS', payload: { data: 'beneficiaryUpdated' }})
					api.post(buildDataPath('beneficiaries', auth.uid, 'list'), JSON.stringify(Object.assign({}, beneficiaryColumns )))
					.then(response => {
						setBeneficiaries((initial) => ({
							...initial,
							list: addExtraRecordData(response.data)
						}))
					})
					.catch(error => { throw error })
				} else {
					throw response.data
				}
			})
			.finally(result => {
				setLoading({ status: false, text: "" })
				setBeneficiaries((prev) => ({
					...prev,
					edit: {},
					view: {}
				}))
				navigation.popToTop()
			})
			.catch(error => console.log("onSubmit", error))
	}

	//TODO: improve the list of errors shown to the user
	const onError = (errors, e) => console.log(errors, e)

	const handleBack = (item) => {
		setBeneficiaries((prev) => ({
			...prev,
			edit: {}
		}))
		navigation.goBack()
	}

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