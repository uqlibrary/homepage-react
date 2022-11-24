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
    promoPanelSaving: false,
    updated: false,
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
        promoPanelSaving: false,
    }),
    // Single Panel Reducer
    [actions.PROMOPANEL_LOADING]: state => ({
        ...initialState,
        ...state,
        promoPanelLoading: true,
        promoPanelActionError: null,
        updated: false,
    }),
    [actions.PROMOPANEL_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelLoading: false,
        promoPanelActionError: null,
        currentPromoPanel: action.payload,
    }),
    [actions.PROMOPANEL_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
        currentPromoPanel: null,
    }),
    // List of Panels Reducer
    [actions.PROMOPANEL_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelList: [],
        promoPanelListLoading: true,
        promoPanelListError: null,
    }),
    [actions.PROMOPANEL_LIST_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelListLoading: false,
        promoPanelListError: null,
        promoPanelList: action.payload,
    }),
    [actions.PROMOPANEL_LIST_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelListLoading: false,
        promoPanelListError: action.payload,
        promoPanelList: [],
    }),
    // Userlist and User-Panel Allocation Reducer
    [actions.PROMOPANEL_USERLIST_LOADING]: state => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelUserTypeList: [],
        promoPanelUserTypesError: null,
        promoPanelUserTypesLoading: true,
    }),
    [actions.PROMOPANEL_USERLIST_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelUserTypesError: null,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: action.payload,
    }),
    [actions.PROMOPANEL_USERLIST_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelUserTypesError: action.payload,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: [],
    }),
    // New Panel Reducer
    [actions.PROMOPANEL_CREATING]: state => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelLoading: true,
        promoPanelActionError: null,
        promoPanelSaving: true,
    }),
    [actions.PROMOPANEL_CREATE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        updated: true,
        currentPromoPanel: action.payload,
        promoPanelLoading: false,
        promoPanelActionError: null,
        promoPanelSaving: false,
    }),
    [actions.PROMOPANEL_CREATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
        promoPanelSaving: false,
    }),
    // Edit Panel Reducer
    [actions.PROMOPANEL_SAVING]: state => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelLoading: true,
        promoPanelActionError: null,
        promoPanelSaving: true,
    }),
    [actions.PROMOPANEL_SAVE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        updated: true,
        currentPromoPanel: action.payload,
        promoPanelLoading: false,
        promoPanelActionError: null,
        promoPanelSaving: false,
    }),
    [actions.PROMOPANEL_SAVE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
        promoPanelSaving: false,
    }),
    // Schedule Panel Reducer
    [actions.PROMOPANEL_SCHEDULING]: state => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelLoading: true,
        promoPanelActionError: null,
        promoPanelSaving: true,
    }),
    [actions.PROMOPANEL_SCHEDULE_SUCCESS]: state => ({
        ...initialState,
        ...state,
        updated: true,
        promoPanelLoading: false,
        promoPanelActionError: null,
        promoPanelSaving: false,
    }),
    [actions.PROMOPANEL_SCHEDULE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
        promoPanelSaving: false,
    }),
    // Delete Panel Reducer
    [actions.PROMOPANEL_DELETING]: state => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelLoading: true,
        promoPanelActionError: null,
        promoPanelSaving: true,
    }),
    [actions.PROMOPANEL_DELETE_SUCCESS]: state => ({
        ...initialState,
        ...state,
        updated: true,
        currentPromoPanel: null,
        promoPanelLoading: false,
        promoPanelActionError: null,
        promoPanelSaving: false,
    }),
    [actions.PROMOPANEL_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        updated: false,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
        promoPanelSaving: false,
    }),
};

export default function promoPanelReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
