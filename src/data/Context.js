import React from 'react';
import { authReducer, dataReducer, transferReducer } from './Reducer'

export const AuthContext = React.createContext()

export const AuthProvider = ({children}) => {
    const authInitialState = {
        online: true,
        uid: null,
        email: null,
        token: null,
        pin: null,
        loading: false,
        expire: 0,
        status: null,
        lang: 'en-AU'
    }
    
    const [auth, authDispatch] = React.useReducer(authReducer, authInitialState);

    return (
        <AuthContext.Provider value={{ auth, authDispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export const DataContext = React.createContext()

export const DataProvider = ({children}) => {
    const dataInitialState = {
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

    const [data, dataDispatch] = React.useReducer(dataReducer, dataInitialState);

    return (
        <DataContext.Provider value={{ data, dataDispatch }}>
            {children}
        </DataContext.Provider>
    )
}

export const TransferContext = React.createContext()

export const TransferProvider = ({children}) => {
    const transferInitialState = {
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

    const [transfer, transferDispatch] = React.useReducer(transferReducer, transferInitialState);

    return (
        <TransferContext.Provider value={{ transfer, transferDispatch }}>
            {children}
        </TransferContext.Provider>
    )
}
