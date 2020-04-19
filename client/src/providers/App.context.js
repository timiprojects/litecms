import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import conf from '../config/conf';
import { useAuth } from './Auth.context';
import { useHistory, useLocation } from 'react-router-dom';
import decoder from 'jwt-decode';
import useGet from '../hooks/useGet';


export const AppContext = React.createContext(null)

export const isToken = () => {
    return localStorage.getItem(conf.cmstoken);
}

const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useUser can only be used inside UserProvider');
    }
    return context;
}

const AppProvider = ({ children }) => {

    const { push } = useHistory()
    const location = useLocation()
    const { auth } = useAuth()
    const [time, setTime] = useState(null)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const token = localStorage.getItem(conf.cmstoken)

    //make changes from other pages and reflect here
    const _setPage = useCallback((object) => setPage(object), [])
    const _setLimit = useCallback((object) => setLimit(object), [])

    useEffect(() => {
        let mounted = true
        if(mounted){
            if (token) {
                const decoded = decoder(token)
                const time = parseInt(decoded.exp)
                setTime(time)
            }
        }
        return () => mounted = false;
    }, [token])

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if (time && time < Math.floor((new Date().getTime() + 1) / 1000)) {
                localStorage.clear()
                push(conf.routes.login)
            }
        }
        return () => mounted = false;
    }, [push, time, token, location])

    
    const [users, setUsers] = useState()

    const [count, setCount] = useState()

    const [categories, setCategories] = useState()

    const [fetchUsers, usersResp] = useGet('/auth/all', 'get')

    const [fetchCount, countResp] = useGet('/auth/counts', 'get')

    const [fetchCat, catResp] = useGet('/posts/getcat', 'get')

    useEffect(() => {
        let mounted = true
        if(mounted) {
            fetchCount()
            fetchCat()
        }

        return () => mounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        let mounted = true
        if(mounted) {
            fetchUsers()
        }

        return () => mounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if(token && auth) {
                if(countResp) {
                    setCount(countResp.data)
                }

                if(usersResp) {
                    setUsers(usersResp.data)
                }

                if(catResp) {
                    setCategories(catResp.data)
                }
            }
        }

        return () => mounted = false
    }, [token, auth, countResp, usersResp, catResp])

    let appValue = useMemo(() => ({
        auth,
        _setPage,
        _setLimit,
        page,
        limit,
        count,
        users,
        categories
    }), [auth, _setPage, _setLimit, page, limit, count, users, categories])

    return (
        <AppContext.Provider value={appValue}>
            {children}
        </AppContext.Provider>
    )
}

export {
    AppProvider,
    useApp
}