import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import {
    CURRENT_ACCOUNT_API,
    CURRENT_AUTHOR_API,
    AUTHOR_DETAILS_API,
    SPOTLIGHTS_API,
    CHAT_API,
} from 'repositories/routes';
import Raven from 'raven-js';
import { sessionApi } from 'config';

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
                    dispatch({
                        type: actions.CURRENT_ACCOUNT_LOADED,
                        payload: accountResponse,
                    });

                    // load current author details (based on token)
                    dispatch({ type: actions.CURRENT_AUTHOR_LOADING });
                    return get(CURRENT_AUTHOR_API());
                })
                .then(currentAuthorResponse => {
                    // TODO: to be decommissioned when author/details will become a part of author api
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
 * Loads the primo search suggestions
 * @returns {function(*)}
 */
export function loadPrimoSuggestions(keyword) {
    console.log('loadPrimoSuggestions');
    return dispatch => {
        dispatch({ type: actions.PRIMO_SUGGESTIONS_LOADING });
        const url =
            'https://primo-instant-apac.hosted.exlibrisgroup.com/solr/ac?q=' +
            keyword +
            '&facet=off' +
            '&fq=scope%3A()%2BAND%2Bcontext%3A(B)' +
            '&rows=10' +
            '&wt=json' +
            '&json.wrf=byutv_jsonp_callback_8f5750d771cd445d80a7eb742f519e69&_=5659175a9b0644c2828fe83a9293637b';
        return get(url, {
            withCredentials: false,
        })
            .then(response => {
                console.log('IT WORKED', response, keyword);
                dispatch({
                    type: actions.PRIMO_SUGGESTIONS_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                console.log('IT FAILED', error);
                dispatch({
                    type: actions.PRIMO_SUGGESTIONS_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Loads the chat status data
 * @returns {function(*)}
 */
export function loadChatStatus() {
    return dispatch => {
        dispatch({ type: actions.CHAT_STATUS_LOADING });
        return get(CHAT_API())
            .then(chatResponse => {
                dispatch({
                    type: actions.CHAT_STATUS_LOADED,
                    payload: chatResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.CHAT_STATUS_FAILED,
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
