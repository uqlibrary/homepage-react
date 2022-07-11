// import { courseReadingList } from 'mock/data/records';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {
    clearAlerts,
    clearAnAlert,
    createAlert,
    deleteAlert,
    loadAllAlerts,
    loadAnAlert,
    saveAlertChange,
    stripSeconds,
} from './alertsActions';

jest.mock('@sentry/browser');

const newAlertRecord = {
    start: '2022-10-12 09:58:02',
    end: '2022-11-22 09:58:02',
    title: 'title add',
    body: 'body add',
    urgent: 1,
};

describe('Alert actions', () => {
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
        mockSessionApi = setupSessionMockAdapter();
    });

    afterEach(() => {
        MockDate.reset();
        mockApi.reset();
        mockSessionApi.reset();
    });

    describe('Alert list Actions', () => {
        it('dispatches expected actions when all alerts call fails', async () => {
            mockApi.onGet(repositories.routes.ALERTS_ALL_API()).reply(500);

            const expectedActions = [actions.ALERTS_CLEAR, actions.ALERTS_LOADING, actions.ALERTS_FAILED];

            await mockActionsStore.dispatch(loadAllAlerts());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear alerts list action', async () => {
            const expectedActions = [actions.ALERTS_CLEAR];

            await mockActionsStore.dispatch(clearAlerts());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles alerts list', async () => {
            mockApi.onGet(repositories.routes.ALERTS_ALL_API().apiUrl).reply(200, []);

            const expectedActions = [actions.ALERTS_CLEAR, actions.ALERTS_LOADING, actions.ALERTS_LOADED];

            await mockActionsStore.dispatch(loadAllAlerts());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when alert list call fails', async () => {
            mockApi.onGet(repositories.routes.ALERTS_ALL_API().apiUrl).reply(500);

            const expectedActions = [
                actions.ALERTS_CLEAR,
                actions.ALERTS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.ALERTS_FAILED,
            ];

            await mockActionsStore.dispatch(loadAllAlerts());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Alert get actions', () => {
        it('dispatches expected actions when specific alerts call fails', async () => {
            mockApi
                .onGet(repositories.routes.ALERT_BY_ID_API({ id: 'e895b270-d62b-11e7-954e-57c2cc19d151' }))
                .reply(500);

            const expectedActions = [actions.ALERT_LOADING, actions.ALERT_FAILED];

            await mockActionsStore.dispatch(loadAnAlert('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear an alert action', async () => {
            const expectedActions = [actions.ALERT_CLEAR];

            await mockActionsStore.dispatch(clearAnAlert());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles an alert get request', async () => {
            mockApi
                .onGet(
                    repositories.routes.ALERT_BY_ID_API({
                        id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    }).apiUrl,
                )
                .reply(200, {
                    id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    start: '2022-10-12 09:58:02',
                    end: '2022-11-22 09:58:02',
                    title: 'Test urgent alert 2',
                    body:
                        '[urgent link description](http://www.somelink.com) Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    urgent: 1,
                });

            const expectedActions = [actions.ALERT_LOADING, actions.ALERT_LOADED];

            await mockActionsStore.dispatch(loadAnAlert('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when an alert get fails', async () => {
            mockApi
                .onGet(
                    repositories.routes.ALERT_BY_ID_API({
                        id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    }).apiUrl,
                )
                .reply(500);

            const expectedActions = [actions.ALERT_LOADING, actions.APP_ALERT_SHOW, actions.ALERT_FAILED];

            await mockActionsStore.dispatch(loadAnAlert('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Alert creation actions', () => {
        it('dispatches expected actions when alert create call fails', async () => {
            mockApi.onAny(repositories.routes.ALERT_CREATE_API().apiUrl).reply(500);

            const expectedActions = [actions.ALERT_LOADING, actions.APP_ALERT_SHOW, actions.ALERT_FAILED];

            await mockActionsStore.dispatch(createAlert(newAlertRecord));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles an alert creation request', async () => {
            mockApi.onAny(repositories.routes.ALERT_CREATE_API().apiUrl).reply(200, {
                id: '88888-d62b-11e7-954e-57c2cc19d151',
                ...newAlertRecord,
            });

            const expectedActions = [actions.ALERT_LOADING, actions.ALERT_SAVED];

            await mockActionsStore.dispatch(createAlert(newAlertRecord));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Alert deletion actions', () => {
        it('handles an alert delete request', async () => {
            mockApi
                .onAny(repositories.routes.ALERT_DELETE_API({ id: '88888-d62b-11e7-954e-57c2cc19d151' }).apiUrl)
                .reply(200, []);

            const expectedActions = [actions.ALERT_LOADING, actions.ALERT_DELETED];

            await mockActionsStore.dispatch(deleteAlert('88888-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when alert delete call fails', async () => {
            mockApi.onDelete(repositories.routes.ALERT_DELETE_API({ id: 'id' }).apiUrl).reply(403);

            try {
                const expectedActions = [actions.ALERT_LOADING, actions.ALERT_FAILED];
                await mockActionsStore.dispatch(deleteAlert('id'));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                const expectedActions = [
                    actions.ALERT_LOADING,
                    actions.CURRENT_ACCOUNT_ANONYMOUS,
                    actions.ALERT_FAILED,
                ];
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('Alert save actions', () => {
        it('handles an alert save request', async () => {
            mockApi
                .onAny(repositories.routes.ALERT_SAVE_API({ id: '88888-d62b-11e7-954e-57c2cc19d151' }).apiUrl)
                .reply(200, {
                    id: '88888-d62b-11e7-954e-57c2cc19d151',
                    ...newAlertRecord,
                });

            const expectedActions = [actions.ALERT_LOADING, actions.ALERT_SAVED];

            await mockActionsStore.dispatch(
                saveAlertChange({
                    id: '88888-d62b-11e7-954e-57c2cc19d151',
                    ...newAlertRecord,
                }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when alert save call fails', async () => {
            mockApi.onAny(repositories.routes.ALERT_SAVE_API({ id: 'id' }).apiUrl).reply(500);

            const expectedActions = [actions.ALERT_LOADING, actions.ALERT_FAILED];

            await mockActionsStore.dispatch(saveAlertChange(newAlertRecord));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('unit tests', () => {
        it('unit tests stripSeconds function', () => {
            expect(stripSeconds('2022-10-12 09:58:02')).toEqual('2022-10-12 09:58');
            expect(stripSeconds('invalid_date')).toEqual('invalid_date');
        });
    });
});
