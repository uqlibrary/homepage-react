import * as actions from './actionTypes';
import { get, post, destroy } from 'repositories/generic';
import {
    SPOTLIGHT_SAVE_API,
    SPOTLIGHT_CREATE_API,
    SPOTLIGHTS_ALL_API,
    SPOTLIGHT_GET_BY_ID_API,
    SPOTLIGHT_DELETE_API,
} from 'repositories/routes';

export function loadAllSpotlights() {
    console.log('action loadAllSpotlights: Loading Spotlights');
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHTS_CLEAR });
        dispatch({ type: actions.SPOTLIGHTS_LOADING });
        return get(SPOTLIGHTS_ALL_API())
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

export const createSpotlight = request => {
    console.log('action createSpotlight, request to save: ', request);

    return async dispatch => {
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        console.log('createSpotlight action, SPOTLIGHT_CREATE_API() = ', SPOTLIGHT_CREATE_API());
        return post(SPOTLIGHT_CREATE_API(), request)
            .then(data => {
                console.log('createSpotlight action, returned data = ', data);
                dispatch({
                    type: actions.SPOTLIGHT_SAVED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('createSpotlight action error = ', error);
                dispatch({
                    type: actions.SPOTLIGHT_FAILED,
                    payload: error.message,
                });
            });
    };
};

export const saveSpotlightChange = request => {
    return async dispatch => {
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        console.log(
            'action saveSpotlightChange action, SPOTLIGHT_SAVE_API() = ',
            SPOTLIGHT_SAVE_API({ id: request.id }),
        );
        return post(SPOTLIGHT_SAVE_API({ id: request.id }), request)
            .then(data => {
                console.log('saveSpotlightChange action, returned data = ', data);
                dispatch({
                    type: actions.SPOTLIGHT_SAVED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('saveSpotlightChange action error = ', error);
                dispatch({
                    type: actions.SPOTLIGHT_FAILED,
                    payload: error.message,
                });
            });
    };
};

export const deleteSpotlight = spotlightID => {
    console.log('SPOTLIGHT_DELETE_API({ id: spotlightID }) = ', SPOTLIGHT_DELETE_API({ id: spotlightID }));
    return async dispatch => {
        dispatch({ type: actions.SPOTLIGHT_LOADING });

        try {
            const response = await destroy(SPOTLIGHT_DELETE_API({ id: spotlightID }));
            console.log('deleteSpotlight action, returned response = ', response);
            dispatch({
                type: actions.SPOTLIGHT_DELETED,
                payload: [],
            });

            return Promise.resolve(response.data);
        } catch (e) {
            console.log('deleteSpotlight action error = ', e);
            dispatch({
                type: actions.SPOTLIGHT_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
};

export function clearSpotlights() {
    console.log('action clearSpotlights - refreshing Spotlights');
    return dispatch => {
        dispatch({
            type: actions.SPOTLIGHTS_CLEAR,
        });
    };
}

export function loadASpotlight(spotlightId) {
    console.log('action load an Spotlight for ', spotlightId);
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        console.log('getting ', SPOTLIGHT_GET_BY_ID_API({ id: spotlightId }));
        return get(SPOTLIGHT_GET_BY_ID_API({ id: spotlightId }))
            .then(data => {
                console.log('got ', data);
                dispatch({
                    type: actions.SPOTLIGHT_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('loadAnSpotlight error = ', error);
                dispatch({
                    type: actions.SPOTLIGHT_FAILED,
                    payload: error.message,
                });
            });
    };
}

export function clearASpotlight() {
    return dispatch => {
        dispatch({ type: actions.SPOTLIGHT_CLEAR });
    };
}
