import { useRecoilValue, atom, selector } from 'recoil'
import { globalState } from './system'
import { userState } from './user'
import { modifyTransferVariables } from '../Actions'

export const stepAtom = atom({
	key: 'step',
	default: 0
})

export const audAtom = atom({
	key: 'aud',
	default: 0
})

export const thbSelector = selector({
	key: 'thb',
	get: ({get}) => {
		const [aud, globals] = [get(audAtom), get(globalState)]
		return aud * globals.rate
	},
	set: ({get, set}, newThbValue) => {
		const globals = get(globalState)
		const newAudValue = newThbValue / globals.rate
		set(audAtom, newAudValue)
	}
})

export const feeSelector = selector({
	key: 'fee',
	get: ({get}) => {
		const [aud, globals] = [get(audAtom), get(globalState)]
		let modifier = modifyTransferVariables(aud, globals.steps.feeModifier)
		return modifier
	}
})

export const rateSelector = selector({
	key: 'rate',
	get: ({get}) => {
		const [aud, globals] = [get(audAtom), get(globalState)]
		let modifier = modifyTransferVariables(aud, globals.steps.rateModifier, globals.rate)
		return modifier
	}
})

export const limitSelector = selector({
	key: 'limit',
	get: ({get}) => {
		const [ aud, user ] = [get(audAtom), get(userState)]
		return Number(user.daily_limit_remaining) - Number(aud)
	} 
})

export const selectedBeneficiaryAtom = atom({
	key: 'selectedBeneficiary',
	default: {}
})

export const stepTwoButtonAtom = atom({
	key: 'stepTwoButton',
	default: true
})