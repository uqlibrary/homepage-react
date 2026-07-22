import { applyMiddleware, compose, createStore } from 'redux';
import { Map } from 'immutable';
import thunk from 'redux-thunk';
import { saveReducerOnSessionExpired } from 'middleware';
import rootReducer from '../reducer';

export const getStore = (initialState = Map()) => {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancer(applyMiddleware(thunk, saveReducerOnSessionExpired)),
    );

    return store;
};

export const store = getStore();
