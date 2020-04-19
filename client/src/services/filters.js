
// const searchItems = (val, filters, callback) => {
//     const filtered = Array(...filters).sort((a, b) => {
//         if (val.toLowerCase() === "alphabet" && a.title < b.title) {
//             return -1
//         } else if (val.toLowerCase() === "date" && b.updatedAt < a.updatedAt) {
//             return -1
//         } else {
//             return 0
//         }
//     })
//     callback(filtered)
//     console.log(filtered)
// }

import { useState, useCallback, useEffect } from "react"

const useFilters = (val=[]) => {

    const [filters, setFilters] = useState([])

    useEffect(() => {
        val && setFilters(val)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const _setFilters = useCallback((object) => {
        filters && setFilters(object)
    }, [filters])

    return [filters,_setFilters]
}

export default useFilters