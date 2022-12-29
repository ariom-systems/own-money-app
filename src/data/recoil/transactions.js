import { atom } from 'recoil'

export const transactionObj = atom({
	key: 'transactionObj',
	default: {}
})

export const transactionList = atom({
	key: 'transactionList',
	default: []
})