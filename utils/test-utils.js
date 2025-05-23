/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { mui1theme } from 'config/theme';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import userEvent from '@testing-library/user-event';

import { getStore } from '../src/config/store';
import Immutable from 'immutable';

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

export const WithRouter = ({ children, route = '/', initialEntries = [route] }) => {
    const routes = [{ path: route, element: children }];
    const router = createMemoryRouter(routes, { initialEntries: initialEntries });
    return <RouterProvider router={router} />;
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
    userEvent,
};
