import * as actions from './actionTypes';
import { get, post, destroy } from 'repositories/generic';
import {
    SPOTLIGHT_SAVE_API,
    SPOTLIGHT_CREATE_API,
    SPOTLIGHTS_ALL_API,
    SPOTLIGHT_GET_BY_ID_API,
    SPOTLIGHT_DELETE_API,
    UPLOAD_PUBLIC_FILES_API,
    SPOTLIGHT_SAVE_BULK_API,
    SPOTLIGHT_DELETE_BULK_API,
} from 'repositories/routes';
import { API_URL } from '../config';
// import {
//     formatDate,
//     isCurrentSpotlight,
//     isPastSpotlight,
//     isScheduledSpotlight,
// } from '../modules/Pages/Admin/Spotlights/spotlighthelpers';

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
                console.log('loadAllSpotlights, error = ', error);
                dispatch({
                    type: actions.SPOTLIGHTS_FAILED,
                    payload: error.message,
                });
            });
    };
}

function createSpotlight(request, dispatch) {
    if ('id' in request) {
        // as we are creating a new spotlight there should not be an id field
        delete request.id;
    }
    console.log('createSpotlight: send request: ', request);
    console.log('createSpotlight action, SPOTLIGHT_CREATE_API() = ', SPOTLIGHT_CREATE_API());
    return post(SPOTLIGHT_CREATE_API(), request)
        .then(data => {
            console.log('createSpotlight action, returned data = ', data);
            dispatch({
                type: actions.SPOTLIGHT_CREATED,
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
}

const saveSpotlightChange = (request, dispatch) => {
    console.log('saveSpotlightChange for request ', request);
    console.log('action saveSpotlightChange action, SPOTLIGHT_SAVE_API() = ', SPOTLIGHT_SAVE_API({ id: request.id }));
    return post(SPOTLIGHT_SAVE_API({ id: request.id }), request)
        .then(data => {
            console.log('saveSpotlightChange action, returned data = ', data);
            dispatch({
                type: actions.SPOTLIGHT_SAVED,
                payload: data,
            });
        })
        .catch(error => {
            console.log('saveSpotlightChange action FAILED, returned: ', error);
            dispatch({
                type: actions.SPOTLIGHT_FAILED,
                payload: error,
            });
            return Promise.reject(error);
        });
};

// this route isnt used to save file changes, just reorder
export const saveSpotlightBatch = request => {
    return async dispatch => {
        dispatch({ type: actions.SPOTLIGHT_SAVING });
        return post(SPOTLIGHT_SAVE_BULK_API(), request)
            .then(data => {
                dispatch({
                    type: actions.SPOTLIGHT_SAVED,
                    payload: data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.SPOTLIGHT_FAILED,
                    payload: error,
                });
            });
    };
};

export const createSpotlightWithExistingImage = request => {
    console.log('action saveSpotlightChangeWithExistingImage, request to save: ', request);
    return dispatch => {
        console.log('actions.SPOTLIGHT_LOADING = ', actions.SPOTLIGHT_LOADING);
        dispatch({ type: actions.SPOTLIGHT_LOADING });
        return createSpotlight(request, dispatch);
    };
};

export const saveSpotlightChangeWithExistingImage = request => {
    console.log('action saveSpotlightChangeWithExistingImage, request to save: ', request);
    return dispatch => {
        console.log('actions.SPOTLIGHT_SAVING = ', actions.SPOTLIGHT_SAVING);
        dispatch({ type: actions.SPOTLIGHT_SAVING });
        return saveSpotlightChange(request, dispatch);
    };
};

export const saveSpotlightWithNewImage = (request, spotlightSaveType = 'update') => {
    console.log('action saveSpotlightWithNewImage, request to save: ', spotlightSaveType, request);

    if (!request.uploadedFile || request.uploadedFile.length === 0) {
        if (spotlightSaveType === 'create') {
            return createSpotlightWithExistingImage(request);
        } else {
            return saveSpotlightChangeWithExistingImage(request);
        }
    }

    return async dispatch => {
        console.log('saveSpotlightWithNewImage: post data: ', request.uploadedFile);

        dispatch({ type: actions.PUBLIC_FILE_UPLOADING });

        const formData = new FormData();
        request.uploadedFile.map((file, index) => {
            formData.append(`file${index}`, file);
        });
        // do not inspect formData with get, eg not: formData.get('spotlightImage')),
        // it causes webpack not to build, with cryptic errors
        return post(UPLOAD_PUBLIC_FILES_API(), formData)
            .then(response => {
                console.log('uploadPublicFile got response ', response);
                dispatch({
                    type: actions.PUBLIC_FILE_UPLOADED,
                    payload: response,
                });

                const firstresponse = !!response && response.length > 0 && response.shift();
                const apiProd = 'https://api.library.uq.edu.au/v1/';
                const domain = API_URL === apiProd ? 'app.library.uq.edu.au' : 'app-testing.library.uq.edu.au';
                request.img_url =
                    !!firstresponse && !!firstresponse.key && `https://${domain}/file/public/${firstresponse.key}`;

                delete request.uploadedFile;
                console.log('action saveSpotlightWithNewImage, request to save: ', request);
                if (spotlightSaveType === 'create') {
                    dispatch({ type: actions.SPOTLIGHT_LOADING });
                    return createSpotlight(request, dispatch);
                } else {
                    dispatch({ type: actions.SPOTLIGHT_SAVING });
                    return saveSpotlightChange(request, dispatch);
                }
            })
            .catch(error => {
                console.log('uploadPublicFile error = ', error);
                dispatch({
                    type: actions.PUBLIC_FILE_UPLOAD_FAILED,
                    payload: error,
                });
            });
    };
};

export const createSpotlightWithNewImage = request => {
    console.log('action createSpotlightWithNewImage, request to save: ', request);
    return saveSpotlightWithNewImage(request, 'create');
};

export const deleteSpotlightBatch = request => {
    console.log('deleteSpotlightBatch', request);
    return async dispatch => {
        dispatch({ type: actions.SPOTLIGHTS_LOADING });
        console.log('calling ', SPOTLIGHT_DELETE_BULK_API(), request);
        return destroy(SPOTLIGHT_DELETE_BULK_API(), request)
            .then(data => {
                console.log('deleteSpotlightBatch success', data);
                dispatch({
                    type: actions.SPOTLIGHTS_DELETION_SUCCESS,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('deleteSpotlightBatch failed', error);
                dispatch({
                    type: actions.SPOTLIGHTS_DELETION_FAILED,
                    payload: error,
                });
            });
    };
};

// not currently used? delete?
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
                console.log('loadASpotlight action, returned data = ', data);
                dispatch({
                    type: actions.SPOTLIGHT_LOADED,
                    payload: data,
                });
            })
            .catch(error => {
                console.log('loadASpotlight action error = ', error);
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

// when a spotlight is added, date changed or deleted, the list must be reordered
// export const reweightSpotlights = saveSpotlightChange => {
//     let failureOccured = false;
//     return dispatch => {
//         console.log('reweightSpotlights getting ', SPOTLIGHTS_ALL_API());
//         dispatch({ type: actions.SPOTLIGHT_REWEIGHTING_UNDERWAY });
//         get(SPOTLIGHTS_ALL_API()).then(list0 => {
//             console.log('reweightSpotlights response = ', list0);
//             // used to get the complete list back when the user clears the filter field
//             const listUnchanged = list0.map(s => s);
//             console.log('reweightSpotlights listUnchanged = ', listUnchanged);
//             const list = list0.map(s => s);
//             // temp for early dev
//             // if (window.location.hostname === 'localhost') {
//             //     list = list0.filter(r => r.id !== '9eab3aa0-82c1-11eb-8896-eb36601837f5');
//             // }
//             list.map(s => {
//                 // sort current then scheduled and then past
//                 if (isPastSpotlight(s)) {
//                     s.spotlightType = 3; // past
//                 } else if (isScheduledSpotlight(s)) {
//                     // console.log('check scheduled', s.id, s.title.substr(0, 20), s.start, s.weight);
//                     s.spotlightType = 2; // scheduled
//                 } else {
//                     // console.log('check current', s.id, s.title.substr(0, 20), s.start, s.weight);
//                     s.spotlightType = 1; // current
//                 }
//                 return s;
//             })
//                 .sort((a, b) => {
//                     // sort by type then start date
//                     // this will make the scheduled spotlights appear as the last spotlight, as they become current
//                     const thisStartDate = formatDate(a.start, 'YYYYMMDDHHmmss');
//                     const prevStartDate = formatDate(b.start, 'YYYYMMDDHHmmss');
//                     const thisEndDate = formatDate(a.end, 'YYYYMMDDHHmmss');
//                     const prevEndDate = formatDate(b.end, 'YYYYMMDDHHmmss');
//                     if (isPastSpotlight(a)) {
//                         return a.spotlightType - b.spotlightType || Number(thisEndDate) - Number(prevEndDate);
//                     } else if (isScheduledSpotlight(a)) {
//                         return a.spotlightType - b.spotlightType || Number(thisStartDate) - Number(prevStartDate);
//                     } else {
//                         return a.spotlightType - b.spotlightType || a.weight - b.weight;
//                     }
//                 })
//                 .map((s, index) => {
//                     return {
//                         ...s,
//                         weight: isPastSpotlight(s) ? 0 : (Number(index) + 1) * 10,
//                     };
//                 })
//                 .forEach(s => {
//                     const currentRow = listUnchanged.map(t => t).find(r => r.id === s.id);
//                     const newValues = {
//                         ...currentRow,
//                         active: !!currentRow.active ? 1 : 0,
//                         weight: s.weight,
//                     };
//
//                     (!isPastSpotlight(s) || s.weight !== currentRow.weight) &&
//                         console.log(
//                             'will',
//                             s.weight === currentRow.weight ? 'NOT' : '',
//                             'save',
//                             newValues.id,
//                             newValues.title.substr(0, 20),
//                             'start: ',
//                             newValues.start,
//                             'weight: ',
//                             newValues.weight,
//                             ' (was ',
//                             currentRow.weight,
//                             ')',
//                             // eslint-disable-next-line no-nested-ternary
//                             isPastSpotlight(s) ? 'past' : isScheduledSpotlight(s) ? 'scheduled' : 'current',
//                         );
//
//                     // save any changes to order
//                     s.weight !== currentRow.weight &&
//                         saveSpotlightChange(newValues)
//                             .then(() => {
//                                 console.log('reWeightSpotlights saved success ', newValues.weight, newValues);
//                                 console.log('look for ', `#spotlight-list-row-${newValues.id} .order`);
//                             })
//                             .catch(bad => {
//                                 console.log('reWeightSpotlights saved failed ', bad, newValues);
//                                 failureOccured = true;
//                             });
//
//                     // update the display of Order
//                     // only current spotlights display the order value
//                     if (!!isCurrentSpotlight(s)) {
//                         const weightCell = document.querySelector(`#spotlight-list-row-${currentRow.id} .order`);
//                         console.log('weightCell = ', weightCell);
//                         !!weightCell && (weightCell.innerHTML = newValues.weight / 10);
//                     }
//                 });
//             console.log('list = ', list);
//         });
//         !!failureOccured
//             ? dispatch({
//                   type: actions.SPOTLIGHTS_REWEIGHTING_FAILED,
//               })
//             : dispatch({
//                   type: actions.SPOTLIGHT_REWEIGHTING_SUCCEEDED,
//               });
//     };
// };

// export function clearSpotlightReweighting() {
//     console.log('action clearSpotlightReweighting');
//     return dispatch => {
//         console.log('action dispatch clearSpotlightReweighting');
//         dispatch({ type: actions.SPOTLIGHTS_REWEIGHTING_CLEAR });
//     };
// }
