import testTagOnLoadReducer, { initialState } from './testTagOnLoadReducer';
import * as actions from '../actions/actionTypes';

describe('testTagOnLoad reducer', () => {
    let emptyState;
    let mockTestTagList;

    beforeEach(() => {
        mockTestTagList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set onLoad status flags to loading when loading config data', () => {
        const test = testTagOnLoadReducer(emptyState, { type: actions.TESTTAG_CONFIG_LOADING });
        expect(test).toEqual({
            ...emptyState,
            initConfig: null,
            initConfigLoading: true,
            initConfigError: false,
        });
    });

    it('should set onLoad values when successfully loaded', () => {
        const test = testTagOnLoadReducer(emptyState, {
            type: actions.TESTTAG_CONFIG_LOADED,
            payload: mockTestTagList,
        });
        expect(test).toEqual({
            ...emptyState,
            initConfig: mockTestTagList,
            initConfigLoading: false,
            initConfigError: false,
        });
    });

    it('should handle a failing onLoad API call', () => {
        const test = testTagOnLoadReducer(emptyState, {
            type: actions.TESTTAG_CONFIG_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            initConfig: null,
            initConfigLoading: false,
            initConfigError: 'failed!',
        });
    });

    it('should handle clearing the onLoad', () => {
        const test = testTagOnLoadReducer(emptyState, { type: actions.TESTTAG_CONFIG_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});
