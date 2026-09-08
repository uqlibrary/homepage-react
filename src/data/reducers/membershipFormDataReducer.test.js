import * as actions from 'data/actions/actionTypes';
import membershipFormDataReducer, { initialState } from './membershipFormDataReducer';

describe('membershipFormDataReducer', () => {
    const formData = { account_types: [{ value: 'alumni', title: 'UQ Alumni' }], titles: ['Mr', 'Ms'] };

    it('returns the initial state by default', () => {
        expect(membershipFormDataReducer(undefined, { type: 'SOMETHING_ELSE' })).toEqual(initialState);
    });

    it('leaves state untouched for an action it does not handle', () => {
        const state = { ...initialState, membershipFormData: formData };
        expect(membershipFormDataReducer(state, { type: 'SOMETHING_ELSE' })).toBe(state);
    });

    it('marks the form data as loading', () => {
        const result = membershipFormDataReducer(initialState, { type: actions.MEMBERSHIP_FORM_DATA_LOADING });

        expect(result.membershipFormDataLoading).toBe(true);
        expect(result.membershipFormDataError).toBe(false);
    });

    it('stores loaded form data', () => {
        const result = membershipFormDataReducer(initialState, {
            type: actions.MEMBERSHIP_FORM_DATA_LOADED,
            payload: formData,
        });

        expect(result.membershipFormData).toEqual(formData);
        expect(result.membershipFormDataLoading).toBe(false);
        expect(result.membershipFormDataError).toBe(false);
    });

    it('stores a load failure', () => {
        const result = membershipFormDataReducer(initialState, {
            type: actions.MEMBERSHIP_FORM_DATA_FAILED,
            payload: 'It broke',
        });

        expect(result.membershipFormDataError).toBe('It broke');
        expect(result.membershipFormDataLoading).toBe(false);
    });
});
