import * as actions from 'data/actions/actionTypes';

export const initialState = {
    currentPromoPanel: null,
    promoPanelPreview: null,
    promoPanelList: [],
    promoPanelUserTypeList: [],
    promoPanelLoading: false,
    promoPanelListLoading: false,
    promoPanelUserTypesLoading: false,
    promoPanelListError: null,
    promoPanelUserTypesError: null,
    promoPanelActionError: null,
};

const handlers = {
    // Reset in case we need it - delete if not used.
    [actions.PROMOPANEL_CLEAR]: () => ({
        ...initialState,
    }),
    [actions.PROMOPANEL_CLEAR_CURRENT]: state => ({
        ...initialState,
        ...state,
        currentPromoPanel: null,
        promoPanelActionError: null,
    }),
    // Single Panel Reducer
    [actions.PROMOPANEL_LOADING]: state => ({
        ...initialState,
        ...state,
        promoPanelLoading: true,
        promoPanelActionError: null,
    }),
    [actions.PROMOPANEL_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelLoading: false,
        promoPanelActionError: null,
        currentPromoPanel: action.payload,
    }),
    [actions.PROMOPANEL_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
        currentPromoPanel: null,
    }),
    // List of Panels Reducer
    [actions.PROMOPANEL_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        promoPanelList: [],
        promoPanelListLoading: true,
        promoPanelListError: null,
    }),
    [actions.PROMOPANEL_LIST_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelListLoading: false,
        promoPanelListError: null,
        promoPanelList: action.payload,
    }),
    [actions.PROMOPANEL_LIST_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelListLoading: false,
        promoPanelListError: action.payload,
        promoPanelList: [],
    }),
    // Userlist and User-Panel Allocation Reducer
    [actions.PROMOPANEL_USERLIST_LOADING]: state => ({
        ...initialState,
        ...state,
        promoPanelUserTypeList: [],
        promoPanelUserTypesError: null,
        promoPanelUserTypesLoading: true,
    }),
    [actions.PROMOPANEL_USERLIST_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelUserTypesError: null,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: action.payload,
    }),
    [actions.PROMOPANEL_USERLIST_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelUserTypesError: action.payload,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: [],
    }),
    // New Panel Reducer
    [actions.PROMOPANEL_CREATING]: state => ({
        ...initialState,
        ...state,
        promoPanelLoading: true,
        promoPanelActionError: null,
    }),
    [actions.PROMOPANEL_CREATE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        currentPromoPanel: action.payload,
        promoPanelLoading: false,
        promoPanelActionError: null,
    }),
    [actions.PROMOPANEL_CREATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
    }),
    // Edit Panel Reducer
    [actions.PROMOPANEL_SAVING]: state => ({
        ...initialState,
        ...state,
        promoPanelLoading: true,
        promoPanelActionError: null,
    }),
    [actions.PROMOPANEL_SAVE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        currentPromoPanel: action.payload,
        promoPanelLoading: false,
        promoPanelActionError: null,
    }),
    [actions.PROMOPANEL_SAVE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
    }),
    // Delete Panel Reducer
    [actions.PROMOPANEL_DELETING]: state => ({
        ...initialState,
        ...state,
        promoPanelLoading: true,
        promoPanelActionError: null,
    }),
    [actions.PROMOPANEL_DELETE_SUCCESS]: state => ({
        ...initialState,
        ...state,
        currentPromoPanel: null,
        promoPanelLoading: false,
        promoPanelActionError: null,
    }),
    [actions.PROMOPANEL_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
    }),
};

export default function promoPanelReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
