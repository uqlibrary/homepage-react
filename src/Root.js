import React from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
import { mui1theme } from 'config';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import createGenerateClassName from '@mui/styles/createGenerateClassName';
const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: false,
    productionPrefix: 'uq-lib-',
});

import { App } from 'modules/App/components';

const Root = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <JssProvider generateClassName={generateClassName}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={mui1theme}>
                        <Switch>
                            <Route component={App} />
                        </Switch>
                    </ThemeProvider>
                </StyledEngineProvider>
            </JssProvider>
        </ConnectedRouter>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
