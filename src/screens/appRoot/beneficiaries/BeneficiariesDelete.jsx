import React from 'react'
import { Center, StatusBar, VStack } from 'native-base'
import { AuthContext, DataContext } from '../../../data/Context'
import { buildDataPath } from '../../../data/Actions'
import { api } from '../../../config'
import LoadingOverlay from '../../../components/common/LoadingOverlay'

export default function BeneficiariesDelete({route, navigation}) {
	const { id } = route.params
	const { auth, authDispatch } = React.useContext(AuthContext)
	const { data, dataDispatch } = React.useContext(DataContext)

	React.useEffect(() => {
		api.delete(buildDataPath('beneficiaries', auth.uid, 'delete', { id: Number.parseInt(id) }))
		.then(response => {
			if (response.data == true) {
				const newBeneficiaries = data.beneficiaries.filter(function(obj) {
					return obj.id !== id
				})
				dataDispatch({ type: 'LOAD_BENEFICIARIES', payload: { data: newBeneficiaries }})
				authDispatch({ type: 'SET_STATUS', payload: { data: 'beneficiaryDeleted' }})
				dataDispatch({ type: 'CLEAR_BENEFICIARY' })
				navigation.popToTop('BeneficiariesList')
			}
		})
	},[])

	return (
		<>
			<StatusBar barStyle={"dark-content"} />
			<Center flex={1} justifyContent={"center"}>
				<VStack pt={4} flex="1" w={"100%"} justifyContent={"flex-start"}>
					<LoadingOverlay />
				</VStack>
			</Center>
		</>
	)
}