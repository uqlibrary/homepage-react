import * as actions from 'data/actions/actionTypes';

export const initialState = {
    campusList: null,
    campusListLoading: null,
    campusListError: null,
};

const handlers = {
    [actions.SPACES_CAMPUS_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        campusListLoading: true,
        campusListError: null,
    }),
    [actions.SPACES_CAMPUS_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        campusListLoading: false,
        campusListError: false,
        campusList: action.payload,
    }),
    [actions.SPACES_CAMPUS_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        campusListLoading: false,
        campusListError: action.payload,
    }),
};

export default function bookableSpaceLocationReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log('bookableSpaceLocationReducer', action.type, state, action);
    return handler(state, action);
}
