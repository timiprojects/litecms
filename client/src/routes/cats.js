import React, { lazy } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Suspense from '../components/Suspense.comp';

const AllCatsPage = lazy(() => import('../pages/app/categories/Categories'))
const NewCatPage = lazy(() => import('../pages/app/categories/NewCate'))
const EditCatPage = lazy(() => import('../pages/app/categories/CatEdit'))


export default () => {

    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${url}/`} render={props =>
                <Suspense>
                    <AllCatsPage {...props} />
                </Suspense>
            } />
            <Route path={`${url}/new`} render={props =>
                <Suspense>
                    <NewCatPage {...props} />
                </Suspense>
            } />
            <Route path={`${url}/edit/:id`} render={props =>
                <Suspense>
                    <EditCatPage {...props} />
                </Suspense>
            } />
        </Switch>
    )
}