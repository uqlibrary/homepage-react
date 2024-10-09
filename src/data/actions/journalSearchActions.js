import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { JOURNAL_SEARCH_API } from 'repositories/routes';

export function loadJournalSearchFavourites() {
    return dispatch => {
        console.log('LOADING JOURNAL SEARCH FAVS');
        dispatch({ type: actions.JOURNAL_SEARCH_LOADING });
        // console.log('THE API LOCATION: ', DRUPAL_ARTICLE_API());
        return get(JOURNAL_SEARCH_API(), {
            headers: {},
        })
            .then(articleResponse => {
                // console.log('Journal search response:', articleResponse);
                dispatch({
                    type: actions.JOURNAL_SEARCH_LOADED,
                    payload: articleResponse,
                });
            })
            .catch(error => {
                // console.log('Journal search response::', error.message, JOURNAL_SEARCH_API());
                dispatch({
                    type: actions.JOURNAL_SEARCH_FAILED,
                    payload: error.message,
                });
            });
    };
}
