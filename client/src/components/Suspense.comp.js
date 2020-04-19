import React, { Suspense } from 'react'
import Loader from './loader';


export default ({ children }) => <Suspense fallback={<Loader />}>{children}</Suspense>