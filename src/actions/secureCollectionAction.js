import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { SECURE_COLLECTION_API, SECURE_COLLECTION_CHECK_API } from '../repositories/routes';
// import { throwFetchErrors } from 'helpers/general';

export function loadSecureCollectionFile(params) {
    console.log('will load Secure Collection File for ', params);
    const path = `/${params.collection}/${params.someFile.pdf}`;
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_FILE_LOADING });
        return get(SECURE_COLLECTION_API({ path }))
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
export function loadSecureCollectionCheck(params) {
    console.log('will load Secure Collection Check for ', params);
    const path = `/${params.collection}/${params.someFile.pdf}`;
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_CHECK_LOADING });
        return get(SECURE_COLLECTION_CHECK_API({ path }))
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

export function clearSecureCollectionFile() {
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_FILE_CLEAR });
    };
}

export function clearSecureCollectionCheck() {
    return dispatch => {
        dispatch({ type: actions.SECURE_COLLECTION_CHECK_CLEAR });
    };
}
