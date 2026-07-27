import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { MEMBERSHIP_CHECK_RENEWING_API, MEMBERSHIP_FORM_DATA_API } from 'repositories/routes';

/**
 * Load the data the membership form and landing chooser are built from: account_types, titles, hospital.* and
 * reciprocal.*.
 */
export function loadMembershipFormData() {
    return dispatch => {
        dispatch({ type: actions.MEMBERSHIP_FORM_DATA_LOADING });
        return get(MEMBERSHIP_FORM_DATA_API())
            .then(response => dispatch({ type: actions.MEMBERSHIP_FORM_DATA_LOADED, payload: response }))
            .catch(error => dispatch({ type: actions.MEMBERSHIP_FORM_DATA_FAILED, payload: error.message }));
    };
}

/**
 * Ask whether the signed-in user is currently eligible to renew.
 */
export function checkIsRenewing() {
    return dispatch => {
        dispatch({ type: actions.MEMBERSHIP_RENEWING_LOADING });
        return get(MEMBERSHIP_CHECK_RENEWING_API())
            .then(response => dispatch({ type: actions.MEMBERSHIP_RENEWING_LOADED, payload: response }))
            .catch(error => dispatch({ type: actions.MEMBERSHIP_RENEWING_FAILED, payload: error.message }));
    };
}
