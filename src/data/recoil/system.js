import { atom } from 'recoil'

export const globalState = atom({
	key: 'globals',
	default: {
		rate: 0,
		steps: {},
		lastDailyLimitReset: 0
	}
})

export const loadingState = atom({
	key: 'loading',
	default: {
		status: false,
		type: "loading"
	}
})

export const noticeState = atom({
	key: 'notices',
	default: []
})

export const profileNavState = atom({
	key: 'profileNav',
	default: false
})

export const langState = atom({
	key: 'langstate',
	default: 'en-AU'
})