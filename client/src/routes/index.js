import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import Suspense from '../components/Suspense.comp';


import { AuthProvider as Auth } from '../providers/Auth.context';
import { AppProvider as App } from '../providers/App.context';

const AuthRoutes = lazy(() => import('./auth'))
const AppRoutes = lazy(() => import('./app'))

const BaseRoute = () => {
    return (
        <Switch>
            <Route path="/auth" render={props =>
                <Suspense>
                    <AuthRoutes {...props} />
                </Suspense>
            } />

            <Route path="/admin" render={props =>
                <Suspense>
                    <Auth><App><AppRoutes {...props} /></App></Auth>
                </Suspense>
            } />
        </Switch>
    )
}

export default BaseRoute