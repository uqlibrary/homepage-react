import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { DRUPAL_ARTICLE_API } from 'repositories/routes';

export function loadDrupalArticles() {
    return dispatch => {
        dispatch({ type: actions.DRUPAL_ARTICLES_LOADING });
        // console.log('THE API LOCATION: ', DRUPAL_ARTICLE_API());
        return get(DRUPAL_ARTICLE_API())
            .then(articleResponse => {
                console.log('ARTICLE RESPONSE:', articleResponse);
                dispatch({
                    type: actions.DRUPAL_ARTICLES_LOADED,
                    payload: articleResponse,
                });
            })
            .catch(error => {
                console.log('ARTICLE RESPONSE:', error.message, DRUPAL_ARTICLE_API());
                dispatch({
                    type: actions.DRUPAL_ARTICLES_FAILED,
                    payload: error.message,
                });
            });
    };
}
