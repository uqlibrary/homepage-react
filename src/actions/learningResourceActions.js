import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { GUIDES_API, EXAMS_API, READING_LIST_API, SUGGESTIONS_API_PAST_COURSE } from '../repositories/routes';
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

export function loadExams(keyword) {
    return dispatch => {
        dispatch({ type: actions.EXAMS_LOADING });
        return get(EXAMS_API({ keyword }))
            .then(data => {
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

const extractDetailsOfEnrolmentFromCurrentClassList = (classnumber, account) => {
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

    if (!account || !account.current_classes) {
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
    } else {
        // this is the users classes
        const semesterString = subjectEnrolment.semester;
        const thisCampus = getCampusByCode(subjectEnrolment.CAMPUS);
        return readingLists.filter(item => {
            return item.period === semesterString && item.campus.indexOf(thisCampus) !== -1;
        });
    }
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

export function clearReadingLists() {
    return dispatch => {
        dispatch({ type: actions.READING_LIST_CLEAR });
    };
}

export function loadCourseReadingListsSuggestions(keyword) {
    return dispatch => {
        dispatch({ type: actions.COURSE_RESOURCE_SUGGESTIONS_LOADING });
        return fetch(SUGGESTIONS_API_PAST_COURSE({ keyword }).apiUrl)
            .then(throwFetchErrors)
            .then(response => response.json())
            .then(data => {
                const payload = data.map((item, index) => {
                    return {
                        text: item.name,
                        index,
                        rest: item,
                    };
                });
                dispatch({
                    type: actions.COURSE_RESOURCE_SUGGESTIONS_LOADED,
                    payload: payload,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.COURSE_RESOURCE_SUGGESTIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearCourseResourceSuggestions() {
    return dispatch => {
        dispatch({ type: actions.COURSE_RESOURCE_SUGGESTIONS_CLEAR });
    };
}
