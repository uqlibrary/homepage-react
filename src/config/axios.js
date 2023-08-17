import axios from 'axios';
import Cookies from 'js-cookie';
import { setupCache } from 'axios-cache-adapter';
import { API_URL, SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME, TOKEN_NAME } from './general';
import { store } from 'config/store';
import { logout } from 'data/actions/account';
import { showAppAlert } from 'data/actions/app';
import locale from 'locale/global';

import * as Sentry from '@sentry/browser';

import param from 'can-param';
import {
    COMP_AVAIL_API,
    CURRENT_ACCOUNT_API,
    LIB_HOURS_API,
    LOANS_API,
    PRINTING_API,
    TRAINING_API,
} from '../repositories/routes';

export const cache = setupCache({
    maxAge: 15 * 60 * 1000,
    key: request => {
        return `${request.url}${JSON.stringify(request.params)}`;
    },
    exclude: {
        query: false,
        paths: [
            'external/records/search',
            'records/search?rule=',
            'records/search?title=',
            'records/search?doi=',
            'records/search?id=pmid:',
        ],
    },
});

export const api = axios.create({
    baseURL: API_URL,
    adapter: process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'cc' ? undefined : cache.adapter,
    crossdomain: true,
});

export const sessionApi = axios.create({
    baseURL: API_URL,
    crossdomain: true,
});

// need to generate a new token for each request otherwise if you try a new request with the old token,
// axios will appear to cancel your request automatically
export const generateCancelToken = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};

// If there is a local cookie available, then set the api headers for x-uql-token
if (!!Cookies.get(SESSION_COOKIE_NAME) && !!Cookies.get(SESSION_USER_GROUP_COOKIE_NAME)) {
    api.defaults.headers.common[TOKEN_NAME] = Cookies.get(SESSION_COOKIE_NAME);
}

// allow us to safely force a given SESSION_COOKIE_NAME during development
if (process.env.NODE_ENV === 'development' && !!process.env.SESSION_COOKIE_NAME) {
    api.defaults.headers.common[TOKEN_NAME] = process.env.SESSION_COOKIE_NAME;
}

api.isCancel = axios.isCancel; // needed for cancelling requests and the instance created does not have this method

let isGet = null;
api.interceptors.request.use(request => {
    isGet = request.method === 'get';
    if (
        !!request.url &&
        (request.url.includes('records/search') || request.url.includes('records/export')) &&
        !!request.params &&
        !!request.params.mode &&
        request.params.mode === 'advanced'
    ) {
        request.paramsSerializer = params => {
            return param(params);
        };
    }
    return request;
});

const reportToSentry = error => {
    // the non-logged in user always generates a 403 on the Account call. We dont need to report that to Sentry
    const isCallToAccountAPI =
        error?.response?.request?.responseUrl?.includes(`${CURRENT_ACCOUNT_API().apiUrl}?ts=`) ||
        error?.response?.request?.responseURL?.includes(`${CURRENT_ACCOUNT_API().apiUrl}?ts=`);
    if (error?.response?.status === 403 && isCallToAccountAPI) {
        return false;
    }

    let detailedError = '';
    if (error.response) {
        detailedError = `Data: ${JSON.stringify(error.response.data)}; Status: ${
            error.response.status
        }; Headers: ${JSON.stringify(error.response.headers)}`;
    } else {
        detailedError = `Something happened in setting up the request that triggered an Error: ${error.message}`;
    }
    Sentry.withScope(scope => {
        scope.setExtra('error', detailedError);
        Sentry.captureException(error);
    });

    return true;
};

function alertDisplayAllowed(error) {
    // these APIs don't put a banner on the page because they are reported or ignored within the panel
    const apisThatManageTheirOwn500 = [
        TRAINING_API().apiUrl,
        COMP_AVAIL_API().apiUrl,
        LIB_HOURS_API().apiUrl,
        PRINTING_API().apiUrl,
        LOANS_API().apiUrl,
    ];
    if (
        !!error.response?.request?.responseUrl &&
        apisThatManageTheirOwn500.includes(error.response.request.responseUrl)
    ) {
        return false;
    }
    return true;
}

function backendhasSanitisedErrorMessages(response) {
    return response.request?.responseUrl?.startsWith('test-and-tag');
}

function routeRequiresLogin(error) {
    if (error?.response?.request?.responseUrl === 'account') {
        return true;
    }
    return error?.response?.request?.responseUrl?.startsWith('learning_resources/reading_list/summary');
}

api.interceptors.response.use(
    response => {
        if (!isGet) {
            return cache.store.clear().then(() => Promise.resolve(response.data));
        }
        return Promise.resolve(response.data);
    },
    error => {
        let errorMessage = null;
        if (!!error && !!error.config) {
            if (error?.response?.status === 403 && routeRequiresLogin(error)) {
                if (!!Cookies.get(SESSION_COOKIE_NAME)) {
                    Cookies.remove(SESSION_COOKIE_NAME, { path: '/', domain: '.library.uq.edu.au' });
                    Cookies.remove(SESSION_USER_GROUP_COOKIE_NAME, { path: '/', domain: '.library.uq.edu.au' });
                    delete api.defaults.headers.common[TOKEN_NAME];
                }

                if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'cc') {
                    global.mockActionsStore.dispatch(logout());
                } else {
                    store.dispatch(logout());
                }
            }

            if (error?.response?.status === 500) {
                errorMessage =
                    error.response.data?.length > 0
                        ? { message: error.response.data?.join(' ') }
                        : (backendhasSanitisedErrorMessages(error.response) && error.response.data?.message) ||
                          locale.global.errorMessages[error.response.status];
                if (!alertDisplayAllowed(error)) {
                    // we dont display an error banner for these (the associated panel displays an error)
                } else if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'cc') {
                    global.mockActionsStore.dispatch(showAppAlert(error.response));
                } else {
                    store.dispatch(showAppAlert(error.response.data));
                }
            } else if (!!error?.response?.status) {
                errorMessage =
                    error.response.data?.length > 0
                        ? { message: error.response.data?.join(' ') }
                        : (backendhasSanitisedErrorMessages(error.response) && error.response.data?.message) ||
                          locale.global.errorMessages[error.response.status];
                if ([410, 422].includes(error.response.status)) {
                    errorMessage = {
                        ...errorMessage,
                        ...error.response.data,
                    };
                }
            }
        }

        reportToSentry(error);

        if (!!errorMessage) {
            return Promise.reject({ ...errorMessage });
        } else {
            return Promise.reject(error);
        }
    },
);
