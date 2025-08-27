import * as actions from 'data/actions/actionTypes';

export const initialState = {
    locationSpaceList: null,
    locationSpaceListLoading: null,
    locationSpaceListError: null,
};

const handlers = {
    [actions.SPACES_ROOM_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        locationSpaceListLoading: true,
        locationSpaceListError: false,
    }),
    [actions.SPACES_ROOM_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        locationSpaceListLoading: false,
        locationSpaceListError: false,
        locationSpaceList: action.payload,
    }),
    [actions.SPACES_ROOM_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        locationSpaceListLoading: false,
        locationSpaceListError: action.payload,
    }),
    // [actions.SPACES_ROOM_LIST_CLEAR]: () => ({
    //     ...initialState,
    // }),
};

export default function locationSpacesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
