import React, { lazy } from 'react';
import { Route, Switch, useRouteMatch, Link } from 'react-router-dom';
import Suspense from '../components/Suspense.comp';
import Sidebar from '../components/sidebar.comp';

const Dash = lazy(() => import('../pages/app/Dashboard'))
const PostRoutes = lazy(() => import('./posts'))
const CatsRoutes = lazy(() => import('./cats'))
const UserRoutes = lazy(() => import('./userroute'))
const SettingsRoutes = lazy(() => import('../pages/app/settings/Settings'))


export default () => {

    const { url } = useRouteMatch()

    return (
        <>
            <div className="wrapper">
                <Sidebar />
                <div className="wrapper-content">
                    <Link to="/" target="_blank" className="button button-light button-smaller text-small text-bold text-dark mb"><i className="fas fa-eye">&nbsp;</i>View Site</Link>
                    <Switch>
                        <Route exact path={`${url}/`} render={props =>
                            <Suspense>
                                <Dash {...props} />
                            </Suspense>
                        } />
                        <Route path={`${url}/posts`} render={props =>
                            <Suspense>
                                <PostRoutes {...props} />
                            </Suspense>
                        } />
                        <Route path={`${url}/categories`} render={props =>
                            <Suspense>
                                <CatsRoutes {...props} />
                            </Suspense>
                        } />
                        <Route path={`${url}/users`} render={props =>
                            <Suspense>
                                <UserRoutes {...props} />
                            </Suspense>
                        } />
                        <Route path={`${url}/settings`} render={props =>
                            <Suspense>
                                <SettingsRoutes {...props} />
                            </Suspense>
                        } />
                    </Switch>
                </div>
            </div>
        </>
    )
}