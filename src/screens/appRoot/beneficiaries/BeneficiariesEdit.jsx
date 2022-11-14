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

export default function BeneficiariesEdit() {
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
			<BeneficiariesEditInner />
		</FormProvider>
	)
}

function BeneficiariesEditInner() {
	const navigation = useNavigation()
	const route = useRoute()
	const { id } = route.params
	const [isLoading, setIsLoading] = React.useState(true)
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

	React.useEffect(() => {
		mountRef.current = true
		if (isLoading == true) {
			api.get(buildDataPath('beneficiaries', auth.uid, 'view', { id: id }))
				.then(response => {
					setValue('firstname', response.data.firstname, { shouldTouch: true })
					setValue('lastname', response.data.lastname, { shouldTouch: true })
					setValue('thainame', response.data.thainame, { shouldTouch: true })
					setValue('phone', response.data.phone, { shouldTouch: true })
					setValue('accountnumber', response.data.accountnumber, { shouldTouch: true })
					setValue('accounttype', response.data.accounttype, { shouldTouch: true })
					setValue('bankname', response.data.bankname, { shouldTouch: true })
					setValue('branchname', response.data.branchname, { shouldTouch: true })
					setValue('branchcity', response.data.branchcity, { shouldTouch: true })
					setValue('address', response.data.address, { shouldTouch: true })
					setValue('state', response.data.state, { shouldTouch: true })
					setValue('city', response.data.city, { shouldTouch: true })
					setValue('postcode', response.data.postcode, { shouldTouch: true })
					setValue('country', response.data.country, { shouldTouch: true })
				})
				.then(response => setIsLoading(false))
				.catch(error => console.log(error))
				
		}
		return () => {
			mountRef.current = false
		}
	}, [isLoading])

	const onSubmit = data => {
		setIsLoading(true)
		api.put(buildDataPath('beneficiaries', auth.uid, 'edit', {id: id} ), data)
			.then(response => {
				authDispatch({ type: 'SET_STATUS', payload: { data: 'beneficiaryUpdated' }})
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
								onPress={() => navigation.popToTop()}>{ language.beneficiariesEdit.buttonBack }</Button>
							<Spacer />
							<Button
								flex={"1"}
								isLoadingText={"Saving..."}
								onPress={handleSubmit(onSubmit, onError)}>{ language.beneficiariesEdit.buttonSave }</Button>
						</HStack>
						<ScrollView w={"100%"}>
						<VStack py={"4"} space={"4"}>
							<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"}>
								<Heading size={"sm"}>{ language.beneficiariesEdit.listDataHeaderPersonalDetails }</Heading>
							</Box>
							<FormControl px={"4"} isRequired isInvalid={formState.errors.firstname ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataFirstNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataFirstNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.beneficiariesEdit.listDataFirstNamePlaceholder }
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
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataLastNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataLastNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesEdit.listDataLastNamePlaceholder}
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
								<FormControl.Label fontSize={"xs"} color={"coolGray.500"}>{ language.beneficiariesEdit.listDataThaiNameLabel }</FormControl.Label>
								<Controller
									control={control}
									render={({ field: { onChange, value } }) => (
										<Input
											type={"text"}
											placeholder={language.beneficiariesEdit.listDataThaiNamePlaceholder}
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"thainame"} />
							</FormControl>
							
							<FormControl px={"4"} isInvalid={formState.errors.phone ? true : false}>
								<FormControl.Label fontSize={"xs"} color={"coolGray.500"}>{ language.beneficiariesEdit.listDataPhoneLabel }</FormControl.Label>
								<Controller
									control={control}
									rules={{
										pattern: {
											value: /[0-9-]+/,
											message: language.beneficiariesEdit.listDataPhoneErrorDigits
										},
										minLength: {
											value: 10,
											message: language.beneficiariesEdit.listDataPhoneErrorMin
										},
										maxLength: {
											value: 10,
											message: language.beneficiariesEdit.listDataPhoneErrorMax
										}
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											type={"text"}
											placeholder={language.beneficiariesEdit.listDataPhonePlaceholder}
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
								<Heading size={"sm"}>{ language.beneficiariesEdit.listDataHeaderBankDetails }</Heading>
							</Box>
							<FormControl px={"4"} isRequired isInvalid={formState.errors.accountnumber ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataAccountNumberLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataAccountNumberErrorRequired,
										pattern: {
											value: /\d+/,
											message: language.beneficiariesEdit.listDataAccountNumberErrorDigits
										},
										minLength: {
											value: 10,
											message: language.beneficiariesEdit.listDataAccountNumberErrorMin
										},
										maxLength: {
											value: 10,
											message: language.beneficiariesEdit.listDataAccountNumberErrorMax
										}
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesEdit.listDataAccountNumberPlaceholder}
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
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataAccountTypeLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataAccountTypeErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.AccountType
											placeholder={language.beneficiariesEdit.listDataAccountTypePlaceholder}
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
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataBankNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataBankNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.BankName
											placeholder={language.beneficiariesEdit.listDataBankNamePlaceholder}
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
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataBranchNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataBranchNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesEdit.listDataBranchNamePlaceholder}
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
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataBranchCityLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataBranchCityErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.BranchCity
											placeholder={language.beneficiariesEdit.listDataBranchCityPlaceholder}
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
								<Heading size={"sm"}>{ language.beneficiariesEdit.listDataHeaderAddressDetails }</Heading>
							</Box>
							<FormControl px={"4"} isRequired isInvalid={formState.errors.address ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataThaiAddressLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataThaiAddressErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesEdit.listDataThaiAddressPlaceholder}
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
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataProvinceLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataProvinceErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.Province
											placeholder={language.beneficiariesEdit.listDataProvincePlaceholder}
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
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataDistrictLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataDistrictErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<SelectControl.District
											placeholder={language.beneficiariesEdit.listDataDistrictPlaceholder}
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
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.beneficiariesEdit.listDataPostCodeLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.beneficiariesEdit.listDataPostCodeErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesEdit.listDataPostCodePlaceholder}
											value={value}
											onChangeText={onChange}
											fontSize={"lg"}
										/>
									)}
									name={"postcode"} />
							</FormControl>
							
							<FormControl px={"4"} isRequired>
								<FormControl.Label fontSize={"xs"} color={"coolGray.500"}>{ language.beneficiariesEdit.listDataCountryLabel }</FormControl.Label>
								<Controller
									control={control}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={language.beneficiariesEdit.listDataCountryPlaceholder}
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