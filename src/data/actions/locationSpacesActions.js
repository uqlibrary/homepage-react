import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { LOCATIONSPACE_ALL_API } from 'repositories/routes';

export function loadAllLocationSpaces() {
    return dispatch => {
        // dispatch({ type: actions.SPACES_ROOM_LIST_CLEAR });
        dispatch({ type: actions.SPACES_ROOM_LIST_LOADING });
        return get(LOCATIONSPACE_ALL_API())
            .then(response => {
                dispatch({
                    type: actions.SPACES_ROOM_LIST_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_ROOM_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}
