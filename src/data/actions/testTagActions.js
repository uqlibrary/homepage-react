import * as actions from './actionTypes';
import { get, post, put } from 'repositories/generic';
import {
    TEST_TAG_USER_API,
    TEST_TAG_ONLOAD_DASHBOARD_API,
    TEST_TAG_ONLOAD_INSPECT_API,
    TEST_TAG_FLOOR_API,
    TEST_TAG_ROOM_API,
    TEST_TAG_ASSETS_API,
    TEST_TAG_ASSET_ACTION,
    TEST_TAG_ONLOAD_ASSETTYPE_API,
    TEST_TAG_SAVE_ASSETTYPE_API,
    TEST_TAG_DELETE_REASSIGN_ASSETTYPE_API,
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

export function loadFloors(buildingId) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_FLOOR_LIST_LOADING });
        return get(TEST_TAG_FLOOR_API(buildingId))
            .then(response => {
                console.log(response);
                dispatch({
                    type: actions.TESTTAG_FLOOR_LIST_LOADED,
                    payload: response?.data,
                });
            })
            .catch(error => {
                console.log(error);
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
                    payload: response?.data,
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
                    payload: response?.data,
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

/** * ASSET TYPES ACTIONS  ***/

export function loadAssetTypes() {
    console.log('Loading Asset Types');
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_LIST_LOADING });
        return get(TEST_TAG_ONLOAD_ASSETTYPE_API())
            .then(response => {
                console.log('RESPONSE WAS', response);
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_LIST_LOADED,
                    payload: response?.data?.asset_types ?? /* istanbul ignore next */ {},
                });
            })
            .catch(error => {
                console.log('Calling Error');
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function saveAssetType(request) {
    console.log('Calling saveAssetType');
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_SAVING });
        return put(TEST_TAG_SAVE_ASSETTYPE_API(), request)
            .then(response => {
                console.log('This is the data', response?.data);
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_SAVED,
                    payload: response?.data ?? /* istanbul ignore next */ {},
                });
            })
            .catch(error => {
                console.log('Calling Error');
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_SAVE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function deleteAndReassignAssetType(request) {
    console.log('Calling deleteAssetType');
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_REASSIGNING });
        return post(TEST_TAG_DELETE_REASSIGN_ASSETTYPE_API(), request)
            .then(response => {
                console.log('This is the data', response?.data);
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_REASSIGNED,
                    payload: response?.data ?? /* istanbul ignore next */ {},
                });
            })
            .catch(error => {
                console.log('Calling Error');
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_REASSIGN_FAILED,
                    payload: error.message,
                });
            });
    };
}
