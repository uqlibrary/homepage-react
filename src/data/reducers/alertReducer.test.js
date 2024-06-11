import alertReducer, { initialState } from './alertReducer';
import * as actions from '../actions/actionTypes';

describe('alert reducer', () => {
    let emptyState;
    let mockAlertList;

    beforeEach(() => {
        mockAlertList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set alert values when successfully loaded', () => {
        const test = alertReducer(emptyState, { type: actions.ALERT_LOADED, payload: mockAlertList });
        expect(test).toEqual({
            ...emptyState,
            alert: mockAlertList,
            alertStatus: 'loaded',
            alertError: false,
        });
    });

    it('should set alerts value when successfully saved', () => {
        const test = alertReducer(emptyState, { type: actions.ALERT_SAVED, payload: mockAlertList });
        expect(test).toEqual({
            ...emptyState,
            alert: mockAlertList,
            alertStatus: 'saved',
            alertError: false,
        });
    });

    it('should set alerts value when successfully deleted', () => {
        const test = alertReducer(emptyState, { type: actions.ALERT_DELETED, payload: [] });
        expect(test).toEqual({
            ...emptyState,
            alert: [],
            alertStatus: 'deleted',
            alertError: false,
        });
    });

    it('should handle a failing Alert API call', () => {
        const test = alertReducer(emptyState, {
            type: actions.ALERT_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            alertStatus: 'error',
            alertError: 'failed!',
        });
    });

    it('should handle clearing the alerts', () => {
        const test = alertReducer(emptyState, { type: actions.ALERT_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should set alert Status flags to loading when loading alert', () => {
        const test = alertReducer(emptyState, { type: actions.ALERT_LOADING });
        expect(test).toEqual({
            ...emptyState,
            alert: null,
            alertStatus: 'loading',
            alertError: false,
        });
    });
});
