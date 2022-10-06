import alertsReducer, { initialState } from './alertsReducer';
import * as actions from '../actions/actionTypes';

describe('alerts reducer', () => {
    let emptyState;
    let mockAlertList;

    beforeEach(() => {
        mockAlertList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set alerts Status flags to loading when loading alerts', () => {
        const test = alertsReducer(emptyState, { type: actions.ALERTS_LOADING });
        expect(test).toEqual({
            ...emptyState,
            alerts: null,
            alertsLoading: true,
            alertsError: false,
        });
    });

    it('should set alerts value when successfully loaded', () => {
        const test = alertsReducer(emptyState, { type: actions.ALERTS_LOADED, payload: mockAlertList });
        expect(test).toEqual({
            ...emptyState,
            alerts: mockAlertList,
            alertsLoading: false,
            alertsError: false,
        });
    });

    it('should handle a failing Alerts API call', () => {
        const test = alertsReducer(emptyState, {
            type: actions.ALERTS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            alertsLoading: false,
            alertsError: 'failed!',
        });
    });

    it('should handle clearing the alerts', () => {
        const test = alertsReducer(emptyState, { type: actions.ALERTS_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});
