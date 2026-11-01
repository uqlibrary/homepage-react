import * as actions from 'data/actions/actionTypes';
import membershipListReducer, { initialState } from './membershipListReducer';

describe('membershipListReducer', () => {
    const memberships = [{ id: 'abc-123' }, { id: 'def-456' }];

    it('returns the initial state by default', () => {
        expect(membershipListReducer(undefined, { type: 'SOMETHING_ELSE' })).toEqual(initialState);
    });

    it('leaves state untouched for an action it does not handle', () => {
        const state = { ...initialState, memberships };
        expect(membershipListReducer(state, { type: 'SOMETHING_ELSE' })).toBe(state);
    });

    it('marks the listing as loading', () => {
        const result = membershipListReducer(initialState, { type: actions.MEMBERSHIPS_LOADING });

        expect(result.membershipsLoading).toBe(true);
        expect(result.membershipsError).toBe(false);
    });

    it('stores a loaded page with its pagination and counts', () => {
        const pagination = { total: 42, page: 1, per_page: 20, pages: 3 };
        const counts = { all: 42, unconfirmed: 10, renewing: 12, confirmed: 20 };
        const result = membershipListReducer(initialState, {
            type: actions.MEMBERSHIPS_LOADED,
            payload: { memberships, pagination, counts },
        });

        expect(result.memberships).toEqual(memberships);
        expect(result.pagination).toEqual(pagination);
        expect(result.counts).toEqual(counts);
        expect(result.membershipsLoading).toBe(false);
        expect(result.membershipsError).toBe(false);
    });

    it('stores a load failure', () => {
        const result = membershipListReducer(initialState, { type: actions.MEMBERSHIPS_FAILED, payload: 'It broke' });

        expect(result.membershipsError).toBe('It broke');
        expect(result.membershipsLoading).toBe(false);
    });

    it('clears back to the initial state', () => {
        const state = { ...initialState, memberships, membershipsError: 'It broke' };
        expect(membershipListReducer(state, { type: actions.MEMBERSHIPS_CLEAR })).toEqual(initialState);
    });
});
