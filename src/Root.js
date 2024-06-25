import React from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
import { mui1theme } from 'config';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { App } from 'modules/App/components';

const Root = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={mui1theme}>
                    <Switch>
                        <Route component={App} />
                    </Switch>
                </ThemeProvider>
            </StyledEngineProvider>
        </ConnectedRouter>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
