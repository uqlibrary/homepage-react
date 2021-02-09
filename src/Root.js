import React from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { Route, Switch } from 'react-router';
import PropTypes from 'prop-types';
// MUI1
import { mui1theme } from 'config';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';
const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: false,
    productionPrefix: 'uq-espace-',
});

// Top level "pages"
import { App } from 'modules/App/components';
import { ScrollToTop } from 'modules/SharedComponents/Toolbox/ScrollToTop';

const Root = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <ScrollToTop>
                <JssProvider generateClassName={generateClassName}>
                    <ThemeProvider theme={mui1theme}>
                        <MuiThemeProvider theme={mui1theme}>
                            <Switch>
                                <Route component={App} />
                            </Switch>
                        </MuiThemeProvider>
                    </ThemeProvider>
                </JssProvider>
            </ScrollToTop>
        </ConnectedRouter>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
