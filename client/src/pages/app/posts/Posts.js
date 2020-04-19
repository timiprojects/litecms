import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/page.header';
import TableList from '../../../components/table.comp';
import { Link, useRouteMatch } from 'react-router-dom';
import { useApp } from '../../../providers/App.context';
import useGet from '../../../hooks/useGet';
import Suspense from '../../../components/Suspense.comp';
import moment from 'moment';
import Button from '../../../components/button';
import useFilters from '../../../services/filters';

export default () => {

    const { url } = useRouteMatch()

    const { page, limit, users, categories } = useApp()

    const [getposts, postResponse] = useGet('/posts/all', 'get', { page, limit })

    const [posts, setPosts] = useState()

    const [filters, _setFilter] = useFilters((posts) ? posts.result : [])

    useEffect(() => {
        let mounted = true
        if(mounted) {
            getposts()
        }
        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit])

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if (postResponse) {
                setPosts(postResponse.data)
            }
        }
        return () => mounted = false
    }, [postResponse])

    useEffect(() => {
        let mounted = true
        if (mounted) {
            posts && _setFilter(posts.result)
        }

        return () => mounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts])

    return (
        <div className="pages">
            <PageHeader btnTitle="add new" pageTitle="all posts" urls="/new" showbutton={true} />
            <div className="pages-content">
                <TableList tableHead={["Title", "Author(s)", "Categories", "Date", "..."]} styling="posts" pagination={posts} filters={filters} setFilter={_setFilter}>
                    <Suspense>
                        {
                            posts && posts.result.map(post => {
                                let authOutput = "";
                                let catOutput = "";
                                const authors = post.authors.join(", ").split(", ")
                                authors.forEach(x => {
                                    const fill = users.find(y => y._id === x)
                                    authOutput += fill.username + ", "
                                })
                                const category = post.category.join(", ").split(", ")
                                category.forEach(x => {
                                    const fill = categories.find(y => y._id === x)
                                    catOutput += fill.title + ", "
                                })
                                return (
                                    <tr key={post._id} className="posts">
                                        <td><Link to={`${url}/edit/${post._id}`}>{post.title}</Link></td>
                                        <td>{authOutput}</td>
                                        <td>{catOutput}</td>
                                        <td>{moment(post.updatedAt).startOf().fromNow()}</td>
                                        <td><Button.DeleteButton link={`/posts/delete/${post._id}`} fallbackUrl={url}/></td>
                                    </tr>
                                )
                            })
                        }
                    </Suspense>
                </TableList>
            </div>
        </div>
    )
}
