import { useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Api } from '../services/Api.services';
import conf from '../config/conf';

const useFetch = (url, type) => {
    const { push } = useHistory()

    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const errorhandler = (res, failureCallback) => {
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
    }

    const fetch = async (data = {}) => {
        setLoading(true)
        try {
            //get type from type
            const networkResponse = await Api[type](url, data);
            const _response = networkResponse.data;
            setLoading(false)
            setResponse(_response)
        } catch (error) {
            setLoading(false)
            errorhandler(error, message => setError(message))
        }
    }
    return [fetch, response, loading, error]
}

export default useFetch;