import * as actions from 'data/actions/actionTypes';

export const initialState = {
    roomList: null,
    roomListLoading: false,
    roomListError: null,
};

const handlers = {
    [actions.TESTTAG_ROOM_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        roomListLoading: true,
        roomListError: false,
    }),
    [actions.TESTTAG_ROOM_LIST_LOADED]: (state, action) => {
        console.log('ROOM ACTION', action);
        return {
            ...initialState,
            ...state,
            roomListLoading: false,
            roomListError: false,
            roomList: action.payload,
        };
    },
    [actions.TESTTAG_ROOM_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        roomListLoading: false,
        roomListError: action.payload,
    }),
    [actions.TESTTAG_ROOM_LIST_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function roomListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
