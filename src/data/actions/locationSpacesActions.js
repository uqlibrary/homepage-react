import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { LOCATIONSPACE_ALL_API } from 'repositories/routes';

export function loadAllLocationSpaces() {
    return dispatch => {
        // dispatch({ type: actions.LOCATIONLIST_CLEAR });
        dispatch({ type: actions.LOCATIONLIST_LOADING });
        return get(LOCATIONSPACE_ALL_API())
            .then(response => {
                dispatch({
                    type: actions.LOCATIONLIST_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.LOCATIONLIST_FAILED,
                    payload: error.message,
                });
            });
    };
}
