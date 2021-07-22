import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import {
    AUTHOR_DETAILS_API,
    CURRENT_ACCOUNT_API,
    CURRENT_AUTHOR_API,
    LIB_HOURS_API,
    SPOTLIGHTS_API,
    COMP_AVAIL_API,
    TRAINING_API,
    PRINTING_API,
    LOANS_API,
    POSSIBLE_RECORDS_API,
    INCOMPLETE_NTRO_RECORDS_API,
} from 'repositories/routes';
import Raven from 'raven-js';
import { sessionApi } from 'config';

// make the complete class number from the pieces supplied by API, eg FREN + 1010 = FREN1010
export function getClassNumberFromPieces(subject) {
    /* istanbul ignore next */
    if (!subject || !subject.SUBJECT || !subject.CATALOG_NBR) {
        return '';
    }
    return `${subject.SUBJECT}${subject.CATALOG_NBR}`;
}

/**
 * Returns semester year/number based on semester code
 * 6520 - semestre 1, 2015
 * Year: 2000 + 6520 - 5000 = 2015
 * Semester: 65"20" - semester 1
 * 6480 - semester 3 year 2014,
 *
 * @param termNumber
 * @returns {string}
 */
export function getSemesterStringByTermNumber(termNumber) {
    const year = 2000 + parseInt((parseInt(termNumber, 10) - 5000 + '').substring(0, 2), 10);

    let semester = 1;
    const semesterCode = parseInt(termNumber.substr(-2), 10);
    if (semesterCode >= 50 && semesterCode <= 79) {
        semester = 2;
    } else if (semesterCode >= 80) {
        semester = 3;
    }
    return `Semester ${semester} ${year}`;
}

/**
 * Loads the user's account and author details into the application
 * @returns {function(*)}
 */
export function loadCurrentAccount() {
    return dispatch => {
        if (navigator.userAgent.match(/Googlebot|facebookexternalhit|bingbot|Slackbot-LinkExpanding|Twitterbot/)) {
            dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
            return Promise.resolve({});
        } else {
            dispatch({ type: actions.CURRENT_ACCOUNT_LOADING });

            let currentAuthor = null;

            // load UQL account (based on token)
            return get(CURRENT_ACCOUNT_API())
                .then(account => {
                    if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                        if (process.env.ENABLE_LOG) Raven.setUserContext({ id: account.id });
                        return Promise.resolve(account);
                    } else {
                        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
                        return Promise.reject(new Error('Session expired. User is unauthorized.'));
                    }
                })
                .then(accountResponse => {
                    accountResponse.current_classes =
                        !!accountResponse.current_classes && accountResponse.current_classes.length > 0
                            ? accountResponse.current_classes.map(subject => {
                                  subject.classnumber = getClassNumberFromPieces(subject);
                                  subject.semester = getSemesterStringByTermNumber(subject.STRM);
                                  return subject;
                              })
                            : accountResponse.current_classes;
                    dispatch({
                        type: actions.CURRENT_ACCOUNT_LOADED,
                        payload: accountResponse,
                    });

                    // load current author details (based on token)
                    dispatch({ type: actions.CURRENT_AUTHOR_LOADING });
                    return get(CURRENT_AUTHOR_API());
                })
                .then(currentAuthorResponse => {
                    currentAuthor = currentAuthorResponse.data;
                    dispatch({
                        type: actions.CURRENT_AUTHOR_LOADED,
                        payload: currentAuthor,
                    });

                    // load repository author details
                    if (currentAuthor.aut_org_username || currentAuthor.aut_student_username) {
                        dispatch({ type: actions.CURRENT_AUTHOR_DETAILS_LOADING });
                        return get(
                            AUTHOR_DETAILS_API({
                                userId: currentAuthor.aut_org_username || currentAuthor.aut_student_username,
                            }),
                        );
                    }
                    return null;
                })
                .then(authorDetailsResponse => {
                    dispatch({
                        type: actions.CURRENT_AUTHOR_DETAILS_LOADED,
                        payload: authorDetailsResponse,
                    });
                })
                .catch(error => {
                    if (!currentAuthor) {
                        dispatch({
                            type: actions.CURRENT_AUTHOR_FAILED,
                            payload: error.message,
                        });
                    }
                    dispatch({
                        type: actions.CURRENT_AUTHOR_DETAILS_FAILED,
                        payload: error.message,
                    });
                });
        }
    };
}

/**
 * Loads the spotlight data
 * @returns {function(*)}
 */
export function loadSpotlights() {
    console.log('Loading Spotlights');
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHTS_LOADING });
        return get(SPOTLIGHTS_API())
            .then(spotlightsResponse => {
                dispatch({
                    type: actions.SPOTLIGHTS_LOADED,
                    payload: spotlightsResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPOTLIGHTS_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Loads the library hours data
 * @returns {function(*)}
 */
export function loadLibHours() {
    console.log('Loading Library Hours');
    return dispatch => {
        dispatch({ type: actions.LIB_HOURS_LOADING });
        return get(LIB_HOURS_API())
            .then(hoursResponse => {
                dispatch({
                    type: actions.LIB_HOURS_LOADED,
                    payload: hoursResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.LIB_HOURS_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Loads the papercut print balance data
 * @returns {function(*)}
 */
export function loadPrintBalance() {
    console.log('Loading Print Balance');
    return dispatch => {
        dispatch({ type: actions.PRINT_BALANCE_LOADING });
        return get(PRINTING_API())
            .then(papercutResponse => {
                dispatch({
                    type: actions.PRINT_BALANCE_LOADED,
                    payload: papercutResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PRINT_BALANCE_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Loads the loans data
 * @returns {function(*)}
 */
export function loadLoans() {
    console.log('Loading Loans');
    return dispatch => {
        dispatch({ type: actions.LOANS_LOADING });
        return get(LOANS_API())
            .then(loanResponse => {
                dispatch({
                    type: actions.LOANS_LOADED,
                    payload: loanResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.LOANS_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Loads the computer availability data
 * @returns {function(*)}
 */
export function loadCompAvail() {
    console.log('Loading Computer Availability');
    return dispatch => {
        dispatch({ type: actions.COMP_AVAIL_LOADING });
        return get(COMP_AVAIL_API())
            .then(availResponse => {
                dispatch({
                    type: actions.COMP_AVAIL_LOADED,
                    payload: availResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.COMP_AVAIL_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Loads the training events data
 * @returns {function(*)}
 */
export function loadTrainingEvents() {
    console.log('Loading Training Events');
    return dispatch => {
        dispatch({ type: actions.TRAINING_LOADING });
        return get(TRAINING_API(10))
            .then(availResponse => {
                dispatch({
                    type: actions.TRAINING_LOADED,
                    payload: availResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.TRAINING_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Search publications from eSpace which are fuzzy matched to currently logged in username
 * @param {object} activeFacets - optional list of facets
 * @returns {action}
 */
export function searcheSpacePossiblePublications() {
    console.log('Loading Possible eSpace Pubs');
    return dispatch => {
        dispatch({ type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING });
        return get(POSSIBLE_RECORDS_API())
            .then(response => {
                dispatch({
                    type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Search NTRO publications from eSpace which are incomplete for the current user
 * @param {object} activeFacets - optional list of facets
 * @returns {action}
 */
export function searcheSpaceIncompleteNTROPublications() {
    console.log('Loading Incomplete NTRO Pubs');
    return dispatch => {
        dispatch({ type: actions.INCOMPLETE_NTRO_PUBLICATIONS_LOADING });
        return get(INCOMPLETE_NTRO_RECORDS_API())
            .then(response => {
                dispatch({
                    type: actions.INCOMPLETE_NTRO_PUBLICATIONS_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.INCOMPLETE_NTRO_PUBLICATIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function logout() {
    return dispatch => {
        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
    };
}

/**
 * @param string reducerToSave
 */
export function checkSession(reducerToSave = 'form') {
    return dispatch => {
        return sessionApi
            .get(CURRENT_ACCOUNT_API().apiUrl)
            .then(() => {
                dispatch({ type: actions.CURRENT_ACCOUNT_SESSION_VALID });
            })
            .catch(() => {
                dispatch({
                    type: actions.CURRENT_ACCOUNT_SESSION_EXPIRED,
                    payload: reducerToSave,
                });
            });
    };
}

export function clearSessionExpiredFlag() {
    return dispatch => {
        dispatch({ type: actions.CLEAR_CURRENT_ACCOUNT_SESSION_FLAG });
    };
}
