import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { EXAMS_API, GUIDES_API, READING_LIST_API, SUGGESTIONS_API_PAST_COURSE } from '../repositories/routes';
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

    /* istanbul ignore next */
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
    console.log('loadCourseReadingListsSuggestions', keyword);
    return dispatch => {
        dispatch({ type: actions.LEARNING_RESOURCE_SUGGESTIONS_LOADING });
        return fetch(SUGGESTIONS_API_PAST_COURSE({ keyword }).apiUrl)
            .then(throwFetchErrors)
            .then(response => response.json())
            .then(data => {
                console.log('keyword = ', keyword);
                console.log(
                    'data = ',
                    data.map(t => t.name),
                );

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
                        !!option.name && option.name.length > 0 ? option.name.toUpperCase() : '';
                    return uppercaseCourseCode.startsWith(keyword.toUpperCase());
                }

                let datafiltered = data;

                // if they have searched for something that looks like it is a course code, eg FREN, then
                // only show results that start with that course code
                // (the talis search is too broad - if the user searches for MEDI they will get subjects
                // whose name includes interMEDIate)
                if (!!data.find(option => foundCourseCodeMatchesSearchTerm(option))) {
                    console.log('found ', keyword, ' in data');
                    datafiltered = data.filter(option => foundCourseCodeMatchesSearchTerm(option));
                }
                console.log(
                    'datafiltered = ',
                    datafiltered.map(t => t.name),
                );

                const sorter = datafiltered
                    // sort to put the matching course codes at the top of the list
                    .sort(a => {
                        const foundcode = a.name.toUpperCase().substr(0, keyword.length);
                        const searchedcode = keyword.toUpperCase();
                        const searchedcode4 = keyword.toUpperCase().substr(0, 4);
                        // if (searchedcode.length > 4) {
                        //     return 1;
                        // }
                        // eslint-disable-next-line no-nested-ternary
                        const number1 = foundcode === searchedcode ? 1 : a.name.startsWith(searchedcode4) ? 0 : -1;
                        // const number1 = a.name.startsWith(searchedcode4) ? -1 : foundcode === searchedcode ? 0 : -1;
                        // const number1 = foundcode < searchedcode ? -1 : foundcode > searchedcode ? 1 : 0;
                        console.log('dump:', foundcode, searchedcode, number1);
                        return number1;
                    });
                console.log(
                    'sorter = ',
                    sorter.map(t => t.name),
                );
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
                        rest: item,
                        // courseTitle: item.course_title,
                        campus: item.campus,
                        semester: item.semester,
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
    console.log('CLEARING SUGGESTIONS clearLearningResourceSuggestions');
    return dispatch => {
        dispatch({ type: actions.LEARNING_RESOURCE_SUGGESTIONS_CLEAR });
    };
}
