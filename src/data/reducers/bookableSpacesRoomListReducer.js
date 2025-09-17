import * as actions from 'data/actions/actionTypes';

export const initialState = {
    bookableSpacesRoomList: null,
    bookableSpacesRoomListLoading: null,
    bookableSpacesRoomListError: null,
};

const handlers = {
    [actions.SPACES_ROOM_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        bookableSpacesRoomListLoading: true,
        bookableSpacesRoomListError: false,
    }),
    [actions.SPACES_ROOM_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpacesRoomListLoading: false,
        bookableSpacesRoomListError: false,
        bookableSpacesRoomList: action.payload,
    }),
    [actions.SPACES_ROOM_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpacesRoomListLoading: false,
        bookableSpacesRoomListError: action.payload,
    }),
    // [actions.SPACES_ROOM_LIST_CLEAR]: () => ({
    //     ...initialState,
    // }),
};

export default function bookableSpacesRoomListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
