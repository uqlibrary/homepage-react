import * as actions from './actionTypes';
import { get, post, put, destroy } from 'repositories/generic';
import {
    PROMOPANEL_CREATE_API,
    PROMOPANEL_UPDATE_API,
    PROMOPANEL_LIST_USERTYPES_API,
    PROMOPANEL_LIST_API,
    PROMOPANEL_GET_BY_ID_API,
    PROMOPANEL_GET_CURRENT_API,
    PROMOPANEL_UPDATE_USERTYPE_DEFAULT,
    PROMOPANEL_UPDATE_USERTYPE,
    PROMOPANEL_DELETE_API,
    PROMOPANEL_ADD_SCHEDULE_API,
    PROMOPANEL_UNSCHEDULE_API,
    PROMOPANEL_UPDATE_SCHEDULE_API,
    PROMOPANEL_LIST_ACTIVE_PANELS_API,
} from 'repositories/routes';

export function clearPromoUpdatedStatus() {
    return dispatch => {
        dispatch({ type: actions.CLEAR_PROMO_UPDATED_STATUS });
    };
}
export function decrementQueueLength() {
    return dispatch => {
        dispatch({ type: actions.PROMOPANEL_DECREMENT_QUEUELENGTH });
    };
}
// Actions for Single Promo Panel Retrieval
export function getAssignedPromoPanel() {
    return dispatch => {
        dispatch({ type: actions.PROMOPANEL_LOADING });
        return get(PROMOPANEL_GET_CURRENT_API())
            .then(response => {
                dispatch({
                    type: actions.PROMOPANEL_LOAD_SUCCESS,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_LOAD_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function getPromoPanelByID(request) {
    return dispatch => {
        dispatch({ type: actions.PROMOPANEL_LOADING });
        return get(PROMOPANEL_GET_BY_ID_API({ id: request.id }))
            .then(response => {
                dispatch({
                    type: actions.PROMOPANEL_LOAD_SUCCESS,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_LOAD_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadPromoPanelList() {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_LIST_LOADING });
        return get(PROMOPANEL_LIST_API())
            .then(response => {
                dispatch({
                    type: actions.PROMOPANEL_LIST_LOAD_SUCCESS,
                    payload: response,
                });
            })
            .catch(error => {
                console.log('Catching error');
                dispatch({
                    type: actions.PROMOPANEL_LIST_LOAD_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadPromoPanelUserList() {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_USERLIST_LOADING });
        return get(PROMOPANEL_LIST_USERTYPES_API())
            .then(response => {
                dispatch({
                    type: actions.PROMOPANEL_USERLIST_LOAD_SUCCESS,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_USERLIST_LOAD_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadActivePanelList() {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_LIST_ACTIVE_LOADING });
        return get(PROMOPANEL_LIST_ACTIVE_PANELS_API())
            .then(response => {
                dispatch({
                    type: actions.PROMOPANEL_LIST_ACTIVE_SUCCESS,
                    payload: response,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_LIST_ACTIVE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export const createPromoPanel = request => {
    if ('panel_id' in request) {
        // as we are creating a new promo panel there should not be an id field
        delete request.panel_id;
    }
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_CREATING });
        return post(PROMOPANEL_CREATE_API(), request)
            .then(data => {
                dispatch({
                    type: actions.PROMOPANEL_CREATE_SUCCESS,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_CREATE_FAILED,
                    payload: error.message,
                });
            });
    };
};

export const savePromoPanel = request => {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_SAVING });
        return post(PROMOPANEL_UPDATE_API({ id: request.panel_id }), request)
            .then(data => {
                dispatch({
                    type: actions.PROMOPANEL_SAVE_SUCCESS,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_SAVE_FAILED,
                    payload: error.message,
                });
            });
    };
};
export const saveUserTypePanel = request => {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_SAVING });
        return post(PROMOPANEL_UPDATE_USERTYPE({ id: request.id, usergroup: request.usergroup }), request)
            .then(data => {
                dispatch({
                    type: actions.PROMOPANEL_SAVE_SUCCESS,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_SAVE_FAILED,
                    payload: error.message,
                });
            });
    };
};
export const saveDefaultUserTypePanel = request => {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_SCHEDULING });
        return put(PROMOPANEL_UPDATE_USERTYPE_DEFAULT({ id: request.id, usergroup: request.usergroup }), request)
            .then(data => {
                dispatch({
                    type: actions.PROMOPANEL_SCHEDULE_SUCCESS,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_SCHEDULE_FAILED,
                    payload: error.message,
                });
            });
    };
};

export const updateScheduleQueuelength = queueLength => {
    return dispatch => {
        dispatch({ type: actions.PROMOPANEL_UPDATE_QUEUELENGTH, payload: queueLength });
    };
};

export const saveUserTypePanelSchedule = request => {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_SCHEDULING });
        return post(PROMOPANEL_ADD_SCHEDULE_API({ id: request.id, usergroup: request.usergroup }), request.payload)
            .then(data => {
                dispatch({
                    type: actions.PROMOPANEL_SCHEDULE_SUCCESS,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_SCHEDULE_FAILED,
                    payload: error.message,
                });
            });
    };
};
export const updateUserTypePanelSchedule = request => {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_SCHEDULING });
        return put(PROMOPANEL_UPDATE_SCHEDULE_API({ id: request.id, usergroup: request.usergroup }), request.payload)
            .then(data => {
                dispatch({
                    type: actions.PROMOPANEL_SCHEDULE_SUCCESS,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.PROMOPANEL_SCHEDULE_FAILED,
                    payload: error.message,
                });
            });
    };
};

export const deletePanel = panelID => {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_DELETING });

        try {
            const response = await destroy(PROMOPANEL_DELETE_API({ id: panelID }));
            dispatch({
                type: actions.PROMOPANEL_DELETE_SUCCESS,
                payload: [],
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: actions.PROMOPANEL_DELETE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

export const unschedulePanel = scheduleID => {
    return async dispatch => {
        dispatch({ type: actions.PROMOPANEL_SCHEDULING });

        try {
            const response = await destroy(PROMOPANEL_UNSCHEDULE_API({ id: scheduleID }));
            dispatch({
                type: actions.PROMOPANEL_SCHEDULE_SUCCESS,
                payload: [],
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: actions.PROMOPANEL_SCHEDULE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};
export function clearCurrentPanel() {
    return dispatch => {
        dispatch({ type: actions.PROMOPANEL_CLEAR_CURRENT });
    };
}
