import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorFileTypeListLoading: null,
    dlorFileTypeListError: null,
    dlorFileTypeList: null,
};

const handlers = {
    [actions.DLOR_FILETYPE_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorFileTypeListLoading: true,
        dlorFileTypeListError: false,
    }),
    [actions.DLOR_FILETYPE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorFileTypeListLoading: false,
        dlorFileTypeListError: false,
        dlorFileTypeList: action.payload,
    }),
    [actions.DLOR_FILETYPE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorFileTypeListLoading: false,
        dlorFileTypeListError: action.payload,
    }),
};

export default function dlorFileTypeListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
