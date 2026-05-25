import * as actions from 'data/actions/actionTypes';

export const initialState = {
    bookableSpacesRoomList: null,
    bookableSpacesRoomListIncludesDrafts: null,
    bookableSpacesRoomListIncludesDeleted: null,
    bookableSpacesRoomListLoading: null,
    bookableSpacesRoomListError: null,
    bookableSpacesRoomAdding: null,
    bookableSpacesRoomAddError: null,
    bookableSpacesRoomAddResult: null,
    bookableSpaceGetting: null,
    bookableSpaceGetError: null,
    bookableSpaceGetResult: null,
    bookableSpacesArchibusTree: null,
    bookableSpacesArchibusTreeLoading: null,
    bookableSpacesArchibusTreeError: null,
    spaceOutageList: null,
    spaceOutageListLoading: null,
    spaceOutageListError: null,
    spaceOutageCreating: null,
    spaceOutageCreateError: null,
    spaceOutageCreateResult: null,
    spaceOutageUpdating: null,
    spaceOutageUpdateError: null,
    spaceOutageUpdateResult: null,
    spaceOutageDeleting: null,
    spaceOutageDeleteError: null,
    spaceOutageDeleteResult: null,
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
        bookableSpacesRoomListIncludesDrafts: !!action.includeDrafts,
        bookableSpacesRoomListIncludesDeleted: !!action.includeDeleted,
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
    [actions.SPACES_ARCHIBUS_TREE_LOADING]: state => ({
        ...initialState,
        ...state,
        bookableSpacesArchibusTreeLoading: true,
        bookableSpacesArchibusTreeError: false,
    }),
    [actions.SPACES_ARCHIBUS_TREE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpacesArchibusTreeLoading: false,
        bookableSpacesArchibusTreeError: false,
        bookableSpacesArchibusTree: action.payload,
    }),
    [actions.SPACES_ARCHIBUS_TREE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        bookableSpacesArchibusTreeLoading: false,
        bookableSpacesArchibusTreeError: action.payload,
    }),
    [actions.SPACES_OUTAGE_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        spaceOutageListLoading: true,
        spaceOutageListError: false,
    }),
    [actions.SPACES_OUTAGE_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        spaceOutageListLoading: false,
        spaceOutageListError: false,
        spaceOutageList: action.payload,
    }),
    [actions.SPACES_OUTAGE_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        spaceOutageListLoading: false,
        spaceOutageListError: action.payload,
    }),
    [actions.SPACES_OUTAGE_ADDING]: state => ({
        ...initialState,
        ...state,
        spaceOutageCreating: true,
        spaceOutageCreateError: false,
    }),
    [actions.SPACES_OUTAGE_ADDED]: (state, action) => ({
        ...initialState,
        ...state,
        spaceOutageCreating: false,
        spaceOutageCreateError: false,
        spaceOutageCreateResult: action.payload,
    }),
    [actions.SPACES_OUTAGE_ADD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        spaceOutageCreating: false,
        spaceOutageCreateError: action.payload,
    }),
    [actions.SPACES_OUTAGE_UPDATING]: state => ({
        ...initialState,
        ...state,
        spaceOutageUpdating: true,
        spaceOutageUpdateError: false,
    }),
    [actions.SPACES_OUTAGE_UPDATED]: (state, action) => ({
        ...initialState,
        ...state,
        spaceOutageUpdating: false,
        spaceOutageUpdateError: false,
        spaceOutageUpdateResult: action.payload,
    }),
    [actions.SPACES_OUTAGE_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        spaceOutageUpdating: false,
        spaceOutageUpdateError: action.payload,
    }),
    [actions.SPACES_OUTAGE_DELETING]: state => ({
        ...initialState,
        ...state,
        spaceOutageDeleting: true,
        spaceOutageDeleteError: false,
    }),
    [actions.SPACES_OUTAGE_DELETED]: (state, action) => ({
        ...initialState,
        ...state,
        spaceOutageDeleting: false,
        spaceOutageDeleteError: false,
        spaceOutageDeleteResult: action.payload,
    }),
    [actions.SPACES_OUTAGE_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        spaceOutageDeleting: false,
        spaceOutageDeleteError: action.payload,
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
