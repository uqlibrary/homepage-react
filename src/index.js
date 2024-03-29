// External
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connectRouter } from 'connected-react-router/immutable';
import { AppContainer } from 'react-hot-loader';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// pick utils
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// Internal
import Root from './Root';
import AppErrorBoundary from './AppErrorBoundary';
import rootReducer from './reducer';
import 'sass/index.scss';
import { store } from 'config/store';
import { history } from 'config/history';

// Increase default (10) event listeners to 30
require('events').EventEmitter.prototype._maxListeners = 30;

// Import mock data if required
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
    require('./data/mock');
}

const render = () => {
    ReactDOM.render(
        <AppErrorBoundary>
            <AppContainer>
                <Provider store={store}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Root history={history} />
                    </LocalizationProvider>
                </Provider>
            </AppContainer>
        </AppErrorBoundary>,
        document.getElementById('react-root'),
    );
};

render();

// Hot reloading
if (module.hot) {
    // Reload components
    module.hot.accept('./Root', () => {
        render();
    });

    // Reload reducers
    module.hot.accept('./reducer', () => {
        store.replaceReducer(connectRouter(history)(rootReducer));
    });
}
