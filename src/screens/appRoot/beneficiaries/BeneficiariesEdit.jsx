import React, { useContext, useEffect } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { ScrollView, VStack } from 'native-base'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import * as Forms from '../../../components/common/Forms'
import Toolbar from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'

//data
import { useRecoilState, useRecoilValue } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { AuthContext } from '../../../data/Context'
import { getNotice } from '../../../data/handlers/Status'
import { Sizes, api, beneficiaryEditToolbarConfig, validationRulesBeneficiaryEdit } from '../../../config'
import { buildDataPath, atomReplaceItemAtIndex, addObjectExtraData, mapActionsToConfig } from '../../../data/Actions'
import { beneficiaryList, beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { loadingState, noticeState, langState } from '../../../data/recoil/system'

//lang
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
	const forceUpdate = useForceUpdate()
	const { control, handleSubmit, setValue, formState } = useFormContext()
	const { auth } = useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = useRecoilState(beneficiaryList)
	const [ notices, setNotices ] = useRecoilState(noticeState)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const lang = useRecoilValue(langState)

	let actions = [
		() => handleBack(), , //note the double comma. second element is a spacer and has no action
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

	const toolbarConfig = mapActionsToConfig(beneficiaryEditToolbarConfig, actions)

	useEffect(() => {
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
		setLoading({ status: false, type: 'none' })
	},[beneficiary])

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])

	const handleBack = () => {
		navigation.goBack()
	}

	const onSubmit = data => {
		//push changes to remote
		api.put(buildDataPath('beneficiaries', auth.uid, 'edit', {id: data.id} ), data)
		.then(response => {
			if(response.ok == true) {			
				if(response.data == true) {
					//if update is successful, re-parse submitted form data and send it to beneficiaryList atom
					let newData = addObjectExtraData(data)				
					const newList = atomReplaceItemAtIndex(beneficiaries, data.index, newData)
					setBeneficiaries(newList)
					setLoading({ status: false, type: "" })
					setNotices((prev) => ([...prev, getNotice('beneficiaryUpdated', lang)]))
					navigation.popToTop()
				} else {
					throw response.data
				}
			} else {
				throw response.data
			}
			
		})
		.catch(error => console.log(error))
	}

	const onError = (error) => {
		setLoading({ status: false, message: 'none' })
	}


	return (
		<AppSafeArea>
			<ScrollView w={"100%"}>
				<VStack space={Sizes.spacing} m={"2.5%"}>
					{ notices && <AlertBanner /> }
					<Toolbar config={toolbarConfig} />
					<VStack pb={"2.5%"} space={"2"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiaryEdit.headings.personalDetails }</Forms.HeaderItem>
						<VStack space={Sizes.spacing} px={"2.5%"}>
							<Forms.TextInput
								name={ "firstname" }
								control={ control }
								rules={ validationRulesBeneficiaryEdit.firstname }
								errors={ formState.errors.firstname }
								label={ language.beneficiaryEdit.labels.firstName }
								placeholder={ language.beneficiaryEdit.placeholders.firstName }
								required={true}
							/>
							<Forms.TextInput
								name={ "lastname" }
								control={ control }
								rules={ validationRulesBeneficiaryEdit.lastname }
								errors={ formState.errors.lastname }
								label={ language.beneficiaryEdit.labels.lastName }
								placeholder={ language.beneficiaryEdit.placeholders.lastName }
								required={true}
							/>
							<Forms.TextInput
								name={ "thainame" }
								control={ control }
								errors={ formState.errors.thainame }
								label={ language.beneficiaryEdit.labels.thaiName }
								placeholder={ language.beneficiaryEdit.placeholders.thaiName }
								required={false}
							/>
							<Forms.TextInput
								name={ "phone" }
								control={ control }
								rules={ validationRulesBeneficiaryEdit.phone }
								errors={ formState.errors.phone }
								label={ language.beneficiaryEdit.labels.phone }
								placeholder={ language.beneficiaryEdit.placeholders.phone }
								required={false}
							/>
						</VStack>
					</VStack>
					<VStack pb={"2.5%"} space={"2"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiaryEdit.headings.bankDetails }</Forms.HeaderItem>
						<VStack space={Sizes.spacing} px={"2.5%"}>	
							<Forms.TextInput
								name={ "accountnumber" }
								control={ control }
								rules={ validationRulesBeneficiaryEdit.accountnumber }
								errors={ formState.errors.accountnumber }
								label={ language.beneficiaryEdit.labels.accountNumber }
								placeholder={ language.beneficiaryEdit.placeholders.accountNumber }
								required={true}
							/>
							<Forms.SelectInput
								name={ "accounttype" }
								control={ control }
								component={"AccountType"}
								rules={ validationRulesBeneficiaryEdit.accounttype }
								errors={ formState.errors.accounttype }
								label={ language.beneficiaryEdit.labels.accountType }
								placeholder={ language.beneficiaryEdit.placeholders.accountType }
								required={true}
								context={"Beneficiaries"}
							/>
							<Forms.SelectInput
								name={ "bankname" }
								control={ control }
								component={"BankName"}
								rules={ validationRulesBeneficiaryEdit.bankname }
								errors={ formState.errors.bankname }
								label={ language.beneficiaryEdit.labels.bankName }
								placeholder={ language.beneficiaryEdit.placeholders.bankName }
								required={true}
								context={"Beneficiaries"}
							/>
							<Forms.TextInput
								name={ "branchname" }
								control={ control }
								rules={ validationRulesBeneficiaryEdit.branchname }
								errors={ formState.errors.branchname }
								label={ language.beneficiaryEdit.labels.branchName }
								placeholder={ language.beneficiaryEdit.placeholders.branchName }
								required={true}
							/>
							<Forms.SelectInput
								name={ "branchcity" }
								control={ control }
								component={"BranchCity"}
								rules={ validationRulesBeneficiaryEdit.branchcity }
								errors={ formState.errors.branchname }
								label={ language.beneficiaryEdit.labels.branchCity }
								placeholder={ language.beneficiaryEdit.placeholders.branchCity }
								required={true}
								context={"Beneficiaries"}
							/>
						</VStack>
					</VStack>
					<VStack pb={"4"} space={"2"} bgColor={"white"} rounded={"8"}>
						<Forms.HeaderItem nb={{roundedTop: "8"}}>{ language.beneficiaryEdit.headings.addressDetails }</Forms.HeaderItem>
						<VStack space={Sizes.spacing} px={"2.5%"}>
							<Forms.TextInput
								name={ "address" }
								control={ control }
								rules={ validationRulesBeneficiaryEdit.address }
								errors={ formState.errors.address }
								label={ language.beneficiaryEdit.labels.thaiAddress }
								placeholder={ language.beneficiaryEdit.placeholders.thaiAddress }
								required={true}
							/>
							<Forms.SelectInput
								name={ "state" }
								control={ control }
								component={"Province"}
								rules={ validationRulesBeneficiaryEdit.state }
								errors={ formState.errors.state }
								label={ language.beneficiaryEdit.labels.province }
								placeholder={ language.beneficiaryEdit.placeholders.province }
								required={true}
								context={"Beneficiaries"}
							/>
							<Forms.SelectInput
								name={ "city" }
								control={ control }
								component={"District"}
								rules={ validationRulesBeneficiaryEdit.city }
								errors={ formState.errors.city }
								label={ language.beneficiaryEdit.labels.district }
								placeholder={ language.beneficiaryEdit.placeholders.district }
								required={true}
								context={"Beneficiaries"}
							/>
							<Forms.TextInput
								name={ "postcode" }
								control={ control }
								rules={ validationRulesBeneficiaryEdit.postcode }
								errors={ formState.errors.postcode }
								label={ language.beneficiaryEdit.labels.postCode }
								placeholder={ language.beneficiaryEdit.placeholders.postCode }
								required={true}
							/>
							<Forms.TextInput
								name={ "country" }
								control={ control }
								errors={ formState.errors.country }
								label={ language.beneficiaryEdit.labels.country }
								placeholder={ language.beneficiaryEdit.placeholders.country }
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