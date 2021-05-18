import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { SECURE_COLLECTION_FILE_API, SECURE_COLLECTION_CHECK_API } from 'repositories/routes';
// import { throwFetchErrors } from 'helpers/general';

export function loadSecureCollectionCheck(path) {
    console.log('start of action:loadSecureCollectionCheck for ', path);
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_LOADING });
        return get(SECURE_COLLECTION_CHECK_API({ path }))
            .then(data => {
                dispatch({
                    type: actions.SECURE_COLLECTION_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SECURE_COLLECTION_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearSecureCollectionCheck() {
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_CLEAR });
    };
}

export function loadSecureCollectionFile(path) {
    console.log('start of action: will load Secure Collection File for ', path);
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_LOADING });
        return get(SECURE_COLLECTION_FILE_API({ path }))
            .then(data => {
                dispatch({
                    type: actions.SECURE_COLLECTION_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SECURE_COLLECTION_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearSecureCollectionFile() {
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_CLEAR });
    };
}
