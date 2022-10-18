import * as actions from 'data/actions/actionTypes';

export const initialState = {
    currentPromoPanel: null,
    promoPanelPreview: null,
    promoPanelList: null,
    promoPanelUserTypeList: null,
    promoPanelStatus: null,
    promoPanelError: false,
};

const handlers = {
    // Reset in case we need it - delete if not used.
    [actions.PROMOPANEL_CLEAR]: () => ({
        ...initialState,
    }),
    // Single Panel Reducer
    [actions.PROMOPANEL_LOADING]: state => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'loading',
    }),
    [actions.PROMOPANEL_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'loaded',
        currentPromoPanel: action.payload,
    }),
    [actions.PROMOPANEL_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'loaderror',
        promoPanelError: action.payload,
    }),
    // List of Panels Reducer
    [actions.PROMOPANEL_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'listloading',
    }),
    [actions.PROMOPANEL_LIST_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelList: action.payload,
        promoPanelStatus: 'listloaded',
    }),
    [actions.PROMOPANEL_LIST_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'listloaderror',
        promoPanelError: action.payload,
    }),
    // Userlist and User-Panel Allocation Reducer
    [actions.PROMOPANEL_USERLIST_LOADING]: state => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'userlistloading',
        promoPanelError: null,
    }),
    [actions.PROMOPANEL_USERLIST_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelUserTypeList: action.payload,
        promoPanelStatus: 'userlistloaded',
        promoPanelError: null,
    }),
    [actions.PROMOPANEL_USERLIST_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'userlistloaderror',
        promoPanelError: action.payload,
    }),
    // New Panel Reducer
    [actions.PROMOPANEL_CREATING]: state => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'creating',
        promoPanelError: null,
    }),
    [actions.PROMOPANEL_CREATE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'created',
        currentPromoPanel: action.payload,
        promoPanelError: null,
    }),
    [actions.PROMOPANEL_CREATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'createerror',
        promoPanelError: action.payload,
    }),
    // Edit Panel Reducer
    [actions.PROMOPANEL_SAVING]: state => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'saving',
        promoPanelError: null,
    }),
    [actions.PROMOPANEL_SAVE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'saved',
        currentPromoPanel: action.payload,
        promoPanelError: null,
    }),
    [actions.PROMOPANEL_SAVE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'saveerror',
        promoPanelError: action.payload,
    }),
    // Delete Panel Reducer
    [actions.PROMOPANEL_DELETING]: state => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'deleting',
        promoPanelError: null,
    }),
    [actions.PROMOPANEL_DELETE_SUCCESS]: state => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'deleted',
        promoPanelError: null,
    }),
    [actions.PROMOPANEL_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelStatus: 'deleteerror',
        promoPanelError: action.payload,
    }),
};

export default function promoPanelReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
