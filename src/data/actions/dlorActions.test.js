import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {
    clearADlor,
    createDlor,
    loadADLOR,
    loadCurrentDLORs,
    loadDlorSubscriptionConfirmation,
    loadDlorUnsubscribe,
    loadFileTypeList,
    loadOwningTeams,
} from './dlorActions';

jest.mock('@sentry/browser');

const dlorCreationRequest = {
    contents: 'tba',
};
const dlorCreationResponse = {
    contents: 'tba',
};

describe('Digital Learning Hub actions', () => {
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
            mockApi.onGet(repositories.routes.DLOR_ALL_CURRENT_API()).reply(500);

            const expectedActions = [actions.DLOR_LIST_LOADING, actions.DLOR_LIST_FAILED];

            await mockActionsStore.dispatch(loadCurrentDLORs());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles dlor list', async () => {
            mockApi.onGet(repositories.routes.DLOR_ALL_CURRENT_API().apiUrl).reply(200, []);

            const expectedActions = [actions.DLOR_LIST_LOADING, actions.DLOR_LIST_LOADED];

            await mockActionsStore.dispatch(loadCurrentDLORs());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when dlor list call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_ALL_CURRENT_API().apiUrl).reply(500);

            const expectedActions = [actions.DLOR_LIST_LOADING, actions.APP_ALERT_SHOW, actions.DLOR_LIST_FAILED];

            await mockActionsStore.dispatch(loadCurrentDLORs());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Digital Learning Hub GET actions', () => {
        it('dispatches expected actions when specific dlors call fails', async () => {
            mockApi
                .onGet(repositories.routes.DLOR_GET_BY_ID_API({ id: 'e895b270-d62b-11e7-954e-57c2cc19d151' }))
                .reply(500);

            const expectedActions = [actions.DLOR_DETAIL_LOADING, actions.DLOR_DETAIL_FAILED];

            await mockActionsStore.dispatch(loadADLOR('e895b270-d62b-11e7-954e-57c2cc19d151'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles an Digital Learning Hub get request', async () => {
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

            await mockActionsStore.dispatch(clearADlor());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Digital Learning Hub Object creation', () => {
        it('dispatches expected actions when dlor create call fails', async () => {
            mockApi.onAny(repositories.routes.DLOR_CREATE_API().apiUrl).reply(500);

            const expectedActions = [actions.DLOR_CREATING, actions.APP_ALERT_SHOW, actions.DLOR_CREATE_FAILED];

            await mockActionsStore.dispatch(createDlor(dlorCreationRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles an spotlight creation request', async () => {
            mockApi.onAny(repositories.routes.DLOR_CREATE_API().apiUrl).reply(200, dlorCreationResponse);

            const expectedActions = [actions.DLOR_CREATING, actions.DLOR_CREATED, actions.DLOR_LIST_LOADING];

            await mockActionsStore.dispatch(createDlor(dlorCreationRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Dlor team list Actions', () => {
        it('dispatches expected actions when all dlors call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_TEAM_LIST_API()).reply(500);

            const expectedActions = [actions.DLOR_TEAMLIST_LOADING, actions.DLOR_TEAMLIST_FAILED];

            await mockActionsStore.dispatch(loadOwningTeams());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles dlor list', async () => {
            mockApi.onGet(repositories.routes.DLOR_TEAM_LIST_API().apiUrl).reply(200, []);

            const expectedActions = [actions.DLOR_TEAMLIST_LOADING, actions.DLOR_TEAMLIST_LOADED];

            await mockActionsStore.dispatch(loadOwningTeams());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when dlor list call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_TEAM_LIST_API().apiUrl).reply(500);

            const expectedActions = [
                actions.DLOR_TEAMLIST_LOADING,
                actions.APP_ALERT_SHOW,
                actions.DLOR_TEAMLIST_FAILED,
            ];

            await mockActionsStore.dispatch(loadOwningTeams());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Dlor file type list Actions', () => {
        it('dispatches expected actions when all dlors call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_FILE_TYPE_LIST_API()).reply(500);

            const expectedActions = [actions.DLOR_FILETYPE_LOADING, actions.DLOR_FILETYPE_FAILED];

            await mockActionsStore.dispatch(loadFileTypeList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles dlor list', async () => {
            mockApi.onGet(repositories.routes.DLOR_FILE_TYPE_LIST_API().apiUrl).reply(200, []);

            const expectedActions = [actions.DLOR_FILETYPE_LOADING, actions.DLOR_FILETYPE_LOADED];

            await mockActionsStore.dispatch(loadFileTypeList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when dlor list call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_FILE_TYPE_LIST_API().apiUrl).reply(500);

            const expectedActions = [
                actions.DLOR_FILETYPE_LOADING,
                actions.APP_ALERT_SHOW,
                actions.DLOR_FILETYPE_FAILED,
            ];

            await mockActionsStore.dispatch(loadFileTypeList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Dlor subscription confirmation Actions', () => {
        it('dispatches expected actions when dlor subscription confirmation call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: '1a1' })).reply(500);

            const expectedActions = [actions.DLOR_UPDATING, actions.DLOR_UPDATE_FAILED];

            await mockActionsStore.dispatch(loadDlorSubscriptionConfirmation('1a1'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles expected actions when dlor subscription confirmation succeeds', async () => {
            mockApi.onAny(repositories.routes.DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: '2b2' }).apiUrl).reply(200, []);

            const expectedActions = [actions.DLOR_UPDATING, actions.DLOR_UPDATED];

            await mockActionsStore.dispatch(loadDlorSubscriptionConfirmation('2b2'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('Dlor UNsubscription confirmation Actions', () => {
        it('dispatches expected actions when dlor unsubscription confirmation call fails', async () => {
            mockApi.onGet(repositories.routes.DLOR_UNSUBSCRIBE_API({ id: '1a1' })).reply(500);

            const expectedActions = [actions.DLOR_UPDATING, actions.DLOR_UPDATE_FAILED];

            await mockActionsStore.dispatch(loadDlorUnsubscribe('1a1'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('handles expected actions when dlor unsubscription confirmation succeeds', async () => {
            mockApi.onAny(repositories.routes.DLOR_UNSUBSCRIBE_API({ id: '2b2' }).apiUrl).reply(200, []);

            const expectedActions = [actions.DLOR_UPDATING, actions.DLOR_UPDATED];

            await mockActionsStore.dispatch(loadDlorUnsubscribe('2b2'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
