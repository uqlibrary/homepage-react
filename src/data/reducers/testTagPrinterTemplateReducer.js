import * as actions from 'data/actions/actionTypes';

export const initialState = {
    printerTemplateList: [],
    printerTemplateListLoading: false,
    printerTemplateListLoaded: false,
    printerTemplateListError: null,
};

const handlers = {
    [actions.TESTTAG_PRINTER_TEMPLATE_LOADING]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: true,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateList: action?.payload ?? [],
        printerTemplateListLoading: false,
        printerTemplateListLoaded: true,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: action?.payload ?? null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_UPDATING]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: true,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_UPDATED]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: action.payload,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_ADDING]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: true,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_ADDED]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_ADD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: action.payload,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_DELETING]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: true,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_DELETED]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: action.payload,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        printerTemplateListError: null,
    }),
};

export default function testTagPrinterTemplateReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
