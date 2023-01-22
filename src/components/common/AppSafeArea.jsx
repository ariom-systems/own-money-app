import React from 'react'

//components
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ImageBackground } from 'react-native'
import FocusRender from 'react-navigation-focus-render'
import { KeyboardAvoidingView, StatusBar, View } from 'native-base'
import LoadingOverlay from './LoadingOverlay'

//data
import { useRecoilValue } from 'recoil'
import { loadingState } from '../../data/recoil/system'

//lang
import LocalizedStrings from 'react-native-localization'
const auStrings = require('../../i18n/en-AU.json')
const thStrings = require('../../i18n/th-TH.json')
let language = new LocalizedStrings({ ...auStrings, ...thStrings })

const AppSafeArea = ({styles, children}) => {
	const insets = useSafeAreaInsets()
	const loading = useRecoilValue(loadingState)

	return (
		<KeyboardAvoidingView>
			{ loading.status && <LoadingOverlay /> }
			<ImageBackground source={require("../../assets/img/app_background.jpg")} style={{ width: '100%', height: '100%' }} resizeMode={"cover"}>
				<StatusBar barStyle={"dark-content"} />
				<View pl={insets.left} pr={insets.right} {...styles}>
					<FocusRender>
						{children}
					</FocusRender>
				</View>
			</ImageBackground>
		</KeyboardAvoidingView>
	)
}

export default AppSafeArea
