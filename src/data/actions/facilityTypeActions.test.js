import * as actions from './actionTypes';
import * as repositories from 'repositories';
import { loadAllFacilityTypes } from './facilityTypeActions';

jest.mock('@sentry/browser');

describe('Facility type action creators', () => {
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

    it('handles a facility type get request', async () => {
        mockApi.onGet(repositories.routes.FACILITY_TYPE_ALL_API().apiUrl).reply(200, {});

        const expectedActions = [actions.FACILITY_TYPE_LOADING, actions.FACILITY_TYPE_LOADED];

        await mockActionsStore.dispatch(loadAllFacilityTypes());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when facility type call fails', async () => {
        mockApi.onGet(repositories.routes.FACILITY_TYPE_ALL_API()).reply(500);

        const expectedActions = [actions.FACILITY_TYPE_LOADING, actions.FACILITY_TYPE_FAILED];

        await mockActionsStore.dispatch(loadAllFacilityTypes());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
