import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { DRUPAL_ARTICLE_API } from 'repositories/routes';

export function loadDrupalArticles() {
    return dispatch => {
        dispatch({ type: actions.DRUPAL_ARTICLES_LOADING });
        return get(DRUPAL_ARTICLE_API(), {
            headers: {},
        })
            .then(articleResponse => {
                dispatch({
                    type: actions.DRUPAL_ARTICLES_LOADED,
                    payload: articleResponse,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.DRUPAL_ARTICLES_FAILED,
                    payload: error.message,
                });
            });
    };
}
