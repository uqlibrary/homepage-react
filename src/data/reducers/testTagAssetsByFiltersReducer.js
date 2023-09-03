import * as actions from 'data/actions/actionTypes';

export const initialState = {
    taggedBuildingList: [],
    assetList: [],
    taggedBuildingListLoading: false,
    taggedBuildingListLoaded: false,
    taggedBuildingListError: null,
    assetListLoading: false,
    assetListLoaded: false,
    assetListError: null,
};

const handlers = {
    [actions.TESTTAG_TAGGED_BUILDING_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        taggedBuildingListLoading: true,
        taggedBuildingListLoaded: false,
        taggedBuildingListError: null,
    }),
    [actions.TESTTAG_TAGGED_BUILDING_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        taggedBuildingListLoading: false,
        taggedBuildingListLoaded: true,
        taggedBuildingList: action.payload,
        taggedBuildingListError: null,
    }),
    [actions.TESTTAG_TAGGED_BUILDING_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        taggedBuildingListLoading: false,
        taggedBuildingListLoaded: false,
        taggedBuildingListError: action.payload,
    }),
    [actions.TESTTAG_TAGGED_BUILDING_LIST_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        taggedBuildingListError: null,
    }),
    [actions.TESTTAG_ASSET_REPORT_LOADING]: state => ({
        ...initialState,
        ...state,
        assetListLoading: true,
        assetListLoaded: false,
        assetListError: null,
    }),
    [actions.TESTTAG_ASSET_REPORT_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        assetListLoading: false,
        assetListLoaded: true,
        assetList: action.payload,
        assetListError: null,
    }),
    [actions.TESTTAG_ASSET_REPORT_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        assetListLoading: false,
        assetListLoaded: false,
        assetListError: action.payload,
    }),
    [actions.TESTTAG_ASSET_REPORT_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        assetListError: null,
    }),
};

export default function testTagAssetsByFiltersReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
