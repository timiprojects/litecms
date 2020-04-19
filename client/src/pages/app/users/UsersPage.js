import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/page.header';
import TableList from '../../../components/table.comp';
import { Link, useRouteMatch } from 'react-router-dom';
import { useApp } from '../../../providers/App.context';
import useGet from '../../../hooks/useGet';
import Suspense from '../../../components/Suspense.comp';
import EditUser from './EditUser';

export default () => {

    const { url } = useRouteMatch()

    const { page, limit } = useApp()

    const [getUsers, userResponse] = useGet('/auth/protected', 'get', { page, limit })

    const [users, setUsers] = useState()

    useEffect(() => {
        let mounted = true
        if(mounted) {
            getUsers()
        }

        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit])

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if (userResponse) {
                setUsers(userResponse.data)
            }
        }

        return () => mounted = false
    }, [userResponse])

    return (
        <div className="pages">
            <PageHeader pageTitle="All Users" showbutton={false} />
            <div className="pages-content">
                <div className="postform">
                    <div className="left">
                        <TableList tableHead={["Username", "Fullname", "Email", "Role"]} styling="" pagination={users}>
                            <Suspense>
                                {
                                    users && users.result.map(user => {
                                        return (
                                            <tr key={user._id} className="">
                                                <td><Link to={`${url}/${user._id}`}>{user.username}</Link></td>
                                                <td>{user.fullname}</td>
                                                <td>{user.email}</td>
                                                <td>{user.user_role}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </Suspense>
                        </TableList>
                    </div>
                    <div className="right">
                        <EditUser />
                    </div>
                </div>
            </div>
        </div>
    )
}
