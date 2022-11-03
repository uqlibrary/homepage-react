import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { TEST_TAG_SITE_API, TEST_TAG_FLOOR_API, TEST_TAG_ROOM_API } from 'repositories/routes';
// import { throwFetchErrors } from 'helpers/general';

export function loadSites() {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_SITE_LIST_LOADING });
        return get(TEST_TAG_SITE_API())
            .then(data => {
                console.log('loadSites', data);
                dispatch({
                    type: actions.TESTTAG_SITE_LIST_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('loadSites error', error);
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

export function loadFloors(siteId, buildingId) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_FLOOR_LIST_LOADING });
        return get(TEST_TAG_FLOOR_API(siteId, buildingId))
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

export function loadRooms(siteId, buildingId, floorId) {
    return dispatch => {
        dispatch({ type: actions.TESTTAG_ROOM_LIST_LOADING });
        return get(TEST_TAG_ROOM_API(siteId, buildingId, floorId))
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
