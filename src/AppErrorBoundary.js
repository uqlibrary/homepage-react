import React from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';

class AppErrorBoundary extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    componentDidMount() {
        if (process.env.ENABLE_LOG) {
            Raven.config('https://88702b1b71434522871473c7e2490ed8@o136426.ingest.sentry.io/5379235', {
                environment: process.env.BRANCH,
                release: process.env.GIT_SHA,
                whitelistUrls: [/library\.uq\.edu\.au/],
                ignoreErrors: [
                    'Object Not Found Matching Id',
                    'Non-Error exception captured',
                    'Non-Error promise rejection captured',
                ],
            }).install();
        }
    }

    componentDidCatch(error, errorInfo) {
        if (process.env.ENABLE_LOG) Raven.captureException(error, { extra: errorInfo });
    }

    render() {
        return this.props.children;
    }
}

export default AppErrorBoundary;
