import axios from 'axios';
import Cookies from 'js-cookie';
import { setupCache } from 'axios-cache-adapter';
import { API_URL, SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME, TOKEN_NAME } from './general';
import { store } from 'config/store';
import { logout } from 'data/actions/account';
import { showAppAlert } from 'data/actions/app';
import locale from 'locale/global';

import * as Sentry from '@sentry/browser';

import { COMP_AVAIL_API, LIB_HOURS_API, LOANS_API, PRINTING_API, TRAINING_API } from '../repositories/routes';

export const cache = setupCache({
    maxAge: 15 * 60 * 1000,
    key: request => {
        return `${request.url}${JSON.stringify(request.params)}`;
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
    return request;
});

function getUrlRoot(responseUrl) {
    return responseUrl.startsWith('https://api.library.uq.edu.au/v1/')
        ? 'https://api.library.uq.edu.au/v1'
        : 'https://api.library.uq.edu.au/staging';
}

function routeRequiresLogin(error) {
    const responseURL = error?.response?.request?.responseUrl || error?.response?.request?.responseURL || null;
    if (!responseURL) {
        return false;
    }

    const urlRoot = getUrlRoot(responseURL);
    const accountUrl = `${urlRoot}/account`;
    const LRurlPrefix = `${urlRoot}/learning_resources/reading_list/count`;
    return responseURL.startsWith(accountUrl) || responseURL.startsWith(LRurlPrefix);
}

const reportToSentry = error => {
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
    const responseURL = error?.response?.request?.responseURL || error?.response?.request?.responseUrl || null;
    if (!responseURL) {
        return false;
    }

    const urlRoot = getUrlRoot(responseURL);

    // these APIs don't put a banner on the page because they are reported or ignored within their own panel
    const handlesErrorUrls =
        responseURL.startsWith(`${urlRoot}/${TRAINING_API().apiUrl}`) ||
        responseURL.startsWith(`${urlRoot}/${COMP_AVAIL_API().apiUrl}`) ||
        responseURL.startsWith(`${urlRoot}/${LIB_HOURS_API().apiUrl}`) ||
        responseURL.startsWith(`${urlRoot}/${PRINTING_API().apiUrl}`) ||
        responseURL.startsWith(`${urlRoot}/${LOANS_API().apiUrl}`);

    return !handlesErrorUrls;
}

function backendHasSanitisedErrorMessages(response) {
    const responseURL = response?.request?.responseUrl || response?.request?.responseURL || null;
    if (!responseURL) {
        return false;
    }
    const urlRoot = getUrlRoot(responseURL);

    // certain systems have fully sanitised their error messages - these can go through for display on the frontend
    return !!responseURL && responseURL.startsWith(`${urlRoot}/test-and-tag`);
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
        if (!!error?.config && !!error?.response) {
            // (oddly, when a 403 comes through, axios fires twice, the second time without a response)
            const errorStatus = error.response.status;
            if ([401, 403].includes(errorStatus) && routeRequiresLogin(error)) {
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

            if (errorStatus === 500) {
                errorMessage =
                    error.response.data?.length > 0
                        ? { message: error.response.data?.join(' ') }
                        : (backendHasSanitisedErrorMessages(error.response) && error.response.data?.message) ||
                          locale.global.errorMessages[error.response.status];
                if (!alertDisplayAllowed(error)) {
                    // we don't display an error banner for these (the associated panel displays an error)
                } else if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'cc') {
                    global.mockActionsStore.dispatch(showAppAlert(error.response));
                } else {
                    store.dispatch(showAppAlert(error.response.data));
                }
            } else if (!!errorStatus) {
                errorMessage =
                    error.response.data?.length > 0
                        ? { message: error.response.data?.join(' ') }
                        : (backendHasSanitisedErrorMessages(error.response) && error.response.data?.message) ||
                          locale.global.errorMessages[error.response.status];
                if ([410, 422].includes(error.response.status)) {
                    errorMessage = {
                        ...errorMessage,
                        ...error.response.data,
                    };
                }
            }

            const isNonReportable =
                document.location.hostname === 'localhost' || // testing on AWS sometimes fires these
                [401, 403].includes(errorStatus) || // login expired - no notice required
                errorStatus === 0 || // maybe catch those "the network request was interrupted" we see so much?
                errorStatus === '0' || // don't know what format it comes in
                errorStatus === 500 || // api should handle these
                errorStatus === 502; // connection timed out - it happens, FE can't do anything about it

            if (!isNonReportable) {
                reportToSentry(error);
            }
        }

        if (!!errorMessage) {
            return Promise.reject({ ...errorMessage });
        } else {
            return Promise.reject(error);
        }
    },
);
