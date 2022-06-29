// import { courseReadingList } from 'mock/data/records';
import { default as HIST1201ReadingList } from '../../src/mock/data/records/courseReadingList_HIST1201';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import {
    clearExamLearningResources,
    clearLearningResourceSuggestions,
    clearGuides,
    loadCourseReadingListsSuggestions,
    loadExamLearningResources,
    loadGuides,
    loadReadingLists,
} from './learningResourceActions';
import { accounts } from '../mock/data';

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

    it('dispatches expected actions when possible guides call fails', async () => {
        mockApi.onGet(repositories.routes.GUIDES_API({ keyword: 'FREN1010' })).reply(500);

        const expectedActions = [actions.GUIDES_LOADING, actions.GUIDES_FAILED];

        await mockActionsStore.dispatch(loadGuides('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear guides list action', async () => {
        const expectedActions = [actions.GUIDES_CLEAR];

        await mockActionsStore.dispatch(clearGuides());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('handles a guides get request', async () => {
        mockApi.onGet(repositories.routes.GUIDES_API({ keyword: 'FREN1010' }).apiUrl).reply(200, [{}]);

        const expectedActions = [actions.GUIDES_LOADING, actions.GUIDES_LOADED];

        await mockActionsStore.dispatch(loadGuides('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when possible exams call fails', async () => {
        mockApi.onGet(repositories.routes.LEARNING_RESOURCES_EXAMS_API({ keyword: 'FREN1010' })).reply(500);

        const expectedActions = [actions.EXAMS_LEARNING_RESOURCES_LOADING, actions.EXAMS_LEARNING_RESOURCES_FAILED];

        await mockActionsStore.dispatch(loadExamLearningResources('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear exams list action', async () => {
        const expectedActions = [actions.EXAMS_LEARNING_RESOURCES_CLEAR];

        await mockActionsStore.dispatch(clearExamLearningResources());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('handles an exams get request', async () => {
        mockApi.onGet(repositories.routes.LEARNING_RESOURCES_EXAMS_API({ keyword: 'FREN1010' }).apiUrl).reply(200, {});

        const expectedActions = [actions.EXAMS_LEARNING_RESOURCES_LOADING, actions.EXAMS_LEARNING_RESOURCES_LOADED];

        await mockActionsStore.dispatch(loadExamLearningResources('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    // should never happen
    it('handles an empty reading list', async () => {
        const emptyReadingList = {
            title: 'FREN1010',
            course_title: 'Introductory French 1',
            reading_lists: [
                {
                    campus: 'St Lucia',
                    url: 'http://lr.library.uq.edu.au/lists/162A2ECA-2921-8A7C-CE27-C0B38055B9D7',
                    period: 'Semester 2 2020',
                    list: [],
                },
            ],
        };
        mockApi
            .onGet(
                repositories.routes.READING_LIST_API({
                    coursecode: 'FREN1010',
                    campus: 'St Lucia',
                    semester: 'Semester 2 2020',
                }).apiUrl,
            )
            .reply(200, emptyReadingList);

        const expectedActions = [actions.READING_LIST_LOADING, actions.READING_LIST_LOADED];

        await mockActionsStore.dispatch(loadReadingLists('FREN1010', 'St Lucia', 'Semester 2 2020', accounts.s1111111));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('handles reading list with items of various importance', async () => {
        mockApi
            .onGet(
                repositories.routes.READING_LIST_API({
                    coursecode: 'HIST1201',
                    campus: 'St Lucia',
                    semester: 'Semester 2 2020',
                }).apiUrl,
            )
            .reply(200, HIST1201ReadingList);

        const expectedActions = [actions.READING_LIST_LOADING, actions.READING_LIST_LOADED];

        await mockActionsStore.dispatch(loadReadingLists('HIST1201', 'St Lucia', 'Semester 2 2020', accounts.s1111111));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when possible reading list call fails', async () => {
        mockApi
            .onGet(
                repositories.routes.READING_LIST_API({
                    coursecode: 'FREN1010',
                    campus: 'St Lucia',
                    semester: 'Semester 2 2020',
                }).apiUrl,
            )
            .reply(500);

        const expectedActions = [actions.READING_LIST_LOADING, actions.APP_ALERT_SHOW, actions.READING_LIST_FAILED];

        await mockActionsStore.dispatch(loadReadingLists('FREN1010', 'St Lucia', 'Semester 2 2020', accounts.s1111111));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when possible suggestions call fails', async () => {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: false,
                statusText: 'Internal Server Error',
                status: 500,
            });
        });

        const expectedActions = [
            actions.LEARNING_RESOURCE_SUGGESTIONS_LOADING,
            actions.LEARNING_RESOURCE_SUGGESTIONS_FAILED,
        ];

        await mockActionsStore.dispatch(loadCourseReadingListsSuggestions('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions when the response is invalid', async () => {
        global.fetch = jest.fn(() => {
            return Promise.resolve({});
        });

        const expectedActions = [
            actions.LEARNING_RESOURCE_SUGGESTIONS_LOADING,
            actions.LEARNING_RESOURCE_SUGGESTIONS_FAILED,
        ];

        await mockActionsStore.dispatch(loadCourseReadingListsSuggestions('FREN1010'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear course suggestions list action', async () => {
        const expectedActions = [actions.LEARNING_RESOURCE_SUGGESTIONS_CLEAR];

        await mockActionsStore.dispatch(clearLearningResourceSuggestions());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
