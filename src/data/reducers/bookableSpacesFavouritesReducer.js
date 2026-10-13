import * as actions from 'data/actions/actionTypes';

export const initialState = {
    spacesFavouritesList: null,
    spacesFavouritesLoading: null,
    spacesFavouritesError: null,
};

const handlers = {
    [actions.SPACES_FAVOURITES_LOADING]: state => ({
        ...initialState,
        ...state,
        spacesFavouritesLoading: true,
        spacesFavouritesError: false,
    }),
    [actions.SPACES_FAVOURITES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        spacesFavouritesList: action.payload,
        spacesFavouritesLoading: null,
        spacesFavouritesError: null,
    }),
    [actions.SPACES_FAVOURITES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        spacesFavouritesLoading: false,
        spacesFavouritesError: action.payload,
    }),
};

export default function bookableSpacesFavouritesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
