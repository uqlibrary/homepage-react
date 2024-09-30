import * as actions from 'data/actions/actionTypes';

export const initialState = {
    drupalArticleList: [],
    drupalArticlesLoading: false,
    drupalArticlesError: null,
};

const handlers = {
    [actions.DRUPAL_ARTICLES_LOADING]: state => ({
        ...initialState,
        ...state,
        drupalArticleList: null,
        drupalArticlesLoading: true,
        drupalArticlesError: null,
    }),
    [actions.DRUPAL_ARTICLES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        drupalArticleList: action.payload,
        drupalArticlesLoading: true,
        drupalArticlesError: null,
    }),
    [actions.DRUPAL_ARTICLES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        drupalArticlesLoading: false,
        drupalArticlesError: action.payload,
    }),
};

export default function drupalArticlesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
