export const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STATUS':
            return {
                ...state,
                status: action.payload.data
            }
        break
        case 'CLEAR_STATUS':
            return {
                ...state,
                status: null
            }
        break
        case 'LOADING':
            return {
                ...state,
                loading: action.payload.data
            }
        break
        case 'LOGOUT':
            return {
                ...state,
                uid: 0,
                email: null,
                token: null,
                loading: false,
                expire: 0,
            }
        break
        case 'LOGIN':
            return {
                ...state,
                uid: action.payload.uid,
                email: action.payload.email,
                token: action.payload.token,
                expire: action.payload.expire,
                loading: false
            }
        break
        case 'SET_PIN': 
            return {
                ...state,
                pin: action.payload.data
            }
        break
        case 'RESET_PIN':
            return {
                ...state,
                pin: null
            }
        break
        case 'SET_LANG':
            return {
                ...state,
                lang: action.payload.lang
            }
        default:
            return {...state}
    }
}

export const dataReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_GLOBALS':
            return {
                ...state,
                globals: action.payload.data
            }
        break
        case 'LOAD_USER':
            return {
                ...state,
                user: action.payload.data
            }
        break
        case 'LOAD_USER_META':
            return {
                ...state,
                userMeta: action.payload.data
            }
        breakr
        case 'LOAD_BENEFICIARIES':
            return {
                ...state,
                beneficiaries: action.payload.data
            }
        break
        case 'LOAD_TRANSACTIONS':
            return {
                ...state,
                transactions: action.payload.data,
                transactionTimestamp: action.payload.index,
                transactionTimestampLast: action.payload.last,
                transactionCount: action.payload.count
            }
        break
        case 'LOAD_LATEST':
            return {
                ...state,
                transactionLatest: action.payload.data,
            }
        break
        case 'SET_BENEFICIARY':
            return {
                ...state,
                beneficiaryCurrent: action.payload.data
            }
        break
        case 'CLEAR_BENEFICIARY':
            return {
                ...state,
                beneficiaryCurrent: []
            }
        break
        case 'UPDATE_REMAINING':
            return {
                ...state,
                userMeta: {
                    ...state.userMeta,
                    daily_limit: action.payload.data
                }
            }
        break
        case 'UNLOAD_DATA':
            return {
                beneficiaries: [],
                beneficiaryCurrent: [],
                globals: [{ rate: 0 }],
                loading: false,
                status: null,
                transactionCount: 0,
                transactionLatest: [],
                transactionTimestamp: 0,
                transactionTimestampLast: 0,
                transactions: [],
                user: [],
                userMeta: []
            }
        break
        default:
            return {...state}
        break
    }
}

export const transferReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STEP_ONE':
            return {
                ...state,
                reset: false,
                stepOne: {
                    aud: action.payload.aud,
                    thb: action.payload.thb,
                    fee: action.payload.fee,
                    rate: action.payload.rate
                }
            }
        break
        case 'SET_STEP_TWO':
            return {
                ...state,
                stepTwo: {
                    beneficiary: action.payload.data
                }
            }
        break
        case 'SET_STEP_THREE':
            return {
                ...state,
                stepThree: {
                    summary: action.payload.data
                }
            }
        break
        case 'UNLOAD_DATA':
            return {
                reset: false,
                step: 0,
                stepOne: {
                    aud: '',
                    thb: '',
                    fee: '',
                    rate: ''
                },
                stepTwo: {
                    beneficiary: ''
                },
                stepThree: {
                    summary: ''
                }
            }
        break
        case 'RESTART':
            return {
                reset: true,
                step: 0,
                stepOne: {
                    aud: '',
                    thb: '',
                    fee: '',
                    rate: ''
                },
                stepTwo: {
                    beneficiary: ''
                },
                stepThree: {
                    summary: ''
                }
            }
        break
        case 'GO_TO':
            return {
                ...state,
                step: action.payload.step
            }
        break
    }
}