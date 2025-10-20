import * as actions from './actionTypes';
import { get, post, put } from 'repositories/generic';
import {
    SPACES_FACILITY_TYPE_ALL_API,
    SPACES_FACILITY_TYPE_CHANGE_API,
    SPACES_FACILITY_TYPE_GROUP_CHANGE_API,
} from 'repositories/routes';

const checkExpireSession = (dispatch, error) => {
    const triggerLogoutStatus = [401];
    if (!!error?.status && triggerLogoutStatus.includes(error.status)) {
        // They are no longer allowed. Log them out
        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
    }
};

export function loadAllFacilityTypes() {
    return dispatch => {
        // dispatch({ type: actions.SPACES_FACILITY_TYPE_CLEAR });
        dispatch({ type: actions.SPACES_FACILITY_TYPE_LOADING });
        return get(SPACES_FACILITY_TYPE_ALL_API())
            .then(response => {
                dispatch({
                    type: actions.SPACES_FACILITY_TYPE_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_FACILITY_TYPE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function createSpacesFacilityType(request) {
    if (!request) {
        return false;
    }
    console.log('createSpacesFacilityType', request);
    return dispatch => {
        dispatch({ type: actions.SPACES_FACILITY_TYPE_CREATING });
        const url = SPACES_FACILITY_TYPE_CHANGE_API();
        return post(url, request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_FACILITY_TYPE_CREATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_FACILITY_TYPE_CREATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_FACILITY_TYPE_CREATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function updateSpacesFacilityType(request) {
    console.log('updateSpacesFacilityType', request);
    if (!request) {
        return false;
    }
    console.log('updateSpacesFacilityType', request);
    return dispatch => {
        dispatch({ type: actions.SPACES_FACILITY_TYPE_UPDATING });
        const url = SPACES_FACILITY_TYPE_CHANGE_API();
        return put(url, request)
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_FACILITY_TYPE_UPDATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_FACILITY_TYPE_UPDATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SPACES_FACILITY_TYPE_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}

export function createSpacesFacilityTypeGroup(request) {
    if (!request) {
        return false;
    }
    console.log('saveNewFacilityGroupType start', request);
    return dispatch => {
        dispatch({ type: actions.SPACES_FACILITY_TYPE_GROUP_CREATING });
        const url = SPACES_FACILITY_TYPE_GROUP_CHANGE_API();
        console.log('action saveNewFacilityGroupType loading', url);
        return post(url, request)
            .then(response => {
                console.log('action saveNewFacilityGroupType loaded', response);
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.SPACES_FACILITY_TYPE_GROUP_CREATED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.SPACES_FACILITY_TYPE_GROUP_CREATE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                console.log('action saveNewFacilityGroupType error', error);
                dispatch({
                    type: actions.SPACES_FACILITY_TYPE_GROUP_CREATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
}
