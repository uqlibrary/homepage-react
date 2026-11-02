import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { WEEKLYHOURS_API } from 'repositories/routes';

export function loadWeeklyHours() {
    return dispatch => {
        // dispatch({ type: actions.WEEKLYHOURS_CLEAR });
        dispatch({ type: actions.WEEKLYHOURS_LOADING });
        return get(WEEKLYHOURS_API())
            .then(response => {
                dispatch({
                    type: actions.WEEKLYHOURS_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.WEEKLYHOURS_FAILED,
                    payload: error.message,
                });
            });
    };
}
