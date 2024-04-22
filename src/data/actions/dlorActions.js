import * as actions from './actionTypes';
import { destroy, get, post, put } from 'repositories/generic';
import {
    DLOR_ALL_API,
    DLOR_ALL_CURRENT_API,
    DLOR_CREATE_API,
    DLOR_UPDATE_API,
    DLOR_DESTROY_API,
    DLOR_GET_BY_ID_API,
    DLOR_GET_FILTER_LIST,
    DLOR_TEAM_LIST_API,
} from 'repositories/routes';

export function loadCurrentDLORs() {
    console.log('loadCurrentDLORs start');
    return dispatch => {
        dispatch({ type: actions.DLOR_LIST_LOADING });
        return get(DLOR_ALL_CURRENT_API())
            .then(response => {
                console.log('loadCurrentDLORs response=', response);
                dispatch({
                    type: actions.DLOR_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                console.log('loadCurrentDLORs response=', error);
                dispatch({
                    type: actions.DLOR_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadAllDLORs() {
    console.log('loadAllDLORs start');
    return dispatch => {
        dispatch({ type: actions.DLOR_LIST_LOADING });
        return get(DLOR_ALL_API())
            .then(response => {
                console.log('loadAllDLORs response=', response);
                dispatch({
                    type: actions.DLOR_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                console.log('loadAllDLORs error=', error);
                dispatch({
                    type: actions.DLOR_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadADLOR(dlorId) {
    return dispatch => {
        dispatch({ type: actions.DLOR_DETAIL_LOADING });
        return get(DLOR_GET_BY_ID_API({ id: dlorId }))
            .then(response => {
                dispatch({
                    type: actions.DLOR_DETAIL_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_DETAIL_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadAllFilters() {
    console.log('loadAllFilters');
    return dispatch => {
        dispatch({ type: actions.DLOR_FILTER_LIST_LOADING });
        return get(DLOR_GET_FILTER_LIST())
            .then(response => {
                console.log('loadAllFilters got it', response);
                dispatch({
                    type: actions.DLOR_FILTER_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                console.log('loadAllFilters error', error);
                dispatch({
                    type: actions.DLOR_FILTER_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearADlor() {
    return dispatch => {
        dispatch({ type: actions.DLOR_DETAIL_CLEAR });
    };
}

export function createDLor(request) {
    console.log('createDLor request=', request);
    return async dispatch => {
        dispatch({ type: actions.DLOR_CREATING });
        return post(DLOR_CREATE_API(), request)
            .then(data => {
                console.log('createDLor response=', data);
                dispatch({
                    type: actions.DLOR_CREATED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('createDLor error=', error);
                dispatch({
                    type: actions.DLOR_CREATE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function updateDLor(id, request) {
    console.log('updateDLor request=', request);
    return async dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return put(DLOR_UPDATE_API(), request)
            .then(data => {
                console.log('updateDLor response=', data);
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('updateDLor error=', error);
                dispatch({
                    type: actions.DLOR_UPDATE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export const deleteDlor = dlorID => {
    return async dispatch => {
        dispatch({ type: actions.DLOR_DELETING });

        try {
            const response = await destroy(DLOR_DESTROY_API({ id: dlorID }));
            dispatch({
                type: actions.DLOR_DELETED,
                payload: [],
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: actions.DLOR_DELETE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

export function loadOwningTeams() {
    return dispatch => {
        dispatch({ type: actions.DLOR_TEAM_LOADING });
        return get(DLOR_TEAM_LIST_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_TEAM_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_TEAM_FAILED,
                    payload: error.message,
                });
            });
    };
}
