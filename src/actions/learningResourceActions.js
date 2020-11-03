import * as actions from './actionTypes';
// import { get } from 'repositories/generic';
import { LEARNING_RESOURCES_API, GUIDES_API, READING_LIST_API } from '../repositories/routes';

// import { get } from 'repositories/generic';
/**
 * Loads the learning resources
 * @returns {function(*)}
 */
export function loadLearningResources(keyword) {
    console.log('will load loadLearningResources for ', keyword);
    return dispatch => {
        dispatch({ type: actions.LEARNING_RESOURCES_LOADING });
        return fetch(LEARNING_RESOURCES_API({ keyword }).apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('fetched LEARNING_RESOURCES_API');
                dispatch({
                    type: actions.LEARNING_RESOURCES_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.LEARNING_RESOURCES_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearLearningResources() {
    return dispatch => {
        dispatch({ type: actions.LEARNING_RESOURCES_CLEAR });
    };
}

export function loadGuides(keyword) {
    console.log('will load loadGuides for ', keyword);
    return dispatch => {
        dispatch({ type: actions.GUIDES_LOADING });
        return fetch(GUIDES_API({ keyword }).apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('fetched GUIDES_API');
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

export function loadReadingLists(keyword) {
    console.log('will load loadReadingLists for ', keyword);
    return dispatch => {
        dispatch({ type: actions.READING_LIST_LOADING });
        return fetch(READING_LIST_API({ keyword }).apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('fetched READING_LIST_API for ', keyword);
                dispatch({
                    type: actions.READING_LIST_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
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
