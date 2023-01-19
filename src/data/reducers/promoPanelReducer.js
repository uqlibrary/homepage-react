import * as actions from 'data/actions/actionTypes';

export const initialState = {
    currentPromoPanel: null,
    promoPanelPreview: null,
    promoPanelList: [],
    promoPanelUserTypeList: [],
    promoPanelActiveList: [],
    promoPanelLoading: false,
    promoPanelListLoading: false,
    promoPanelUserTypesLoading: false,
    promoPanelActivePanelsLoading: false,
    promoPanelActivePanelsError: null,
    promoPanelListError: null,
    promoPanelUserTypesError: null,
    promoPanelActionError: null,
    promoPanelSaving: false,
    panelUpdated: false,
    scheduleUpdated: false,
    queueLength: 0,
};

const handlers = {
    // Reset in case we need it - delete if not used.
    [actions.CLEAR_PROMO_UPDATED_STATUS]: state => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
    }),
    [actions.PROMOPANEL_UPDATE_QUEUELENGTH]: (state, action) => ({
        ...initialState,
        ...state,
        queueLength: action.payload,
    }),
    [actions.PROMOPANEL_DECREMENT_QUEUELENGTH]: state => ({
        ...state,
        queueLength: state.queueLength > 0 ? state.queueLength - 1 : 0,
    }),
    [actions.PROMOPANEL_CLEAR]: () => ({
        ...initialState,
    }),
    [actions.PROMOPANEL_CLEAR_CURRENT]: state => ({
        ...initialState,
        ...state,
        currentPromoPanel: null,
        promoPanelActionError: null,
        promoPanelSaving: false,
        scheduleUpdated: false,
    }),
    // List Active Panels
    [actions.PROMOPANEL_LIST_ACTIVE_LOADING]: state => ({
        ...initialState,
        ...state,
        promoPanelActiveList: [],
        promoPanelActivePanelsLoading: true,
        promoPanelActiveListError: null,
    }),
    [actions.PROMOPANEL_LIST_ACTIVE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        // panelUpdated: false,
        // scheduleUpdated: false,
        // promoPanelLoading: false,
        promoPanelActiveListError: null,
        promoPanelActivePanelsLoading: false,
        promoPanelActiveList: action.payload,
        // queueLength: 0,
    }),
    [actions.PROMOPANEL_LIST_ACTIVE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        // panelUpdated: false,
        // scheduleUpdated: false,
        // promoPanelLoading: false,
        promoPanelActiveListError: action.payload,
        promoPanelActivePanelsLoading: false,
        promoPanelActiveList: [],
        // queueLength: 0,
    }),
    // Single Panel Reducer
    [actions.PROMOPANEL_LOADING]: state => ({
        ...initialState,
        ...state,
        promoPanelLoading: true,
        promoPanelActionError: null,
        panelUpdated: false,
        scheduleUpdated: false,
        queueLength: 0,
    }),
    [actions.PROMOPANEL_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelLoading: false,
        promoPanelActionError: null,
        currentPromoPanel: action.payload,
        queueLength: 0,
    }),
    [actions.PROMOPANEL_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
        currentPromoPanel: null,
        queueLength: 0,
    }),
    // List of Panels Reducer
    [actions.PROMOPANEL_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelList: [],
        promoPanelListLoading: true,
        promoPanelListError: null,
        queueLength: 0,
    }),
    [actions.PROMOPANEL_LIST_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelListLoading: false,
        promoPanelListError: null,
        promoPanelList: action.payload,
    }),
    [actions.PROMOPANEL_LIST_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelListLoading: false,
        promoPanelListError: action.payload,
        promoPanelList: [],
    }),
    // Userlist and User-Panel Allocation Reducer
    [actions.PROMOPANEL_USERLIST_LOADING]: state => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelUserTypeList: [],
        promoPanelUserTypesError: null,
        promoPanelUserTypesLoading: true,
        queueLength: 0,
    }),
    [actions.PROMOPANEL_USERLIST_LOAD_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelUserTypesError: null,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: action.payload,
    }),
    [actions.PROMOPANEL_USERLIST_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelUserTypesError: action.payload,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: [],
    }),
    // New Panel Reducer
    [actions.PROMOPANEL_CREATING]: state => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelLoading: false,
        promoPanelActionError: null,
        promoPanelSaving: true,
    }),
    [actions.PROMOPANEL_CREATE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: true,
        scheduleUpdated: false,
        currentPromoPanel: action.payload,
        promoPanelLoading: false,
        promoPanelActionError: null,
        promoPanelSaving: false,
        queueLength: 0,
    }),
    [actions.PROMOPANEL_CREATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
        promoPanelSaving: false,
    }),
    // Edit Panel Reducer
    [actions.PROMOPANEL_SAVING]: state => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelLoading: true,
        promoPanelActionError: null,
        promoPanelSaving: true,
    }),
    [actions.PROMOPANEL_SAVE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: true,
        scheduleUpdated: false,
        currentPromoPanel: action.payload,
        promoPanelLoading: false,
        promoPanelActionError: null,
        promoPanelSaving: false,
    }),
    [actions.PROMOPANEL_SAVE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        promoPanelLoading: false,
        scheduleUpdated: false,
        promoPanelActionError: action.payload,
        promoPanelSaving: false,
    }),
    // Schedule Panel Reducer
    [actions.PROMOPANEL_SCHEDULING]: state => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelLoading: true,
        promoPanelActionError: null,
        promoPanelSaving: true,
    }),
    [actions.PROMOPANEL_SCHEDULE_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: true,
        currentPanel: action.payload,
        scheduleUpdated: true,
        promoPanelLoading: false,
        promoPanelActionError: null,
        promoPanelSaving: false,
        queueLength: state.queueLength > 0 ? state.queueLength - 1 : 0,
    }),
    [actions.PROMOPANEL_SCHEDULE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelLoading: false,
        promoPanelActionError: action.payload,
        promoPanelSaving: false,
    }),
    // Delete Panel Reducer
    [actions.PROMOPANEL_DELETING]: state => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
        promoPanelLoading: true,
        promoPanelActionError: null,
        promoPanelSaving: true,
    }),
    [actions.PROMOPANEL_DELETE_SUCCESS]: state => ({
        ...initialState,
        ...state,
        panelUpdated: true,
        scheduleUpdated: false,
        currentPromoPanel: null,
        promoPanelLoading: false,
        promoPanelActionError: null,
        promoPanelSaving: false,
    }),
    [actions.PROMOPANEL_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        panelUpdated: false,
        scheduleUpdated: false,
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
