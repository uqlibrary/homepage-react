/* eslint-env jest */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Immutable from 'immutable';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { api, sessionApi } from 'config/axios';

const setupStoreForActions = () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    return mockStore({});
};

export const setupStoreForMount = (initialState = Immutable.Map()) => {
    const store = {
        getState: jest.fn(() => initialState),
        dispatch: jest.fn(),
        subscribe: jest.fn(),
    };
    const next = jest.fn();
    const invoke = action => thunk(store)(next)(action);
    return { store, next, invoke };
};

const setupMockAdapter = () => {
    return new MockAdapter(api, { delayResponse: 100 });
};

const setupSessionMockAdapter = () => {
    return new MockAdapter(sessionApi, { delayResponse: 100 });
};

// set global store for testing actions
global.setupStoreForActions = setupStoreForActions;
global.mockActionsStore = setupStoreForActions();

// set global mock api
global.setupMockAdapter = setupMockAdapter;
global.setupSessionMockAdapter = setupSessionMockAdapter;
global.mockApi = setupMockAdapter();
global.mockSessionApi = setupSessionMockAdapter();
global.setupStoreForMount = setupStoreForMount;

jest.spyOn(Date, 'now').mockImplementation(() => 1451606400000);

const MockDate = require('mockdate');
MockDate.set('6/30/2017');
