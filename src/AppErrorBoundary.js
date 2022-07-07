import React from 'react';
import PropTypes from 'prop-types';
// import Raven from 'raven-js';

import * as Sentry from '@sentry/browser';
// import { BrowserTracing } from '@sentry/tracing';

class AppErrorBoundary extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    componentDidMount() {
        if (process.env.ENABLE_LOG) {
            // Raven.config('https://88702b1b71434522871473c7e2490ed8@o136426.ingest.sentry.io/5379235', {
            //     environment: process.env.BRANCH,
            //     release: process.env.GIT_SHA,
            //     whitelistUrls: [/library\.uq\.edu\.au/],
            //     ignoreErrors: [
            //         'Object Not Found Matching Id',
            //         'Non-Error exception captured',
            //         'Non-Error promise rejection captured',
            //     ],
            // }).install();
            Sentry.init({
                dsn: 'https://88702b1b71434522871473c7e2490ed8@o136426.ingest.sentry.io/5379235',
                environment: process.env.BRNCH,
                release: process.env.GIT_SHA,
                whitelistUrls: [/library\.uq\.edu\.au/],
                ignoreErrors: [
                    'Object Not Found Matching Id',
                    'Non-Error exception captured',
                    'Non-Error promise rejection captured',
                ],
            });
        }
    }

    componentDidCatch(error, errorInfo) {
        if (process.env.ENABLE_LOG) {
            // Raven.captureException(error, { extra: errorInfo });
            Sentry.withScope(scope => {
                Object.keys(errorInfo).forEach(key => scope.setExtra(key, errorInfo[key]));
                Sentry.captureException(error);
            });
        }
    }

    render() {
        return this.props.children;
    }
}

export default AppErrorBoundary;
