import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import {
    TEST_TAG_USER_API,
    TEST_TAG_ONLOAD_DASHBOARD_API,
    TEST_TAG_ONLOAD_INSPECT_API,
    TEST_TAG_FLOOR_API,
    TEST_TAG_ROOM_API,
    TEST_TAG_ASSETS_API,
    TEST_TAG_ASSET_ACTION,
    TEST_TAG_ASSETTYPE_ADD,
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
                dispatch({
                    type: actions.TESTTAG_FLOOR_LIST_LOADED,
                    payload: response?.data,
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

export function saveAssetTypeAndReload(request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_SAVE_ASSET_TYPE_SAVING });
        let saveAssetComplete = false;
        return post(TEST_TAG_ASSETTYPE_ADD(), request)
            .then(data => {
                dispatch({
                    type: actions.TESTTAG_SAVE_ASSET_TYPE_SUCCESS,
                    payload: data,
                });
                saveAssetComplete = true;

                // reload the onload route after the asset type list would have updated with a new asset
                // to get the update into the dropdown
                dispatch({ type: actions.TESTTAG_INSPECTION_CONFIG_LOADING });
                return get(TEST_TAG_ONLOAD_INSPECT_API());
            })
            .then(data => {
                dispatch({
                    type: actions.TESTTAG_INSPECTION_CONFIG_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                if (saveAssetComplete) {
                    dispatch({
                        type: actions.TESTTAG_INSPECTION_CONFIG_FAILED,
                        payload: error.message,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_SAVE_ASSET_TYPE_FAILED,
                        payload: error.message,
                    });
                }
            });
    };
}
export function clearSaveAssetType() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_SAVE_ASSET_TYPE_CLEAR });
    };
}
