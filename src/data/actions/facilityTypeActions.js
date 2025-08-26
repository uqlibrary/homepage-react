import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { FACILITY_TYPE_ALL_API } from 'repositories/routes';

export function loadAllFacilityTypes() {
    return dispatch => {
        // dispatch({ type: actions.FACILITY_TYPE_CLEAR });
        dispatch({ type: actions.FACILITY_TYPE_LOADING });
        return get(FACILITY_TYPE_ALL_API())
            .then(response => {
                dispatch({
                    type: actions.FACILITY_TYPE_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.FACILITY_TYPE_FAILED,
                    payload: error.message,
                });
            });
    };
}
