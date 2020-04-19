import React, { lazy } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Suspense from '../components/Suspense.comp';

const AllUsers = lazy(() => import('../pages/app/users/UsersPage'))


export default () => {

    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${url}/`} render={props =>
                <Suspense>
                    <AllUsers {...props} />
                </Suspense>
            } />
            <Route path={`${url}/:id`} render={props =>
                <Suspense>
                    <AllUsers {...props} />
                </Suspense>
            } />
        </Switch>
    )
}