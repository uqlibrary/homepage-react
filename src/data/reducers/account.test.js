import * as actions from 'data/actions/actionTypes';
import accountReducer, { initialState, initSavingState } from './account';

describe('account reducer', () => {
    let emptyState;
    let mockAccount;

    beforeEach(() => {
        mockAccount = {
            author: 'loaded',
        };
        emptyState = {
            ...initialState,
            ...initSavingState,
        };
    });

    it('should set values for anon account', () => {
        const test = accountReducer(emptyState, { type: actions.CURRENT_ACCOUNT_ANONYMOUS });
        expect(test).toEqual({
            ...emptyState,
            account: null,
            accountLoading: false,
            accountAuthorLoading: false,
        });
    });

    it('should set account value when successfully loaded', () => {
        const test = accountReducer(emptyState, { type: actions.CURRENT_ACCOUNT_LOADED, payload: mockAccount });
        expect(test).toEqual({
            ...emptyState,
            account: mockAccount,
            accountLoading: false,
        });
    });

    it('should set author value when successfully loaded', () => {
        const test = accountReducer(emptyState, { type: actions.CURRENT_AUTHOR_LOADED, payload: mockAccount });
        expect(test).toEqual({
            ...emptyState,
            author: mockAccount,
            accountAuthorLoading: false,
        });
    });

    it('should set account loading flags to true when loading account', () => {
        const test = accountReducer(emptyState, { type: actions.CURRENT_ACCOUNT_LOADING });
        expect(test).toEqual({
            ...emptyState,
            accountLoading: true,
        });
    });

    it('should set author loading flag to true when loading author', () => {
        const test = accountReducer(emptyState, { type: actions.CURRENT_AUTHOR_LOADING });
        expect(test).toEqual({
            ...emptyState,
            author: null,
            accountAuthorLoading: true,
        });
    });

    it('should set author to null when failed loading', () => {
        const test = accountReducer(emptyState, { type: actions.CURRENT_AUTHOR_FAILED });
        expect(test).toEqual({
            ...emptyState,
            author: null,
            accountLoading: false,
            accountAuthorLoading: false,
        });
    });

    it('should not modify state if invalid action type', () => {
        const test = accountReducer(emptyState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should set saving author flag to true when saving author', () => {
        const test = accountReducer(emptyState, { type: 'CURRENT_AUTHOR_SAVING' });
        expect(test).toEqual({
            ...emptyState,
            accountAuthorSaving: true,
            accountAuthorError: null,
        });
    });

    it('should set error message when saving author failed', () => {
        const test = accountReducer(emptyState, { type: 'CURRENT_AUTHOR_SAVE_FAILED', payload: 'failed!' });
        expect(test).toEqual({
            ...emptyState,
            accountAuthorSaving: false,
            accountAuthorError: 'failed!',
        });
    });

    it('should set error message when saving author failed', () => {
        const beforeState = {
            ...emptyState,
            accountAuthorSaving: true,
            accountAuthorError: 'failed!',
        };

        const test = accountReducer(beforeState, { type: 'CURRENT_AUTHOR_SAVE_RESET' });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('set author to new value if save successful', () => {
        const beforeState = {
            ...emptyState,
            accountAuthorSaving: true,
            accountAuthorError: 'failed!',
        };

        const testAuthor = { author: 'newAuthor' };

        const test = accountReducer(beforeState, { type: 'CURRENT_AUTHOR_SAVED', payload: testAuthor });
        expect(test).toEqual({
            ...emptyState,
            author: { ...testAuthor },
        });
    });

    it('set current user session expired to true', () => {
        const test = accountReducer(emptyState, { type: 'CURRENT_ACCOUNT_SESSION_EXPIRED' });
        expect(test).toEqual({
            ...emptyState,
            isSessionExpired: true,
        });
    });

    it('set current user session expired to false', () => {
        const test = accountReducer(emptyState, { type: 'CURRENT_ACCOUNT_SESSION_VALID' });
        expect(test).toEqual({
            ...emptyState,
            isSessionExpired: false,
        });
    });

    it('set current user session expired to null', () => {
        const test = accountReducer(emptyState, { type: 'CLEAR_CURRENT_ACCOUNT_SESSION_FLAG' });
        expect(test).toEqual({
            ...emptyState,
            isSessionExpired: null,
        });
    });

    it('should set hours to null when failed loading', () => {
        const test = accountReducer(emptyState, { type: actions.LIB_HOURS_FAILED });
        expect(test).toEqual({
            ...emptyState,
            libHours: null,
            libHoursLoading: false,
            libHoursError: true,
        });
    });

    it('should set training to null when failed loading', () => {
        const test = accountReducer(emptyState, { type: actions.TRAINING_FAILED });
        expect(test).toEqual({
            ...emptyState,
            trainingEvents: null,
            trainingEventsLoading: false,
            trainingEventsError: true,
        });
    });

    it('should set library hours value when successfully loaded library hours', () => {
        const test = accountReducer(emptyState, { type: actions.LIB_HOURS_LOADED, payload: [] });
        expect(test).toEqual({
            ...emptyState,
            libHours: [],
            libHoursLoading: false,
            libHoursError: false,
        });
    });

    it('should set library hours loading flag to true when loading library hours', () => {
        const test = accountReducer(emptyState, { type: actions.LIB_HOURS_LOADING });
        expect(test).toEqual({
            ...emptyState,
            libHours: null,
            libHoursLoading: true,
            libHoursError: false,
        });
    });

    it('should set vemcount to null when failed loading', () => {
        const test = accountReducer(emptyState, { type: actions.VEMCOUNT_FAILED });
        expect(test).toEqual({
            ...emptyState,
            vemcount: null,
            vemcountLoading: false,
            vemcountError: true,
        });
    });

    it('should set vemcount value when successfully loaded', () => {
        const test = accountReducer(emptyState, { type: actions.VEMCOUNT_LOADED, payload: [] });
        expect(test).toEqual({
            ...emptyState,
            vemcount: [],
            vemcountLoading: false,
            vemcountError: false,
        });
    });

    it('should set vemcount loading flag to true when loading library hours', () => {
        const test = accountReducer(emptyState, { type: actions.VEMCOUNT_LOADING });
        expect(test).toEqual({
            ...emptyState,
            vemcount: null,
            vemcountLoading: true,
            vemcountError: false,
        });
    });

    it('should set training value when successfully loaded', () => {
        const test = accountReducer(emptyState, { type: actions.TRAINING_LOADED, payload: [] });
        expect(test).toEqual({
            ...emptyState,
            trainingEvents: [],
            trainingEventsLoading: false,
            trainingEventsError: false,
        });
    });

    it('should set training loading flag to true when loading library hours', () => {
        const test = accountReducer(emptyState, { type: actions.TRAINING_LOADING });
        expect(test).toEqual({
            ...emptyState,
            trainingEvents: null,
            trainingEventsLoading: true,
            trainingEventsError: false,
        });
    });
});
