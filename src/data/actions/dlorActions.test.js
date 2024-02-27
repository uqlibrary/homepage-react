import * as actions from './actionTypes';
import * as repositories from 'repositories';
import { loadAllDLORs, loadADLOR } from './dlorActions';

jest.mock('@sentry/browser');

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

    describe('Dlor list Actions', () => {
        it('dispatches expected actions when all dlors call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_ALL_API()).reply(500);

            const expectedActions = [actions.DLOR_HOMEPAGE_LOADING, actions.DLOR_HOMEPAGE_FAILED];

            await mockActionsStore.dispatch(loadAllDLORs());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles dlor list', async () => {
            mockApi.onGet(repositories.routes.DLOR_ALL_API().apiUrl).reply(200, []);

            const expectedActions = [actions.DLOR_HOMEPAGE_LOADING, actions.DLOR_HOMEPAGE_LOADED];

            await mockActionsStore.dispatch(loadAllDLORs());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when alert list call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_ALL_API().apiUrl).reply(500);

            const expectedActions = [
                actions.DLOR_HOMEPAGE_LOADING,
                actions.APP_ALERT_SHOW,
                actions.DLOR_HOMEPAGE_FAILED,
            ];

            await mockActionsStore.dispatch(loadAllDLORs());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('DLOR get actions', () => {
        it('dispatches expected actions when specific alerts call fails', async () => {
            mockApi
                .onGet(repositories.routes.DLOR_GET_BY_ID_API({ id: 'e895b270-d62b-11e7-954e-57c2cc19d151' }))
                .reply(500);

            const expectedActions = [actions.DLOR_VIEWPAGE_LOADING, actions.DLOR_VIEWPAGE_FAILED];

            await mockActionsStore.dispatch(loadADLOR('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles an DLOR get request', async () => {
            mockApi
                .onGet(
                    repositories.routes.DLOR_GET_BY_ID_API({
                        id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    }).apiUrl,
                )
                .reply(200, {
                    object_id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    object_title: 'Test digital learning object',
                });

            const expectedActions = [actions.DLOR_VIEWPAGE_LOADING, actions.DLOR_VIEWPAGE_LOADED];

            await mockActionsStore.dispatch(loadADLOR('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when an alert get fails', async () => {
            mockApi
                .onGet(
                    repositories.routes.DLOR_GET_BY_ID_API({
                        id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    }).apiUrl,
                )
                .reply(500);

            const expectedActions = [
                actions.DLOR_VIEWPAGE_LOADING,
                actions.APP_ALERT_SHOW,
                actions.DLOR_VIEWPAGE_FAILED,
            ];

            await mockActionsStore.dispatch(loadADLOR('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
