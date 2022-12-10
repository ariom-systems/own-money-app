import { atom } from 'recoil'

export const globalState = atom({
	key: 'globals',
	default: {
		rate: 0,
		steps: {},
		lang: 'en-AU',
		lastDailyLimitReset: 0
	}
})

export const loadingState = atom({
	key: 'loading',
	default: {
		status: false,
		text: "loading"
	}
})