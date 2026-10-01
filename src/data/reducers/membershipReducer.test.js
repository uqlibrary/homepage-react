import membershipReducer, { initialState } from './membershipReducer';
import * as actions from 'data/actions/actionTypes';

describe('membershipReducer', () => {
    it('returns the initial state for an unknown action', () => {
        expect(membershipReducer(undefined, { type: 'SOMETHING_ELSE' })).toEqual(initialState);
    });

    it('marks the record as loading', () => {
        const state = membershipReducer(initialState, { type: actions.MEMBERSHIP_LOADING });
        expect(state.membershipLoading).toBe(true);
        expect(state.membershipError).toBe(false);
    });

    it('stores a loaded record', () => {
        const membership = { id: 'abc-123', type: 'community' };
        const state = membershipReducer(initialState, { type: actions.MEMBERSHIP_LOADED, payload: membership });
        expect(state.membershipLoading).toBe(false);
        expect(state.membership).toEqual(membership);
    });

    it('records a load failure', () => {
        const state = membershipReducer(initialState, { type: actions.MEMBERSHIP_FAILED, payload: 'boom' });
        expect(state.membershipLoading).toBe(false);
        expect(state.membershipError).toBe('boom');
    });

    it('marks the record as saving', () => {
        const state = membershipReducer(initialState, { type: actions.MEMBERSHIP_SAVING });
        expect(state.membershipSaving).toBe(true);
        expect(state.membershipSaved).toBeNull();
        expect(state.membershipSaveError).toBe(false);
    });

    it('stores a saved record as both saved and current', () => {
        const membership = { id: 'abc-123', type: 'community', status: 'unconfirmed' };
        const state = membershipReducer(initialState, { type: actions.MEMBERSHIP_SAVED, payload: membership });
        expect(state.membershipSaving).toBe(false);
        expect(state.membershipSaved).toEqual(membership);
        expect(state.membership).toEqual(membership);
    });

    it('records a save failure', () => {
        const error = { message: 'nope' };
        const state = membershipReducer(initialState, { type: actions.MEMBERSHIP_SAVE_FAILED, payload: error });
        expect(state.membershipSaving).toBe(false);
        expect(state.membershipSaveError).toEqual(error);
    });

    it('clears the record on delete', () => {
        const populated = { ...initialState, membership: { id: 'abc-123' } };
        const state = membershipReducer(populated, { type: actions.MEMBERSHIP_DELETED });
        expect(state.membership).toBeNull();
        expect(state.membershipSaving).toBe(false);
    });

    it('resets to the initial state on clear', () => {
        const populated = { ...initialState, membership: { id: 'abc-123' }, membershipSaving: true };
        expect(membershipReducer(populated, { type: actions.MEMBERSHIP_CLEAR })).toEqual(initialState);
    });
});
