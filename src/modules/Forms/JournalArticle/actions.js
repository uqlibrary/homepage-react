// Repositories
import {getPublicationSubTypes} from '../../../repositories/publicationSubTypes';
import {getListOfAuthors} from '../../../repositories/authors';

// Types
export const PUBLICATION_SUB_TYPES_LOADING = 'PUBLICATION_SUB_TYPES_LOADING';
export const PUBLICATION_SUB_TYPES_LOADED = 'PUBLICATION_SUB_TYPES_LOADED';
export const AUTHORS_LOADING = 'AUTHORS_LOADING';
export const AUTHORS_LOADED = 'AUTHORS_LOADED';

/**
 * Loads the user's account into the application
 * @returns {function(*)}
 */
export function loadPublicationSubTypes() {
    return dispatch => {
        dispatch({type: PUBLICATION_SUB_TYPES_LOADING});
        getPublicationSubTypes().then(publicationTypes => {
            dispatch({
                type: PUBLICATION_SUB_TYPES_LOADED,
                payload: publicationTypes
            });
        }).catch((error) => {
            throw(error);
        });
    };
}

/**
 * Loads a list of authors
 * @returns {function(*)}
 */
export function loadAuthorData() {
    return dispatch => {
        dispatch({type: AUTHORS_LOADING});
        getListOfAuthors().then(authorList => {
            dispatch({
                type: AUTHORS_LOADED,
                payload: authorList
            });
        }).catch((error) => {
            throw(error);
        });
    };
}
