import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { GUIDES_API, EXAMS_API, READING_LIST_API } from '../repositories/routes';

export function loadGuides(keyword) {
    console.log('will load loadGuides for ', keyword);
    return dispatch => {
        dispatch({ type: actions.GUIDES_LOADING });
        return get(GUIDES_API({ keyword }))
            .then(data => {
                console.log('fetched GUIDES_API: ', data);
                const updatedData = data.map(subject => {
                    subject.coursecode = keyword;
                    return subject;
                });
                dispatch({
                    type: actions.GUIDES_LOADED,
                    payload: updatedData,
                });
            })
            .catch(error => {
                console.log('guides error: ', error);
                dispatch({
                    type: actions.GUIDES_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearGuides() {
    return dispatch => {
        dispatch({ type: actions.GUIDES_CLEAR });
    };
}

export function loadExams(keyword) {
    console.log('will load Exams for ', keyword);
    return dispatch => {
        dispatch({ type: actions.EXAMS_LOADING });
        return get(EXAMS_API({ keyword }))
            .then(data => {
                console.log('fetched EXAMS_API: ', data);
                dispatch({
                    type: actions.EXAMS_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.EXAMS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearExams() {
    return dispatch => {
        dispatch({ type: actions.EXAMS_CLEAR });
    };
}

export function loadReadingLists(coursecode, campus, semester) {
    console.log(
        'will load loadReadingLists for ',
        coursecode,
        ': ',
        campus,
        ': ',
        semester,
        ' via',
        READING_LIST_API({ coursecode, campus, semester }),
    );
    return dispatch => {
        dispatch({ type: actions.READING_LIST_LOADING });
        return get(READING_LIST_API({ coursecode, campus, semester }))
            .then(data => {
                console.log('fetched READING_LIST_API for ', coursecode, ': ', data);
                const updatedData = data;
                // make the returned value more sensibly named
                updatedData.coursecode = data.title;
                dispatch({
                    type: actions.READING_LIST_LOADED,
                    payload: updatedData,
                });
            })
            .catch(error => {
                console.log(
                    'error for READING_LIST_API ',
                    READING_LIST_API({ coursecode, campus, semester }),
                    ': ',
                    error,
                );
                dispatch({
                    type: actions.READING_LIST_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearReadingLists() {
    return dispatch => {
        dispatch({ type: actions.READING_LIST_CLEAR });
    };
}
