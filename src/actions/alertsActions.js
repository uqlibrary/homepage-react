import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import { ALERT_ADD, ALERTS_ALL_API, ALERTS_BY_ID_API } from 'repositories/routes';
// import { throwFetchErrors } from 'helpers/general';

export function loadAllAlerts() {
    console.log('Loading Alerts');
    return dispatch => {
        dispatch({ type: actions.ALERTS_LOADING });
        return get(ALERTS_ALL_API())
            .then(alertResponse => {
                dispatch({
                    type: actions.ALERTS_LOADED,
                    payload: alertResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ALERTS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export const createAlert = request => {
    console.log('createAlert, request to save: ', request);

    return async dispatch => {
        dispatch({ type: actions.ALERTS_LOADING });
        console.log('createAlert action, ALERT_ADD() = ', ALERT_ADD());
        return post(ALERT_ADD(), request)
            .then(data => {
                console.log('createAlert action, returned data = ', data);
                dispatch({
                    type: actions.ALERT_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('createAlert action error = ', error);
                dispatch({
                    type: actions.ALERTS_FAILED,
                    payload: error.message,
                });
            });
    };
};

export function clearAlerts() {
    return dispatch => {
        dispatch({
            type: actions.ALERTS_CLEAR,
        });
    };
}

export function loadAnAlert(alertId) {
    console.log('load an Alert for ', alertId);
    return dispatch => {
        dispatch({ type: actions.ALERTS_LOADING });
        return get(ALERTS_BY_ID_API({ id: alertId }))
            .then(data => {
                dispatch({
                    type: actions.ALERTS_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('error = ', error);
                dispatch({
                    type: actions.ALERTS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearAnAlert() {
    return dispatch => {
        dispatch({ type: actions.ALERTS_CLEAR });
    };
}
