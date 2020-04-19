import React from 'react'

export default ({heads}) => {
    return (
        Object.values(heads).map(head => {
            return (
                <th key={head}>{head}</th>
            )
        })
    )
}
