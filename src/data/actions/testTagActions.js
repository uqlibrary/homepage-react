import * as actions from './actionTypes';
import { get, post, put, destroy } from 'repositories/generic';
import {
    TEST_TAG_USER_API,
    TEST_TAG_ONLOAD_DASHBOARD_API,
    TEST_TAG_ONLOAD_INSPECT_API,
    TEST_TAG_FLOOR_API,
    TEST_TAG_ROOM_API,
    TEST_TAG_ASSETS_API,
    TEST_TAG_ASSET_ACTION,
    TEST_TAG_SITE_API,
    TEST_TAG_ADD_LOCATION_API,
    TEST_TAG_MODIFY_LOCATION_API,
} from 'repositories/routes';

export function loadUser() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_USER_LOADING });
        return get(TEST_TAG_USER_API())
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_USER_LOADED,
                    payload: response?.data ?? /* istanbul ignore next */ {},
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_USER_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadDashboard() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_DASHBOARD_CONFIG_LOADING });
        return get(TEST_TAG_ONLOAD_DASHBOARD_API())
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_DASHBOARD_CONFIG_LOADED,
                    payload: response?.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_DASHBOARD_CONFIG_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadInspectionConfig() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_CONFIG_LOADING });
        return get(TEST_TAG_ONLOAD_INSPECT_API())
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_INSPECTION_CONFIG_LOADED,
                    payload: response?.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_INSPECTION_CONFIG_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearInspectionConfig() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_CONFIG_CLEAR });
    };
}

export function addLocation({ type, request }) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_LOCATION_ADDING });
        return post(TEST_TAG_ADD_LOCATION_API(type), request)
            .then(response => {
                console.log(response, response.status.toLowerCase());
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_LOCATION_ADDED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_LOCATION_ADD_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_LOCATION_ADD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function updateLocation({ type, request }) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_LOCATION_UPDATING });
        return put(TEST_TAG_MODIFY_LOCATION_API({ type, id: request[`${type}_id`] }), request)
            .then(response => {
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_LOCATION_UPDATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_LOCATION_UPDATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_LOCATION_UPDATE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function deleteLocation({ type, id }) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_LOCATION_DELETING });
        return destroy(TEST_TAG_MODIFY_LOCATION_API({ type, id: id }))
            .then(response => {
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_LOCATION_DELETED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_LOCATION_DELETE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_LOCATION_DELETE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function loadSites() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_SITE_LIST_LOADING });
        return get(TEST_TAG_SITE_API())
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_SITE_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_SITE_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearSites() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_SITE_LIST_CLEAR });
    };
}

export function loadFloors(buildingId) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_FLOOR_LIST_LOADING });
        return get(TEST_TAG_FLOOR_API(buildingId))
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_FLOOR_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_FLOOR_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearFloors() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_FLOOR_LIST_CLEAR });
    };
}

export function loadRooms(floorId) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ROOM_LIST_LOADING });
        return get(TEST_TAG_ROOM_API(floorId))
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_ROOM_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ROOM_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearRooms() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ROOM_LIST_CLEAR });
    };
}

/** * ASSETS  ***/
export function loadAssets(pattern) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSETS_LOADING });
        return get(TEST_TAG_ASSETS_API(pattern))
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_ASSETS_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSETS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearAssets() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSETS_CLEAR });
    };
}

export function saveInspection(request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_SAVE_INSPECTION_SAVING });
        return post(TEST_TAG_ASSET_ACTION(), request)
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_SAVE_INSPECTION_SUCCESS,
                    payload: response?.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_SAVE_INSPECTION_FAILED,
                    payload: error.message,
                });
            });
    };
}
export function clearSaveInspection() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_SAVE_INSPECTION_CLEAR });
    };
}

/*
export function addAssetType(request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_ADDING });
        return post(TEST_TAG_ADD_ASSET_API(), request)
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_ADDED,
                    payload: response?.data ?? {},
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_ADD_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function saveAssetType(request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_SAVING });
        return put(TEST_TAG_SAVE_ASSETTYPE_API(), request)
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_SAVED,
                    payload: response?.data ?? {},
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_SAVE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function deleteAndReassignAssetType(request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_REASSIGNING });
        return post(TEST_TAG_DELETE_REASSIGN_ASSETTYPE_API(), request)
            .then(response => {
                // Fire function - should then handle the new promise?
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_REASSIGNED,
                    payload: response?.data?.asset_types ?? [],
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_REASSIGN_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function deleteAssetType(id) {
    return dispatch => {
        console.log('The ID is ', id);
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_DELETING });
        return destroy(TEST_TAG_DELETE_ASSET_TYPE_API(id))
            .then(() => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_DELETED,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_DELETE_FAILED,
                    payload: error.message,
                });
            });
    };
}
*/
