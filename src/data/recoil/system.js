import { atom } from 'recoil'

export const globalState = atom({
	key: 'globals',
	default: {
		rate: 0,
		fee: 0,
		steps: {},
		lang: 'en-AU',
		sinceLastLogin: 0,
	}
})

export const loadingState = atom({
	key: 'loading',
	default: {
		status: false,
		text: "loading"
	}
})