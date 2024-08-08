import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';

const router =
    process.env.USE_MOCK || process.env.BRANCH === 'production' || process.env.BRANCH === 'staging'
        ? createBrowserRouter
        : createHashRouter;

export const createRouter = process.env.ENABLE_LOG ? Sentry.wrapCreateBrowserRouter(router) : router;
