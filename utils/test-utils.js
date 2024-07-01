/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Route } from 'react-router';
import { mui1theme } from 'config/theme';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import preview from 'jest-preview';
import userEvent from '@testing-library/user-event';

import { getStore } from '../src/config/store';
import Immutable from 'immutable';
import { createMemoryHistory } from 'history';

const domTestingLib = require('@testing-library/dom');
const reactTestingLib = require('@testing-library/react');

const AllTheProviders = props => {
    return (
        <MuiThemeProvider theme={mui1theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>{props.children}</LocalizationProvider>
        </MuiThemeProvider>
    );
};

AllTheProviders.propTypes = {
    children: PropTypes.node,
};

export const rtlRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

export const WithRouter = ({
    children,
    route = '/',
    path = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
}) => {
    return (
        <Router history={history}>
            <Route path={path} children={children} />
        </Router>
    );
};

export const WithReduxStore = ({ initialState = Immutable.Map(), children }) => (
    <Provider store={getStore(initialState)}>
        <AllTheProviders>{children}</AllTheProviders>
    </Provider>
);

module.exports = {
    ...domTestingLib,
    ...reactTestingLib,
    rtlRender,
    WithRouter,
    WithReduxStore,
    preview,
    userEvent,
};
