import * as actions from './actionTypes';
import { destroy, get, post, put } from 'repositories/generic';
import {
    DLOR_ALL_API,
    DLOR_ALL_CURRENT_API,
    DLOR_CREATE_API,
    DLOR_DESTROY_API,
    DLOR_FILE_TYPE_LIST_API,
    DLOR_GET_BY_ID_API,
    DLOR_GET_FILTER_LIST,
    DLOR_TEAM_DELETE_API,
    DLOR_TEAM_LIST_API,
    DLOR_TEAM_SINGLE_GET_API,
    DLOR_TEAM_UPDATE_API,
    DLOR_UPDATE_API,
} from 'repositories/routes';

const checkExpireSession = (dispatch, error) => {
    const triggerLogoutStatus = [401];
    if (!!error?.status && triggerLogoutStatus.includes(error.status)) {
        // They are no longer allowed. Log them out
        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
    }
};

export function loadCurrentDLORs() {
    console.log('loadCurrentDLORs start');
    return dispatch => {
        dispatch({ type: actions.DLOR_LIST_LOADING });
        return get(DLOR_ALL_CURRENT_API())
            .then(response => {
                console.log('loadCurrentDLORs response=', response);
                dispatch({
                    type: actions.DLOR_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                console.log('loadCurrentDLORs response=', error);
                dispatch({
                    type: actions.DLOR_LIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadAllDLORs() {
    console.log('loadAllDLORs start');
    return dispatch => {
        dispatch({ type: actions.DLOR_LIST_LOADING });
        return get(DLOR_ALL_API())
            .then(response => {
                console.log('loadAllDLORs response=', response);
                dispatch({
                    type: actions.DLOR_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                console.log('loadAllDLORs error=', error);
                dispatch({
                    type: actions.DLOR_LIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadADLOR(dlorId) {
    return dispatch => {
        dispatch({ type: actions.DLOR_DETAIL_LOADING });
        return get(DLOR_GET_BY_ID_API({ id: dlorId }))
            .then(response => {
                dispatch({
                    type: actions.DLOR_DETAIL_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_DETAIL_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadAllFilters() {
    console.log('loadAllFilters');
    return dispatch => {
        dispatch({ type: actions.DLOR_FILTER_LIST_LOADING });
        return get(DLOR_GET_FILTER_LIST())
            .then(response => {
                console.log('loadAllFilters got it', response);
                dispatch({
                    type: actions.DLOR_FILTER_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                console.log('loadAllFilters error', error);
                dispatch({
                    type: actions.DLOR_FILTER_LIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function clearADlor() {
    return dispatch => {
        dispatch({ type: actions.DLOR_DETAIL_CLEAR });
    };
}

export function createDlor(request) {
    console.log('createDlor request=', request);
    return async dispatch => {
        dispatch({ type: actions.DLOR_CREATING });
        return post(DLOR_CREATE_API(), request)
            .then(data => {
                console.log('createDlor response=', data);
                dispatch({
                    type: actions.DLOR_CREATED,
                    payload: data,
                });
                // refresh the list after change
                dispatch(loadAllDLORs());
            })
            .catch(error => {
                console.log('createDlor error=', error);
                dispatch({
                    type: actions.DLOR_CREATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function updateDlor(dlorId, request) {
    return dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return put(DLOR_UPDATE_API(dlorId), request)
            .then(response => {
                // console.log('updateDlor response=', response);
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: response,
                });
                // refresh the list after change
                dispatch(loadAllDLORs());
            })
            .catch(error => {
                // console.log('updateDlor error=', error);
                dispatch({
                    type: actions.DLOR_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export const deleteDlor = dlorId => {
    return async dispatch => {
        dispatch({ type: actions.DLOR_DELETING });

        try {
            const response = await destroy(DLOR_DESTROY_API({ id: dlorId }));
            dispatch({
                type: actions.DLOR_DELETED,
                payload: [],
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: actions.DLOR_DELETE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

export function loadOwningTeams() {
    return dispatch => {
        dispatch({ type: actions.DLOR_TEAMLIST_LOADING });
        return get(DLOR_TEAM_LIST_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_TEAMLIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_TEAMLIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadFileTypeList() {
    return dispatch => {
        dispatch({ type: actions.DLOR_FILETYPE_LOADING });
        return get(DLOR_FILE_TYPE_LIST_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_FILETYPE_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_FILETYPE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export const deleteDlorTeam = teamId => {
    return async dispatch => {
        dispatch({ type: actions.DLOR_TEAM_DELETING });

        try {
            console.log('#### start dlor team deletion');
            const response = await destroy(DLOR_TEAM_DELETE_API({ id: teamId }));
            dispatch({
                type: actions.DLOR_TEAM_DELETED,
                payload: [],
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: actions.DLOR_TEAM_DELETE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

export function loadADLORTeam(dlorId) {
    console.log('loadADLOR', dlorId);
    return dispatch => {
        dispatch({ type: actions.DLOR_TEAM_LOADING });
        return get(DLOR_TEAM_SINGLE_GET_API({ id: dlorId }))
            .then(response => {
                console.log('loadADLORTeam response=', response);
                dispatch({
                    type: actions.DLOR_TEAM_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                console.log('loadADLORTeam error=', error);
                dispatch({
                    type: actions.DLOR_TEAM_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function updateDlorTeam(teamId, request) {
    return dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return put(DLOR_TEAM_UPDATE_API(teamId), request)
            .then(response => {
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: response,
                });
                // refresh the list after change
                dispatch(loadOwningTeams());
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}
