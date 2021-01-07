import * as actions from './actionTypes';
import fetchJsonp from 'fetch-jsonp';
import {
    PRIMO_SUGGESTIONS_API_GENERIC,
    PRIMO_SUGGESTIONS_API_EXAMS,
    SUGGESTIONS_API_PAST_COURSE,
} from '../repositories/routes';
// import { get } from 'repositories/generic';
/**
 * Loads the primo search suggestions
 * @returns {function(*)}
 */
export function loadPrimoSuggestions(keyword) {
    return dispatch => {
        dispatch({ type: actions.PRIMO_SUGGESTIONS_LOADING });
        return fetchJsonp(PRIMO_SUGGESTIONS_API_GENERIC({ keyword }).apiUrl, {
            jsonpCallbackFunction: 'byutv_jsonp_callback_c631f96adec14320b23f1cac342d30f6',
            timeout: 3000,
        })
            .then(response => response.json())
            .then(data => {
                console.log('RESPONSE', data);
                const payload =
                    (data &&
                        data.response &&
                        data.response.docs &&
                        data.response.docs.map((item, index) => {
                            return {
                                ...item,
                                index,
                            };
                        })) ||
                    [];
                dispatch({
                    type: actions.PRIMO_SUGGESTIONS_LOADED,
                    payload: payload,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PRIMO_SUGGESTIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

// "A fetch() promise does not reject on HTTP errors (404, etc.).
// Instead, a then() handler must check the Response.ok and/or Response.status properties."
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export function loadExamPaperSuggestions(keyword) {
    return dispatch => {
        dispatch({ type: actions.PRIMO_SUGGESTIONS_LOADING });
        return fetch(PRIMO_SUGGESTIONS_API_EXAMS({ keyword }).apiUrl)
            .then(handleErrors)
            .then(response => response.json())
            .then(data => {
                const payload = data.map((item, index) => {
                    const title = !!item.course_title ? ` (${item.course_title})` : '';
                    return {
                        text: `${item.name}${title}`,
                        index,
                    };
                });
                dispatch({
                    type: actions.PRIMO_SUGGESTIONS_LOADED,
                    payload: payload,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PRIMO_SUGGESTIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadHomepageCourseReadingListsSuggestions(keyword) {
    return dispatch => {
        dispatch({ type: actions.PRIMO_SUGGESTIONS_LOADING });
        return fetch(SUGGESTIONS_API_PAST_COURSE({ keyword }).apiUrl)
            .then(handleErrors)
            .then(response => response.json())
            .then(data => {
                const payload = data.map((item, index) => {
                    const specifier =
                        (item.course_title ? `${item.course_title} | ` : '') +
                        (item.campus ? `${item.campus} , ` : '') +
                        (item.period ? item.period.toLowerCase() : '');
                    const append = !!specifier ? ` ( ${specifier} )` : '';
                    return {
                        text: `${item.name}${append}`,
                        index,
                        rest: item,
                    };
                });
                dispatch({
                    type: actions.PRIMO_SUGGESTIONS_LOADED,
                    payload: payload,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PRIMO_SUGGESTIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearPrimoSuggestions() {
    return dispatch => {
        dispatch({ type: actions.PRIMO_SUGGESTIONS_CLEAR });
    };
}
