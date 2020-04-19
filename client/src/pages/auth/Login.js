import React, { useEffect } from 'react';
import Form from '../../components/Forms.comp';
import useFetch from '../../hooks/useFetch';
import useForm from '../../hooks/useForm';
import { login as loginSchema } from '../../validators/validate';
import { useHistory } from 'react-router-dom';
import conf from '../../config/conf';
import AuthFooter from '../../components/auth.footer';

export default () => {

    const token = localStorage.getItem(conf.cmstoken)

    const { push } = useHistory()

    const [state, handleChange, errors] = useForm({
        username: '',
        password: ''
    }, loginSchema)

    const [fetch, response, loading] = useFetch('/auth/login', 'post')

    const Login = e => {
        e.preventDefault()
        fetch(state)
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            if (response) {
                localStorage.setItem(conf.cmstoken, response.data)
                push(conf.routes.app.dashboard)
            }
        }

        return () => {
            mounted = false
        }

    }, [response, push])

    useEffect(() => {
        if (token) push(conf.routes.app.dashboard)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="auth">
                <div className="auth-inner">
                    <div className="auth-header">
                        <h2>Login Design</h2>
                        <h3>Sign In</h3>
                        <p>to get complete access</p>
                        <div className="auth-card-title">
                            <i className="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                    <form onSubmit={Login} className="form">
                        <Form.TextBox name="username" type="text" placeholder="Enter username" label="Username" value={state.username} change={handleChange} error={errors['username']} />
                        <Form.TextBox name="password" type="password" placeholder="Enter password" label="Password" value={state.password} change={handleChange} error={errors['password']} />
                        <div className="button-group">
                            <a href="/">Forgotten password?</a>
                            <div className="form-group">
                                <button type="submit" className="button button-peru" disabled={loading ? true : false}>
                                    {!loading ? (<><i className="fas fa-sign-in-alt"></i> Login</>) : 'Please wait...'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <AuthFooter />
            </div>
        </>
    )
}
