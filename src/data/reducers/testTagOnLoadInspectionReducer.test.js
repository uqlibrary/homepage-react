import testTagOnLoadInspectionReducer, { initialState } from './testTagOnLoadInspectionReducer';
import * as actions from '../actions/actionTypes';

describe('testTagOnLoadInspectionReducer reducer', () => {
    let emptyState;
    let mockTestTagList;

    beforeEach(() => {
        mockTestTagList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set onLoad status flags to loading when loading config data', () => {
        const test = testTagOnLoadInspectionReducer(emptyState, { type: actions.TESTTAG_INSPECTION_CONFIG_LOADING });
        expect(test).toEqual({
            ...emptyState,
            inspectionConfig: null,
            inspectionConfigLoading: true,
            inspectionConfigError: false,
        });
    });

    it('should set onLoad values when successfully loaded', () => {
        const test = testTagOnLoadInspectionReducer(emptyState, {
            type: actions.TESTTAG_INSPECTION_CONFIG_LOADED,
            payload: mockTestTagList,
        });
        expect(test).toEqual({
            ...emptyState,
            inspectionConfig: mockTestTagList,
            inspectionConfigLoading: false,
            inspectionConfigError: false,
        });
    });

    it('should handle a failing onLoad API call', () => {
        const test = testTagOnLoadInspectionReducer(emptyState, {
            type: actions.TESTTAG_INSPECTION_CONFIG_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            inspectionConfig: null,
            inspectionConfigLoading: false,
            inspectionConfigError: 'failed!',
        });
    });

    it('should handle clearing the onLoad', () => {
        const test = testTagOnLoadInspectionReducer(emptyState, { type: actions.TESTTAG_INSPECTION_CONFIG_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});
