import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { EXAMS_SUGGESTION_API } from '../repositories/routes';

export function loadExamSuggestions(keyword) {
    return dispatch => {
        dispatch({ type: actions.EXAM_SUGGESTIONS_LOADING });
        return get(EXAMS_SUGGESTION_API({ keyword }))
            .then(data => {
                dispatch({
                    type: actions.EXAM_SUGGESTIONS_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.EXAM_SUGGESTIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearExamSuggestions() {
    return dispatch => {
        dispatch({ type: actions.EXAM_SUGGESTIONS_CLEAR });
    };
}
