import guidesReducer, { initialState } from './guidesReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Guides API call', () => {
        const test = guidesReducer(emptyState, {
            type: actions.GUIDES_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            guideListLoading: false,
            guideListError: 'failed!',
        });
    });

    it('should handle clearing the guides', () => {
        const test = guidesReducer(emptyState, { type: actions.GUIDES_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});
