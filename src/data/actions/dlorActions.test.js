import * as actions from './actionTypes';
import * as repositories from 'repositories';
import { loadAllDLORs, loadADLOR, clearDlor, createDLor } from './dlorActions';
import { DLOR_DETAIL_FAILED } from './actionTypes';

jest.mock('@sentry/browser');

const dlorCreationRequest = {
    contents: 'tba',
};
const dlorCreationResponse = {
    contents: 'tba',
};

describe('DLOR actions', () => {
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

            const expectedActions = [actions.DLOR_LIST_LOADING, actions.DLOR_LIST_FAILED];

            await mockActionsStore.dispatch(loadAllDLORs());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles dlor list', async () => {
            mockApi.onGet(repositories.routes.DLOR_ALL_API().apiUrl).reply(200, []);

            const expectedActions = [actions.DLOR_LIST_LOADING, actions.DLOR_LIST_LOADED];

            await mockActionsStore.dispatch(loadAllDLORs());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when dlor list call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_ALL_API().apiUrl).reply(500);

            const expectedActions = [actions.DLOR_LIST_LOADING, actions.APP_ALERT_SHOW, actions.DLOR_LIST_FAILED];

            await mockActionsStore.dispatch(loadAllDLORs());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('DLOR get actions', () => {
        it('dispatches expected actions when specific dlors call fails', async () => {
            mockApi
                .onGet(repositories.routes.DLOR_GET_BY_ID_API({ id: 'e895b270-d62b-11e7-954e-57c2cc19d151' }))
                .reply(500);

            const expectedActions = [actions.DLOR_DETAIL_LOADING, actions.DLOR_DETAIL_FAILED];

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

            const expectedActions = [actions.DLOR_DETAIL_LOADING, actions.DLOR_DETAIL_LOADED];

            await mockActionsStore.dispatch(loadADLOR('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when a dlor get fails', async () => {
            mockApi
                .onGet(
                    repositories.routes.DLOR_GET_BY_ID_API({
                        id: 'e895b270-d62b-11e7-954e-57c2cc19d151',
                    }).apiUrl,
                )
                .reply(500);

            const expectedActions = [actions.DLOR_DETAIL_LOADING, actions.APP_ALERT_SHOW, actions.DLOR_DETAIL_FAILED];

            await mockActionsStore.dispatch(loadADLOR('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear a dlor action', async () => {
            const expectedActions = [actions.DLOR_DETAIL_CLEAR];

            await mockActionsStore.dispatch(clearDlor());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('DLOR Creation', () => {
        it('dispatches expected actions when dlor create call fails', async () => {
            mockApi.onAny(repositories.routes.DLOR_CREATE_API().apiUrl).reply(500);

            const expectedActions = [actions.DLOR_CREATING, actions.APP_ALERT_SHOW, actions.DLOR_CREATE_FAILED];

            await mockActionsStore.dispatch(createDLor(dlorCreationRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles an spotlight creation request', async () => {
            mockApi.onAny(repositories.routes.DLOR_CREATE_API().apiUrl).reply(200, dlorCreationResponse);

            const expectedActions = [actions.DLOR_CREATING, actions.DLOR_CREATED];

            await mockActionsStore.dispatch(createDLor(dlorCreationRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
