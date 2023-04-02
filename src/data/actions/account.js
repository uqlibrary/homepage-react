import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import {
    COMP_AVAIL_API,
    INCOMPLETE_NTRO_RECORDS_API,
    LIB_HOURS_API,
    LOANS_API,
    POSSIBLE_RECORDS_API,
    PRINTING_API,
    SPOTLIGHTS_API_CURRENT,
    TRAINING_API,
} from 'repositories/routes';

import { isHospitalUser, TRAINING_FILTER_GENERAL, TRAINING_FILTER_HOSPITAL } from 'helpers/access';
import { SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME, STORAGE_ACCOUNT_KEYNAME } from 'config/general';
import Cookies from 'js-cookie';

const queryString = require('query-string');

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
 * from database IFACE_LIBRARY table STU_SEMESTER_DATES
 * *90 = SRC Enrolment Year
 * *80 = Summer Semester (which we call semester 3)
 * *75 = Research Quarter 4
 * *60 = Semester 2
 * *50 = Trimester 3
 * *45 = Research Quarter 3
 * *30 = Trimester 2
 * *25 = Research Quarter 2
 * *20 = Semester 1
 * *10 = Trimester 1
 * *05 = Research Quarter 1
 * but we only use Semesters 1, 2 and 3
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

function getSessionCookie() {
    return Cookies.get(SESSION_COOKIE_NAME);
}
function getLibraryGroupCookie() {
    // I am guessing this field is used as a proxy for 'has a Library account, not just a general UQ login'
    return Cookies.get(SESSION_USER_GROUP_COOKIE_NAME);
}

function removeAccountStorage() {
    sessionStorage.removeItem(STORAGE_ACCOUNT_KEYNAME);
}

export function getAccountFromStorage() {
    const item = sessionStorage.getItem(STORAGE_ACCOUNT_KEYNAME);
    const accountDetails = item === null ? null : JSON.parse(item);
    console.log('getAccountFromStorage accountDetails=', accountDetails);

    if (accountDetails === null) {
        console.log('getAccountFromStorage return null');
        return null;
    }

    if (process.env.USE_MOCK && process.env.BRANCH !== 'production') {
        let user = queryString.parse(
            location.search || /* istanbul ignore next */ location.hash.substring(location.hash.indexOf('?')),
        ).user;
        user = user || 'vanilla';

        if (!!accountDetails.status && accountDetails.status === 'loggedout' && user === 'public') {
            console.log('no user logged in');
        } else if ((!!accountDetails.account.id && accountDetails.account.id !== user) || !accountDetails.account.id) {
            // allow developer to swap between users in the same tab in mock
            console.log(
                'developer swapping users in localhost (clear session storage)',
                accountDetails?.account?.id,
                ' != ',
                user,
            );
            removeAccountStorage();
            return null;
        }
    }
    return accountDetails;
}

function extendAccountDetails(accountResponse) {
    return {
        ...accountResponse,
        current_classes:
            !!accountResponse.current_classes && accountResponse.current_classes.length > 0
                ? accountResponse.current_classes.map(subject => {
                      subject.classnumber = getClassNumberFromPieces(subject);
                      subject.semester = getSemesterStringByTermNumber(subject.STRM);
                      return subject;
                  })
                : accountResponse.current_classes,
        trainingfilterId: isHospitalUser(accountResponse) ? TRAINING_FILTER_HOSPITAL : TRAINING_FILTER_GENERAL,
    };
}

function extractAccountFromSession(dispatch, storedAccount) {
    dispatch({ type: actions.CURRENT_ACCOUNT_LOADING });
    const accountResponse = extendAccountDetails(storedAccount.account || /* istanbul ignore next */ null);
    dispatch({
        type: actions.CURRENT_ACCOUNT_LOADED,
        payload: accountResponse,
    });

    dispatch({ type: actions.CURRENT_AUTHOR_LOADING });
    /* istanbul ignore else */
    if (storedAccount.currentAuthor) {
        dispatch({
            type: actions.CURRENT_AUTHOR_LOADED,
            payload: storedAccount.currentAuthor,
        });
    } else {
        /* istanbul ignore next */
        dispatch({
            type: actions.CURRENT_AUTHOR_FAILED,
            payload: 'author unexpectedly not available',
        });
    }
    return accountResponse;
}

/**
 * Loads the user's account and author details into the application
 * @returns {function(*)}
 */
export function loadCurrentAccount() {
    console.log('loadCurrentAccount');
    return dispatch => {
        if (navigator.userAgent.match(/Googlebot|facebookexternalhit|bingbot|Slackbot-LinkExpanding|Twitterbot/)) {
            console.log('loadCurrentAccount bot');
            dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
            return Promise.resolve({});
        }

        if (getSessionCookie() === undefined || getLibraryGroupCookie() === undefined) {
            console.log('loadCurrentAccount no cookie');
            // no cookie, don't call account api without a cookie
            // removeAccountStorage();
            dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
            return Promise.resolve({});
        }

        // there can be a mismatch between load time of homepage and load time of reusable
        // wait for the session storage if it isn't there straight away
        const storedAccount = getAccountFromStorage();
        console.log('storedAccount=', storedAccount);
        if (storedAccount?.status === 'loggedin' && !!storedAccount?.account) {
            console.log('loadCurrentAccount reusable says HAS account');
            // account details stored locally with an expiry date
            const account = extractAccountFromSession(dispatch, storedAccount);
            return Promise.resolve(account);
        } else if (storedAccount?.status === 'loggedout') {
            console.log('loadCurrentAccount reusable says loggedout');
            dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
            return Promise.resolve({});
        } else {
            console.log('loadCurrentAccount reusable says no storage (should never happen)');
        }
        console.log('loadCurrentAccount no storage');
        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
        return Promise.resolve(null);
    };
}

/**
 * Loads the spotlight data
 * @returns {function(*)}
 */
export function loadCurrentSpotlights() {
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHTS_HOMEPAGE_LOADING });
        return get(SPOTLIGHTS_API_CURRENT())
            .then(spotlightsResponse => {
                dispatch({
                    type: actions.SPOTLIGHTS_HOMEPAGE_LOADED,
                    payload: spotlightsResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPOTLIGHTS_HOMEPAGE_FAILED,
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
    if (!!getSessionCookie()) {
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
    } else {
        return dispatch => {
            dispatch({
                type: actions.PRINT_BALANCE_FAILED,
                payload: 'not logged in',
            });
        };
    }
}

/**
 * Loads the loans data
 * @returns {function(*)}
 */
export function loadLoans() {
    if (!!getSessionCookie()) {
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
    } else {
        return dispatch => {
            dispatch({
                type: actions.LOANS_FAILED,
                payload: 'not logged in',
            });
        };
    }
}

/**
 * Loads the computer availability data
 * @returns {function(*)}
 */
export function loadCompAvail() {
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
export function loadTrainingEvents(account) {
    const trainingfilterId =
        !!account && !!account.trainingfilterId ? account.trainingfilterId : TRAINING_FILTER_GENERAL;
    return dispatch => {
        dispatch({ type: actions.TRAINING_LOADING });
        return get(TRAINING_API(10, trainingfilterId))
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
    if (!!getSessionCookie()) {
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
    } else {
        return dispatch => {
            dispatch({
                type: actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED,
                payload: 'not logged in',
            });
        };
    }
}

/**
 * Search NTRO publications from eSpace which are incomplete for the current user
 * @param {object} activeFacets - optional list of facets
 * @returns {action}
 */
export function searcheSpaceIncompleteNTROPublications() {
    if (!!getSessionCookie()) {
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
    } else {
        return dispatch => {
            dispatch({
                type: actions.INCOMPLETE_NTRO_PUBLICATIONS_FAILED,
                payload: 'not logged in',
            });
        };
    }
}

export function logout() {
    return dispatch => {
        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
    };
}

export function clearSessionExpiredFlag() {
    return dispatch => {
        dispatch({ type: actions.CLEAR_CURRENT_ACCOUNT_SESSION_FLAG });
    };
}
