import * as actions from 'data/actions/actionTypes';

export const initialState = {
    locationSpaceList: null,
    locationSpaceListLoading: null,
    locationSpaceListError: null,
};

const handlers = {
    [actions.LOCATIONLIST_LOADING]: state => ({
        ...initialState,
        ...state,
        locationSpaceListLoading: true,
        locationSpaceListError: false,
    }),
    [actions.LOCATIONLIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        locationSpaceListLoading: false,
        locationSpaceListError: false,
        locationSpaceList: action.payload,
    }),
    [actions.LOCATIONLIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        locationSpaceListLoading: false,
        locationSpaceListError: action.payload,
    }),
    // [actions.LOCATIONLIST_CLEAR]: () => ({
    //     ...initialState,
    // }),
};

export default function locationSpacesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log('locationSpacesReducer', action.type, state, action);
    return handler(state, action);
}
