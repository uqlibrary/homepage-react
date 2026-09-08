import * as actions from 'data/actions/actionTypes';
import membershipRenewingReducer, { initialState } from './membershipRenewingReducer';

describe('membershipRenewingReducer', () => {
    const renewing = { renewing: true, type: 'hospital', id: 'abc-123', renewal_code: 'the-code' };

    it('returns the initial state by default', () => {
        expect(membershipRenewingReducer(undefined, { type: 'SOMETHING_ELSE' })).toEqual(initialState);
    });

    it('leaves state untouched for an action it does not handle', () => {
        const state = { ...initialState, membershipRenewing: renewing };
        expect(membershipRenewingReducer(state, { type: 'SOMETHING_ELSE' })).toBe(state);
    });

    it('marks the check as loading', () => {
        const result = membershipRenewingReducer(initialState, { type: actions.MEMBERSHIP_RENEWING_LOADING });

        expect(result.membershipRenewingLoading).toBe(true);
        expect(result.membershipRenewingError).toBe(false);
    });

    it('stores the renewal eligibility', () => {
        const result = membershipRenewingReducer(initialState, {
            type: actions.MEMBERSHIP_RENEWING_LOADED,
            payload: renewing,
        });

        expect(result.membershipRenewing).toEqual(renewing);
        expect(result.membershipRenewingLoading).toBe(false);
        expect(result.membershipRenewingError).toBe(false);
    });

    it('stores a check failure', () => {
        const result = membershipRenewingReducer(initialState, {
            type: actions.MEMBERSHIP_RENEWING_FAILED,
            payload: 'It broke',
        });

        expect(result.membershipRenewingError).toBe('It broke');
        expect(result.membershipRenewingLoading).toBe(false);
    });
});
