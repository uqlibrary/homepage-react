import * as actions from 'data/actions/actionTypes';

export const initialState = {
    bookableSpacesRoomList: null,
    bookableSpacesRoomListLoading: null,
    bookableSpacesRoomListError: null,
    bookableSpacesRoomAdding: null,
    bookableSpacesRoomAddError: null,
    bookableSpacesRoomAddResult: null,
    bookableSpaceGetting: null,
    bookableSpaceGetError: null,
    bookableSpaceGetResult: null,
    bookableSpacesRoomUpdating: null,
    bookableSpacesRoomUpdateError: null,
    bookableSpacesRoomUpdateResult: null,
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
    [actions.SPACES_ROOM_GET_LOADING]: state => ({
        ...initialState,
        ...state,
        bookableSpaceGetting: true,
        bookableSpaceGetError: false,
    }),
    [actions.SPACES_ROOM_GET_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpaceGetting: false,
        bookableSpaceGetError: false,
        bookableSpaceGetResult: action.payload,
    }),
    [actions.SPACES_ROOM_GET_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpaceGetting: false,
        bookableSpaceGetError: action.payload,
    }),
    [actions.SPACES_LOCATION_ADDING]: state => ({
        ...initialState,
        ...state,
        bookableSpacesRoomAdding: true,
        bookableSpacesRoomAddError: false,
    }),
    [actions.SPACES_LOCATION_ADDED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpacesRoomAdding: false,
        bookableSpacesRoomAddError: false,
        bookableSpacesRoomAddResult: action.payload,
    }),
    [actions.SPACES_LOCATION_ADD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpacesRoomAdding: false,
        bookableSpacesRoomAddError: action.payload,
    }),
    [actions.SPACES_LOCATION_UPDATING]: state => ({
        ...initialState,
        ...state,
        bookableSpacesRoomUpdating: true,
        bookableSpacesRoomUpdateError: false,
    }),
    [actions.SPACES_LOCATION_UPDATED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpacesRoomUpdating: false,
        bookableSpacesRoomUpdateError: false,
        bookableSpacesRoomUpdateResult: action.payload,
    }),
    [actions.SPACES_LOCATION_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpacesRoomUpdating: false,
        bookableSpacesRoomUpdateError: action.payload,
    }),
    [actions.SPACES_LOCATION_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function bookableSpacesRoomListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log('bookableSpacesRoomListReducer', action.type, state);
    return handler(state, action);
}
