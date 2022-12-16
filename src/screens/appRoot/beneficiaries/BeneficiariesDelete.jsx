import React from 'react'
import { StatusBar } from 'native-base'
import LoadingOverlay from '../../../components/common/LoadingOverlay'

import { api } from '../../../config'
import { buildDataPath, atomRemoveItemAtIndex } from '../../../data/Actions'
import { AuthContext} from '../../../data/Context'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { beneficiaryList, beneficiaryObj } from '../../../data/recoil/beneficiaries'
import { loadingState } from '../../../data/recoil/system'
import { useNavigation } from '@react-navigation/native';

export default function BeneficiariesDelete() {
	const navigation = useNavigation()
	const { auth, authDispatch } = React.useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = useRecoilState(beneficiaryList)
	const beneficiary = useRecoilValue(beneficiaryObj)
	const resetBeneficiary = useResetRecoilState(beneficiaryObj)
	const loading = useRecoilValue(loadingState)

	React.useEffect(() => {
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
		<>
			{ loading.status && <LoadingOverlay /> }
			<StatusBar barStyle={"dark-content"} />
		</>
	)
}