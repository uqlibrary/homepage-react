import * as actions from './actionTypes';
import { destroy, get, post, put } from 'repositories/generic';
import {
    DLOR_ALL_API,
    DLOR_ALL_CURRENT_API,
    DLOR_CREATE_API,
    DLOR_REQUEST_API,
    DLOR_DEMOGRAPHICS_SAVE_API,
    DLOR_DESTROY_API,
    DLOR_FILE_TYPE_LIST_API,
    DLOR_GET_BY_ID_API,
    DLOR_AUTHENTICATED_GET_BY_ID_API,
    DLOR_GET_FILTER_LIST,
    DLOR_SUBSCRIPTION_CONFIRMATION_API,
    DLOR_TEAM_CREATE_API,
    DLOR_TEAM_DELETE_API,
    DLOR_TEAM_LIST_API,
    DLOR_TEAM_SINGLE_GET_API,
    DLOR_ADMIN_TEAM_UPDATE_API,
    DLOR_SERIES_CREATE_API,
    DLOR_SERIES_DELETE_API,
    DLOR_SERIES_LIST_API,
    DLOR_SERIES_UPDATE_API,
    DLOR_UPDATE_API,
    DLOR_UNSUBSCRIBE_API,
    DLOR_UNSUBSCRIBE_FIND_API,
    DLOR_SERIES_LOAD_API,
    DLOR_UPDATE_FACET_API,
    DLOR_DELETE_FACET_API,
    DLOR_CREATE_FACET_API,
    DLOR_OWNED_UPDATE_API,
    DLOR_FAVOURITES_API,
    DLOR_DEMOGRAPHICS_REPORT_API,
    DLOR_ADMIN_NOTES_API,
    DLOR_CREATE_TEAM_ADMIN_API,
    DLOR_EDIT_TEAM_ADMIN_API,
    DLOR_DELETE_TEAM_ADMIN_API,
    DLOR_KEYWORDS_API,
    DLOR_KEYWORDS_UPDATE_API,
    DLOR_KEYWORDS_DESTROY_API,
    DLOR_STATISTICS_API,
    DLOR_SCHEDULE_API,
    DLOR_SCHEDULE_UPDATE_API,
    DLOR_REQUEST_KEYWORD_API,
} from 'repositories/routes';
import { checkExpireSession } from './actionhelpers';

export function loadCurrentDLORs() {
    return dispatch => {
        dispatch({ type: actions.DLOR_LIST_LOADING });
        return get(DLOR_ALL_CURRENT_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_LIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadAllDLORs() {
    return dispatch => {
        dispatch({ type: actions.DLOR_LIST_LOADING });
        return get(DLOR_ALL_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_LIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadADLOR(dlorId, isauthenticated = false) {
    return dispatch => {
        dispatch({ type: actions.DLOR_DETAIL_LOADING });
        return get(
            isauthenticated ? DLOR_AUTHENTICATED_GET_BY_ID_API({ id: dlorId }) : DLOR_GET_BY_ID_API({ id: dlorId }),
        )
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
    return dispatch => {
        dispatch({ type: actions.DLOR_FILTER_LIST_LOADING });
        return get(DLOR_GET_FILTER_LIST())
            .then(response => {
                dispatch({
                    type: actions.DLOR_FILTER_LIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
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

export function createDlor(request, isDlorAdminUser = true) {
    // isDlorAdminUser is overriden to false when creating a request by a non-admin user
    // used to determine the API endpoint to use. Default is true.
    return async dispatch => {
        dispatch({ type: actions.DLOR_CREATING });
        console.log('POINT CHECK');
        return post(isDlorAdminUser ? DLOR_CREATE_API() : DLOR_REQUEST_API(), request)
            .then(data => {
                dispatch({
                    type: actions.DLOR_CREATED,
                    payload: data,
                });
                // refresh the list after change, only if the user is an admin
                !!isDlorAdminUser && dispatch(loadAllDLORs());
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_CREATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function updateDlor(dlorId, request, isDlorAdminUser = true) {
    return dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return put(isDlorAdminUser ? DLOR_UPDATE_API(dlorId) : DLOR_OWNED_UPDATE_API(dlorId), request)
            .then(response => {
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: response,
                });
                // refresh the list after change
                !!isDlorAdminUser && dispatch(loadAllDLORs());
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
            const response = await destroy(DLOR_TEAM_DELETE_API(teamId));
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
    return dispatch => {
        dispatch({ type: actions.DLOR_TEAM_LOADING });
        return get(DLOR_TEAM_SINGLE_GET_API({ id: dlorId }))
            .then(response => {
                dispatch({
                    type: actions.DLOR_TEAM_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
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
        return put(DLOR_ADMIN_TEAM_UPDATE_API(teamId), request)
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

export function createDlorTeam(request) {
    return async dispatch => {
        dispatch({ type: actions.DLOR_CREATING });
        return post(DLOR_TEAM_CREATE_API(), request)
            .then(data => {
                dispatch({
                    type: actions.DLOR_CREATED,
                    payload: data,
                });
                // refresh the list after change
                dispatch(loadOwningTeams());
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_CREATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export const deleteDlorSeries = seriesId => {
    return async dispatch => {
        dispatch({ type: actions.DLOR_SERIES_DELETING });
        return destroy(DLOR_SERIES_DELETE_API(seriesId))
            .then(response => {
                if (response?.status?.toLowerCase() === 'ok') {
                    dispatch({
                        type: actions.DLOR_SERIES_DELETED,
                        payload: response,
                    });
                } else {
                    dispatch({
                        type: actions.DLOR_SERIES_DELETE_FAILED,
                        payload: response.message,
                    });
                }
                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_SERIES_DELETE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                return Promise.reject(error);
            });
    };
};

export function loadDlorSeriesList() {
    return dispatch => {
        dispatch({ type: actions.DLOR_SERIESLIST_LOADING });
        return get(DLOR_SERIES_LIST_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_SERIESLIST_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_SERIESLIST_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadDlorSeries(seriesId) {
    return dispatch => {
        dispatch({ type: actions.DLOR_SERIES_LOADING });
        return get(DLOR_SERIES_LOAD_API(seriesId))
            .then(response => {
                dispatch({
                    type: actions.DLOR_SERIES_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_SERIES_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function updateDlorSeries(seriesId, request) {
    return dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return put(DLOR_SERIES_UPDATE_API(seriesId), request)
            .then(response => {
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: response,
                });
                // refresh the list after change
                dispatch(loadDlorSeriesList());
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

export function createDlorSeries(request) {
    return async dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return post(DLOR_SERIES_CREATE_API(), request)
            .then(data => {
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: data,
                });
                // refresh the list after change
                dispatch(loadDlorSeriesList());
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

export function saveDlorDemographics(request) {
    return async dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return post(DLOR_DEMOGRAPHICS_SAVE_API(), request)
            .then(data => {
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: data,
                });
                // refresh the list after change
                dispatch(loadDlorSeriesList());
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_UPDATE_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadDlorSubscriptionConfirmation(confirmationId) {
    return dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return get(DLOR_SUBSCRIPTION_CONFIRMATION_API({ id: confirmationId }))
            .then(response => {
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: response.data,
                });
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

export function loadDlorUnsubscribe(confirmationId) {
    return dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return get(DLOR_UNSUBSCRIBE_API({ id: confirmationId }))
            .then(response => {
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: response.data,
                });
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

export function loadDlorFindObjectDetailsByUnsubscribeId(confirmationId) {
    return dispatch => {
        dispatch({ type: actions.DLOR_UPDATING });
        return get(DLOR_UNSUBSCRIBE_FIND_API({ id: confirmationId }))
            .then(response => {
                dispatch({
                    type: actions.DLOR_UPDATED,
                    payload: response.data,
                });
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

export function updateFacet(filterId, payload) {
    return dispatch => {
        dispatch({ type: actions.DLOR_FILTER_UPDATING });
        return put(DLOR_UPDATE_FACET_API(filterId), payload)
            .then(response => {
                dispatch({
                    type: actions.DLOR_FILTER_UPDATED,
                    payload: response,
                });
                dispatch(loadAllFilters());
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_FILTER_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function createFacet(payload) {
    return dispatch => {
        dispatch({ type: actions.DLOR_FILTER_UPDATING });
        return post(DLOR_CREATE_FACET_API(), payload)
            .then(response => {
                dispatch({
                    type: actions.DLOR_FILTER_UPDATED,
                    payload: response,
                });
                dispatch(loadAllFilters());
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_FILTER_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function deleteFacet(filterId) {
    return dispatch => {
        dispatch({ type: actions.DLOR_FILTER_UPDATING });
        return destroy(DLOR_DELETE_FACET_API(filterId))
            .then(response => {
                dispatch({
                    type: actions.DLOR_FILTER_UPDATED,
                    payload: response,
                });
                dispatch(loadAllFilters());
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_FILTER_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadDlorFavourites() {
    return dispatch => {
        dispatch({ type: actions.DLOR_FAVOURITES_LOADING });
        return get(DLOR_FAVOURITES_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_FAVOURITES_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_FAVOURITES_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function addFavourite(uuid) {
    return dispatch => {
        dispatch({ type: actions.DLOR_FAVOURITES_LOADING });
        return post(DLOR_FAVOURITES_API(), {
            object_public_uuid: uuid,
        })
            .then(response => {
                const payload = Array.isArray(response.data) ? response.data : [response.data];
                dispatch({
                    type: actions.DLOR_FAVOURITES_LOADED,
                    payload,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_FAVOURITES_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function removeFavourite(uuid) {
    return dispatch => {
        dispatch({ type: actions.DLOR_FAVOURITES_LOADING });
        return destroy(DLOR_FAVOURITES_API(), {
            object_public_uuid: uuid,
        })
            .then(response => {
                dispatch({
                    type: actions.DLOR_FAVOURITES_LOADED,
                    payload: response.data || [],
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_FAVOURITES_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadDlorDemographics() {
    return dispatch => {
        dispatch({ type: actions.DLOR_DEMOGRAPHICS_LOADING });
        return get(DLOR_DEMOGRAPHICS_REPORT_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_DEMOGRAPHICS_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_DEMOGRAPHICS_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function loadDlorAdminNotes(uuid) {
    return dispatch => {
        dispatch({ type: actions.DLOR_ADMIN_NOTES_LOADING });
        return get(DLOR_ADMIN_NOTES_API(uuid))
            .then(response => {
                dispatch({
                    type: actions.DLOR_ADMIN_NOTES_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_ADMIN_NOTES_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

// eslint-disable-next-line camelcase
export function saveDlorAdminNote(uuid, object_admin_note_content) {
    return dispatch => {
        dispatch({ type: actions.DLOR_ADMIN_NOTES_LOADING });
        return post(DLOR_ADMIN_NOTES_API(uuid), {
            // eslint-disable-next-line camelcase
            object_admin_note_content,
        })
            .then(response => {
                console.log('DLOR Admin Notes Response', response);
                dispatch({
                    type: actions.DLOR_ADMIN_NOTES_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_ADMIN_NOTES_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function addDlorTeamMember(request) {
    return dispatch => {
        dispatch({ type: actions.DLOR_TEAM_LOADING });
        return post(DLOR_CREATE_TEAM_ADMIN_API(), request)
            .then(response => {
                dispatch({
                    type: actions.DLOR_TEAM_LOADED,
                    payload: response.data,
                });
                // refresh the team after change
                dispatch(loadADLORTeam(request.team_id));
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_TEAM_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function editDlorTeamMember(id, request) {
    return dispatch => {
        dispatch({ type: actions.DLOR_TEAM_LOADING });
        return put(DLOR_EDIT_TEAM_ADMIN_API(id), request)
            .then(response => {
                dispatch({
                    type: actions.DLOR_TEAM_LOADED,
                    payload: response.data,
                });
                // refresh the team after change
                dispatch(loadADLORTeam(request.team_id));
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_TEAM_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function deleteDlorTeamMember(id, teamId) {
    return dispatch => {
        dispatch({ type: actions.DLOR_TEAM_LOADING });
        return destroy(DLOR_DELETE_TEAM_ADMIN_API(id))
            .then(response => {
                dispatch({
                    type: actions.DLOR_TEAM_LOADED,
                    payload: response.data,
                });
                // refresh the team after change
                dispatch(loadADLORTeam(teamId));
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_TEAM_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadDlorKeywords() {
    console.log('loadDlorKeywords called');
    return dispatch => {
        dispatch({ type: actions.DLOR_KEYWORDS_LOADING });
        return get(DLOR_KEYWORDS_API())
            .then(response => {
                console.log('DLOR Keywords Response', response);
                dispatch({
                    type: actions.DLOR_KEYWORDS_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_KEYWORDS_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}
export function updateDlorKeywords(request) {
    console.log('UpdateDlor called', request);
    return dispatch => {
        dispatch({ type: actions.DLOR_KEYWORDS_UPDATING });
        return post(DLOR_KEYWORDS_UPDATE_API(), request)
            .then(response => {
                console.log('UPDATE RESPONSE', response);
                dispatch({
                    type: actions.DLOR_KEYWORDS_UPDATED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_KEYWORDS_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function deleteDlorSynonym(request) {
    return dispatch => {
        dispatch({ type: actions.DLOR_KEYWORDS_UPDATING });
        return destroy(DLOR_KEYWORDS_DESTROY_API(), request)
            .then(response => {
                dispatch({
                    type: actions.DLOR_KEYWORDS_UPDATED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_KEYWORDS_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadDlorStatistics() {
    console.log('loadDlorStatistics action creator called');
    return dispatch => {
        dispatch({ type: actions.DLOR_STATISTICS_LOADING });
        return get(DLOR_STATISTICS_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_STATISTICS_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_STATISTICS_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function loadDLORSchedules() {
    console.log('loadDLORSchedules action creator called');
    return dispatch => {
        dispatch({ type: actions.DLOR_SCHEDULE_LOADING });
        return get(DLOR_SCHEDULE_API())
            .then(response => {
                dispatch({
                    type: actions.DLOR_SCHEDULE_LOADED,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_SCHEDULE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}
export function addDLORSchedule(request) {
    console.log('addDLORSchedule action creator called', request);
    return dispatch => {
        dispatch({ type: actions.DLOR_SCHEDULE_LOADING });
        return post(DLOR_SCHEDULE_API(), request)
            .then(response => {
                console.log('addDLORSchedule response', response);
                dispatch({
                    type: actions.DLOR_SCHEDULE_LOADED,
                    payload: response.data,
                });
                // dispatch(loadDLORSchedules());
            })
            .catch(error => {
                dispatch({
                    type: actions.DLOR_SCHEDULE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
            });
    };
}

export function editDLORSchedule(id, request) {
    console.log('editDLORSchedule action creator called', request);
    return dispatch => {
        dispatch({ type: actions.DLOR_SCHEDULE_LOADING });
        return put(DLOR_SCHEDULE_UPDATE_API(id), request)
            .then(response => {
                console.log('editDLORSchedule response', response);
                dispatch({
                    type: actions.DLOR_SCHEDULE_LOADED,
                    payload: response.data,
                });
                // dispatch(loadDLORSchedules());
            })
            .catch(error => {
                console.log('editDLORSchedule error', error);
                dispatch({
                    type: actions.DLOR_SCHEDULE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                throw error;
            });
    };
}

export function deleteDlorSchedule(id) {
    return dispatch => {
        dispatch({ type: actions.DLOR_SCHEDULE_LOADING });
        return destroy(DLOR_SCHEDULE_UPDATE_API(id))
            .then(response => {
                console.log('deleteDLORSchedule response', response);
                dispatch({
                    type: actions.DLOR_SCHEDULE_LOADED,
                    payload: response.data,
                });
                // dispatch(loadDLORSchedules());
            })
            .catch(error => {
                console.log('editDLORSchedule error', error);
                dispatch({
                    type: actions.DLOR_SCHEDULE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                throw error;
            });
    };
}
// request for new keyword email action
export function requestNewKeyword(request) {
    console.log('request new keyword called', request);
    return dispatch => {
        dispatch({ type: actions.DLOR_KEYWORDS_UPDATING });
        return post(DLOR_REQUEST_KEYWORD_API(), request)
            .then(response => {
                console.log('KEYWORD RESPONSE', response);
                dispatch({
                    type: actions.DLOR_KEYWORDS_UPDATED,
                    payload: response.data,
                });
            })
            .catch(error => {
                console.log('TESTING');
                dispatch({
                    type: actions.DLOR_KEYWORDS_UPDATE_FAILED,
                    payload: error.message,
                });
                checkExpireSession(dispatch, error);
                throw error;
            });
    };
}
