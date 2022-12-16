import React from 'react'
import { Divider } from 'native-base'
import FlatListItem from './FlatListItem'

const StaticFlatList = (props) => {
	let { data } = props
	let output = []
	data.forEach((item, index) => {
		output.push(<FlatListItem key={index} data={item} />)
		if(index != data.length - 1) {
			output.push(<Divider key={'div_' + index} />)
		}	
	})
	return output
}

export default React.memo(StaticFlatList)