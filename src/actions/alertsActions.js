import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { ALERTS_ALL_API, ALERTS_BY_ID_API } from 'repositories/routes';
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

export function clearAlerts() {
    return dispatch => {
        dispatch({ type: actions.ALERTS_CLEAR });
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
