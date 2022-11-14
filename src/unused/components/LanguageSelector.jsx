import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LanguageSelector = (props) => {
	const [selection, setSelection] = useState(1);
	return (
		<SafeAreaView style={ styles.container}>
			<View style={styles.btnGroup}>
				<TouchableOpacity style={[styles.btn, styles.btnLeft, selection === 1 ? {backgroundColor:'#a87e2d'} : null]} onPress={() => setSelection(1)}>
					<Text style={[styles.btnText, selection === 1 ? {color:'#FFF'} : null]}>English</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.btn, styles.btnRight, selection === 2 ? {backgroundColor:'#a87e2d'} : null]} onPress={() => setSelection(2)}>
					<Text style={[styles.btnText, selection === 2 ? {color:'#FFF'} : null]}>Thai</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	btnGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		
		borderRadius: 10,
	},
	btn: {
		flex: 1,
		borderRightWidth: 0.25,
		borderLeftWidth: 0.25,
		borderBottomWidth: 1,
		borderBottomColor: '#a87e2d',
		borderTopWidth: 1,
		borderTopColor: '#a87e2d',
	},
	btnText: {
		textAlign: 'center',
		paddingVertical: 5,
		fontSize: 14
	},
	btnLeft: {
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
	},
	btnRight: {
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
	}

})

//export default LanguageSelector