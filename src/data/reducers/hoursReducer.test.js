import * as actions from 'data/actions/actionTypes';
import hoursReducer, { initialState, initSavingState } from './hoursReducer';

describe('hours reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
            ...initSavingState,
        };
    });

    it('should set hours to null when failed loading', () => {
        const test = hoursReducer(emptyState, { type: actions.LIB_HOURS_FAILED });
        expect(test).toEqual({
            ...emptyState,
            libHours: null,
            libHoursLoading: false,
            libHoursError: true,
        });
    });

    it('should set library hours value when successfully loaded library hours', () => {
        const test = hoursReducer(emptyState, { type: actions.LIB_HOURS_LOADED, payload: [] });
        expect(test).toEqual({
            ...emptyState,
            libHours: [],
            libHoursLoading: false,
            libHoursError: false,
        });
    });

    it('should set library hours loading flag to true when loading library hours', () => {
        const test = hoursReducer(emptyState, { type: actions.LIB_HOURS_LOADING });
        expect(test).toEqual({
            ...emptyState,
            libHours: null,
            libHoursLoading: true,
            libHoursError: false,
        });
    });
});
