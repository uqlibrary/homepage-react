import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import {
    MEMBERSHIPS_LIST_API,
    MEMBERSHIP_BY_CODE_API,
    MEMBERSHIP_BY_ID_API,
    MEMBERSHIP_CHECK_RENEWING_API,
    MEMBERSHIP_CREATE_API,
    MEMBERSHIP_FILE_UPLOAD_API,
    MEMBERSHIP_FORM_DATA_API,
    MEMBERSHIP_PAYMENT_API,
    MEMBERSHIP_RENEW_API,
} from 'repositories/routes';

// The API stores attachments as a flat attachment_0..attachment_n set of JSON strings rather than a list, and
// only ever reads this many back.
export const MAX_ATTACHMENTS = 4;

/**
 * Turn the API's attachment_0..attachment_n fields into an `attachments` list. A record with no attachments is
 * returned untouched.
 */
export const convertAttachments = membership => {
    if (!membership || !Object.prototype.hasOwnProperty.call(membership, 'attachment_0')) {
        return membership;
    }

    const attachments = [];
    for (let index = 0; index < MAX_ATTACHMENTS; index++) {
        const key = `attachment_${index}`;
        if (Object.prototype.hasOwnProperty.call(membership, key)) {
            const attachment = membership[key];
            attachments.push(typeof attachment === 'string' ? JSON.parse(attachment) : attachment);
        }
    }
    return { ...membership, attachments };
};

/**
 * The inverse of convertAttachments: spread an `attachments` list back out into the fields the API expects.
 */
export const flattenAttachments = membership => {
    if (!Object.prototype.hasOwnProperty.call(membership ?? {}, 'attachments')) {
        return membership;
    }
    return membership.attachments.reduce(
        (flattened, attachment, index) => ({ ...flattened, [`attachment_${index}`]: JSON.stringify(attachment) }),
        { ...membership },
    );
};

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
            const response = await post(MEMBERSHIP_CREATE_API(), flattenAttachments(membership));
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
            .then(response => dispatch({ type: actions.MEMBERSHIP_LOADED, payload: convertAttachments(response) }))
            .catch(error => dispatch({ type: actions.MEMBERSHIP_FAILED, payload: error.message }));
    };
}

/**
 * Read an application via a renewal link, authenticated on the id + code pair from the link rather than a
 * session. Used to open a renewal prefilled from the record it points at.
 */
export function loadMembershipByCode(id, code) {
    return dispatch => {
        dispatch({ type: actions.MEMBERSHIP_LOADING });
        return get(MEMBERSHIP_BY_CODE_API({ id, code }))
            .then(response => dispatch({ type: actions.MEMBERSHIP_LOADED, payload: convertAttachments(response) }))
            .catch(error => dispatch({ type: actions.MEMBERSHIP_FAILED, payload: error.message }));
    };
}

/**
 * Submit a renewal. The renewal endpoint authenticates on the id + code from the link, so they travel with
 * the body. Resolves with the saved record so the received page can be reached with its id.
 */
export function renewMembership(membership) {
    return async dispatch => {
        dispatch({ type: actions.MEMBERSHIP_SAVING });

        try {
            const saved = await post(
                MEMBERSHIP_RENEW_API({ id: membership.id, code: membership.code }),
                flattenAttachments(membership),
            );
            dispatch({ type: actions.MEMBERSHIP_SAVED, payload: saved });
            return Promise.resolve(saved);
        } catch (error) {
            dispatch({ type: actions.MEMBERSHIP_SAVE_FAILED, payload: error });
            return Promise.reject(error);
        }
    };
}

/**
 * Record a payment against an application when the gateway sends the applicant back. By this point the money
 * has changed hands, so this only writes down what happened; the outcome reported to the applicant is whether
 * that record was written, not whether they paid.
 */
export function saveMembershipPayment(payment) {
    return async dispatch => {
        dispatch({ type: actions.MEMBERSHIP_SAVING });

        try {
            const response = await post(MEMBERSHIP_PAYMENT_API({ id: payment.id }), payment);
            dispatch({ type: actions.MEMBERSHIP_SAVED, payload: response });
            return Promise.resolve(response);
        } catch (error) {
            dispatch({ type: actions.MEMBERSHIP_SAVE_FAILED, payload: error });
            return Promise.reject(error);
        }
    };
}

/**
 * Upload one supporting document.
 *
 * Resolves with the attachment the API stored, which is what goes into the application's `attachments` list.
 * Nothing is dispatched: an upload succeeds or fails on its own, and is reported next to the file it belongs
 * to rather than as a failure of the application as a whole.
 */
export function uploadMembershipFile(file) {
    return async () => {
        const data = new FormData();
        data.append('file', file);

        // The Content-Type is left to the browser: it has to set the multipart boundary, which we cannot know.
        const response = await post(MEMBERSHIP_FILE_UPLOAD_API(), data);

        return Array.isArray(response) ? response[0] : response;
    };
}

/**
 * Drop the current membership record from the store — used when the form mounts.
 */
export function clearMembership() {
    return dispatch => dispatch({ type: actions.MEMBERSHIP_CLEAR });
}

/**
 * Load the admin listing of applications for the given search filter. Each record's flat attachment fields are
 * turned into an `attachments` list, the same as a single record read.
 */
export function loadMemberships(filter, limit) {
    return dispatch => {
        dispatch({ type: actions.MEMBERSHIPS_LOADING });
        return get(MEMBERSHIPS_LIST_API({ filter, limit }))
            .then(response =>
                dispatch({
                    type: actions.MEMBERSHIPS_LOADED,
                    payload: response.map(membership => convertAttachments(membership)),
                }),
            )
            .catch(error => dispatch({ type: actions.MEMBERSHIPS_FAILED, payload: error.message }));
    };
}

/**
 * Drop the admin listing from the store.
 */
export function clearMemberships() {
    return dispatch => dispatch({ type: actions.MEMBERSHIPS_CLEAR });
}
