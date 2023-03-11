import { atom } from 'recoil'

export const userState = atom({
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
		logins: [],
		img_name: '',
		created_date: '',
		idtype: '',
		idnumber: '',
		idexpiry: '',
		idissuer: '',
		blocked: false,
		preventTransfer: false
	}
})

export const imageState = atom({
	key: 'image',
	default: ""
})