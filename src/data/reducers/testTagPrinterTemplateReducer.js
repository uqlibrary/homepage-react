import * as actions from 'data/actions/actionTypes';

export const initialState = {
    printerTemplateList: [],
    printerTemplateListLoading: false,
    printerTemplateListLoaded: false,
    printerTemplateListError: null,
};

const handlers = {
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: true,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateList: action?.payload ?? [],
        printerTemplateListLoading: false,
        printerTemplateListLoaded: true,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: action?.payload ?? null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_UPDATING]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: true,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_UPDATED]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: action.payload,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_ADDING]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: true,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_ADDED]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_ADD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: action.payload,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_DELETING]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: true,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_DELETED]: state => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: null,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        printerTemplateListLoading: false,
        printerTemplateListLoaded: false,
        printerTemplateListError: action.payload,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_LIST_CLEAR_ERROR]: state => ({
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

export const pasteDataInitialState = {
    field: null,
    value: null,
};

const pasteHandlers = {
    [actions.TESTTAG_PRINTER_TEMPLATE_PASTE_DETECTED]: (state, action) => ({
        ...pasteDataInitialState,
        ...state,
        field: action.payload.field,
        value: action.payload.value,
    }),
    [actions.TESTTAG_PRINTER_TEMPLATE_PASTE_CLEAR]: () => ({
        ...pasteDataInitialState,
    }),
};

export function testTagPrinterTemplatePasteDataReducer(state = pasteDataInitialState, action) {
    const handler = pasteHandlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
