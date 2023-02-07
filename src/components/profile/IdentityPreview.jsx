import React, { useEffect, useState } from 'react'

//components
import { Image } from 'react-native'
import { Flex } from 'native-base'

//data
import { useRecoilValue } from 'recoil'
import { userState, imageState } from '../../data/recoil/user'

const IdentityPreview = () => {
	const user = useRecoilValue(userState)
	const image = useRecoilValue(imageState)
	let imageBoxStyle, imageSource

	if(user.img_name != "") {
		imageSource = 'https://ownservices.com.au/Cus_ID_api_test/' + user.img_name
	} else {
		imageSource = image
	}
	
	return (
		<Flex {...imageBoxStyle} w={"100%"} alignItems={"center"} justifyContent={"center"}>
			<Image source={{ uri: imageSource }} alt={"your uploaded image"} style={{ width: 320, height: 195 }} />
		</Flex>
	)
}

export default IdentityPreview
