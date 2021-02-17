import React from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
// MUI1
import { mui1theme } from 'config';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';
const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: false,
    productionPrefix: 'uq-espace-',
});

import OffSiteApp from 'modules/OffSiteApp/container/OffSiteApp';

const OffSiteRoot = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <JssProvider generateClassName={generateClassName}>
                <MuiThemeProvider theme={mui1theme}>
                    <Switch>
                        <Route component={OffSiteApp} />
                    </Switch>
                </MuiThemeProvider>
            </JssProvider>
        </ConnectedRouter>
    );
};

OffSiteRoot.propTypes = {
    history: PropTypes.object,
};

export default OffSiteRoot;
