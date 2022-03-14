import * as actions from './actionTypes';
import * as repositories from 'repositories';
import { clearExamSuggestions, loadExamSuggestions } from './examSuggestionActions';

jest.mock('raven-js');

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
        mockApi.onGet(repositories.routes.EXAMS_SUGGESTION_API({ keyword: 'FREN1' }).apiUrl).reply(200, {});

        const expectedActions = [actions.EXAM_SUGGESTIONS_LOADING, actions.EXAM_SUGGESTIONS_LOADED];

        await mockActionsStore.dispatch(loadExamSuggestions('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear exams list action', async () => {
        const expectedActions = [actions.EXAM_SUGGESTIONS_CLEAR];

        await mockActionsStore.dispatch(clearExamSuggestions());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when possible exams call fails', async () => {
        mockApi.onGet(repositories.routes.EXAMS_SUGGESTION_API({ keyword: 'FREN1' })).reply(500);

        const expectedActions = [actions.EXAM_SUGGESTIONS_LOADING, actions.EXAM_SUGGESTIONS_FAILED];

        await mockActionsStore.dispatch(loadExamSuggestions('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
