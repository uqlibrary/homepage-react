import * as actions from './actionTypes';

export function showAppAlert(appAlert) {
    return {
        type: actions.APP_ALERT_SHOW,
        payload: appAlert,
    };
}

export function dismissAppAlert() {
    return { type: actions.APP_ALERT_HIDE };
}

/**
 * Set redirect path for user to redirect
 * @param {string} redirectPath
 */
export function setRedirectPath(redirectPath) {
    return dispatch => {
        dispatch({
            type: actions.SET_REDIRECT_PATH,
            payload: redirectPath,
        });
    };
}

/**
 * Clears redirect path
 */
export function clearRedirectPath() {
    return dispatch => {
        dispatch({
            type: actions.CLEAR_REDIRECT_PATH,
        });
    };
}
