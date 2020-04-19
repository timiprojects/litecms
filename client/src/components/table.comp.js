import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../providers/App.context';

export default ({ tableHead, children, styling, pagination, setFilter, filters }) => {

    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(() => (pagination) ? pagination.pages : 0)

    useEffect(() => { pagination && setPages(pagination.pages) }, [pagination])

    const { _setPage, limit, _setLimit } = useApp()

    const nextPage = (e) => {
        e.preventDefault()
        if (pagination.next !== undefined) {
            _setPage(pagination.next.page)
            setPage(prev => prev = `${pagination.next.page}`)
        }
    }
    const prevPage = (e) => {
        e.preventDefault()
        if (pagination.previous !== undefined) {
            _setPage(pagination.previous.page)
            setPage(prev => prev = `${pagination.previous.page}`)
        }
    }

    const searchItems = useCallback((val) => {
        const filtered = Array(...filters).sort((a, b) => {
            if (val.toLowerCase() === "alphabet" ) {
                if(a.title < b.title || a.fullname < b.fullname) {
                    return -1
                }
            } else if (val.toLowerCase() === "date" && b.updatedAt < a.updatedAt) {
                return -1
            } 

            return 0
        })
        setFilter(filtered)
        console.log(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters])

    return (
        <div className="tables">
            <div className="tables-top">
                <div className="filters">
                    <div className="filters-left">
                        <div className="heading">
                            <p>All <span className="heading-value">{pagination && pagination.total}</span></p>
                            <p className="text-info">Published <span className="heading-value">{pagination && pagination.total}</span></p>
                        </div>
                    </div>
                    <div className="filters-right">
                        <div className="limit">
                            <p className="page">Sort By</p>
                            <select className="select" defaultValue="Date" onChange={(e) => searchItems(e.target.value)}>
                                {
                                    ["Alphabet", "Date",].map(num => {
                                        return (
                                            <option key={num} value={num} >{num}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="limit">
                            <p className="page">Set Limit</p>
                            <select className="select" defaultValue={limit} onChange={(e) => _setLimit(e.target.value)}>
                                {
                                    [5, 10, 15].map(num => {
                                        return (
                                            <option key={num} value={num} >{num}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <p className="page">{`Page ${page} of ${pages}`}</p>
                        <button className="child button button-light button-small" onClick={prevPage}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button className="child button button-light button-small" onClick={nextPage}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="tables-content">
                <table>
                    <thead>
                        <tr className={styling}>
                            {Object.values(tableHead).map(head => {
                                return (
                                    <th key={head}>{head}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
