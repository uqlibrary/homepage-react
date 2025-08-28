import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { SPACES_ROOMS_ALL_API } from 'repositories/routes';

export function loadAllBookableSpacesRooms() {
    return dispatch => {
        // dispatch({ type: actions.SPACES_ROOM_LIST_CLEAR });
        dispatch({ type: actions.SPACES_ROOM_LIST_LOADING });
        return get(SPACES_ROOMS_ALL_API())
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
