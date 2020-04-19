import React, { useEffect } from 'react'
import useFetch from '../hooks/useFetch';
import { useHistory } from 'react-router-dom';

const DeleteButton = ({link, fallbackUrl}) => {

    const { push } = useHistory()

    const [fetch, response] = useFetch(link, 'delete')

    const submit = e => {
        //e.preventDefault()
        fetch()
    }

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if(response && response.redirect) {
                push(fallbackUrl)
            }
        }

        return () => mounted = false;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response, push])

    return (
        <form onSubmit={submit}>
            <button type="submit" className="button button-danger-outline"><i className="fas fa-times"></i></button>
        </form>
    )
}

export default {
    DeleteButton
}
