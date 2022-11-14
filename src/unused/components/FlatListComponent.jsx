import React from 'react'
import { FlatList } from 'native-base'
import AlertMessage from './AlertMessage'



export default function FlatListComponent({ data, renderItem, keyExtractor, contentContainerStyle, getItemLayout }) {
	if (data.length !== 0) {
		return (
			<FlatList
				w={"100%"}
				data={data}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				contentContainerStyle={contentContainerStyle}
				getItemLayout={getItemLayout} />
		)
	} else {
		return (
			<AlertMessage message={"No Recent Transfers Found"} />
		)
	}
}