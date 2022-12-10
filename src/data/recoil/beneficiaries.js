import { atom } from 'recoil'

export const beneficiaryObj = atom({
	key: 'beneficiaryObj',
	default: {}
})

export const beneficiaryList = atom({
	key: 'beneficiaryList',
	default: [],
	effects_UNSTABLE: [
		({ setSelf, onSet}) => {
			onSet((newVal, oldVal) => {
				//console.log("beneficiaryList onSet", newVal.length, oldVal.length)
			})
		}
	]
})