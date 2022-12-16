import React from 'react'
import { ImageBackground } from 'react-native'
import FocusRender from 'react-navigation-focus-render'
import { Center, Divider, Fab, StatusBar, VStack } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()
import ListSwipeItem from '../../../components/beneficiaries/ListSwipeItem'
import ListSwipeHiddenItem from '../../../components/beneficiaries/ListSwipeHiddenItem'

import { AuthContext} from '../../../data/Context'
import { Notice } from '../../../components/common/Notice'

import { useRecoilState } from 'recoil'
import { loadingState } from '../../../data/recoil/system'
import { beneficiaryList } from '../../../data/recoil/beneficiaries'

const BeneficiariesList = ({navigation}) => {
	const { auth } = React.useContext(AuthContext)
	const [ beneficiaries, setBeneficiaries ] = useRecoilState(beneficiaryList)
	const [ loading, setLoading ] = useRecoilState(loadingState)

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			setLoading({ status: false, text: "" })
		})
		return unsubscribe
	},[navigation, beneficiaries])

	return (
		<ImageBackground source={require("../../../assets/img/app_background.jpg")} style={{width: '100%', height: '100%'}} resizeMode={"cover"}>
			<StatusBar barStyle={"dark-content"}/>
			<Center flex={1} justifyContent={"center"}>
				<VStack flex="1" w={"100%"} px={"2.5%"} py={"5%"} justifyContent={"flex-start"}>
					{ (auth.status !== null && auth.status !== "") && (
						<Notice nb={{w:"100%", mb: "4"}} />
					)}
					<FocusRender>
						<SwipeListView
							data={beneficiaries}
							renderItem={(item, rowMap) => <ListSwipeItem data={item} rowMap={rowMap} navigation={navigation} /> }
							renderHiddenItem={(item, rowMap) => <ListSwipeHiddenItem data={item} rowMap={rowMap} navigation={navigation}  />}
							rightOpenValue={-160}
							previewRowKey={'0'}
							previewOpenValue={0}
							previewOpenDelay={3000}
							ItemSeparatorComponent={<Divider />}
							keyExtractor={(item, index) => item + index }
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
		</ImageBackground>				
	)
}

export default BeneficiariesList