import React, { memo } from 'react'

//components
import { HStack, Text } from 'native-base'

//data
import { Sizes } from '../../config'

const Bullet = ({ children }) => {
	return (
		<HStack space={Sizes.spacing} ml={Sizes.marginSmall}>
			<Text>{'\u2022'}</Text>{children}
		</HStack>
	)
}

export default memo(Bullet)