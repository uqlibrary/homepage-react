import bookablespacesFacilityTypeReducer, { initialState } from './bookablespacesFacilityTypeReducer';
import * as actions from '../actions/actionTypes';

describe('facility type reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Facility Type list API call', () => {
        const test = bookablespacesFacilityTypeReducer(emptyState, {
            type: actions.SPACES_FACILITY_TYPE_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            facilityTypeListLoading: false,
            facilityTypeListError: 'failed!',
        });
    });

    it('should set Facility Type list values when successfully loaded', () => {
        const test = bookablespacesFacilityTypeReducer(emptyState, {
            type: actions.SPACES_FACILITY_TYPE_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            facilityTypeList: [],
            facilityTypeListError: false,
            facilityTypeListLoading: false,
        });
    });

    it('should set Facility Type list Status flags to loading when loading', () => {
        const test = bookablespacesFacilityTypeReducer(emptyState, {
            type: actions.SPACES_FACILITY_TYPE_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            facilityTypeList: null,
            facilityTypeListError: false,
            facilityTypeListLoading: true,
        });
    });
});
