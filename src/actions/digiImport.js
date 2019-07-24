import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import { BATCH_IMPORT_DIRECTORIES_API, BATCH_IMPORT_API } from 'repositories/routes';
import * as transformers from './transformers';

export function getBatchImportDirectories() {
    return dispatch => {
        dispatch({ type: actions.DIRECTORY_LIST_LOADING });
        return get(BATCH_IMPORT_DIRECTORIES_API()).then(
            response => {
                dispatch({ type: actions.DIRECTORY_LIST_LOADED, payload: response.data });
                return Promise.resolve(response);
            },
            error => {
                dispatch({ type: actions.DIRECTORY_LIST_FAILED, payload: error.message });
                return Promise.reject(new Error(error.message));
            }
        );
    };
}

export function createBatchImport(data) {
    return dispatch => {
        dispatch({ type: actions.BATCH_IMPORT_REQUESTING });
        const batchImportRequest = transformers.getBatchImport(data);

        return post(BATCH_IMPORT_API(), batchImportRequest).then(
            response => {
                dispatch({ type: actions.BATCH_IMPORT_REQUESTED, payload: response.data });
                return Promise.resolve(response);
            },
            error => {
                dispatch({ type: actions.BATCH_IMPORT_REQUEST_FAILED, payload: error.message });
                return Promise.reject(new Error(error.message));
            }
        );
    };
}
