import React, { useContext, useEffect } from 'react'

//components
import { useNavigation } from '@react-navigation/native';
import AppSafeArea from '../../../components/common/AppSafeArea';
import LoadingOverlay from '../../../components/common/LoadingOverlay'

//data
import { AuthContext} from '../../../data/Context'
import { api } from '../../../config'
import { buildDataPath, atomRemoveItemAtIndex } from '../../../data/Actions'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { beneficiaryList, beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { loadingState } from '../../../data/recoil/system'

export default function BeneficiariesDelete() {
	const navigation = useNavigation()
	const { auth, authDispatch } = useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = useRecoilState(beneficiaryList)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const resetBeneficiary = useResetRecoilState(beneficiaryObj)
	const loading = useRecoilValue(loadingState)

	useEffect(() => {
		api.delete(buildDataPath('beneficiaries', auth.uid, 'delete', { id: Number.parseInt(beneficiary.id) }))
		.then(response => {
			if (response.data == true) {
				let newList = atomRemoveItemAtIndex(beneficiaries, beneficiary.index)
				setBeneficiaries(newList)
				resetBeneficiary()
				authDispatch({ type: 'SET_STATUS', payload: { data: 'beneficiaryDeleted' }})
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