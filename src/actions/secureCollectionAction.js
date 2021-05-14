import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { SECURE_COLLECTION_API, SECURE_COLLECTION_CHECK_API } from '../repositories/routes';
// import { throwFetchErrors } from 'helpers/general';

export function loadSecureCollectionCheck(path) {
    console.log('start of action:loadSecureCollectionCheck for ', path);
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_CHECK_LOADING });
        const api = SECURE_COLLECTION_CHECK_API({ path });
        console.log('api = ', api);
        return get(api)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: actions.SECURE_COLLECTION_CHECK_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SECURE_COLLECTION_CHECK_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearSecureCollectionCheck() {
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_CHECK_CLEAR });
    };
}

export function loadSecureCollectionFile(path) {
    console.log('will load Secure Collection File for ', path);
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_FILE_LOADING });
        const api = SECURE_COLLECTION_API({ path });
        return get(api)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: actions.SECURE_COLLECTION_FILE_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SECURE_COLLECTION_FILE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearSecureCollectionFile() {
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_FILE_CLEAR });
    };
}
