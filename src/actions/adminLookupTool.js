import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import {ADMIN_LOOKUP_API_1FIELD, ADMIN_LOOKUP_API_2FIELD} from 'repositories/routes';

/**
 * build the api url
 * @param type
 * @param field1
 * @param field2
 * @returns {*}
 */
export function getAdminLookupApiUrl(type, field1, field2) {
    if (typeof field2 !== 'undefined') {
        return ADMIN_LOOKUP_API_2FIELD({type: type, field1: field1, field2: field2});
    } else {
        return ADMIN_LOOKUP_API_1FIELD({type: type, field1: field1});
    }
}

/**
 * fetch and dispatch the data from api
 * @param type
 * @param field1
 * @param field2
 * @returns {function(*): (*|void|Promise<T | never>)}
 */
export function loadAdminLookup(type, field1, field2) {
    return dispatch => {
        dispatch({type: actions.ADMIN_LOOKUP_TOOL_LOADING});

        // console.log(getAdminLookupApiUrl(type, field1, field2).apiUrl);

        return get(getAdminLookupApiUrl(type, field1, field2))
            .then(response => {
                dispatch({
                    type: actions.ADMIN_LOOKUP_TOOL_SUCCESS,
                    payload: response
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.ADMIN_LOOKUP_TOOL_LOAD_FAILED,
                    payload: error.message
                });
            });
    };
}
