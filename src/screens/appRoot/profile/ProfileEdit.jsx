import React from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form'
import { Box, Button, Center, Factory, FormControl, Heading,
	HStack, Input, ScrollView, Select, Spacer, StatusBar, Text, VStack } from 'native-base'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
const NBIonicon = Factory(Ionicon)
import LoadingOverlay from '../../../components/common/LoadingOverlay'
import { ErrorMessage } from '../../../components/common/Forms'
import { OMDatePicker } from '../../../components/common/DatePicker'
import Toolbar, { ToolbarItem, ToolbarSpacer } from '../../../components/common/Toolbar'

//data
import { AuthContext } from '../../../data/Context'
import { buildDataPath } from '../../../data/Actions'
import { api } from '../../../config'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

export default function ProfileEdit() {
	const methods = useForm({
		mode: 'onBlur',
		criteriaMode: 'all'
	})
	return (
		<FormProvider {...methods}>
			<ProfileEditInner />
		</FormProvider>
	)
}

function ProfileEditInner() {
	const navigation = useNavigation()
	const [ isLoading, setIsLoading ] = React.useState(false)
	const { auth, authDispatch } = React.useContext(AuthContext)
	const { control, handleSubmit, setValue, formState } = useFormContext()
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)

	// React.useEffect(() => {
	// 	setValue('firstname', data.user.firstname)
	// 	setValue('middlename', data.user.middlename)
	// 	setValue('lastname', data.user.lastname)
	// 	setValue('nickname', data.user.nickname)
	// 	setValue('dateofbirth', data.user.dateofbirth)
	// 	setValue('occupation', data.user.occupation)
	// 	setValue('phone', data.user.phone)
	// 	setValue('email', data.user.email)
	// 	setValue('address', data.user.address)
	// 	setValue('city', data.user.city)
	// 	setValue('state', data.user.state)
	// 	setValue('postcode', data.user.postcode)

	// }, [isLoading])

	React.useEffect(() => {
		if(language.getLanguage() !== auth.lang) {
			language.setLanguage(auth.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, auth])

	const onSubmit = data => {
		setIsLoading(true)
		api.put(buildDataPath('users', auth.uid, 'edit'), data)
		.then(response => {
			authDispatch({ type: 'SET_STATUS', payload: { data: 'profileUpdated' }})
			navigation.popToTop()
		})
	}

	const onError = error => {
		console.log("error", error)
	}


	const EditToolbar = ({ submitAction }) => {
		return (
			<Toolbar nb={{ my: "4" }} >
				<ToolbarItem
					label={language.beneficiariesEdit.buttonBack}
					icon={"chevron-back-outline"}
					space={"1"}
					iconProps={{ ml: "-4" }}
					buttonProps={{ flex: "1" }}
					action={() => handleBack()} />
				<ToolbarSpacer />
				<ToolbarItem
					label={language.beneficiariesEdit.buttonSave}
					icon={"save-outline"}
					buttonProps={{ isLoadingText: "Saving...", flex: "1" }}
					action={submitAction} />
			</Toolbar>
		)
	}

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{ width: '100%', height: '100%' }} resizeMode={"cover"}>
			<StatusBar />
			<Center flex={1} justifyContent={"center"}>
				<VStack flex={"1"} space={"4"} w={"100%"} px={"2.5%"}>
					{/* <HStack space={"3"} flexDir={"row"} pt={"4"} px={"4"}>
						<Button
							flex={"1"}
							variant={"subtle"}
							onPress={() => navigation.popToTop()}>{ language.profileEdit.buttonBack }</Button>
						<Spacer />
						<Button
							flex={"1"}
							isLoadingText={"Saving..."}
							onPress={handleSubmit(onSubmit, onError)}>{ language.profileEdit.buttonSave }</Button>
					</HStack> */}
					<ScrollView w={"100%"}>
						<VStack py={"4"} space={"4"}>
							<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"}>
								<Heading size={"sm"}>{ language.profileEdit.listDataHeaderPersonalDetails }</Heading>
							</Box>

							<FormControl px={"4"} isRequired isInvalid={formState.errors.firstname ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataFirstNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataFirstNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.profileEdit.listDataFirstNamePlaceholder }
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

							<FormControl px={"4"} isRequired isInvalid={formState.errors.middlename ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataMiddleNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataMiddleNamErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.profileEdit.listDataMiddleNamePlaceholder }
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"middlename"} />
								{formState.errors.middlename && (
									<ErrorMessage message={formState.errors.middlename.message} />
								)}
							</FormControl>

							<FormControl px={"4"} isRequired isInvalid={formState.errors.lastname ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataLastNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataLastNameErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.profileEdit.listDataLastNamePlaceholder }
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
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataNickNameLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.profileEdit.listDataNickNamePlaceholder }
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"nickname"} />
							</FormControl>

							<FormControl px={"4"} isRequired isInvalid={formState.errors.dateofbirth ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataDateOfBirthLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataDateOfBirthErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<OMDatePicker
											title={ language.profileEdit.listDataDateOfBirthModalTitle }
											onChange={onChange}
											value={value} />
									)}
									name={"dateofbirth"} />
								{formState.errors.dateofbirth && (
									<ErrorMessage message={formState.errors.dateofbirth.message} />
								)}
							</FormControl>

							<FormControl px={"4"} isRequired isInvalid={formState.errors.occupation ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataOccupationLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataOccupationErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.profileEdit.listDataOccupationPlaceholder }
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"occupation"} />
								{formState.errors.occupation && (
									<ErrorMessage message={formState.errors.occupation.message} />
								)}
							</FormControl>
						</VStack>
						<VStack py={"4"} space={"4"}>
							<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"}>
								<Heading size={"sm"}>{ language.profileEdit.listDataHeaderContactDetails }</Heading>
							</Box>

							<FormControl px={"4"} isRequired isInvalid={formState.errors.phone ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataPhoneLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataPhoneErrorRequired,
										pattern: {
											value: /[0-9-]+/,
											message: language.profileEdit.listDataPhoneErrorDigits
										},
										minLength: {
											value: 10,
											message: language.profileEdit.listDataPhoneErrorMin
										},
										maxLength: {
											value: 10,
											message: language.profileEdit.listDataPhoneErrorMax
										}
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.profileEdit.listDataPhonePlaceholder }
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

							<FormControl px={"4"}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataEmailLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									render={({ field: { value } }) => (
										<Input
											backgroundColor={"coolGray.300"}
											color={"coolGray.700"}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'}
											isReadOnly={true} />
									)}
									name={"email"} />
								<FormControl.HelperText>
									{ language.profileEdit.listDataEmailSubLabel }
								</FormControl.HelperText>
							</FormControl>

						</VStack>
						<VStack py={"4"} space={"4"}>
							<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"}>
								<Heading size={"sm"}>{ language.profileEdit.listDataHeaderAddressDetails }</Heading>
							</Box>

							<FormControl px={"4"} isRequired isInvalid={formState.errors.address ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataAddressLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataAddressErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.profileEdit.listDataAddressPlaceholder }
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

							<FormControl px={"4"} isRequired isInvalid={formState.errors.city ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataSuburbLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataSuburbErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.profileEdit.listDataSuburbPlaceholder }
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"city"} />
								{formState.errors.city && (
									<ErrorMessage message={formState.errors.city.message} />
								)}
							</FormControl>

							<FormControl px={"4"} isRequired isInvalid={formState.errors.state ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataStateLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataStateErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Select selectedValue={value} placeholder={ language.profileEdit.listDataStatePlaceholder } onValueChange={onChange} value={value} fontSize={"lg"}>
											<Select.Item label={"Australian Capital Territory"} value={"ACT"} />
											<Select.Item label={"New South Wales"} value={"NSW"} />
											<Select.Item label={"Northern Territory"} value={"NT"} />
											<Select.Item label={"Queensland"} value={"QLD"} />
											<Select.Item label={"South Australia"} value={"SA"} />
											<Select.Item label={"Tasmania"} value={"TAS"} />
											<Select.Item label={"Victoria"} value={"VIC"} />
											<Select.Item label={"Western Australia"} value={"WA"} />
										</Select>
									)}
									name={"state"} />
								{formState.errors.state && (
									<ErrorMessage message={formState.errors.state.message} />
								)}
							</FormControl>

							<FormControl px={"4"} isRequired isInvalid={formState.errors.postcode ? true : false}>
								<HStack>
									<FormControl.Label fontSize={"xs"} color={"coolGray.500"} flexGrow={"1"}>{ language.profileEdit.listDataPostCodeLabel }</FormControl.Label>
								</HStack>
								<Controller
									control={control}
									rules={{
										required: language.profileEdit.listDataPostCodeErrorRequired
									}}
									render={({ field: { onChange, value } }) => (
										<Input
											placeholder={ language.profileEdit.listDataPostCodePlaceholder }
											onChangeText={onChange}
											value={value}
											fontSize={"lg"}
											autoCorrect={false}
											autoCapitalize={'none'} />
									)}
									name={"postcode"} />
								{formState.errors.postcode && (
									<ErrorMessage message={formState.errors.postcode.message} />
								)}
							</FormControl>
						</VStack>
						<HStack space={"3"} flexDir={"row"} pt={"4"} px={"4"}>
							<Button
								flex={"1"}
								variant={"subtle"}
								onPress={() => navigation.popToTop() }>{ language.profileEdit.buttonBack }</Button>
							<Spacer />
							<Button
								flex={"1"}
								isLoadingText={"Saving..."}
								onPress={handleSubmit(onSubmit)}>{ language.profileEdit.buttonSave }</Button>
						</HStack>
					</ScrollView>
				</VStack>
			</Center>
		</ImageBackground>
	)
}