import * as actions from './actionTypes';
// import { get } from 'repositories/generic';
import { LEARNING_RESOURCES_API, GUIDES_API, READING_LIST_API } from '../repositories/routes';

// import { get } from 'repositories/generic';
/**
 * Loads the learning resources
 * @returns {function(*)}
 */
export function loadLearningResources(keyword) {
    return dispatch => {
        dispatch({ type: actions.LEARNING_RESOURCES_LOADING });
        console.log('loadLearningResources - fetching ', LEARNING_RESOURCES_API({ keyword }).apiUrl);
        return fetch(LEARNING_RESOURCES_API({ keyword }).apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('loadLearningResources data = ', data);
                dispatch({
                    type: actions.LEARNING_RESOURCES_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('loadLearningResources got error = ', error);
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
    return dispatch => {
        dispatch({ type: actions.GUIDES_LOADING });
        return fetch(GUIDES_API({ keyword }).apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('loadGuides data = ', data);
                dispatch({
                    type: actions.GUIDES_LOADED,
                    payload: data,
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
    return dispatch => {
        dispatch({ type: actions.READING_LIST_LOADING });
        console.log('loadReadingLists: fetching ', READING_LIST_API({ keyword }).apiUrl);
        return fetch(READING_LIST_API({ keyword }).apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('loadReadingLists data = ', data);
                dispatch({
                    type: actions.READING_LIST_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('loadReadingLists: dispatch failed');
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
