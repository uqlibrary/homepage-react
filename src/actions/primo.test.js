import * as actions from './actionTypes';
import * as repositories from 'repositories';
import { clearPrimoSuggestions, loadPrimoSuggestions } from './primo';

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

    it('dispatches expected actions when possible Primo search suggestions call fails', async () => {
        mockApi.onGet(repositories.routes.PRIMO_SUGGESTIONS_API_GENERIC({ keyword: 'beard' })).reply(500);

        const expectedActions = [actions.PRIMO_SUGGESTIONS_LOADING, actions.PRIMO_SUGGESTIONS_FAILED];

        await mockActionsStore.dispatch(loadPrimoSuggestions('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear Primo search suggestion list action', async () => {
        const expectedActions = [actions.PRIMO_SUGGESTIONS_CLEAR];

        await mockActionsStore.dispatch(clearPrimoSuggestions());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when possible Exams search suggestions call fails', async () => {
        mockApi.onGet(repositories.routes.PRIMO_SUGGESTIONS_API_EXAMS({ keyword: 'FREN1' })).reply(500);

        const expectedActions = [actions.PRIMO_SUGGESTIONS_LOADING, actions.PRIMO_SUGGESTIONS_FAILED];

        await mockActionsStore.dispatch(loadPrimoSuggestions('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when possible Homepage Course Reading Lists search suggestions call fails', async () => {
        mockApi.onGet(repositories.routes.SUGGESTIONS_API_PAST_COURSE({ keyword: 'FREN1' })).reply(500);

        const expectedActions = [actions.PRIMO_SUGGESTIONS_LOADING, actions.PRIMO_SUGGESTIONS_FAILED];

        await mockActionsStore.dispatch(loadPrimoSuggestions('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
