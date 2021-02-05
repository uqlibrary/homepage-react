import React from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
import { mui1theme } from 'config';
import { ThemeProvider } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';
const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: false,
    productionPrefix: 'uq-lib-',
});

import { App } from 'modules/App';

const Root = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <JssProvider generateClassName={generateClassName}>
                <ThemeProvider theme={mui1theme}>
                    <Switch>
                        <Route component={App} />
                    </Switch>
                </ThemeProvider>
            </JssProvider>
        </ConnectedRouter>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
