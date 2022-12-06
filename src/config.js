import React, { useContext } from 'react';
import { extendTheme } from 'native-base';
import { DefaultTheme } from '@react-navigation/native';
import { border } from 'native-base/lib/typescript/theme/styled-system';
import { create } from 'apisauce'
import Config from 'react-native-config';

export const api = create({
	baseURL: Config.BASEURL + '/' + Config.APIVERSION + '/',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	timeout: 5000
})

//no idea where else to put this
export const beneficiaryColumns = [
	"id",
	"id_users",
	"firstname",
	"lastname",
	"thainame",
	"phone",
	"accountnumber",
	"accounttype",
	"bankname",
	"branchname",
	"branchcity",
	"address",
	"state",
	"city",
	"postcode",
	"country",
	"status" 
]

export const NativeBaseTheme = extendTheme({
	colors: {
		primary: {
			50: '#FCF5E1',
			100: '#F0E0BF',
			200: '#E3CB9A',
			300: '#D8B674',
			400: '#CDA14D',
			500: '#B38834',
			600: '#8B6A27',
			700: '#644B1B',
			800: '#3D2D0D',
			900: '#180E00'
		}
	},
	config: {
		//initialColorMode: 'dark'
	},
	components: {
		Button: {
			variants: {
				outline: () => ({
					_text: {
						color: 'primary.600'
					},
					_light: {
						borderColor: 'primary.600'
					},
					borderWidth: '1px',
				}),
				subtle: () => ({
					_light: {
						borderColor: 'primary.600'
					},
					borderWidth: '1px'
				})
			}
		}
	}
})

export const ReactNavigationThemeDark = {
	dark: true,
	colors: {
		primary: '#FFFFFF',
		background: '#180E00',
		text: '#FCF5E1'
	}
}

export const ReactNavigationThemeDefault = {
	...DefaultTheme,
	colors: {
		
	}
}