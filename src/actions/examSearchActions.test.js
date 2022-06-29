import * as actions from './actionTypes';
import * as repositories from 'repositories';
import { clearExamSearch, loadExamSearch } from './examSearchActions';

// jest.mock('raven-js');
jest.mock('@sentry/browser');

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

    it('handles an exams get request', async () => {
        mockApi.onGet(repositories.routes.EXAMS_SEARCH_API('FREN1010').apiUrl).reply(200, {});

        const expectedActions = [actions.EXAM_SEARCH_LOADING, actions.EXAM_SEARCH_LOADED];

        await mockActionsStore.dispatch(loadExamSearch('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear exams list action', async () => {
        const expectedActions = [actions.EXAM_SEARCH_CLEAR];

        await mockActionsStore.dispatch(clearExamSearch());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when possible exams call fails', async () => {
        mockApi.onGet(repositories.routes.EXAMS_SEARCH_API('FREN1010')).reply(500);

        const expectedActions = [actions.EXAM_SEARCH_LOADING, actions.EXAM_SEARCH_FAILED];

        await mockActionsStore.dispatch(loadExamSearch('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
