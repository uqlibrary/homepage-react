import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {
    loadConfig,
    clearConfig,
    loadFloors,
    clearFloors,
    loadRooms,
    clearRooms,
    loadAssets,
    clearAssets,
    saveInspection,
    clearSaveInspection,
} from './testTagActions';

jest.mock('@sentry/browser');

describe('Test & Tag actions', () => {
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
    // ,,,TEST_TAG_ASSETS_API,TEST_TAG_ASSET_ACTION
    describe('Test & Tag List Config Actions', () => {
        it('handles T&T Config list', async () => {
            mockApi.onGet(repositories.routes.TEST_TAG_CONFIG_API().apiUrl).reply(200, []);

            const expectedActions = [actions.TESTTAG_CONFIG_LOADING, actions.TESTTAG_CONFIG_LOADED];

            await mockActionsStore.dispatch(loadConfig());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when  T&T config call fails', async () => {
            mockApi.onGet(repositories.routes.TEST_TAG_CONFIG_API()).reply(500);

            const expectedActions = [actions.TESTTAG_CONFIG_LOADING, actions.TESTTAG_CONFIG_FAILED];

            await mockActionsStore.dispatch(loadConfig());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear T&T config action', async () => {
            const expectedActions = [actions.TESTTAG_CONFIG_CLEAR];

            await mockActionsStore.dispatch(clearConfig());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
    describe('Test & Tag Floor Actions', () => {
        it('handles T&T floor list', async () => {
            mockApi.onGet(repositories.routes.TEST_TAG_FLOOR_API().apiUrl).reply(200, []);

            const expectedActions = [actions.TESTTAG_FLOOR_LIST_LOADING, actions.TESTTAG_FLOOR_LIST_LOADED];

            await mockActionsStore.dispatch(loadFloors());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when  T&T floor call fails', async () => {
            mockApi.onGet(repositories.routes.TEST_TAG_FLOOR_API()).reply(500);

            const expectedActions = [actions.TESTTAG_FLOOR_LIST_LOADING, actions.TESTTAG_FLOOR_LIST_FAILED];

            await mockActionsStore.dispatch(loadFloors());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear T&T floor action', async () => {
            const expectedActions = [actions.TESTTAG_FLOOR_LIST_CLEAR];

            await mockActionsStore.dispatch(clearFloors());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
    describe('Test & Tag Room Actions', () => {
        it('handles T&T Room list', async () => {
            mockApi.onGet(repositories.routes.TEST_TAG_ROOM_API().apiUrl).reply(200, []);

            const expectedActions = [actions.TESTTAG_ROOM_LIST_LOADING, actions.TESTTAG_ROOM_LIST_LOADED];

            await mockActionsStore.dispatch(loadRooms());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when  T&T floor call fails', async () => {
            mockApi.onGet(repositories.routes.TEST_TAG_ROOM_API()).reply(500);

            const expectedActions = [actions.TESTTAG_ROOM_LIST_LOADING, actions.TESTTAG_ROOM_LIST_FAILED];

            await mockActionsStore.dispatch(loadRooms());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear T&T floor action', async () => {
            const expectedActions = [actions.TESTTAG_ROOM_LIST_CLEAR];

            await mockActionsStore.dispatch(clearRooms());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
    describe('Test & Tag Asset Actions', () => {
        it('handles T&T Asset list', async () => {
            mockApi.onGet(repositories.routes.TEST_TAG_ASSETS_API().apiUrl).reply(200, []);

            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];

            await mockActionsStore.dispatch(loadAssets());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when  T&T asset call fails', async () => {
            mockApi.onGet(repositories.routes.TEST_TAG_ASSETS_API()).reply(500);

            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_FAILED];

            await mockActionsStore.dispatch(loadAssets());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear T&T asset action', async () => {
            const expectedActions = [actions.TESTTAG_ASSETS_CLEAR];

            await mockActionsStore.dispatch(clearAssets());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
    describe('Test & Tag Inspection Actions', () => {
        it('handles T&T Save Inspection list', async () => {
            mockApi.onPost(repositories.routes.TEST_TAG_ASSET_ACTION().apiUrl).reply(200, []);

            const expectedActions = [actions.TESTTAG_SAVE_INSPECTION_SAVING, actions.TESTTAG_SAVE_INSPECTION_SUCCESS];

            await mockActionsStore.dispatch(saveInspection());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when T&T Save Inspection fails', async () => {
            mockApi.onPost(repositories.routes.TEST_TAG_ASSET_ACTION()).reply(500);

            const expectedActions = [actions.TESTTAG_SAVE_INSPECTION_SAVING, actions.TESTTAG_SAVE_INSPECTION_FAILED];

            await mockActionsStore.dispatch(saveInspection());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch clear T&T Save Inspection action', async () => {
            const expectedActions = [actions.TESTTAG_SAVE_INSPECTION_CLEAR];

            await mockActionsStore.dispatch(clearSaveInspection());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
