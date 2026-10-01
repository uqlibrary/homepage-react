import membershipTypesReducer, { initialState } from './membershipTypesReducer';
import * as actions from 'data/actions/actionTypes';

describe('membershipTypesReducer', () => {
    it('returns the current state for an action it does not handle', () => {
        expect(membershipTypesReducer(undefined, { type: 'SOMETHING_ELSE' })).toEqual(initialState);
    });

    it('marks the types as loading', () => {
        const state = membershipTypesReducer(initialState, { type: actions.MEMBERSHIP_TYPES_LOADING });

        expect(state.membershipTypesLoading).toBe(true);
        expect(state.membershipTypesError).toBe(false);
    });

    it('stores the loaded types', () => {
        const payload = [{ name: 'community', expiry: '02-08-2027', computed_expiry: '02-08-2027' }];
        const state = membershipTypesReducer(initialState, { type: actions.MEMBERSHIP_TYPES_LOADED, payload });

        expect(state.membershipTypes).toEqual(payload);
        expect(state.membershipTypesLoading).toBe(false);
        expect(state.membershipTypesError).toBe(false);
    });

    it('records a failure', () => {
        const state = membershipTypesReducer(initialState, {
            type: actions.MEMBERSHIP_TYPES_FAILED,
            payload: 'It broke',
        });

        expect(state.membershipTypesError).toBe('It broke');
        expect(state.membershipTypesLoading).toBe(false);
    });
});
