// import { courseReadingList } from 'mock/data/records';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import { loadAllAlerts, clearAlerts, loadAnAlert, clearAnAlert, createAlert } from './alertsActions';

jest.mock('raven-js');

const newAlertRecord = {
    start: '2022-10-12 09:58:02',
    end: '2022-11-22 09:58:02',
    title: 'title add',
    body: 'body add',
    urgent: 1,
};

describe('Account action creators', () => {
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

    it('dispatches expected actions when all alerts call fails', async () => {
        mockApi.onGet(repositories.routes.ALERTS_ALL_API()).reply(500);

        const expectedActions = [actions.ALERTS_LOADING, actions.ALERTS_FAILED];

        await mockActionsStore.dispatch(loadAllAlerts());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when specific alerts call fails', async () => {
        mockApi.onGet(repositories.routes.ALERTS_BY_ID_API({ id: 'e895b270-d62b-11e7-954e-57c2cc19d151' })).reply(500);

        const expectedActions = [actions.ALERTS_LOADING, actions.ALERTS_FAILED];

        await mockActionsStore.dispatch(loadAnAlert('e895b270-d62b-11e7-954e-57c2cc19d151'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear alerts list action', async () => {
        const expectedActions = [actions.ALERTS_CLEAR];

        await mockActionsStore.dispatch(clearAlerts());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear an alert action', async () => {
        const expectedActions = [actions.ALERTS_CLEAR];

        await mockActionsStore.dispatch(clearAnAlert());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('handles alerts list', async () => {
        mockApi.onGet(repositories.routes.ALERTS_ALL_API().apiUrl).reply(200, []);

        const expectedActions = [actions.ALERTS_LOADING, actions.ALERTS_LOADED];

        await mockActionsStore.dispatch(loadAllAlerts());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('handles an alert get request', async () => {
        mockApi
            .onGet(
                repositories.routes.ALERTS_BY_ID_API({
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

        const expectedActions = [actions.ALERTS_LOADING, actions.ALERTS_LOADED];

        await mockActionsStore.dispatch(loadAnAlert('e895b270-d62b-11e7-954e-57c2cc19d151'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when alert list call fails', async () => {
        mockApi.onGet(repositories.routes.ALERTS_ALL_API().apiUrl).reply(500);

        const expectedActions = [actions.ALERTS_LOADING, actions.APP_ALERT_SHOW, actions.ALERTS_FAILED];

        await mockActionsStore.dispatch(loadAllAlerts());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when an alert get fails', async () => {
        mockApi
            .onGet(
                repositories.routes.ALERTS_BY_ID_API({
                    id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                }).apiUrl,
            )
            .reply(500);

        const expectedActions = [actions.ALERTS_LOADING, actions.APP_ALERT_SHOW, actions.ALERTS_FAILED];

        await mockActionsStore.dispatch(loadAnAlert('e895b270-d62b-11e7-954e-57c2cc19d151'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when alert create call fails', async () => {
        mockApi.onAny(repositories.routes.ALERT_ADD().apiUrl).reply(500);

        const expectedActions = [actions.ALERTS_LOADING, actions.APP_ALERT_SHOW, actions.ALERTS_FAILED];

        await mockActionsStore.dispatch(createAlert(newAlertRecord));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('handles an alert creation request', async () => {
        mockApi.onAny(repositories.routes.ALERT_ADD().apiUrl).reply(200, {
            id: '88888-d62b-11e7-954e-57c2cc19d151',
            ...newAlertRecord,
        });

        const expectedActions = [actions.ALERTS_LOADING, actions.ALERT_LOADED];

        await mockActionsStore.dispatch(createAlert(newAlertRecord));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
