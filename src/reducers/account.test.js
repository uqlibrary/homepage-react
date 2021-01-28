import * as actions from 'actions/actionTypes';
import accountReducer from './account';
import chatReducer from './chat';
import { initialState, initSavingState } from './account';

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
            accountAuthorDetailsLoading: false,
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

    // it('should set author details value when successfully loaded', () => {
    //     const test = accountReducer(emptyState, { type: actions.CURRENT_AUTHOR_DETAILS_LOADED, payload: mockAccount });
    //     expect(test).toEqual({
    //         ...emptyState,
    //         authorDetails: mockAccount,
    //         accountAuthorDetailsLoading: false,
    //     });
    // });

    it('should set account loading flags to true when loading account', () => {
        const test = accountReducer(emptyState, { type: actions.CURRENT_ACCOUNT_LOADING });
        expect(test).toEqual({
            ...emptyState,
            accountLoading: true,
        });
    });

    // it('should set author details loading flag to true when loading author details', () => {
    //     const test = accountReducer(emptyState, { type: actions.CURRENT_AUTHOR_DETAILS_LOADING });
    //     expect(test).toEqual({
    //         ...emptyState,
    //         authorDetails: null,
    //         accountAuthorDetailsLoading: true,
    //     });
    // });

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

    // it('should set author details to null when failed loading', () => {
    //     const test = accountReducer(emptyState, { type: actions.CURRENT_AUTHOR_DETAILS_FAILED });
    //     expect(test).toEqual({
    //         ...emptyState,
    //         authorDetails: null,
    //         accountAuthorDetailsLoading: false,
    //     });
    // });

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

    it('should set chat status loading flags to true when loading account', () => {
        const test = chatReducer(emptyState, { type: actions.CHAT_STATUS_LOADING });
        expect(test).toEqual({
            ...emptyState,
            chatStatus: null,
        });
    });

    it('should set chat status online when chat available', () => {
        const test = chatReducer(emptyState, { type: actions.CHAT_STATUS_LOADED, payload: { online: true } });
        expect(test).toEqual({
            ...emptyState,
            chatStatus: { online: true },
        });
    });

    it('should set chat status offline when chat offline', () => {
        const test = chatReducer(emptyState, { type: actions.CHAT_STATUS_LOADED, payload: { online: false } });
        expect(test).toEqual({
            ...emptyState,
            chatStatus: { online: false },
        });
    });

    it('should set chat status to null when failed loading', () => {
        const test = chatReducer(emptyState, { type: actions.CHAT_STATUS_FAILED });
        expect(test).toEqual({
            ...emptyState,
            chatStatus: { online: 'failed' },
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

    it('should set computer availability to null when failed loading', () => {
        const test = accountReducer(emptyState, { type: actions.COMP_AVAIL_FAILED });
        expect(test).toEqual({
            ...emptyState,
            computerAvailability: null,
            computerAvailabilityLoading: false,
            computerAvailabilityError: true,
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
});
