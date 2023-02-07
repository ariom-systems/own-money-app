export const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STATUS':
            return {
                ...state,
                status: action.payload.data
            }
        break
        case 'SET_STATUS_DETAILED':
            return {
                ...state,
                status: action.payload.data,
                extra: action.payload.extra
            }
        break
        case 'CLEAR_STATUS':
            return {
                ...state,
                status: null,
                extra: null
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
        // case 'SET_PIN': 
        //     return {
        //         ...state,
        //         pin: action.payload.data
        //     }
        // break
        // case 'RESET_PIN':
        //     return {
        //         ...state,
        //         pin: null
        //     }
        // break
        case 'SET_LANG':
            return {
                ...state,
                lang: action.payload.lang
            }
        default:
            return {...state}
    }
}