import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

export default ({ btnTitle, pageTitle, urls, showbutton }) => {
    const { url } = useRouteMatch()
    return (
        <div className="pages-header">
            <h2 className="pages-header-title">
                {pageTitle}
            </h2>
            {showbutton ? (<Link to={`${url}${urls}`} className="button button-peru button-small">{btnTitle}</Link>) : (<></>)}
        </div>
    )
}
