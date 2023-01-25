import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import {
    GUIDES_API,
    LEARNING_RESOURCES_EXAMS_API,
    READING_LIST_API,
    LEARNING_RESOURCES_COURSE_SUGGESTIONS_API,
} from 'repositories/routes';
import { throwFetchErrors } from 'helpers/general';

export function loadGuides(keyword) {
    return dispatch => {
        dispatch({ type: actions.GUIDES_LOADING });
        return get(GUIDES_API({ keyword }))
            .then(data => {
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

export function loadExamLearningResources(keyword) {
    return dispatch => {
        dispatch({ type: actions.EXAMS_LEARNING_RESOURCES_LOADING });
        return get(LEARNING_RESOURCES_EXAMS_API({ keyword }))
            .then(data => {
                dispatch({
                    type: actions.EXAMS_LEARNING_RESOURCES_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.EXAMS_LEARNING_RESOURCES_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearExamLearningResources() {
    return dispatch => {
        dispatch({ type: actions.EXAMS_LEARNING_RESOURCES_CLEAR });
    };
}

export function loadReadingLists(coursecode, campus, semester) {
    /* istanbul ignore next */
    if (coursecode.length !== 8 && coursecode.length !== 9) {
        // coursecodes have a length of 8 eg FREN1101, with a small number of weird outliers with 9
        return null;
    }

    return dispatch => {
        dispatch({ type: actions.READING_LIST_LOADING });
        return get(READING_LIST_API({ coursecode, campus, semester }))
            .then(data => {
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

export function loadCourseReadingListsSuggestions(keyword) {
    return dispatch => {
        dispatch({ type: actions.LEARNING_RESOURCE_SUGGESTIONS_LOADING });
        return fetch(LEARNING_RESOURCES_COURSE_SUGGESTIONS_API({ keyword }).apiUrl)
            .then(throwFetchErrors)
            .then(response => response.json())
            .then(data => {
                /* istanbul ignore next */
                if (keyword.length === 0) {
                    // just trying this as it helps with the mock data
                    dispatch({
                        type: actions.LEARNING_RESOURCE_SUGGESTIONS_LOADED,
                        payload: null,
                    });
                    return;
                }

                function foundCourseCodeMatchesSearchTerm(option) {
                    const uppercaseCourseCode =
                        !!option.name && option.name.length > 0
                            ? option.name.toUpperCase()
                            : /* istanbul ignore next */ '';
                    return uppercaseCourseCode.startsWith(keyword.toUpperCase());
                }

                let datafiltered = data;

                // if they have searched for something that looks like it is a course code, eg FREN, then
                // only show results that start with that course code
                // (the talis search is too broad - if the user searches for MEDI they will get subjects
                // whose name includes interMEDIate)
                /* istanbul ignore else */
                if (!!data.find(option => foundCourseCodeMatchesSearchTerm(option))) {
                    datafiltered = data.filter(option => foundCourseCodeMatchesSearchTerm(option));
                }

                const sorter = datafiltered
                    // sort to put the matching course codes at the top of the list
                    .sort(a => {
                        const foundcode = a.name.toUpperCase().substr(0, keyword.length);
                        const searchedcode = keyword.toUpperCase();
                        const searchedcode4 = keyword.toUpperCase().substr(0, 4);
                        // eslint-disable-next-line no-nested-ternary
                        return foundcode === searchedcode
                            ? 1
                            : /* istanbul ignore next */ a.name.startsWith(searchedcode4)
                            ? 0
                            : -1;
                    });
                const payload = sorter.reverse().map((item, index) => {
                    const specifier =
                        (item.course_title ? `${item.course_title}` : '') +
                        (item.campus ? `, ${item.campus}` : '') +
                        (item.period ? `, ${item.period}` : '');
                    const append = !!specifier ? ` (${specifier})` : '';
                    return {
                        courseCode: item.name,
                        displayname: `${item.name}${append}`,
                        index,
                        campus: item.campus,
                        semester: item.period,
                    };
                });
                dispatch({
                    type: actions.LEARNING_RESOURCE_SUGGESTIONS_LOADED,
                    payload: payload,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.LEARNING_RESOURCE_SUGGESTIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearLearningResourceSuggestions() {
    return dispatch => {
        dispatch({ type: actions.LEARNING_RESOURCE_SUGGESTIONS_CLEAR });
    };
}
