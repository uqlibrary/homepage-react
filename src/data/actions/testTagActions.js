import * as actions from './actionTypes';
import { get, post, put, destroy } from 'repositories/generic';
import {
    TEST_TAG_USER_API,
    TEST_TAG_ONLOAD_DASHBOARD_API,
    TEST_TAG_ONLOAD_INSPECT_API,
    TEST_TAG_FLOOR_API,
    TEST_TAG_ROOM_API,
    TEST_TAG_ASSETS_API,
    TEST_TAG_ASSETS_MINE_API,
    TEST_TAG_ASSET_ACTION,
    TEST_TAG_ASSETTYPE_ADD,
    TEST_TAG_ASSETTYPE_API,
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
    TEST_TAG_TAGGED_BUILDING_LIST,
    TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST,
    TEST_TAG_BULK_UPDATE_API,
    TEST_TAG_MODIFY_INSPECTION_DETAILS_API,
    TEST_TAG_USER_LIST_API,
    TEST_TAG_UPDATE_USER_API,
    TEST_TAG_ADD_USER_API,
    TEST_TAG_DELETE_USER_API,
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
export function clearDashboardError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_DASHBOARD_CONFIG_CLEAR_ERROR });
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

export function clearInspectionConfigError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_CONFIG_CLEAR_ERROR });
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
export function clearAssetsError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSETS_CLEAR_ERROR });
    };
}
export function loadAssetsMine(filters) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSETS_MINE_LOADING });
        return get(TEST_TAG_ASSETS_MINE_API(filters))
            .then(response => {
                console.log('>>>>>', response.data);
                dispatch({
                    type: actions.TESTTAG_ASSETS_MINE_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSETS_MINE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearAssetsMine() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSETS_MINE_CLEAR });
    };
}

export function clearAssetsMineError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSETS_MINE_CLEAR_ERROR });
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

export function clearInspectionDevicesError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DEVICES_LOAD_CLEAR_ERROR });
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
export function clearInspectionDevicesAddError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DEVICES_ADD_CLEAR_ERROR });
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
export function clearInspectionDevicesUpdateError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DEVICES_UPDATE_CLEAR_ERROR });
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
export function clearInspectionDevicesDeleteError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DEVICES_DELETE_CLEAR_ERROR });
    };
}

/** * ASSET TYPES ACTIONS  ***/

export function loadAssetTypes() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_LIST_LOADING });
        return get(TEST_TAG_ASSETTYPE_API())
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_ASSET_TYPES_LIST_LOADED,
                    payload: response?.data ?? /* istanbul ignore next */ {},
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
export function clearAssetTypesError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_LIST_CLEAR_ERROR });
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
export function clearAssetTypeAddError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_ADD_CLEAR_ERROR });
    };
}

export function saveAssetType(id, request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_SAVING });
        return put(TEST_TAG_SAVE_ASSETTYPE_API(id), request)
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
export function clearAssetTypeSaveError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_SAVE_CLEAR_ERROR });
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
export function clearAssetTypeReassignError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_REASSIGN_CLEAR_ERROR });
    };
}

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
export function clearAssetTypeDeleteError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_TYPES_DELETE_CLEAR_ERROR });
    };
}

/* INSPECTION DETAILS UPDATE */
export function updateInspectionDetails(id, request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTION_DETAILS_UPDATING });
        return put(TEST_TAG_MODIFY_INSPECTION_DETAILS_API(id), request)
            .then(response => {
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_INSPECTION_DETAILS_UPDATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_INSPECTION_DETAILS_UPDATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_INSPECTION_DETAILS_UPDATE_FAILED,
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
export function clearInspectionsDueError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTIONS_DUE_CLEAR_ERROR });
    };
}
export function clearInspectionsDue() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_INSPECTIONS_DUE_CLEAR });
    };
}

/* REPORT INSPECTIONS BY LICENCED USER */
export function getInspectionsByLicencedUser({ startDate, endDate, userRange }) {
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
        console.log('Getting Licenced Users');
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
export function clearLicencedUsersError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_LICENCED_INSPECTORS_CLEAR_ERROR });
    };
}

/* Asset report for DEPT */
export function loadTaggedBuildingList() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_TAGGED_BUILDING_LIST_LOADING });
        return get(TEST_TAG_TAGGED_BUILDING_LIST())
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_TAGGED_BUILDING_LIST_LOADED,
                    payload: response?.data ?? /* istanbul ignore next */ [],
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_TAGGED_BUILDING_LIST_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
export function clearTaggedBuildingListError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_TAGGED_BUILDING_LIST_CLEAR_ERROR });
    };
}

export function bulkAssetUpdate(request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_BULK_ASSET_UPDATE_SAVING });
        return put(TEST_TAG_BULK_UPDATE_API(), request)
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_BULK_ASSET_UPDATE_SUCCESS,
                    payload: response?.data,
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_BULK_ASSET_UPDATE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function loadAssetReportByFilters({
    assetStatus,
    locationType,
    locationId,
    inspectionDateFrom,
    inspectionDateTo,
}) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_REPORT_LOADING });
        return get(
            TEST_TAG_ASSET_REPORT_BY_FILTERS_LIST({
                assetStatus,
                locationType,
                locationId,
                inspectionDateFrom,
                inspectionDateTo,
            }),
        )
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_ASSET_REPORT_LOADED,
                    payload: response?.data ?? /* istanbul ignore next */ [],
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_ASSET_REPORT_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
export function clearAssetReportByFiltersError() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ASSET_REPORT_CLEAR_ERROR });
    };
}

export function clearBulkAssetUpdate() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_BULK_ASSET_UPDATE_CLEAR });
    };
}

/* Manage User Lists */
export function loadUserList() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_USER_LIST_LOADING });
        return get(TEST_TAG_USER_LIST_API())
            .then(response => {
                dispatch({
                    type: actions.TESTTAG_USER_LIST_LOADED,
                    payload: response?.data ?? /* istanbul ignore next */ [],
                });
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_USER_LIST_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function updateUser(id, request) {
    return dispatch => {
        console.log('Editing user ACTION', id, request);
        dispatch({ type: actions.TESTTAG_USER_LIST_UPDATING });
        return put(TEST_TAG_UPDATE_USER_API(id), request)
            .then(response => {
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_USER_LIST_UPDATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_USER_LIST_UPDATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_USER_LIST_UPDATE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function addUser(request) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_USER_LIST_ADDING });
        return post(TEST_TAG_ADD_USER_API(), request)
            .then(response => {
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_USER_LIST_ADDED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_USER_LIST_ADD_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_USER_LIST_ADD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}

export function deleteUser(id) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_USER_LIST_DELETING });
        return destroy(TEST_TAG_DELETE_USER_API(id))
            .then(response => {
                if (response.status.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.TESTTAG_USER_LIST_DELETED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.TESTTAG_USER_LIST_DELETE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.TESTTAG_USER_LIST_DELETE_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
