import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form'
import { Box, Button, Center, Divider, Factory, FormControl, Heading, 
	HStack, Input, ScrollView, Spacer, StatusBar, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import { AuthContext, DataContext } from '../../../data/Context'
import { buildDataPath } from '../../../data/Actions'
import { api } from '../../../config'
import * as SelectControl from '../../../components/beneficiaries/SelectControls'
import LoadingOverlay from '../../../components/common/LoadingOverlay'
import { ErrorMessage } from '../../../components/common/Forms'

import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const NBIonicon = Factory(Ionicon)

export default function BeneficiariesAdd() {
	const methods = useForm({
		mode: 'onBlur',
		criteriaMode: 'all',
		defaultValues: {
			firstname: '',
			lastname: '',
			thainame: '',
			phone: '',
			accountnumber: '',
			accounttype: '',
			bankname: '',
			branchname: '',
			branchcity: '',
			address: '',
			state: '',
			city: '',
			postcode: '',
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
	const [isLoading, setIsLoading] = React.useState(false)
	const { dataDispatch } = React.useContext(DataContext)
	const { auth, authDispatch } = React.useContext(AuthContext)
	const { register, control, handleSubmit, setValue, getValues, formState } = useFormContext()
	const mountRef = React.useRef(false)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	
	const onSubmit = data => {
		setIsLoading(true)
		api.post(buildDataPath('beneficiaries', auth.uid, 'add'), JSON.stringify(data))
			.then(response => {
				if (response.ok == true) {
					api.post(buildDataPath('beneficiaries', auth.uid, 'list'), JSON.stringify(Object.assign({}, ["id", "id_users", "firstname", "lastname", "status"])))
					.then(response => {
						let newResponse = []
						newResponse = response.data.filter(function(obj) {
							return obj.status !== 'In-Active'
						})
						newResponse = iterateInitials(newResponse)
						newResponse = iterateFullName(newResponse) 
						newResponse = sortByParam(newResponse, "firstname")
						dataDispatch({ type: 'LOAD_BENEFICIARIES', payload: { data: newResponse } })
						resolve('✅ Loaded Beneficiaries')
					})
					.catch(error => { reject('🚫 ' + error) })
				}
			})
			.then(response => {
				authDispatch({ type: 'SET_STATUS', payload: { data: 'beneficiarySaved' }})
				navigation.popToTop()
			})
			.catch(error => console.log(error))
	}

	//TODO: improve the list of errors shown to the user
	const onError = (errors, e) => console.log(errors, e)

	return (
		<>
			<StatusBar barStyle={"light-content"} backgroundColor={"#8B6A27"} />
			<Center flex={1} justifyContent={"center"}>
				{isLoading == true && (
					<LoadingOverlay />
				)}
				
					<VStack flex={"1"} space={"4"} w={"100%"}>
						<HStack space={"3"} flexDir={"row"} pt={"4"} px={"4"}>
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
						<ScrollView w={"100%"}>
						<VStack py={"4"} space={"4"}>
							<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"}>
								<Heading size={"sm"}>{ language.beneficiariesAdd.listDataHeaderPersonalDetails }</Heading>
							</Box>
							<FormControl px={"4"} isRequired isInvalid={formState.errors.firstname ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataFirstNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataFirstNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.beneficiariesAdd.listDataFirstNamePlaceholder }
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"firstname"} />
								{formState.errors.firstname && (
									<ErrorMessage message={formState.errors.firstname.message} />
								)}
							</FormControl>
							
							<FormControl px={"4"} isRequired isInvalid={formState.errors.lastname ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataLastNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataLastNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesAdd.listDataLastNamePlaceholder}
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"lastname"} />
								{formState.errors.lastname && (
									<ErrorMessage message={formState.errors.lastname.message} />
								)}
							</FormControl>
							
							<FormControl px={"4"}>
								<FormControl.Label fontSize={"xs"} color={"coolGray.500"}>{ language.beneficiariesAdd.listDataThaiNameLabel }</FormControl.Label>
								<Controller
									control={control}
									render={({ field: { onChange, value } }) => (
										<Input
											type={"text"}
											placeholder={language.beneficiariesAdd.listDataThaiNamePlaceholder}
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"thainame"} />
							</FormControl>
							
							<FormControl px={"4"} isInvalid={formState.errors.phone ? true : false}>
								<FormControl.Label fontSize={"xs"} color={"coolGray.500"}>{ language.beneficiariesAdd.listDataPhoneLabel }</FormControl.Label>
								<Controller
									control={control}
									rules={{
										pattern: {
											value: /[0-9-]+/,
											message: language.beneficiariesAdd.listDataPhoneErrorDigits
										},
										minLength: {
											value: 10,
											message: language.beneficiariesAdd.listDataPhoneErrorMin
										},
										maxLength: {
											value: 10,
											message: language.beneficiariesAdd.listDataPhoneErrorMax
										}
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											type={"text"}
											placeholder={language.beneficiariesAdd.listDataPhonePlaceholder}
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"phone"} />
								{formState.errors.phone && (
									<ErrorMessage message={formState.errors.phone.message} />
								)}
							</FormControl>
						</VStack>
						<VStack py={"4"} space={"4"}>
							<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"}>
								<Heading size={"sm"}>{ language.beneficiariesAdd.listDataHeaderBankDetails }</Heading>
							</Box>
							<FormControl px={"4"} isRequired isInvalid={formState.errors.accountnumber ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataAccountNumberLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataAccountNumberErrorRequired,
										pattern: {
											value: /\d+/,
											message: language.beneficiariesAdd.listDataAccountNumberErrorDigits
										},
										minLength: {
											value: 10,
											message: language.beneficiariesAdd.listDataAccountNumberErrorMin
										},
										maxLength: {
											value: 10,
											message: language.beneficiariesAdd.listDataAccountNumberErrorMax
										}
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesAdd.listDataAccountNumberPlaceholder}
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"accountnumber"} />
								{formState.errors.accountnumber && (
									<ErrorMessage message={formState.errors.accountnumber.message} />
								)}
							</FormControl>
							
							<FormControl px={"4"} isRequired isInvalid={formState.errors.accounttype ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataAccountTypeLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataAccountTypeErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.AccountType
											placeholder={language.beneficiariesAdd.listDataAccountTypePlaceholder}
											onValueChange={onChange}
											value={value} />
									)}
									name={"accounttype"} />
								{formState.errors.accounttype && (
									<ErrorMessage message={formState.errors.accounttype.message} />
								)}
							</FormControl>
							
							<FormControl px={"4"} isRequired isInvalid={formState.errors.bankname ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataBankNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataBankNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.BankName
											placeholder={language.beneficiariesAdd.listDataBankNamePlaceholder}
											onValueChange={onChange}
											value={value}
										/>
									)}
									name={"bankname"} />
								{formState.errors.bankname && (
									<ErrorMessage message={formState.errors.bankname.message} />
								)}
							</FormControl>
							
							<FormControl px={"4"} isRequired isInvalid={formState.errors.branchname ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataBranchNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataBranchNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesAdd.listDataBranchNamePlaceholder}
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"branchname"} />
								{formState.errors.branchname && (
									<ErrorMessage message={formState.errors.branchname.message} />
								)}
							</FormControl>
							
							<FormControl px={"4"} isRequired isInvalid={formState.errors.branchcity ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataBranchCityLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataBranchCityErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.BranchCity
											placeholder={language.beneficiariesAdd.listDataBranchCityPlaceholder}
											onValueChange={onChange}
											value={value} />
									)}
									name={"branchcity"} />
								{formState.errors.branchcity && (
									<ErrorMessage message={formState.errors.branchcity.message} />
								)}
							</FormControl>
						</VStack>
						<VStack py={"4"} space={"4"}>
							
							<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"}>
								<Heading size={"sm"}>{ language.beneficiariesAdd.listDataHeaderAddressDetails }</Heading>
							</Box>
							<FormControl px={"4"} isRequired isInvalid={formState.errors.address ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataThaiAddressLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataThaiAddressErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesAdd.listDataThaiAddressPlaceholder}
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"address"} />
								{formState.errors.address && (
									<ErrorMessage message={formState.errors.address.message} />
								)}
							</FormControl>
							
							<FormControl px={"4"} isRequired isInvalid={formState.errors.state ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataProvinceLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataProvinceErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.Province
											placeholder={language.beneficiariesAdd.listDataProvincePlaceholder}
											onValueChange={onChange}
											value={value} />
									)}
									name={"state"} />
								{formState.errors.province && (
									<ErrorMessage message={formState.errors.state.message} />
								)}
							</FormControl>
							
							<FormControl px={"4"} isRequired isInvalid={formState.errors.city ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataDistrictLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataDistrictErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.District
											placeholder={language.beneficiariesAdd.listDataDistrictPlaceholder}
											onValueChange={onChange}
											value={value}
										/>
									)}
									name={"city"} />
								{formState.errors.city && (
									<ErrorMessage message={formState.errors.city.message} />
								)}
							</FormControl>
							
							<FormControl px={"4"} isRequired>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesAdd.listDataPostCodeLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesAdd.listDataPostCodeErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesAdd.listDataPostCodePlaceholder}
											value={value}
											onChangeText={onChange}
											fontSize={"lg"}
										/>
									)}
									name={"postcode"} />
							</FormControl>
							
							<FormControl px={"4"} isRequired>
								<FormControl.Label fontSize={"xs"} color={"coolGray.500"}>{ language.beneficiariesAdd.listDataCountryLabel }</FormControl.Label>
								<Controller
									control={control}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesAdd.listDataCountryPlaceholder}
											onChangeText={onChange}
											value={value}
											defaultValue={"Thailand"}
											fontSize={"lg"}
											isReadOnly={true} />
									)}
									name={"country"} />
							</FormControl>
						</VStack>
						<HStack space={"3"} flexDir={"row"} pt={"4"} px={"4"}>
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
					</ScrollView>
				</VStack>
			</Center>
		</>
	)
}