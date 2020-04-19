import React, { useEffect } from 'react';
import PageHeader from '../../../components/page.header';
import Form from '../../../components/Forms.comp';
import useFetch from '../../../hooks/useFetch';
import useForm from '../../../hooks/useForm';
import { register as registerSchema } from '../../../validators/validate';
import { useHistory, useParams } from 'react-router-dom';
import useGet from '../../../hooks/useGet';

export default () => {
    const { id } = useParams()

    const [getUser, userData] = useGet(`/auth/edit/${id}`, 'get')

    const { push } = useHistory()

    const [state, handleChange, errors, _set] = useForm((id !== undefined && userData) ? userData.data : {
        username: '',
        fullname: '',
        email: '',
        password: '',
        user_role: '',
    }, registerSchema)

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if (id === undefined) {
                _set({
                    username: '',
                    fullname: '',
                    email: '',
                    password: '',
                    user_role: '',
                })
            }
    
            if (id !== undefined) {
                getUser()
            }
        }

        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        let mounted = true
        if(mounted){
            if (userData) {
                userData && _set(userData.data)
            }
        }

        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData])

    const [fetch, response, loading] = useFetch(`/auth/edit/${id}`, 'put')
    const [register, regResponse, regloading] = useFetch(`/auth/register`, 'post')

    const updateUser = (e) => {
        e.preventDefault()
        fetch(state)
    }

    const createUser = (e) => {
        e.preventDefault()
        register(state)
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            if (response && response.redirect) {
                push('/users')
            }

            if (regResponse && regResponse.redirect) {
                push('/users')
            }
        }

        return () => mounted = false
    }, [response, regResponse, push])

    return (
        <>
            <PageHeader pageTitle={(id !== undefined) ? "Edit Users" : "Add Users"} showbutton={false} />
            <div className="pages-content">
                {
                    (id !== undefined) ? (
                        <Form.UserForm state={state} change={handleChange} submit={updateUser} errors={errors} loading={loading} hidePwd={true} />
                    ) : (
                            <Form.UserForm state={state} change={handleChange} submit={createUser} errors={errors} loading={regloading} hidePwd={false} />
                        )
                }
            </div>
        </>
    )
}
