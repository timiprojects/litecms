import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import conf from '../config/conf';
import { useHistory, useLocation } from 'react-router-dom';
import decoder from 'jwt-decode';



export const AuthContext = React.createContext(null)

export const isToken = () => {
    return localStorage.getItem(conf.cmstoken);
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useUser can only be used inside UserProvider');
    }
    return context;
}

const whiteList = [
    '/auth/login',
    '/auth/register'
]

const AuthProvider = ({ children }) => {

    const token = localStorage.getItem(conf.cmstoken)
    const { push } = useHistory()
    const location = useLocation()

    const [auth, setAuth] = useState({})

    const redirect = useCallback(() => {
        if (!(location.pathname in whiteList)) {
            push(conf.routes.app.dashboard)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const logOut = useCallback(() => {
        localStorage.clear()
        push(conf.routes.login)
    },[push])

    useEffect(() => {
        if(token && auth) {
            //redirect()
        }
    }, [auth, token, redirect])

    useEffect(() => {
        if (!token) {
            push(conf.routes.login)
        }

        if (token) {
            const decoded = decoder(token)
            setAuth(decoded)
        }

    }, [push, token])

    let contextValue = useMemo(() => ({
        auth,
        logOut
    }), [auth, logOut])

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider,
    useAuth
}