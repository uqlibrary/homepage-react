import examLearningResourceReducer, { initialState } from './examLearningResourceReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Exams API call', () => {
        const test = examLearningResourceReducer(emptyState, {
            type: actions.EXAMS_LEARNING_RESOURCES_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            examLearningResourceListLoading: false,
            examLearningResourceListError: 'failed!',
        });
    });

    it('should handle clearing the exams', () => {
        const test = examLearningResourceReducer(emptyState, { type: actions.EXAMS_LEARNING_RESOURCES_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should set exams values when successfully loaded', () => {
        const test = examLearningResourceReducer(emptyState, {
            type: actions.EXAMS_LEARNING_RESOURCES_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            examLearningResourceList: [],
            examLearningResourceListError: false,
            examLearningResourceListLoading: false,
        });
    });

    it('should set exams Status flags to loading when loading', () => {
        const test = examLearningResourceReducer(emptyState, {
            type: actions.EXAMS_LEARNING_RESOURCES_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            examLearningResourceList: null,
            examLearningResourceListError: false,
            examLearningResourceListLoading: true,
        });
    });
});
