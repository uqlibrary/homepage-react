import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { GUIDES_API, EXAMS_API, READING_LIST_API } from '../repositories/routes';
import { getCampusByCode } from '../helpers/general';

export function loadGuides(keyword) {
    console.log('will load loadGuides for ', keyword);
    return dispatch => {
        dispatch({ type: actions.GUIDES_LOADING });
        return get(GUIDES_API({ keyword }))
            .then(data => {
                console.log('fetched GUIDES_API for ', keyword, ': ', data);
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

export function loadReadingLists(coursecode, campus, semester, account) {
    const extractDetailsOfEnrolmentFromCurrentClassList = classnumber => {
        const currentClasses = account.current_classes;

        const subjectTemplate = {
            semester: null,
            CAMPUS: null,
            INSTRUCTION_MODE: null,
        };

        const subjectlist =
            !!currentClasses && currentClasses.filter(aClass => !!aClass && aClass.classnumber === classnumber);
        const thisSubject = (!!subjectlist && subjectlist.length > 0 && subjectlist[0]) || null;
        return !!thisSubject
            ? {
                  semester: thisSubject?.semester || subjectTemplate.semester,
                  CAMPUS: thisSubject?.CAMPUS || subjectTemplate.CAMPUS,
                  INSTRUCTION_MODE: thisSubject?.INSTRUCTION_MODE || subjectTemplate.INSTRUCTION_MODE,
              }
            : null;
    };

    const filterReadingLists = (readingLists, coursecode, campus, semester) => {
        console.log('filterReadingLists: readingLists = ', readingLists);
        if (!readingLists || readingLists.length === 0) {
            return [];
        }

        if (readingLists.length === 1) {
            return readingLists;
        }

        !!readingLists &&
            !!readingLists &&
            readingLists.length > 0 &&
            readingLists.map(item => {
                item.coursecode = coursecode;
            });

        const subjectEnrolment = extractDetailsOfEnrolmentFromCurrentClassList(coursecode);
        console.log('subjectEnrolment = ', subjectEnrolment);
        if (!subjectEnrolment) {
            console.log('searching');
            // user is searching
            return readingLists.filter(item => {
                return item.period === semester && item.campus.indexOf(campus) !== -1;
            });
        } else {
            console.log('class list');
            // this is the users classes
            const semesterString = subjectEnrolment.semester;
            const campus = getCampusByCode(subjectEnrolment.CAMPUS);
            return readingLists.filter(item => {
                return (
                    item.period === semesterString &&
                    (item.campus.indexOf(campus) !== -1 || subjectEnrolment.INSTRUCTION_MODE === 'EX')
                );
            });
        }
    };

    if (coursecode.length !== 8 && coursecode.length !== 9) {
        // coursecodes have a length of 8 eg FREN1101, with a small number of weird outliers with 9
        return false;
    }

    console.log('will load loadReadingLists for ', READING_LIST_API({ coursecode, campus, semester }));
    return dispatch => {
        dispatch({ type: actions.READING_LIST_LOADING });
        return get(READING_LIST_API({ coursecode, campus, semester }))
            .then(data => {
                console.log('fetched READING_LIST_API for ', coursecode, ': ', data);
                const updatedData = data;
                // make the returned value a more sensibly named variable
                updatedData.coursecode = data.title;
                // filter out any wrong reading lists
                updatedData.reading_lists = filterReadingLists(updatedData.reading_lists, coursecode, campus, semester);
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
