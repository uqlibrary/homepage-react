import * as actions from 'data/actions/actionTypes';
import appReducer from './app';

describe('app reducer', () => {
    let emptyState;

    const initialState = {
        appAlert: null,
        redirectPath: null,
    };

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('returns the initialState due to an invalid action type', () => {
        const test = appReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('sets an app alert', () => {
        const appAlert = 'This is an alert';
        const test = appReducer(initialState, { type: actions.APP_ALERT_SHOW, payload: appAlert });
        expect(test.appAlert).toEqual(appAlert);
        expect(test).toEqual({
            ...initialState,
            appAlert: appAlert,
        });
    });

    it('hides app alert', () => {
        const test = appReducer({ ...initialState, appAlert: 'A test alert' }, { type: actions.APP_ALERT_HIDE });
        expect(test.appAlert).toBeNull;
        expect(test).toEqual(initialState);
    });

    it('returns the redirect location we are setting', () => {
        const test = appReducer(initialState, {
            type: actions.SET_REDIRECT_PATH,
            payload: '/records/add/find',
        });
        expect(test).toEqual({
            ...initialState,
            redirectPath: '/records/add/find',
        });
    });

    it('clears a redirect', () => {
        const test = appReducer(
            { ...initialState, redirectPath: 'some/redirect/path' },
            { type: actions.CLEAR_REDIRECT_PATH },
        );
        expect(test.redirectPath).toBeNull;
        expect(test).toEqual(initialState);
    });

    // it('should set Learning Resource suggestions to null when failed loading', () => {
    //     const test = appReducer(emptyState, { type: actions.LEARNING_RESOURCE_SUGGESTIONS_FAILED });
    //     expect(test).toEqual({
    //         ...emptyState,
    //         CRsuggestionsLoading: false,
    //         CRsuggestionsError: action.payload,
    //     });
    // });
});
