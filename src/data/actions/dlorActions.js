import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { DLOR_ALL_API, DLOR_GET_BY_ID_API } from 'repositories/routes';

export function loadAllDLORs() {
    return dispatch => {
        // dispatch({ type: actions.DLOR_HOMEPAGE_CLEAR });
        dispatch({ type: actions.DLOR_HOMEPAGE_LOADING });
        return get(DLOR_ALL_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_HOMEPAGE_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_HOMEPAGE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadADLOR(dlorId) {
    return dispatch => {
        dispatch({ type: actions.DLOR_VIEWPAGE_LOADING });
        return get(DLOR_GET_BY_ID_API({ id: dlorId }))
            .then(data => {
                dispatch({
                    type: actions.DLOR_VIEWPAGE_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_VIEWPAGE_FAILED,
                    payload: error.message,
                });
            });
    };
}
