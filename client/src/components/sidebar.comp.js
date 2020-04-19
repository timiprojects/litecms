import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/Auth.context'
import conf from '../config/conf'

export default () => {

    const { pathname } = useLocation()

    const { logOut, auth } = useAuth()

    const [state, setState] = useState(false)

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if(!(auth.role in conf.roles)) {
                setState(true)
            } else {
                setState(false)
            }
        }
        return () => mounted = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth])

    return (
        <div className="wrapper-sidebar">
            <div className="inner">
                <Link to="/admin/" className={(pathname === "/") ? 'active': ''}><i className="fas fa-chart-line"></i> Dashboard</Link>
                <Link to="/admin/posts" className={(pathname.includes('/posts')) ? 'active': ''}><i className="fas fa-bookmark"></i> Posts</Link>
                <Link to="/admin/categories" className={(pathname.includes('/categories')) ? 'active': ''}><i className="fas fa-puzzle-piece"></i> Categories</Link>
                {
                    (state) ? (
                        <>
                        <Link to="/admin/users" className={(pathname.includes('/users')) ? 'active': ''}><i className="fas fa-users-cog"></i> Users</Link>
                        <Link to="/admin/settings" className={(pathname.includes('/settings')) ? 'active': ''}><i className="fas fa-sliders-h"></i> Settings</Link>
                        </>
                    ) : null
                }
                <Link to="?logout=1" className="" onClick={logOut}><i className="fas fa-sign-out-alt"></i> Logout</Link>
            </div>
        </div>
    )
}
