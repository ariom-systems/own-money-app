import React from 'react'
import FocusRender from 'react-navigation-focus-render'
import { Center, Divider, Fab, Factory, StatusBar, VStack } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import ListSwipeItem from '../../../components/beneficiaries/ListSwipeItem'
import ListSwipeHiddenItem from '../../../components/beneficiaries/ListSwipeHiddenItem'
import Spinner from '../../../components/common/Spinner'

import { AuthContext, DataContext } from '../../../data/Context'
import { Notice } from '../../../components/common/Notice'

import * as Recoil from 'recoil'
import * as Atoms from '../../../data/recoil/Atoms'

const NBIonicon = Factory(Ionicon)

const BeneficiariesList = ({navigation}) => {
	const { auth } = React.useContext(AuthContext)
	const beneficiaries = Recoil.useRecoilValue(Atoms.beneficiaries)
	const loading = Recoil.useRecoilValue(Atoms.loading)

	return (
		<>	
			{ loading.status && <Spinner /> }
			<StatusBar barStyle={"dark-content"}/>
			<Center flex={1} justifyContent={"center"}>
				<VStack flex="1" w={"100%"} justifyContent={"flex-start"}>
					{ (auth.status !== null && auth.status !== "") && <Notice /> }
					<FocusRender>
						<SwipeListView
							data={beneficiaries.list}
							renderItem={(item, rowMap) => <ListSwipeItem data={item} rowMap={rowMap} navigation={navigation} />}
							renderHiddenItem={(item, rowMap) => <ListSwipeHiddenItem data={item} rowMap={rowMap} navigation={navigation}  />}
							rightOpenValue={-160}
							previewRowKey={'0'}
							previewOpenValue={0}
							previewOpenDelay={3000}
							ItemSeparatorComponent={<Divider />}
							keyExtractor={item => item.id}
							getItemLayout={(item, index) => {
								return { length: 80, offset: 80 * index, index }
							}}
							initialNumToRender={20}
							maxToRenderPerBatch={20}
							removeClippedSubviews={false}
							/>
					</FocusRender>
					<Fab
						renderInPortal={false}
						placement={"bottom-right"}
						shadow={"2"}
						backgroundColor={"primary.400"}
						icon={<Ionicon color={"#FFFFFF"} name={"add"} size={24} />}
						onPress={() => navigation.navigate('BeneficiariesAdd')}/>
				</VStack>
			</Center>
		</>						
	)
}

export default BeneficiariesList