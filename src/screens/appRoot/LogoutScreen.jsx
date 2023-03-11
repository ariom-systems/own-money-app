import React, { useContext, useEffect, memo } from 'react'

//components
import AppSafeArea from '../../components/common/AppSafeArea'
import LoadingSpinner from '../../components/common/LoadingSpinner'

//data
import { AuthContext } from '../../data/Context'
import { useResetRecoilState } from 'recoil'
import { keychain } from '../../config'
import { keychainReset } from '../../data/Actions'
import { userState } from '../../data/recoil/user'
import { globalState} from '../../data/recoil/system'
import { beneficiaryList, beneficiaryObj } from '../../data/recoil/beneficiaries'
import { transactionList, transactionObj } from '../../data/recoil/transactions'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const LogoutScreen = () => {
	const { authDispatch } = useContext(AuthContext)
	const resetUser = useResetRecoilState(userState)
	const resetGlobals = useResetRecoilState(globalState)
	const resetBeneficiaries = useResetRecoilState(beneficiaryList)
	const resetBeneficiary = useResetRecoilState(beneficiaryObj)
	const resetTransactions = useResetRecoilState(transactionList)
	const resetTransaction = useResetRecoilState(transactionObj)

	useEffect(() => {
		resetUser()
		resetGlobals()
		resetBeneficiaries()
		resetBeneficiary()
		resetTransactions()
		resetTransaction()

		authDispatch({ type: 'SET_STATUS', payload: { data: 'logout' }}) //leave this here
		authDispatch({ type: 'LOGOUT'})
		const reset = keychainReset(keychain.token)
	},[])


	return (
		<AppSafeArea styles={{ w: "100%", h: "100%", alignItems: "center", justifyContent: "center" }}>
			<LoadingSpinner message={language.unloading.title} subtitle={language.unloading.subtitle} />
		</AppSafeArea>
	)
}

export default memo(LogoutScreen)