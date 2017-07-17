import {postRecord, patchRecord} from '../repositories';

// Available actions for /records/ api
export const RECORD_CREATED = 'RECORD_CREATED';
export const RECORD_CREATE_FAILED = 'RECORD_CREATE_FAILED';
export const RECORD_UPDATED = 'RECORD_UPDATED';
export const RECORD_UPDATE_FAILED = 'RECORD_UPDATE_FAILED';
export const RECORD_PROCESSING = 'RECORD_PROCESSING';
export const RECORD_RESET = 'RECORD_RESET';

/**
 * Submits the record for approval
 * @returns {function(*)}
 */
export function saveRecord(data) {
    return dispatch => {
        dispatch({type: RECORD_PROCESSING});

        postRecord(data).then((data) => {
            dispatch({
                type: RECORD_CREATED,
                payload: data
            });
        }).catch(error => {
            dispatch({
                type: RECORD_CREATE_FAILED,
                payload: error
            });
        });
    };
}

export function updateRecord(data) {
    return dispatch => {
        dispatch({type: RECORD_PROCESSING});
        patchRecord(data).then((data) => {
            dispatch({
                type: RECORD_UPDATED,
                payload: data
            });
        }).catch(error => {
            dispatch({
                type: RECORD_UPDATE_FAILED,
                payload: error
            });
        });
    };
}

export function resetRecord() {
    return dispatch => {
        dispatch({type: RECORD_RESET});
    };
}
