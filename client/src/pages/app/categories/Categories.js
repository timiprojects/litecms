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

    const { page, limit, users } = useApp()

    const [getCategory, catResp] = useGet('/category/all', 'get', { page, limit })

    const [categories, setCategories] = useState()

    // const [filters, setFilter] = useState(() => (categories) ? categories.result : [])

    const [filters, _setFilter] = useFilters((categories) ? categories.result : [])

    useEffect(() => {
        let mounted = true
        if (mounted) {
            getCategory()
        }
        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit])

    useEffect(() => {
        let mounted = true
        if (mounted) {
            if (catResp) {
                setCategories(catResp.data)
            }
        }

        return () => mounted = false;
    }, [catResp])

    useEffect(() => {
        let mounted = true
        if (mounted) {
            categories && _setFilter(categories.result)
        }

        return () => mounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories])

    // useEffect(() => {
    //     console.log(filter)
    // }, [filter])

    return (
        <div className="pages">
            <PageHeader btnTitle="add new" pageTitle="all categories" urls="/new" showbutton={true} />
            <div className="pages-content">
                <TableList tableHead={["Title", "Slug", "Author(s)", "Date", "..."]} styling="category" pagination={categories} filters={filters} setFilter={_setFilter}>
                    <Suspense>
                        {
                            categories && filters.map((category) => {
                                const authors = category.authors.join(", ").split(", ")
                                let output = "";
                                return (
                                    <tr key={category._id} className="category">
                                        <td><Link to={`${url}/edit/${category._id}`}>{category.title}</Link></td>
                                        <td>{category.slug}</td>
                                        <td>
                                            {
                                                authors.forEach((x, i) => {
                                                    const fill = users.find(y => y._id === x)
                                                    output += fill.username + ", "
                                                })
                                            }
                                            {output}
                                        </td>
                                        <td>{moment(category.updatedAt).startOf().fromNow()}</td>
                                        <td><Button.DeleteButton link={`/category/delete/${category._id}`} fallbackUrl={url} /></td>
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
