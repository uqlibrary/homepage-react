import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { EXAMS_SEARCH_API } from '../repositories/routes';

export function loadExamSearch(keyword) {
    return dispatch => {
        dispatch({ type: actions.EXAM_SEARCH_LOADING });
        return get(EXAMS_SEARCH_API({ keyword }))
            .then(data => {
                dispatch({
                    type: actions.EXAM_SEARCH_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.EXAM_SEARCH_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearExamSearch() {
    return dispatch => {
        dispatch({ type: actions.EXAM_SEARCH_CLEAR });
    };
}
