import React, { createContext, useReducer } from 'react';
import { authReducer } from './Reducer'

export const AuthContext = createContext()

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
    
    const [auth, authDispatch] = useReducer(authReducer, authInitialState);

    return (
        <AuthContext.Provider value={{ auth, authDispatch }}>
            {children}
        </AuthContext.Provider>
    )
}