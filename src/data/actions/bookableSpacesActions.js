import * as actions from './actionTypes';
import { destroy, get, post, put } from 'repositories/generic';
import {
    SPACES_ADD_LOCATION_API,
    SPACES_MODIFY_LOCATION_API,
    SPACES_ROOMS_ALL_API,
    SPACES_SITE_API,
} from 'repositories/routes';

const checkExpireSession = (dispatch, error) => {
    const triggerLogoutStatus = [401];
    if (!!error?.status && triggerLogoutStatus.includes(error.status)) {
        // They are no longer allowed. Log them out
        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
    }
};

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

export function addBookableSpaceLocation(request, locationType) {
    console.log('addBookableSpaceLocation', locationType, request);
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_ADDING });
        const url = SPACES_ADD_LOCATION_API({ type: locationType });
        return post(url, request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_LOCATION_ADDED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_LOCATION_ADD_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_LOCATION_ADD_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function updateBookableSpaceLocation(request, locationType) {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_UPDATING });
        const url = SPACES_MODIFY_LOCATION_API({ type: locationType, id: request[`${locationType}Id`] });
        return put(url, request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_LOCATION_UPDATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_LOCATION_UPDATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_LOCATION_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function deleteBookableSpaceLocation({ locationType, locationId }) {
    return dispatch => {
        dispatch({ type: actions.SPACES_LOCATION_DELETING });
        const url = SPACES_MODIFY_LOCATION_API({ type: locationType, id: locationId });
        return destroy(url)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_LOCATION_DELETED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_LOCATION_DELETE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_LOCATION_DELETE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function loadBookableSpaceCampusChildren() {
    return dispatch => {
        dispatch({ type: actions.SPACES_CAMPUS_LIST_LOADING });
        return get(SPACES_SITE_API())
            .then(response => {
                dispatch({
                    type: actions.SPACES_CAMPUS_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_CAMPUS_LIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function clearBookableSpaceSitesError() {
    return dispatch => {
        dispatch({ type: actions.SPACES_CAMPUS_LIST_CLEAR_ERROR });
    };
}

export function clearBookableSpaceSites() {
    return dispatch => {
        dispatch({ type: actions.SPACES_CAMPUS_LIST_CLEAR });
    };
}

export function clearBookableSpaceFloors() {
    return dispatch => {
        dispatch({ type: actions.SPACES_FLOOR_LIST_CLEAR });
    };
}
export function clearBookableSpaceFloorsError() {
    return dispatch => {
        dispatch({ type: actions.SPACES_FLOOR_LIST_CLEAR_ERROR });
    };
}
