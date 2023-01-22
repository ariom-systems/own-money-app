import React, { useContext, useEffect } from 'react'

//components
import { useNavigation } from '@react-navigation/native';
import AppSafeArea from '../../../components/common/AppSafeArea';
import LoadingOverlay from '../../../components/common/LoadingOverlay'

//data
import { useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil'
import { AuthContext} from '../../../data/Context'
import { getNotice } from '../../../data/handlers/Status';
import { api } from '../../../config'
import { buildDataPath, atomRemoveItemAtIndex } from '../../../data/Actions'
import { beneficiaryList, beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { loadingState, noticeState, langState } from '../../../data/recoil/system'

export default function BeneficiariesDelete() {
	const navigation = useNavigation()
	const { auth } = useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = useRecoilState(beneficiaryList)
	const resetBeneficiary = useResetRecoilState(beneficiaryObj)
	const setNotices = useSetRecoilState(noticeState)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const loading = useRecoilValue(loadingState)
	const lang = useRecoilValue(langState)

	useEffect(() => {
		api.delete(buildDataPath('beneficiaries', auth.uid, 'delete', { id: Number.parseInt(beneficiary.id) }))
		.then(response => {
			if (response.data == true) {
				let newList = atomRemoveItemAtIndex(beneficiaries, beneficiary.index)
				setBeneficiaries(newList)
				resetBeneficiary()
				setNotices((prev) => ([...prev, getNotice('beneficiaryDeleted', lang)]))
				navigation.navigate('BeneficiariesList')
			}
		})
	},[beneficiary.id])

	return (
		<AppSafeArea>
			{ loading.status && <LoadingOverlay /> }
		</AppSafeArea>
	)
}