import React from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

class AppErrorBoundary extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    };

    componentDidMount() {
        if (
            process.env.ENABLE_LOG &&
            process.env.SENTRY_AUTH_TOKEN &&
            process.env.SENTRY_ORG &&
            process.env.SENTRY_PROJECT
        ) {
            Sentry.init({
                dsn: `https://${process.env.SENTRY_AUTH_TOKEN}@${process.env.SENTRY_ORG}.ingest.sentry.io/${process.env.SENTRY_PROJECT}`,
                integrations: [new Integrations.BrowserTracing()],

                // We recommend adjusting this value in production, or using tracesSampler
                // for finer control
                tracesSampleRate: 1.0,

                environment: process.env.BRANCH || 'branch undefined',
                release: process.env.GIT_SHA || 'release undefined',
                whitelistUrls: [/library\.uq\.edu\.au/], // no mention in current doc, may not work
            });
        }
    }

    componentDidCatch(error, errorInfo) {
        if (process.env.ENABLE_LOG) Raven.captureException(error, errorInfo);
    }

    render() {
        return this.props.children;
    }
}

export default AppErrorBoundary;
