import * as actions from './actionTypes';
import { destroy, get, post } from 'repositories/generic';
import {
    ALERT_BY_ID_API,
    ALERT_CREATE_API,
    ALERT_DELETE_API,
    ALERT_SAVE_API,
    ALERTS_ALL_API,
} from 'repositories/routes';

export const stripSeconds = inputDate => {
    const splittedString = inputDate.split(':');
    return !!splittedString && splittedString.length > 2 ? splittedString.slice(0, -1).join(':') : inputDate;
};

export function loadAllAlerts() {
    return dispatch => {
        dispatch({ type: actions.ALERTS_CLEAR });
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
    console.log('createAlert', request);
    return async dispatch => {
        dispatch({ type: actions.ALERT_LOADING });
        return post(ALERT_CREATE_API(), request)
            .then(data => {
                dispatch({
                    type: actions.ALERT_SAVED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ALERT_FAILED,
                    payload: error.message,
                });
            });
    };
};

export const saveAlertChange = request => {
    console.log('saveAlertChange: ', request);
    return async dispatch => {
        dispatch({ type: actions.ALERT_LOADING });
        return post(ALERT_SAVE_API({ id: request.id }), request)
            .then(data => {
                dispatch({
                    type: actions.ALERT_SAVED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ALERT_FAILED,
                    payload: error.message,
                });
            });
    };
};

export const deleteAlert = alertID => {
    return async dispatch => {
        dispatch({ type: actions.ALERT_LOADING });

        try {
            const response = await destroy(ALERT_DELETE_API({ id: alertID }));
            dispatch({
                type: actions.ALERT_DELETED,
                payload: [],
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: actions.ALERT_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
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
    return dispatch => {
        dispatch({ type: actions.ALERT_LOADING });
        return get(ALERT_BY_ID_API({ id: alertId }))
            .then(data => {
                const result = {
                    ...data,
                    start: stripSeconds(data.start),
                    end: stripSeconds(data.end),
                };
                dispatch({
                    type: actions.ALERT_LOADED,
                    payload: result,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ALERT_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearAnAlert() {
    return dispatch => {
        dispatch({ type: actions.ALERT_CLEAR });
    };
}
