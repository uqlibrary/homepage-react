import * as actions from './actionTypes';
import * as repositories from 'repositories';
import { loadWeeklyHours } from './hoursWeeklyActions';

jest.mock('@sentry/browser');

describe('Weekly hours tests', () => {
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
    it('dispatches expected actions when loading weekly hours fails', async () => {
        mockApi.onGet(repositories.routes.WEEKLYHOURS_API().apiUrl).reply(500);

        const expectedActions = [actions.WEEKLYHOURS_LOADING, actions.APP_ALERT_SHOW, actions.WEEKLYHOURS_FAILED];

        await mockActionsStore.dispatch(loadWeeklyHours());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when loading weekly hours succeeds', async () => {
        mockApi.onGet(repositories.routes.WEEKLYHOURS_API().apiUrl).reply(200);

        const expectedActions = [actions.WEEKLYHOURS_LOADING, actions.WEEKLYHOURS_LOADED];

        await mockActionsStore.dispatch(loadWeeklyHours());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
