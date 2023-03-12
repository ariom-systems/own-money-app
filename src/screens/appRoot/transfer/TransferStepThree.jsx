import React, { useContext, useEffect, useRef, memo } from 'react'

//components
import { useNavigation } from '@react-navigation/native'
import AppSafeArea from '../../../components/common/AppSafeArea'
import { Box, Divider, Heading, SectionList, Text, VStack } from 'native-base'
import TransferStepIndicator from '../../../components/transfers/TransferStepIndicator'
import * as Forms from '../../../components/common/Forms'
import Toolbar from '../../../components/common/Toolbar'
import AlertBanner from '../../../components/common/AlertBanner'
import DetailRowItem from '../../../components/transfers/DetailRowItem'
import ListHeader from '../../../components/common/ListHeader'

//data

import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { atom, useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { useForceUpdate } from '../../../data/Hooks'
import { AuthContext } from '../../../data/Context'
import { api, validationRulesTransferStepThree, transferStepThreeToolbarConfig, TransferStepThreeTemplate, TransferObjFormats, Sizes } from '../../../config'
import { buildDataPath, mapActionsToConfig, mapPropertiesToConfig, localiseObjectData, mapSectionDataFromTemplate } from '../../../data/Actions'
import { getNotice } from '../../../data/handlers/Status'
import { stepAtom, transferAtom, promoAtom, stepThreeButtonAtom } from '../../../data/recoil/transfer'
import { loadingState, noticeState, langState } from '../../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../../i18n/en-AU.json')
const thStrings = require('../../../i18n/th-TH.json')
let language = new LocalizedStrings({...auStrings, ...thStrings})

const fieldState = atom({
	key: 'fields',
	default: { purpose: '', terms: false }
})

const TransferStepThree = () => {
	const transfer = useRecoilValue(transferAtom)
	const methods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		defaultValues: {
			id_users: transfer.id_users,
			id_receivers: transfer.id_receivers,
			fee_AUD: transfer.fees,
			rate: Number(transfer.yourrate).toFixed(2),
			today_rate: Number(transfer.todayrate).toFixed(2),
			sender: transfer.sender,
			receiver: transfer.receiver,
			accountnumber: transfer.accountnumber,
			bankname: transfer.bankname,
			transfer_amount: transfer.amounttosend,
			totalsend: transfer.totaltopay,
			received_amount: transfer.receivableamount,
			purpose: '',
			termsandconditions: false,
			promoUsed: false
		}
	})

	return (
		<FormProvider {...methods}>
			<TransferStepThreeInner />
		</FormProvider>
	)

}

export default memo(TransferStepThree)

const TransferStepThreeInner = () => {
	const navigation = useNavigation()
	const forceUpdate = useForceUpdate()
	const { control, register, handleSubmit, watch, setValue, formState: { errors }} = useFormContext()
	const { auth } = useContext(AuthContext)
	const [ loading, setLoading ] = useRecoilState(loadingState)
	const [ buttonState, setButtonState ] = useRecoilState(stepThreeButtonAtom)
	const [ transfer, setTransfer ] = useRecoilState(transferAtom)
	const [ fields, setFields ] = useRecoilState(fieldState)
	const [ notices, setNotice ] = useRecoilState(noticeState)
	const setStep = useSetRecoilState(stepAtom)
	const promo = useRecoilValue(promoAtom)
	const lang = useRecoilValue(langState)

	const actions = [
		() => handlePrevious(),null,
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

	const properties = [{}, {}, { isDisabled: buttonState }]
	let toolbarConfig = mapActionsToConfig(transferStepThreeToolbarConfig, actions)
	toolbarConfig = mapPropertiesToConfig(toolbarConfig, properties)

	let labels = language.transferStepthree.labels
	let headings = language.transferStepthree.headings
	let localisedData = localiseObjectData(transfer, TransferObjFormats, lang)
	let sections = mapSectionDataFromTemplate(TransferStepThreeTemplate, localisedData, labels, headings)

	useEffect(() => {
		if(language.getLanguage() !== lang) {
			language.setLanguage(lang)
			navigation.setOptions()
			forceUpdate()
		}
	}, [language, lang])
	
	useEffect(() => {
		const purposeState = watch((value) => { 
			setFields((prev) => ({
				...prev,
				purpose: value.purpose,
				terms: value.termsandconditions
			}))
		})
		if (errors.purpose || errors.termsandconditions) {
			setButtonState(true)
		} else if (fields.purpose == "" || fields.terms == false) {
			setButtonState(true)
		} else {
			setButtonState(false)
		}
		return () => purposeState.unsubscribe()
	}, [watch, fields])

	const onSubmit = (data) => {
	
		if(promo.value > 0) {
			register('promoUsed', { required: false })
			data.promoUsed = true
			data.promoID = promo.id
			data.promoName = promo.name
			data.promoValue = promo.value
			data.promoLimit = promo.limit
			
			setTransfer((prev) => ({
				...prev,
				promoUsed: true,
				promoID: promo.id,
				promoName: promo.name,
				promoValue: promo.value,
				promoLimit: promo.limit
			}))
			setValue('usedPromo', true)
		}

		try {
			api.post(buildDataPath('transactions', auth.uid, 'add'), JSON.stringify(data))
			.then(response => {
				if (response.ok == true) {
					if(response.data == true) {
						navigation.navigate('TransferStepFour')
						setNotice([getNotice('transferRequested', lang)])
						setStep(3)
						setLoading({ status: false, message: 'none' })
					}
				}
			})
		} catch (error) {
			console.error("onSubmit:", error)
			setLoading({ status: false, message: 'none' })
		}
	}

	const onError = (error) => {
		console.log(error)
		setLoading({ status: false, message: 'none' })
	}

	const handlePrevious = () => {
		setStep(1)
		navigation.goBack()
	}

	return (
		<AppSafeArea>
			<SectionList
				sections={sections.map((section, index) => ({...section, index}))}
				renderItem={({ item, index, section }) => <DetailRowItem item={item} index={index} section={section} sectionCount={sections.length} />}
				renderSectionHeader={({ section }) => <ListHeader title={section.title} index={section.index} />}
				ItemSeparatorComponent={() => <Divider />}
				showsVerticalScrollIndicator={false}
				stickySectionHeadersEnabled={false}
				contentContainerStyle={{ padding: "2.5%", justifyContent: "flex-start"}}
				ListHeaderComponent={() => (
					<VStack space={Sizes.spacing}>
						{notices && <AlertBanner />}
						<VStack bgColor={"white"} roundedTop={"8"} p={"2.5%"}>
							<TransferStepIndicator />
							<Box>
								<Text>{language.transferStepthree.ui.titleTop}</Text>
							</Box>
						</VStack>
					</VStack>
				)}
				ListFooterComponent={() => (
					<VStack space={Sizes.spacing}>
						<VStack bgColor={"white"} roundedBottom={"8"}>
							<Heading fontSize={"md"} p={"4"} textAlign={"center"}>{language.transferStepthree.ui.pleaseComplete}</Heading>
							<Forms.SelectInput
								name={"purpose"}
								control={control}
								component={"Purpose"}
								rules={validationRulesTransferStepThree.purpose}
								errors={errors.purpose}
								label={language.transferStepthree.labels.purpose}
								placeholder={language.transferStepthree.placeholders.purpose}
								required={true}
								context={"Transfers"}
								labelStyles={{ fontSize: "md", color: "coolGray.500", flexGrow: "1", mb: "2" }}
								blockStyles={{ mb: "4", px: "4" }}
							/>
							<Forms.CheckInput
								name={"termsandconditions"}
								control={control}
								required={true}
								rules={validationRulesTransferStepThree.terms}
								errors={errors.termsandconditions}
								label={language.transferStepthree.labels.terms}
								labelStyles={{ fontSize: "xs", mt: "-0.5", ml: "2", w: "90%" }}
								blockStyles={{ pb: "4", pl: "4" }}
							/>
						</VStack>
						<Toolbar config={toolbarConfig} />
					</VStack>
				)}
			/>
		</AppSafeArea>
	)
}