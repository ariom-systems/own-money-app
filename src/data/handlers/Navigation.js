import * as React from 'react'
import { createNavigationContainerRef, CommonActions } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
	if (navigationRef.isReady()) {
		navigationRef.navigate(name, params)
	}
}

export function reset() {
	if(navigationRef.isReady()) {
		navigationRef.reset()
	}
}
