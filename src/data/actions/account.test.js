import { accounts, currentAuthor } from 'data/mock/data/account';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as accountActions from './account';
import {
    getSemesterStringByTermNumber,
    loadLibHours,
    loadLoans,
    loadPrintBalance,
    loadTrainingEvents,
    getClassNumberFromPieces,
    loadVemcountList,
    loadPrimoStatus,
} from './account';
import Cookies from 'js-cookie';

jest.mock('@sentry/browser');

const sessionStorageMock = (function createSessionStorageMock() {
    let store = {};

    return {
        getItem(key) {
            return store[key] || null;
        },

        setItem(key, value) {
            store[key] = value;
        },

        clear() {
            store = {};
        },

        removeItem(key) {
            delete store[key];
        },

        getAll() {
            console.log(store);
        },
    };
})();

describe('Account action creators', () => {
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
        mockSessionApi = setupSessionMockAdapter();

        Cookies.get = jest.fn().mockImplementation(() => 'abc123');
        Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
    });

    afterEach(() => {
        MockDate.reset();
        mockApi.reset();
        mockSessionApi.reset();
        window.sessionStorage.clear();
    });

    it('should dispatch expected actions on successful fetch of user details', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqresearcher)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.uqresearcher);

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should use student username to get author details when org username not set', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqresearcher)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.s2222222);

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should return expected actions for a student with an account', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.s1111111)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.s3333333);

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should return expected actions for a hospital em user', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.emhospital)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.s3333333);

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should return expected actions for a student with an account but no author account', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.s3333333)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.s3333333);

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions if author returns 404', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqstaff)
            .onAny()
            .reply(404, {});

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_FAILED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions if author returns 403', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqstaff)
            .onAny()
            .reply(403, {});

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_FAILED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions if account, author loaded, but author details failed via loadCurrentAccount()', async () => {
        process.env = {
            ENABLE_LOG: true,
        };

        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqresearcher)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.uqresearcher)
            .onAny()
            .reply(404, {});

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions for a student without an author account', async () => {
        process.env = {
            ENABLE_LOG: true,
        };

        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.s3333333)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.s3333333)
            .onAny()
            .reply(404, {});

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected action when user logs out', () => {
        const expectedActions = [actions.CURRENT_ACCOUNT_ANONYMOUS];
        mockActionsStore.dispatch(accountActions.logout());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected action for google and other bots', async () => {
        global.navigator.__defineGetter__('userAgent', function userAgent() {
            return 'Googlebot'; // customized user agent
        });

        const expectedActions = [actions.CURRENT_ACCOUNT_ANONYMOUS];
        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear session expire action', async () => {
        const expectedActions = [actions.CLEAR_CURRENT_ACCOUNT_SESSION_FLAG];

        await mockActionsStore.dispatch(accountActions.clearSessionExpiredFlag());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading libhours succeeds', async () => {
        mockApi.onGet(repositories.routes.LIB_HOURS_API().apiUrl).reply(500);

        const expectedActions = [actions.LIB_HOURS_LOADING, actions.LIB_HOURS_FAILED];

        await mockActionsStore.dispatch(loadLibHours());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading libhours succeeds', async () => {
        mockApi.onGet(repositories.routes.LIB_HOURS_API().apiUrl).reply(200);

        const expectedActions = [actions.LIB_HOURS_LOADING, actions.LIB_HOURS_LOADED];

        await mockActionsStore.dispatch(loadLibHours());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading papercut fails', async () => {
        mockApi.onGet(repositories.routes.PRINTING_API().apiUrl).reply(500);

        const expectedActions = [actions.PRINT_BALANCE_LOADING, actions.PRINT_BALANCE_FAILED];

        await mockActionsStore.dispatch(loadPrintBalance());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading papercut succeeds', async () => {
        mockApi.onGet(repositories.routes.PRINTING_API().apiUrl).reply(200);

        const expectedActions = [actions.PRINT_BALANCE_LOADING, actions.PRINT_BALANCE_LOADED];

        await mockActionsStore.dispatch(loadPrintBalance());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading loans fails', async () => {
        mockApi.onGet(repositories.routes.LOANS_API().apiUrl).reply(500);

        const expectedActions = [actions.LOANS_LOADING, actions.LOANS_FAILED];

        await mockActionsStore.dispatch(loadLoans());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading loans succeeds', async () => {
        mockApi.onGet(repositories.routes.LOANS_API().apiUrl).reply(200);

        const expectedActions = [actions.LOANS_LOADING, actions.LOANS_LOADED];

        await mockActionsStore.dispatch(loadLoans());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('dispatches expected actions when loading training fails', async () => {
        mockApi.onGet(repositories.routes.TRAINING_API().apiUrl).reply(500);

        const expectedActions = [actions.TRAINING_LOADING, actions.TRAINING_FAILED];

        await mockActionsStore.dispatch(loadTrainingEvents());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading training succeeds', async () => {
        mockApi.onGet(repositories.routes.TRAINING_API().apiUrl).reply(200);

        const expectedActions = [actions.TRAINING_LOADING, actions.TRAINING_LOADED];

        await mockActionsStore.dispatch(loadTrainingEvents());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading training succeeds for hospital user', async () => {
        mockApi.onGet(repositories.routes.TRAINING_API().apiUrl).reply(200);

        const expectedActions = [actions.TRAINING_LOADING, actions.TRAINING_LOADED];

        await mockActionsStore.dispatch(loadTrainingEvents({ trainingfilterId: 360 }));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should calculate term dates correctly', () => {
        expect(getSemesterStringByTermNumber('7050')).toEqual('Semester 2 2020');
        expect(getSemesterStringByTermNumber('7080')).toEqual('Semester 3 2020');
        expect(getSemesterStringByTermNumber('7120')).toEqual('Semester 1 2021');
    });

    it('should calculate class ids correctly', () => {
        expect(getClassNumberFromPieces({})).toEqual('');
        expect(getClassNumberFromPieces({ SUBJECT: 'FREN', CATALOG_NBR: '1010' })).toEqual('FREN1010');
    });

    it('dispatches expected actions when loading vemcount succeeds', async () => {
        mockApi.onGet(repositories.routes.VEMCOUNT_API().apiUrl).reply(200);

        const expectedActions = [actions.VEMCOUNT_LOADING, actions.VEMCOUNT_LOADED];

        await mockActionsStore.dispatch(loadVemcountList());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading vemcount fails', async () => {
        mockApi.onGet(repositories.routes.VEMCOUNT_API().apiUrl).reply(500);

        const expectedActions = [actions.VEMCOUNT_LOADING, actions.VEMCOUNT_FAILED];

        await mockActionsStore.dispatch(loadVemcountList());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading primo status succeeds', async () => {
        mockApi.onGet(repositories.routes.PRIMO_STATUS_API().apiUrl).reply(200);

        const expectedActions = [actions.PRIMO_STATUS_LOADING, actions.PRIMO_STATUS_LOADED];

        await mockActionsStore.dispatch(loadPrimoStatus());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading primo status fails', async () => {
        mockApi.onGet(repositories.routes.PRIMO_STATUS_API().apiUrl).reply(500);

        const expectedActions = [actions.PRIMO_STATUS_LOADING, actions.PRIMO_STATUS_FAILED];

        await mockActionsStore.dispatch(loadPrimoStatus());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});

describe('Account action creators', () => {
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
        mockSessionApi = setupSessionMockAdapter();

        Cookies.get = jest.fn().mockImplementation(() => '');
        Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
    });

    afterEach(() => {
        MockDate.reset();
        mockApi.reset();
        mockSessionApi.reset();
        window.sessionStorage.clear();
    });

    it('dispatches expected actions when loading papercut is unauthorised (fails with 403)', async () => {
        mockApi.onGet(repositories.routes.PRINTING_API().apiUrl).reply(403);

        const expectedActions = [actions.PRINT_BALANCE_FAILED];

        await mockActionsStore.dispatch(loadPrintBalance());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading loans is unauthorised (fails with 403)', async () => {
        mockApi.onGet(repositories.routes.PRINTING_API().apiUrl).reply(403);

        const expectedActions = [actions.LOANS_FAILED];

        await mockActionsStore.dispatch(loadLoans());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
