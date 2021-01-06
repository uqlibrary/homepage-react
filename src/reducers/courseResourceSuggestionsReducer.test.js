import courseResourceSuggestionsReducer, { initialState } from './courseResourceSuggestionsReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Course Resource Suggestions API call', () => {
        const test = courseResourceSuggestionsReducer(emptyState, {
            type: actions.COURSE_RESOURCE_SUGGESTIONS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            CRsuggestionsLoading: false,
            CRsuggestionsError: 'failed!',
        });
    });
});
