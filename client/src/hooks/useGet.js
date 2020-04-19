import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Api, isCancel } from '../services/Api.services';
import conf from '../config/conf';

const useGet = (url, type, params={}) => {
    const { push } = useHistory()

    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const errorhandler = useCallback((res, failureCallback) => {
        if (res.response) {
            failureCallback(res.response.data.message);
            if (res.response.status === 401) {
                localStorage.clear();
                push(conf.routes.login)
            }
        } else if (res.request) {
            failureCallback(res.message);
        } else {
            failureCallback(res.message);
        }
    }, [push])


    async function fetchData() {
        setLoading(true)
        try {
            // const netRes = await axiosInstance.get(url, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `JWT ${token}`
            //     },
            //     params: { page, limit },
            //     //cancelToken: new cancelToken(c => cancel = c)
            // })

            // const _res = netRes.data
            const networkResponse = await Api[type](url,params);
            const _response = networkResponse.data;
            setLoading(false)
            setResponse(_response)
        } catch (error) {
            setLoading(false)
            if (isCancel(error)) return;
            errorhandler(error, message => setError(message))
        }
    }

    return [fetchData, response, loading, error]
}

export default useGet;