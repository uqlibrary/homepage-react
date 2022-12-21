import testTagSaveInspectionReducer, { initialState } from './testTagSaveInspectionReducer';
import * as actions from '../actions/actionTypes';

describe('testTagSaveInspectionReducer', () => {
    let emptyState;
    let mockTestTagList;

    beforeEach(() => {
        mockTestTagList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set inspection status flags to loading when loading asset data', () => {
        const test = testTagSaveInspectionReducer(emptyState, { type: actions.TESTTAG_SAVE_INSPECTION_SAVING });
        expect(test).toEqual({
            ...emptyState,
            saveInspectionSaving: true,
            saveInspectionSuccess: null,
            saveInspectionError: null,
        });
    });

    it('should set inspection values when successfully loaded', () => {
        const test = testTagSaveInspectionReducer(emptyState, {
            type: actions.TESTTAG_SAVE_INSPECTION_SUCCESS,
            payload: mockTestTagList,
        });
        expect(test).toEqual({
            ...emptyState,
            saveInspectionSaving: false,
            saveInspectionSuccess: mockTestTagList,
            saveInspectionError: null,
        });
    });

    it('should handle a failing inspection API call', () => {
        const test = testTagSaveInspectionReducer(emptyState, {
            type: actions.TESTTAG_SAVE_INSPECTION_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            saveInspectionSaving: false,
            saveInspectionSuccess: null,
            saveInspectionError: 'failed!',
        });
    });

    it('should handle clearing the inspections', () => {
        const test = testTagSaveInspectionReducer(emptyState, { type: actions.TESTTAG_SAVE_INSPECTION_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});
