import * as actions from 'data/actions/actionTypes';

export const initialState = {
    assetTypesList: [],
    assetTypesListLoading: false,
    assetTypesListError: null,
    assetTypesActionError: false,
    assetTypesActionType: '',
};

const handlers = {
    [actions.TESTTAG_ASSET_TYPES_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: true,
        assetTypesListError: false,
    }),
    [actions.TESTTAG_ASSET_TYPES_LIST_LOADED]: (state, action) => {
        return {
            ...initialState,
            ...state,
            assetTypesListLoading: false,
            assetTypesListError: false,
            assetTypesList: action.payload,
        };
    },
    [actions.TESTTAG_ASSET_TYPES_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        assetTypesListLoading: false,
        assetTypesListError: action.payload,
    }),
    [actions.TESTTAG_ASSET_TYPES_SAVING]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: true,
        assetTypesListError: false,
        assetTypesActionError: false,
        assetTypesActionType: 'SAVE',
    }),
    [actions.TESTTAG_ASSET_TYPES_SAVED]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: false,
        assetTypesListError: false,
        assetTypesActionError: false,
        assetTypesActionType: '',
    }),
    [actions.TESTTAG_ASSET_TYPES_SAVE_FAILED]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: false,
        assetTypesListError: false,
        assetTypesActionError: true,
        assetTypesActionType: 'SAVE',
    }),
    [actions.TESTTAG_ASSET_TYPES_REASSIGNING]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: true,
        assetTypesListError: false,
        assetTypesActionError: false,
        assetTypesActionType: 'REASSIGN',
    }),
    [actions.TESTTAG_ASSET_TYPES_REASSIGNED]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: false,
        assetTypesListError: false,
        assetTypesActionError: false,
        assetTypesActionType: '',
    }),
    [actions.TESTTAG_ASSET_TYPES_REASSIGN_FAILED]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: false,
        assetTypesListError: false,
        assetTypesActionError: true,
        assetTypesActionType: 'REASSIGN',
    }),
    [actions.TESTTAG_ASSET_TYPES_DELETING]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: false,
        assetTypesListError: false,
        assetTypesActionError: false,
        assetTypesActionType: 'DELETE',
    }),
    [actions.TESTTAG_ASSET_TYPES_DELETED]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: false,
        assetTypesListError: false,
        assetTypesActionError: false,
        assetTypesActionType: '',
    }),
    [actions.TESTTAG_ASSET_TYPES_DELETE_FAILED]: state => ({
        ...initialState,
        ...state,
        assetTypesListLoading: false,
        assetTypesListError: false,
        assetTypesActionError: true,
        assetTypesActionType: 'DELETE',
    }),
};

export default function testTagAssetTypesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}