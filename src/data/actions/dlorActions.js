import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { DLOR_ALL_API } from 'repositories/routes';

export function loadAllDLORs() {
    console.log('dlorActions.loadAllDLORs');
    return dispatch => {
        // dispatch({ type: actions.DLOR_HOMEPAGE_CLEAR });
        dispatch({ type: actions.DLOR_HOMEPAGE_LOADING });
        return get(DLOR_ALL_API())
            .then(response => {
                console.log('dlorActions.loadAllDLORs response=', response);
                dispatch({
                    type: actions.DLOR_HOMEPAGE_LOADED,
                    payload: response,
                });
            })
            .catch(error => {
                console.log('dlorActions.loadAllDLORs error=', error);
                dispatch({
                    type: actions.DLOR_HOMEPAGE_FAILED,
                    payload: error.message,
                });
            });
    };
}
