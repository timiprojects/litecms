export const baseUrl = window.location.origin;

function useFetch(url, type) {
    let response = null, loading = false

    const fetchData = async ({ data = {}, params = {} } = {}) => {
        
        const param = Object.entries(params).map(p => {
            return `${p[0]}=${p[1]}`
        }).join('&')
        const link = (param) ? `${baseUrl}${url}?${param}` : baseUrl + url
        
        try {
            loading = true
            const networkResponse = await fetch(link, {
                method: type.toString().toUpperCase(),
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(data)
            })
            const dataResponse = await networkResponse.json()
            if (dataResponse) {
                
                response = dataResponse
                loading = false
            }
            //return response
        } catch (error) {
            loading = false
            //return error
            response = error
        }

        return { response, loading }
    }

    return fetchData
}

export default useFetch