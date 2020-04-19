import React, { useEffect } from 'react';
import PageHeader from '../../../components/page.header';
import Form from '../../../components/Forms.comp';
import useFetch from '../../../hooks/useFetch';
import useForm from '../../../hooks/useForm';
import { category as catSchema } from '../../../validators/validate';
import { useHistory } from 'react-router-dom';

export default () => {
    const { goBack } = useHistory()

    const [state, handleChange, errors] = useForm({
        title: '',
        slug: ''
    }, catSchema)

    const [fetch, response, loading] = useFetch('/category/new', 'post')

    const create = (e) => {
        e.preventDefault()
        fetch(state)
    }

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if(response) {
                if(response.redirect) 
                    goBack()
            }
        }

        return () => mounted = false
    }, [response, goBack])

    return (
        <div className="pages">
            <PageHeader pageTitle="Add new category" showbutton={false} />
            <div className="pages-content">
                <Form.CatForm state={state} change={handleChange} submit={create} errors={errors} loading={loading}/>
            </div>
        </div>
    )
}
