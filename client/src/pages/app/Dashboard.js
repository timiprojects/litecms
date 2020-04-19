import React from 'react'
import { useApp } from '../../providers/App.context';
import PageHeader from '../../components/page.header';

export default () => {

    const { auth, count } = useApp()

    return (
        <div className="pages">
            <PageHeader pageTitle="Dashboard" showbutton={false} />
            <div className="pages-content">
                <p>Welcome <span className="text-peru text-bold">{auth.username}</span>, you are logged in as <span className="text-gray text-bold">{auth.role}</span>.</p>
                <div className="pages-content summary">
                    <div className="flash-card">
                        <div className="flash-card--body">
                            <p className="flash-card--body-title">
                                <span><i className="fas fa-puzzle-piece"></i> Categories</span>
                                <span className="text-peru text-bold number">{(count)? count.categories : 0}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flash-card">
                        <div className="flash-card--body">
                            <p className="flash-card--body-title">
                                <span><i className="fas fa-bookmark"></i> Posts</span>
                                <span className="text-peru text-bold number">{(count) ? count.posts : 0}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
