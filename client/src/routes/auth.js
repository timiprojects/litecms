import React, { lazy } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Suspense from '../components/Suspense.comp';

const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))

export default () => {

    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}/login`} render={props =>
                <Suspense>
                    <Login {...props} />
                </Suspense>
            } />

            <Route path={`${url}/register`} render={props =>
                <Suspense >
                    <Register {...props} />
                </Suspense>
            } />
        </Switch>
    )
}