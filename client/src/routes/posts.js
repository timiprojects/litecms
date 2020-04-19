import React, { lazy } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Suspense from '../components/Suspense.comp';

const AllPosts = lazy(() => import('../pages/app/posts/Posts'))
const NewPost = lazy(() => import('../pages/app/posts/Newpost'))
const EditPost = lazy(() => import('../pages/app/posts/PostEdit'))


export default () => {

    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${url}/`} render={props =>
                <Suspense>
                    <AllPosts {...props} />
                </Suspense>
            } />
            <Route path={`${url}/new`} render={props =>
                <Suspense>
                    <NewPost {...props} />
                </Suspense>
            } />
            <Route path={`${url}/edit/:id`} render={props =>
                <Suspense>
                    <EditPost {...props} />
                </Suspense>
            } />
        </Switch>
    )
}