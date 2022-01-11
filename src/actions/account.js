import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import {
    AUTHOR_DETAILS_API,
    COMP_AVAIL_API,
    CURRENT_ACCOUNT_API,
    CURRENT_AUTHOR_API,
    INCOMPLETE_NTRO_RECORDS_API,
    LIB_HOURS_API,
    LOANS_API,
    POSSIBLE_RECORDS_API,
    PRINTING_API,
    SPOTLIGHTS_API_CURRENT,
    TRAINING_API,
} from 'repositories/routes';
import Raven from 'raven-js';
import { sessionApi } from 'config';
import { isHospitalUser, TRAINING_FILTER_GENERAL, TRAINING_FILTER_HOSPITAL } from 'helpers/access';
import { getCookieValue } from 'helpers/general';
import { SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME, STORAGE_ACCOUNT_KEYNAME } from 'config/general';
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
    return getCookieValue(SESSION_COOKIE_NAME);
}
function getLibraryGroupCookie() {
    // I am guessing this field is used as a proxy for 'has a Library account, not just a general UQ login'
    return getCookieValue(SESSION_USER_GROUP_COOKIE_NAME);
}

function storeAccount(account, numberOfHoursUntilExpiry = 8) {
    // for improved UX, expire the session storage when the token must surely be expired, for those rare long sessions
    // session lasts 8 hours, per https://auth.uq.edu.au/about/

    const millisecondsUntilExpiry = numberOfHoursUntilExpiry * 60 /* min*/ * 60 /* sec*/ * 1000; /* milliseconds */
    const storageExpiryDate = {
        storageExpiryDate: new Date().setTime(new Date().getTime() + millisecondsUntilExpiry),
    };
    let storeableAccount = {
        account: {
            ...account,
        },
        ...storageExpiryDate,
    };
    storeableAccount = JSON.stringify(storeableAccount);
    sessionStorage.setItem(STORAGE_ACCOUNT_KEYNAME, storeableAccount);
}

function removeAccountStorage() {
    sessionStorage.removeItem(STORAGE_ACCOUNT_KEYNAME);
}

function getAccountFromStorage() {
    const accountDetails = JSON.parse(sessionStorage.getItem(STORAGE_ACCOUNT_KEYNAME));
    console.log('getAccountFromStorage accountDetails = ', accountDetails);

    if (!!accountDetails && process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
        const user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;
        console.log(
            'getAccountFromStorage user = url:',
            user,
            '; session: ',
            !!accountDetails.account.id && accountDetails.account.id,
        );

        if ((!!accountDetails.account.id && accountDetails.account.id !== user) || !accountDetails.account.id) {
            // allow developer to swap between users in the same tab
            removeAccountStorage();
            return null;
        }
    }

    if (accountDetails === null) {
        return null;
    }

    const now = new Date().getTime();
    if (!accountDetails.storageExpiryDate || accountDetails.storageExpiryDate < now) {
        removeAccountStorage();
        return null;
    }

    return accountDetails;
}

function addCurrentAuthorToAccount(currentAuthor) {
    const storedAccount = getAccountFromStorage();
    if (storedAccount === null) {
        return;
    }
    let storeableAccount = {
        ...storedAccount,
        // 'currentAuthor' name must match reusable ApiAccess.js
        currentAuthor: {
            ...currentAuthor,
        },
    };
    storeableAccount = JSON.stringify(storeableAccount);
    sessionStorage.setItem(STORAGE_ACCOUNT_KEYNAME, storeableAccount);
}

function addCurrentAuthorDetailsToAccount(authorDetails) {
    const storedAccount = getAccountFromStorage();
    if (storedAccount === null) {
        return;
    }
    let storeableAccount = {
        ...storedAccount,
        authorDetails: {
            ...authorDetails,
        },
    };
    storeableAccount = JSON.stringify(storeableAccount);
    sessionStorage.setItem(STORAGE_ACCOUNT_KEYNAME, storeableAccount);
}

function calculateAccountDetails(accountResponse) {
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
            // store the account details locally with an expiry date
            // use in preference to yet another call on the api!
            if (getSessionCookie() === undefined || getLibraryGroupCookie() === undefined) {
                // no cookie, force them to log in again
                removeAccountStorage();
            }

            const storedAccount = getAccountFromStorage();
            console.log('retreived storedAccount = ', storedAccount);
            if (storedAccount !== null && !!storedAccount.account) {
                const accountResponse = calculateAccountDetails(storedAccount.account || null);
                dispatch({
                    type: actions.CURRENT_ACCOUNT_LOADED,
                    payload: accountResponse,
                });

                const currentAuthorRetrieved = storedAccount.currentAuthor || null;
                dispatch({
                    type: actions.CURRENT_AUTHOR_LOADED,
                    payload: currentAuthorRetrieved,
                });

                console.log('currentAuthorRetrieved = ', currentAuthorRetrieved);
                if (
                    !!currentAuthorRetrieved &&
                    (!!currentAuthorRetrieved.aut_org_username || !!currentAuthorRetrieved.aut_student_username)
                ) {
                    const authorDetailsResponse = storedAccount.authorDetails || null;
                    dispatch({
                        type: actions.CURRENT_AUTHOR_DETAILS_LOADED,
                        payload: authorDetailsResponse,
                    });
                }

                return true;
            }

            dispatch({ type: actions.CURRENT_ACCOUNT_LOADING });

            let currentAuthor = null;

            // load UQL account (based on token)
            return get(CURRENT_ACCOUNT_API())
                .then(account => {
                    console.log('flow: getting account', account);
                    if (account.hasOwnProperty('hasSession') && account.hasSession === true) {
                        if (process.env.ENABLE_LOG) Raven.setUserContext({ id: account.id });

                        storeAccount(account);

                        return Promise.resolve(account);
                    } else {
                        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
                        return Promise.reject(new Error('Session expired. User is unauthorized.'));
                    }
                })
                .then(accountResponse => {
                    console.log('flow: 2', accountResponse);
                    const accountResponse2 = calculateAccountDetails(accountResponse);
                    dispatch({
                        type: actions.CURRENT_ACCOUNT_LOADED,
                        payload: accountResponse2,
                    });

                    // load current author details (based on token)
                    dispatch({ type: actions.CURRENT_AUTHOR_LOADING });
                    return get(CURRENT_AUTHOR_API());
                })
                .then(currentAuthorResponse => {
                    console.log('flow: getting currentAuthor', currentAuthorResponse);
                    currentAuthor = currentAuthorResponse.data;
                    addCurrentAuthorToAccount(currentAuthor);
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
                    console.log('flow: getting authorDetailsResponse', authorDetailsResponse);
                    addCurrentAuthorDetailsToAccount(authorDetailsResponse);
                    dispatch({
                        type: actions.CURRENT_AUTHOR_DETAILS_LOADED,
                        payload: authorDetailsResponse,
                    });
                })
                .catch(error => {
                    console.log('flow: error');
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
