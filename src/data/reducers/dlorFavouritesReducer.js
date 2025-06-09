import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorFavouritesList: null,
    dlorFavouritesLoading: null,
    dlorFavouritesError: null,
};

const handlers = {
    [actions.DLOR_FAVOURITES_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorFavouritesLoading: true,
        dlorFavouritesError: false,
    }),
    [actions.DLOR_FAVOURITES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorFavouritesList: action.payload,
        dlorFavouritesLoading: null,
        dlorFavouritesError: null,
    }),
    [actions.DLOR_FAVOURITES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorFavouritesLoading: false,
        dlorFavouritesError: action.payload,
    }),
};

export default function dlorFavouritesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
