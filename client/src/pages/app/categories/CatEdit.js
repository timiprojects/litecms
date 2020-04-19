import React, { useEffect } from 'react';
import PageHeader from '../../../components/page.header';
import Form from '../../../components/Forms.comp';
import useFetch from '../../../hooks/useFetch';
import useForm from '../../../hooks/useForm';
import { category as catSchema } from '../../../validators/validate';
import { useHistory, useParams } from 'react-router-dom';
import useGet from '../../../hooks/useGet';

export default () => {
    const {id} = useParams()

    const [getCat, catData] = useGet(`/category/edit/${id}`, 'get')

    const { goBack } = useHistory()

    const [state, handleChange, errors, _set] = useForm((catData) ? catData.data : {}, catSchema)

    useEffect(() => {
        let mounted = true
        if(mounted){
            getCat()
        }

        return () => mounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        let mounted = true
        if(mounted){
            if(catData) {
                catData && _set(catData.data)
            }
        }

        return () => mounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catData])

    const [fetch, response, loading] = useFetch(`/category/edit/${id}`, 'put')

    const updateCat = (e) => {
        e.preventDefault()
        fetch(state)
    }

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if(response && response.redirect) {
                goBack()
            }
        }

        return () => mounted = false
    }, [response, goBack])

    return (
        <div className="pages">
            <PageHeader pageTitle="Edit Category" showbutton={false} />
            <div className="pages-content">
                <Form.CatForm state={state} change={handleChange} submit={updateCat} errors={errors} loading={loading}/>
            </div>
        </div>
    )
}
