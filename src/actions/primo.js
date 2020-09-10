import * as actions from './actionTypes';
import {
    PRIMO_SUGGESTIONS_API_GENERIC,
    PRIMO_SUGGESTIONS_API_EXAMS,
    PRIMO_SUGGESTIONS_API_PAST_COURSE,
} from '../repositories/routes';

/**
 * Loads the primo search suggestions
 * @returns {function(*)}
 */
export function loadPrimoSuggestions(keyword) {
    return dispatch => {
        dispatch({ type: actions.PRIMO_SUGGESTIONS_LOADING });
        return fetch(PRIMO_SUGGESTIONS_API_GENERIC(keyword).apiUrl)
            .then(response => response.json())
            .then(data => {
                const payload =
                    (data && data.response && data.response.docs && data.response.docs.map(item => item.text)) || [];
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

export function loadExamPaperSuggestions(keyword) {
    return dispatch => {
        dispatch({ type: actions.PRIMO_SUGGESTIONS_LOADING });
        return fetch(PRIMO_SUGGESTIONS_API_EXAMS(keyword).apiUrl)
            .then(response => response.json())
            .then(data => {
                const payload = data.map(item => item.name);
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

export function loadCourseReadingListsSuggestions(keyword) {
    return dispatch => {
        dispatch({ type: actions.PRIMO_SUGGESTIONS_LOADING });
        return fetch(PRIMO_SUGGESTIONS_API_PAST_COURSE(keyword).apiUrl)
            .then(response => response.json())
            .then(data => {
                const payload = data.map(item => item.name);
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
