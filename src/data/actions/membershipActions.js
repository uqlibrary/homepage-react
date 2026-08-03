import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import {
    MEMBERSHIP_BY_ID_API,
    MEMBERSHIP_CHECK_RENEWING_API,
    MEMBERSHIP_CREATE_API,
    MEMBERSHIP_FORM_DATA_API,
} from 'repositories/routes';

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

/**
 * Submit a new membership application. Resolves with the saved record — the received page is reached with its
 * id — and, on failure, rejects with the error so the form can surface the API's field messages.
 */
export function submitMembership(membership) {
    return async dispatch => {
        dispatch({ type: actions.MEMBERSHIP_SAVING });
        try {
            // The API answers a create with 201, for which the shared axios interceptor resolves the whole
            // response rather than its body — so the saved record is on `.data`.
            const response = await post(MEMBERSHIP_CREATE_API(), membership);
            const saved = response.data;
            dispatch({ type: actions.MEMBERSHIP_SAVED, payload: saved });
            return saved;
        } catch (error) {
            dispatch({ type: actions.MEMBERSHIP_SAVE_FAILED, payload: error });
            throw error;
        }
    };
}

/**
 * Read a single application back by id. The record normally arrives in the store from the submit that reached
 * the received page; this fills it in on a reload or a bookmarked link, where the store starts empty.
 */
export function loadMembership(id) {
    return dispatch => {
        dispatch({ type: actions.MEMBERSHIP_LOADING });
        return get(MEMBERSHIP_BY_ID_API({ id }))
            .then(response => dispatch({ type: actions.MEMBERSHIP_LOADED, payload: response }))
            .catch(error => dispatch({ type: actions.MEMBERSHIP_FAILED, payload: error.message }));
    };
}

/**
 * Drop the current membership record from the store — used when the form unmounts.
 */
export function clearMembership() {
    return dispatch => dispatch({ type: actions.MEMBERSHIP_CLEAR });
}
