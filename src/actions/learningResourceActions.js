import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import {
    GUIDES_API,
    LEARNING_RESOURCES_EXAMS_API,
    READING_LIST_API,
    SUGGESTIONS_API_PAST_COURSE,
} from '../repositories/routes';
import { getCampusByCode, throwFetchErrors } from 'helpers/general';

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

const extractDetailsOfEnrolmentFromCurrentClassList = (classnumber, account) => {
    /* istanbul ignore next */
    if (!account || !account.current_classes) {
        return null;
    }
    const currentClasses = account.current_classes;

    const subjectlist =
        !!currentClasses && currentClasses.filter(aClass => !!aClass && aClass.classnumber === classnumber);
    const thisSubject = (!!subjectlist && subjectlist.length > 0 && subjectlist[0]) || null;
    const theSemester = thisSubject?.semester || null;
    const theCampus = thisSubject?.CAMPUS || null;
    const instructionMode = thisSubject?.INSTRUCTION_MODE || null;
    return !!thisSubject
        ? {
              semester: theSemester,
              CAMPUS: theCampus,
              INSTRUCTION_MODE: instructionMode,
          }
        : null;
};

const filterReadingLists = (readingLists, coursecode, campus, semester, account) => {
    if (!readingLists || readingLists.length === 0 || !readingLists[0].list || readingLists[0].list.length === 0) {
        return [];
    }

    const importanceOrder = {
        Required: 1,
        Recommended: 2,
        Further: 3,
    };
    readingLists[0].list
        .sort((a, b) => {
            // Item with defined importance should be higher
            if (a.hasOwnProperty('importance') && !b.hasOwnProperty('importance')) {
                return -1;
            }
            // Item with defined importance should be higher
            if (!a.hasOwnProperty('importance') && b.hasOwnProperty('importance')) {
                return 1;
            }
            if (!a.hasOwnProperty('importance') && !b.hasOwnProperty('importance')) {
                return 0;
            }
            const impA = importanceOrder.hasOwnProperty(a.importance) ? importanceOrder[a.importance] : 999;
            const impB = importanceOrder.hasOwnProperty(b.importance) ? importanceOrder[b.importance] : 999;
            return impA - impB;
        })
        .map(item => {
            item.coursecode = coursecode;
        });

    const subjectEnrolment = extractDetailsOfEnrolmentFromCurrentClassList(coursecode, account);
    if (!subjectEnrolment) {
        // user is searching
        return readingLists.filter(item => {
            return item.period === semester && item.campus.indexOf(campus) !== -1;
        });
    }

    // this is the user's classes
    const semesterString = subjectEnrolment.semester;
    const thisCampus = getCampusByCode(subjectEnrolment.CAMPUS);
    return readingLists.filter(item => {
        return item.period === semesterString && item.campus.indexOf(thisCampus) !== -1;
    });
};

export function loadReadingLists(coursecode, campus, semester, account) {
    /* istanbul ignore next */
    if (coursecode.length !== 8 && coursecode.length !== 9) {
        // coursecodes have a length of 8 eg FREN1101, with a small number of weird outliers with 9
        return null;
    }

    return dispatch => {
        dispatch({ type: actions.READING_LIST_LOADING });
        return get(READING_LIST_API({ coursecode, campus, semester }))
            .then(data => {
                const updatedData = data;
                // make the returned value a more sensibly named variable
                updatedData.coursecode = data.title;
                // filter out any wrong reading lists
                updatedData.reading_lists = filterReadingLists(
                    updatedData.reading_lists,
                    coursecode,
                    campus,
                    semester,
                    account,
                );
                dispatch({
                    type: actions.READING_LIST_LOADED,
                    payload: updatedData,
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
        return fetch(SUGGESTIONS_API_PAST_COURSE({ keyword }).apiUrl)
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
                        (item.course_title ? `${item.course_title}, ` : '') +
                        (item.campus ? `${item.campus}, ` : '') +
                        (item.period ? item.period : '');
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