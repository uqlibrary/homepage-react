import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import {
    TEST_TAG_CONFIG_API,
    // TEST_TAG_SITE_API,
    TEST_TAG_FLOOR_API,
    TEST_TAG_ROOM_API,
    // TEST_TAG_ASSET_TYPES_API,
    // TEST_TAG_TEST_DEVICES_API,
    TEST_TAG_ASSETS_API,
    TEST_TAG_SAVE_INSPECTION,
} from 'repositories/routes';
// import { throwFetchErrors } from 'helpers/general';

export function loadConfig() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_CONFIG_LOADING });
        return get(TEST_TAG_CONFIG_API())
            .then(data => {
                console.log('loadConfig', data);
                dispatch({
                    type: actions.TESTTAG_CONFIG_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('loadConfig error', error);
                dispatch({
                    type: actions.TESTTAG_CONFIG_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearConfig() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_CONFIG_CLEAR });
    };
}

export function loadFloors(buildingId) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_FLOOR_LIST_LOADING });
        return get(TEST_TAG_FLOOR_API(buildingId))
            .then(data => {
                dispatch({
                    type: actions.TESTTAG_FLOOR_LIST_LOADED,
                    payload: data,
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
            .then(data => {
                dispatch({
                    type: actions.TESTTAG_ROOM_LIST_LOADED,
                    payload: data,
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
        console.log('loadAssets', pattern);
        return get(TEST_TAG_ASSETS_API(pattern))
            .then(data => {
                console.log('loadAssets', data);
                dispatch({
                    type: actions.TESTTAG_ASSETS_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('loadAssets error', error);
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
        return post(TEST_TAG_SAVE_INSPECTION(), request)
            .then(data => {
                console.log('saveInspection', data);
                dispatch({
                    type: actions.TESTTAG_SAVE_INSPECTION_SUCCESS,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('saveInspection error', error.message);
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
