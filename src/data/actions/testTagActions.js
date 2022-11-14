import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import {
    TEST_TAG_CONFIG_API,
    // TEST_TAG_SITE_API,
    TEST_TAG_FLOOR_API,
    TEST_TAG_ROOM_API,
    // TEST_TAG_ASSET_TYPES_API,
    // TEST_TAG_TEST_DEVICES_API,
    TEST_TAG_ASSETS_API,
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
// export function loadSites() {
//     return dispatch => {
//         dispatch({ type: actions.TESTTAG_SITE_LIST_LOADING });
//         return get(TEST_TAG_SITE_API())
//             .then(data => {
//                 console.log('loadSites', data);
//                 dispatch({
//                     type: actions.TESTTAG_SITE_LIST_LOADED,
//                     payload: data,
//                 });
//             })
//             .catch(error => {
//                 console.log('loadSites error', error);
//                 dispatch({
//                     type: actions.TESTTAG_SITE_LIST_FAILED,
//                     payload: error.message,
//                 });
//             });
//     };
// }

// export function clearSites() {
//     return dispatch => {
//         dispatch({ type: actions.TESTTAG_SITE_LIST_CLEAR });
//     };
// }

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

/** * ASSET TYPES  ***/
// export function loadAssetTypes() {
//     return dispatch => {
//         dispatch({ type: actions.TESTTAG_ASSET_TYPES_LOADING });
//         return get(TEST_TAG_ASSET_TYPES_API())
//             .then(data => {
//                 console.log('loadAssetTypes', data);
//                 dispatch({
//                     type: actions.TESTTAG_ASSET_TYPES_LOADED,
//                     payload: data,
//                 });
//             })
//             .catch(error => {
//                 console.log('loadAssetTypes error', error);
//                 dispatch({
//                     type: actions.TESTTAG_ASSET_TYPES_FAILED,
//                     payload: error.message,
//                 });
//             });
//     };
// }

// export function clearAssetTypes() {
//     return dispatch => {
//         dispatch({ type: actions.TESTTAG_ASSET_TYPES_CLEAR });
//     };
// }

/** * TEST DEVICES TYPES  ***/
// export function loadTestDevices() {
//     return dispatch => {
//         dispatch({ type: actions.TESTTAG_TEST_DEVICES_LOADING });
//         return get(TEST_TAG_TEST_DEVICES_API())
//             .then(data => {
//                 console.log('loadTestDevices', data);
//                 dispatch({
//                     type: actions.TESTTAG_TEST_DEVICES_LOADED,
//                     payload: data,
//                 });
//             })
//             .catch(error => {
//                 console.log('loadTestDevices error', error);
//                 dispatch({
//                     type: actions.TESTTAG_TEST_DEVICES_FAILED,
//                     payload: error.message,
//                 });
//             });
//     };
// }

// export function clearTestDevices() {
//     return dispatch => {
//         dispatch({ type: actions.TESTTAG_TEST_DEVICES_CLEAR });
//     };
// }

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
