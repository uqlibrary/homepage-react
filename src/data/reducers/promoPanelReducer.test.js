import promoPanelReducer, { initialState } from './promoPanelReducer';
import * as actions from '../actions/actionTypes';

describe('PromoPanel reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('Clear Promo Panel updated status', () => {
        const test = promoPanelReducer(emptyState, {
            type: actions.CLEAR_PROMO_UPDATED_STATUS,
        });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should handle updating queueLength', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_UPDATE_QUEUELENGTH, payload: 10 });
        expect(test).toEqual({
            ...emptyState,
            queueLength: 10,
        });
    });
    it('should handle decrementing queueLength', () => {
        const test = promoPanelReducer(
            { ...emptyState, queueLength: 10 },
            { type: actions.PROMOPANEL_DECREMENT_QUEUELENGTH },
        );
        expect(test).toEqual({
            ...emptyState,
            queueLength: 9,
        });
    });
    it('should handle clear action', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
    it('should handle clear current action', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_CLEAR_CURRENT });
        expect(test).toEqual({
            ...emptyState,
        });
    });
    it('should handle active list loading', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_LIST_ACTIVE_LOADING });
        expect(test).toEqual({
            ...emptyState,
            promoPanelActiveList: [],
            promoPanelActivePanelsLoading: true,
            promoPanelActiveListError: null,
        });
    });
    it('should handle active list success', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_LIST_ACTIVE_SUCCESS, payload: 'test' });
        expect(test).toEqual({
            ...emptyState,
            promoPanelActiveListError: null,
            promoPanelActivePanelsLoading: false,
            promoPanelActiveList: 'test',
        });
    });
    it('should handle active list failed', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_LIST_ACTIVE_FAILED, payload: 'failed' });
        expect(test).toEqual({
            ...emptyState,
            promoPanelActiveListError: 'failed',
            promoPanelActivePanelsLoading: false,
            promoPanelActiveList: [],
        });
    });
    it('should handle single panel load', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_LOADING });
        expect(test).toEqual({
            ...emptyState,
            promoPanelLoading: true,
            promoPanelActionError: null,
            panelUpdated: false,
            scheduleUpdated: false,
            queueLength: 0,
        });
    });
    it('should handle single panel load success', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_LOAD_SUCCESS, payload: 'test' });
        expect(test).toEqual({
            ...emptyState,
            panelUpdated: false,
            scheduleUpdated: false,
            promoPanelLoading: false,
            promoPanelActionError: null,
            currentPromoPanel: 'test',
            queueLength: 0,
        });
    });
    it('should handle single panel load fail', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_LOAD_FAILED, payload: 'error' });
        expect(test).toEqual({
            ...emptyState,
            panelUpdated: false,
            scheduleUpdated: false,
            promoPanelLoading: false,
            promoPanelActionError: 'error',
            currentPromoPanel: null,
            queueLength: 0,
        });
    });
    it('should handle panel list loading', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_LIST_LOADING });
        expect(test).toEqual({
            ...emptyState,
            panelUpdated: false,
            scheduleUpdated: false,
            promoPanelList: [],
            promoPanelListLoading: true,
            promoPanelListError: null,
            queueLength: 0,
        });
    });
    it('should handle panel list loading success', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_LIST_LOAD_SUCCESS, payload: 'test' });
        expect(test).toEqual({
            ...emptyState,
            panelUpdated: false,
            scheduleUpdated: false,
            promoPanelListLoading: false,
            promoPanelListError: null,
            promoPanelList: 'test',
        });
    });
    it('should handle panel list loading failure', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_LIST_LOAD_FAILED, payload: 'error' });
        expect(test).toEqual({
            ...emptyState,
            panelUpdated: false,
            scheduleUpdated: false,
            promoPanelListLoading: false,
            promoPanelListError: 'error',
            promoPanelList: [],
        });
    });
    it('should handle panel user list loading', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_USERLIST_LOADING });
        expect(test).toEqual({
            ...emptyState,
            panelUpdated: false,
            scheduleUpdated: false,
            promoPanelUserTypeList: [],
            promoPanelUserTypesError: null,
            promoPanelUserTypesLoading: true,
            queueLength: 0,
        });
    });
    it('should handle panel user list loading success', () => {
        const test = promoPanelReducer(emptyState, { type: actions.PROMOPANEL_USERLIST_LOAD_SUCCESS, payload: 'test' });
        expect(test).toEqual({
            ...emptyState,
            panelUpdated: false,
            scheduleUpdated: false,
            promoPanelUserTypesError: null,
            promoPanelUserTypesLoading: false,
            promoPanelUserTypeList: 'test',
        });
    });
});
