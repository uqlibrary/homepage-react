import React from 'react';
import { Router, Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
import { mui1theme } from 'config';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { App } from 'modules/App/components';

const Root = ({ history }) => {
    return (
        <Router history={history}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={mui1theme}>
                    <Switch>
                        <Route component={App} />
                    </Switch>
                </ThemeProvider>
            </StyledEngineProvider>
        </Router>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
