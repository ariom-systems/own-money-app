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
        lang: 'en-AU',
        extra: null
    }
    
    const [auth, authDispatch] = React.useReducer(authReducer, authInitialState);

    return (
        <AuthContext.Provider value={{ auth, authDispatch }}>
            {children}
        </AuthContext.Provider>
    )
}