/* eslint-disable */
import { api, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import { SESSION_COOKIE_NAME } from 'config';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import { spotlights } from './data/spotlights';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 200 });
const mockSessionApi = new MockAdapter(sessionApi, { delayResponse: 200 });
const escapeRegExp = input => input.replace('.\\*', '.*').replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');
// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

// Get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;

mockData.accounts.uqrdav10 = mockData.uqrdav10.account;
mockData.accounts.uqagrinb = mockData.uqagrinb.account;
if (user && !mockData.accounts[user]) {
    console.warn(
        `API MOCK DATA: User name (${user}) is not found, please use one of the usernames from mock data only...`,
    );
}

// default user is researcher if user is not defined
user = user || 'uqresearcher';

mockSessionApi.onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
    console.log('Account API hit');
    // mock account response
    if (['s2222222', 's3333333'].indexOf(user) > -1) {
        return [200, mockData.accounts[user]];
    } else if (mockData.accounts[user]) {
        return [403, {}];
    }
    return [404, {}];
});

mock.onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
    console.log('Account API hit');
    // mock account response
    if (user === 'public') {
        return [403, {}];
    } else if (mockData.accounts[user]) {
        return [200, mockData.accounts[user]];
    }
    return [404, {}];
});

mock.onGet(routes.SPOTLIGHTS_API().apiUrl).reply(() => {
    // mock spotlights
    console.log('Spotlights API hit');
    return [200, [...spotlights]];
});

mock.onGet(routes.CHAT_API().apiUrl).reply(() => {
    console.log('Chat status API hit');
    // mock chat status
    return [200, { online: true }];
});
