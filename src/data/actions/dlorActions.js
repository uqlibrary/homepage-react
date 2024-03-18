import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import {
    DLOR_ALL_API,
    DLOR_CREATE_API,
    DLOR_GET_BY_ID_API,
    DLOR_GET_FILTER_LIST,
    DLOR_TEAM_LIST_API,
} from 'repositories/routes';

export function loadAllDLORs() {
    return dispatch => {
        dispatch({ type: actions.DLOR_LIST_LOADING });
        return get(DLOR_ALL_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
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
    return dispatch => {
        dispatch({ type: actions.DLOR_FILTER_LIST_LOADING });
        return get(DLOR_GET_FILTER_LIST())
            .then(response => {
                dispatch({
                    type: actions.DLOR_FILTER_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_FILTER_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearDlor() {
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
                dispatch({
                    type: actions.DLOR_CREATED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_CREATE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadOwningTeams() {
    console.log('loadOwningTeams');
    return dispatch => {
        dispatch({ type: actions.DLOR_TEAM_LOADING });
        console.log('loadOwningTeams DLOR_TEAM_LIST_API()=', DLOR_TEAM_LIST_API());
        return get(DLOR_TEAM_LIST_API())
            .then(response => {
                console.log('loadOwningTeams response=', response);
                dispatch({
                    type: actions.DLOR_TEAM_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                console.log('loadOwningTeams error=', error);
                dispatch({
                    type: actions.DLOR_TEAM_FAILED,
                    payload: error.message,
                });
            });
    };
}
