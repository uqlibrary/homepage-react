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
    TEST_TAG_ONLOAD_ASSETTYPE_API,
    TEST_TAG_SAVE_ASSETTYPE_API,
    TEST_TAG_DELETE_REASSIGN_ASSETTYPE_API,
    TEST_TAG_ADD_ASSET_TYPE_API,
    TEST_TAG_DELETE_ASSET_TYPE_API,
    TEST_TAG_SITE_API,
    TEST_TAG_ADD_LOCATION_API,
    TEST_TAG_MODIFY_LOCATION_API,
    TEST_TAG_INSPECTION_DEVICE_API,
    TEST_TAG_ADD_INSPECTION_DEVICE_API,
    TEST_TAG_MODIFY_INSPECTION_DEVICE_API,
    TEST_TAG_REPORT_INSPECTIONS_DUE_API,
    TEST_TAG_REPORT_INSPECTIONS_BY_LICENCED_USER_API,
    TEST_TAG_REPORT_UTILITY_LICENCED_USERS,
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
                    payload: response.data,
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

/** * INSPECTION DEVICE MANAGEMENT  ***/
export function loadInspectionDevices() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DEVICES_LOADING });
        return get(TEST_TAG_INSPECTION_DEVICE_API())
            .then(response => {
                console.log(response);
                dispatch({
                    type: actions.TESTTAG_INSPECTION_DEVICES_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_INSPECTION_DEVICES_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearInspectionDevices() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DEVICES_CLEAR });
    };
}

export function addInspectionDevice(request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DEVICES_ADDING });
        return post(TEST_TAG_ADD_INSPECTION_DEVICE_API(), request)
            .then(response => {
                console.log(response, response.status.toLowerCase());
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_INSPECTION_DEVICES_ADDED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_INSPECTION_DEVICES_ADD_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_INSPECTION_DEVICES_ADD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function updateInspectionDevice(id, request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DEVICES_UPDATING });
        return put(TEST_TAG_MODIFY_INSPECTION_DEVICE_API(id), request)
            .then(response => {
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_INSPECTION_DEVICES_UPDATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_INSPECTION_DEVICES_UPDATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_INSPECTION_DEVICES_UPDATE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function deleteInspectionDevice(id) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DEVICES_DELETING });
        return destroy(TEST_TAG_MODIFY_INSPECTION_DEVICE_API(id))
            .then(response => {
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_INSPECTION_DEVICES_DELETED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_INSPECTION_DEVICES_DELETE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_INSPECTION_DEVICES_DELETE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

/** * ASSET TYPES ACTIONS  ***/

export function loadAssetTypes() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_LIST_LOADING });
        return get(TEST_TAG_ONLOAD_ASSETTYPE_API())
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_LIST_LOADED,
                    payload: response?.data?.asset_types ?? /* istanbul ignore next */ {},
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_LIST_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function addAssetType(request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_ADDING });
        return post(TEST_TAG_ADD_ASSET_TYPE_API(), request)
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_ADDED,
                    payload: response?.data ?? /* istanbul ignore next */ {},
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_ADD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
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
                    payload: response?.data ?? /* istanbul ignore next */ {},
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_SAVE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export const deleteAndReassignAssetType = request => {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_REASSIGNING });
        return post(TEST_TAG_DELETE_REASSIGN_ASSETTYPE_API(), request)
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_REASSIGNED,
                    payload: response?.data ?? /* istanbul ignore next */ [],
                });
                return Promise.resolve(response?.data ?? []);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_REASSIGN_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
};

export function deleteAssetType(id) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_DELETING });
        return destroy(TEST_TAG_DELETE_ASSET_TYPE_API(id))
            .then(() => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_DELETED,
                });
                return Promise.resolve();
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_DELETE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

/* REPORT INSPECTIONS DUE */

export function getInspectionsDue({ locationId, locationType, period, periodType }) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTIONS_DUE_LOADING });
        return get(TEST_TAG_REPORT_INSPECTIONS_DUE_API({ locationId, locationType, period, periodType }))
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_INSPECTIONS_DUE_LOADED,
                    payload: response?.data ?? /* istanbul ignore next */ [],
                });
                // return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_INSPECTIONS_DUE_FAILED,
                    payload: error.message,
                });
                // return Promise.reject(error);
            });
    };
}
export function clearInspectionsDue() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTIONS_DUE_CLEAR });
    };
}

/* REPORT INSPECTIONS BY LICENCED USER */
export function getInspectionsByLicencedUser({ startDate = null, endDate = null, userRange = null }) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADING });
        return get(TEST_TAG_REPORT_INSPECTIONS_BY_LICENCED_USER_API({ startDate, endDate, userRange }))
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADED,
                    payload: response?.data ?? /* istanbul ignore next */ [],
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
export function getLicencedUsers() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_LICENCED_INSPECTORS_LOADING });
        return get(TEST_TAG_REPORT_UTILITY_LICENCED_USERS())
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_LICENCED_INSPECTORS_LOADED,
                    payload: response?.data ?? /* istanbul ignore next */ [],
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_LICENCED_INSPECTORS_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
