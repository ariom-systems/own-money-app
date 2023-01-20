import React, { useContext, useEffect, useReducer } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { ScrollView, VStack } from 'native-base'
import * as Forms from '../../../components/common/Forms'
import Toolbar from '../../../components/common/Toolbar'
import AppSafeArea from '../../../components/common/AppSafeArea'
import AlertBanner from '../../../components/common/AlertBanner'

//data
import { AuthContext } from '../../../data/Context'
import { buildDataPath, sortByParam, addObjectExtraData, stringifyArray, mapActionsToConfig } from '../../../data/Actions'
import { api, beneficiaryColumns, beneficiaryAddToolbarConfig } from '../../../config'
import { useRecoilState, useRecoilValue } from 'recoil'
import { loadingState, noticeState } from '../../../data/recoil/system'
import { beneficiaryList } from '../../../data/recoil/beneficiaries'
import { validationRulesBeneficiaryAdd } from '../../../config'
import { userState } from '../../../data/recoil/user'

//lang
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
	const { auth, authDispatch } = useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = useRecoilState(beneficiaryList)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const user = useRecoilValue(userState)
	const notices = useRecoilValue(noticeState)
	const { control, handleSubmit, setValue, formState } = useFormContext()
	const [ ignored, forceUpdate] = useReducer((x) => x +1, 0)

	let actions = [
		() => handleBack(), , //note the double comma. second element is a spacer and has no action
		() => handleSubmit(onSubmit, onError)
	]

	const toolbarConfig = mapActionsToConfig(beneficiaryAddToolbarConfig, actions)

	useEffect(() => {
		if(language.getLanguage() !== user.lang) {
			language.setLanguage(user.lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, user])

	const handleBack = () => {
		navigation.goBack()
	}

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

	return (
		<AppSafeArea>
			<ScrollView w={"100%"}>
				<VStack space={"4"} m={"2.5%"}>
					{ notices && <AlertBanner /> }
					<Toolbar config={toolbarConfig} />
					<VStack pb={"2.5%"} space={"2"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiaryAdd.headings.personalDetails }</Forms.HeaderItem>		
						<VStack space={"4"} px={"2.5%"}>	
							<Forms.TextInput
								name={ "firstname" }
								control={ control }
								rules={ validationRulesBeneficiaryAdd.firstname }
								errors={ formState.errors.firstname }
								label={ language.beneficiaryAdd.labels.firstName }
								placeholder={ language.beneficiaryAdd.placeholders.firstName }
								required={true}
							/>
							<Forms.TextInput
								name={ "lastname" }
								control={ control }
								rules={ validationRulesBeneficiaryAdd.lastname }
								errors={ formState.errors.lastname }
								label={ language.beneficiaryAdd.labels.lastName }
								placeholder={ language.beneficiaryAdd.placeholders.lastName }
								required={true}
							/>
							<Forms.TextInput
								name={ "thainame" }
								control={ control }
								errors={ formState.errors.thainame }
								label={ language.beneficiaryAdd.labels.thaiName }
								placeholder={ language.beneficiaryAdd.placeholders.thaiName }
								required={false}
							/>
							<Forms.TextInput
								name={ "phone" }
								control={ control }
								rules={ validationRulesBeneficiaryAdd.phone }
								errors={ formState.errors.phone }
								label={ language.beneficiaryAdd.labels.phone }
								placeholder={ language.beneficiaryAdd.placeholders.phone }
								required={false}
							/>
						</VStack>				
					</VStack>
					<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiaryAdd.headings.bankDetails }</Forms.HeaderItem>
						<VStack space={"4"} px={"2.5%"}>
							<Forms.TextInput
								name={ "accountnumber" }
								control={ control }
								rules={ validationRulesBeneficiaryAdd.accountnumber }
								errors={ formState.errors.accountnumber }
								label={ language.beneficiaryAdd.labels.accountNumber }
								placeholder={ language.beneficiaryAdd.placeholders.accountNumber }
								required={true}
							/>
							<Forms.SelectInput
								name={ "accounttype" }
								control={ control }
								component={"AccountType"}
								rules={ validationRulesBeneficiaryAdd.accounttype }
								errors={ formState.errors.accounttype }
								label={ language.beneficiaryAdd.labels.accountType }
								placeholder={ language.beneficiaryAdd.placeholders.accountType }
								required={true}
								context={"Beneficiaries"}
							/>
							<Forms.SelectInput
								name={ "bankname" }
								control={ control }
								component={"BankName"}
								rules={ validationRulesBeneficiaryAdd.bankname }
								errors={ formState.errors.bankname }
								label={ language.beneficiaryAdd.labels.bankName }
								placeholder={ language.beneficiaryAdd.placeholders.bankName }
								required={true}
								context={"Beneficiaries"}
							/>
							<Forms.TextInput
								name={ "branchname" }
								control={ control }
								rules={ validationRulesBeneficiaryAdd.branchname }
								errors={ formState.errors.branchname }
								label={ language.beneficiaryAdd.labels.branchName }
								placeholder={ language.beneficiaryAdd.placeholders.branchName }
								required={true}
								context={"Beneficiaries"}
							/>
							<Forms.SelectInput
								name={ "branchcity" }
								control={ control }
								component={"BranchCity"}
								rules={ validationRulesBeneficiaryAdd.branchcity }
								errors={ formState.errors.branchname }
								label={ language.beneficiaryAdd.labels.branchCity }
								placeholder={ language.beneficiaryAdd.placeholders.branchCity }
								required={true}
								context={"Beneficiaries"}
							/>			
						</VStack>
					</VStack>
					<VStack pb={"4"} space={"4"} bgColor={"white"} rounded={"8"}>					
						<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiaryAdd.headings.addressDetails }</Forms.HeaderItem>
						<VStack space={"4"} px={"2.5%"}>
							<Forms.TextInput
								name={ "address" }
								control={ control }
								rules={ validationRulesBeneficiaryAdd.address }
								errors={ formState.errors.address }
								label={ language.beneficiaryAdd.labels.thaiAddress }
								placeholder={ language.beneficiaryAdd.placeholders.thaiAddress }
								required={true}
							/>
							<Forms.SelectInput
								name={ "state" }
								control={ control }
								component={"Province"}
								rules={ validationRulesBeneficiaryAdd.state }
								errors={ formState.errors.state }
								label={ language.beneficiaryAdd.labels.province }
								placeholder={ language.beneficiaryAdd.placeholders.province }
								required={true}
								context={"Beneficiaries"}
							/>
							<Forms.SelectInput
								name={ "city" }
								control={ control }
								component={"District"}
								rules={ validationRulesBeneficiaryAdd.city }
								errors={ formState.errors.city }
								label={ language.beneficiaryAdd.labels.district }
								placeholder={ language.beneficiaryAdd.placeholders.district }
								required={true}
								context={"Beneficiaries"}
							/>
							<Forms.TextInput
								name={ "postcode" }
								control={ control }
								rules={ validationRulesBeneficiaryAdd.postcode }
								errors={ formState.errors.postcode }
								label={ language.beneficiaryAdd.labels.postCode }
								placeholder={ language.beneficiaryAdd.placeholders.postCode }
								required={true}
							/>
							<Forms.TextInput
								name={ "country" }
								control={ control }
								errors={ formState.errors.country }
								label={ language.beneficiaryAdd.labels.country }
								placeholder={ language.beneficiaryAdd.placeholders.country }
								required={true}
							/>
						</VStack>
					</VStack>
					<Toolbar config={toolbarConfig} />
				</VStack>
			</ScrollView>
		</AppSafeArea>
	)
}