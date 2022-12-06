import { atom } from 'recoil'

export const transactionObj = atom({
	key: 'transactionObj',
	default: {}
})

export const transactionList = atom({
	key: 'transactionList',
	default: [],
	effects_UNSTABLE: [
		({ setSelf, onSet}) => {
			onSet((newVal, oldVal) => {
				console.log("transactionList onSet", newVal.length, oldVal.length)
			})
		}
	]
})