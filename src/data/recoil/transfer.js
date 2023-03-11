import { useRecoilValue, atom, selector } from 'recoil'
import { globalState } from './system'
import { userState } from './user'
import { findMatchingCriteriaAndModify } from '../Actions'

export const transferAtom = atom({
	key: 'transfer',
	default: {}
})

export const audAtom = atom({
	key: 'aud',
	default: 0
})

export const promoAtom = atom({
	key: 'promo',
	default: {
		id: 0,
		name: '',
		rate: 0,
		limit: 0
	}
})

export const thbSelector = selector({
	key: 'thb',
	get: ({get}) => {
		let [aud, rate] = [get(audAtom), get(rateSelector)]
		return Number(aud * rate).toFixed(2)
	},
	set: ({get, set}, newThbValue) => {
		let rate = get(rateSelector)
		set(audAtom, Number(newThbValue / rate).toFixed(2))
	}
})

export const rateSelector = selector({
	key: 'rate',
	get: ({get}) => {
		let [aud, globals, promo] = [Number(get(audAtom)).toFixed(2), get(globalState), get(promoAtom)]
		let globalRate = findMatchingCriteriaAndModify(aud, globals.steps.rateModifier, globals.rate)
		return (Number(globalRate) + Number(promo.rate)).toFixed(2)
	}
})

export const feeSelector = selector({
	key: 'fee',
	get: ({ get }) => {
		const [aud, globals] = [get(audAtom), get(globalState)]
		let modifier = findMatchingCriteriaAndModify(aud, globals.steps.feeModifier)
		return modifier
	}
})

export const limitSelector = selector({
	key: 'limit',
	get: ({get}) => {
		const [ aud, user, promo ] = [get(audAtom), get(userState), get(promoAtom)]
		return (Number(user.daily_limit_remaining) + Number(promo.limit)) - Number(aud)
	}
})

export const stepAtom = atom({
	key: 'step',
	default: 0
})

export const selectedBeneficiaryAtom = atom({
	key: 'selectedBeneficiary',
	default: {}
})

export const stepOneButtonAtom = atom({
	key: 'stepOneButton',
	default: true
})

export const stepTwoButtonAtom = atom({
	key: 'stepTwoButton',
	default: true
})

export const stepThreeButtonAtom = atom({
	key: 'stepThreeButton',
	default: true
})

export const stepFourButtonAtom = atom({
	key: 'stepFourButton',
	default: true
})