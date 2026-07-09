import { createBrowserRouter, createHashRouter } from 'react-router';
import * as Sentry from '@sentry/react';

const router =
    (process.env.USE_MOCK || process.env.BRANCH === 'production' || process.env.BRANCH === 'staging') &&
    !process.env.HASH_ROUTER
        ? createBrowserRouter
        : createHashRouter;

export const createRouter = process.env.ENABLE_LOG ? Sentry.wrapCreateBrowserRouterV7(router) : router;
