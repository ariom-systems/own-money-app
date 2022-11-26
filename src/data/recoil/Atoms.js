import { atom } from 'recoil'

export const globals = atom({
	key: 'globals',
	default: {
		rate: 0,
		fee: 0,
		steps: {},
		lang: 'en-AU'
	}
})

export const user = atom({
	key: 'user',
	default: {
		uid: '',
		firstname: '',
		middlename: '',
		lastname: '',
		nickname: '',
		phone: '',
		email: '',
		dateofbirth: '',
		occupation: '',
		address: '',
		city: '',
		state: '',
		postcode: '',
		country: '',
		date_regis: '',
		date_regis_completed: '',
		memberid: '',
		daily_limit_max: '',
		daily_limit_remaining: '',
		level: '',
		id_branches: '',
		knowus: '',
		referrer: '',
		firsttime_rate: '',
		notice_show: '',
		notice_seen_date: '',
		email_sent: '',
		onetime_promo: '',
		onetime_credit: '',
		general_promo: '',
		general_credit: '',
		comments: '',
		comments_date: '',
		commentor: '',
		logins: []
	}
})

export const beneficiaries = atom({
	key: 'beneficiaries',
	default: {
		add: {},
		edit: {},
		view: {},
		list: []
	}
})

export const transactions = atom({
	key: 'transactions',
	default: {
		add: {
			amountAUD: 0,
			amountTHB: 0,
			rate: 0,
			today_rate: 0,
			fee_AUD: 0,
			limit_remaining: 0,
			id_receivers: '',
			receiver: '',
			accountnumber: '',
			branchname: '',
			step: 0,
			id_users: '',
			purpose: '',
			termandconditions: ''
		},
		view: 0,
		timestamp: 0,
		list: []
	}
})

export const loading = atom({
	key: 'loading',
	default: {
		status: false,
		text: "loading"
	}
})