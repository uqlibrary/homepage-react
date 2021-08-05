import * as actions from './actionTypes';
import { get, post, destroy } from 'repositories/generic';
import {
    ALERT_SAVE_API,
    ALERT_CREATE_API,
    ALERTS_ALL_API,
    ALERT_BY_ID_API,
    ALERT_DELETE_API,
} from 'repositories/routes';

export function loadAllAlerts() {
    console.log('action loadAllAlerts: Loading Alerts');
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
    console.log('action createAlert, request to save: ', request);

    return async dispatch => {
        dispatch({ type: actions.ALERT_LOADING });
        console.log('createAlert action, ALERT_CREATE_API() = ', ALERT_CREATE_API());
        return post(ALERT_CREATE_API(), request)
            .then(data => {
                console.log('createAlert action, returned data = ', data);
                dispatch({
                    type: actions.ALERT_SAVED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('createAlert action error = ', error);
                dispatch({
                    type: actions.ALERT_FAILED,
                    payload: error.message,
                });
            });
    };
};

export const saveAlertChange = request => {
    return async dispatch => {
        dispatch({ type: actions.ALERT_LOADING });
        console.log('action saveAlertChange action, ALERT_SAVE_API() = ', ALERT_SAVE_API({ id: request.id }));
        return post(ALERT_SAVE_API({ id: request.id }), request)
            .then(data => {
                console.log('saveAlertChange action, returned data = ', data);
                dispatch({
                    type: actions.ALERT_SAVED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('saveAlertChange action error = ', error);
                dispatch({
                    type: actions.ALERT_FAILED,
                    payload: error.message,
                });
            });
    };
};

export const deleteAlert = alertID => {
    console.log('ALERT_DELETE_API({ id: alertID }) = ', ALERT_DELETE_API({ id: alertID }));
    return async dispatch => {
        dispatch({ type: actions.ALERT_LOADING });

        try {
            const response = await destroy(ALERT_DELETE_API({ id: alertID }));
            console.log('deleteAlert action, returned response = ', response);
            dispatch({
                type: actions.ALERT_DELETED,
                payload: [],
            });

            return Promise.resolve(response.data);
        } catch (e) {
            console.log('deleteAlert action error = ', e);
            dispatch({
                type: actions.ALERT_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

export function clearAlerts() {
    console.log('action clearAlerts - refreshing Alerts');
    return dispatch => {
        dispatch({
            type: actions.ALERTS_CLEAR,
        });
    };
}

// export function clearAlert() {
//     return dispatch => {
//         dispatch({
//             type: actions.ALERT_CLEAR,
//         });
//     };
// }

const stripSeconds = inputDate => {
    const splittedString = inputDate.split(':');
    return !!splittedString && splittedString.length > 2 ? splittedString.slice(0, -1).join(':') : inputDate;
};

export function loadAnAlert(alertId) {
    console.log('action load an Alert for ', alertId);
    return dispatch => {
        dispatch({ type: actions.ALERT_LOADING });
        console.log('getting ', ALERT_BY_ID_API({ id: alertId }));
        return get(ALERT_BY_ID_API({ id: alertId }))
            .then(data => {
                const result = {
                    ...data,
                    start: stripSeconds(data.start),
                    end: stripSeconds(data.end),
                };
                console.log('return ', result);
                dispatch({
                    type: actions.ALERT_LOADED,
                    payload: result,
                });
            })
            .catch(error => {
                console.log('loadAnAlert error = ', error);
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
