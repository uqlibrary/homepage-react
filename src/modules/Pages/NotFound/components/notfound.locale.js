import React from 'react';

export default {
    notFound: {
        title: 'Page not found',
        urlChangeAdvisory: [
            // when the url path matches this pattern, this content will be displayed
            {
                linkPattern: '/courseresources',
                content: (
                    <div
                        className="layout-card"
                        data-testid="courseresources-in-url"
                        style={{
                            border: 'thin solid black',
                            padding: '1rem',
                            margin: '1rem',
                        }}
                    >
                        <p>
                            <b>
                                This page has permanently moved and is now available at{' '}
                                <a href="/learning-resources">Learning resources</a>.
                            </b>
                        </p>
                    </div>
                ),
            },
        ],
        content: (
            <div className="layout-card" data-testid="page-not-found">
                <p>The requested page could not be found.</p>
                <p>Sorry about that, but here's what you can do next:</p>
                <ul>
                    <li>Try re-typing the address, checking for spelling, capitalisation and/or punctuation.</li>
                    <li>Start again at the home page.</li>
                    <li>
                        If you’re sure the page should be at this address, email us at{' '}
                        <a href="mailto:webmaster@library.uq.edu.au">webmaster@library.uq.edu.au</a>.
                    </li>
                </ul>
            </div>
        ),
    },
    authenticationRequired: {
        title: 'Authentication required',
        children: (
            <div className="layout-card" data-testid="user-not-loggedin">
                <p>The requested page is available to authenticated users only.</p>
                <p>Please login to continue</p>
            </div>
        ),
    },
    permissionDenied: {
        title: 'Permission denied',
        children: (
            <div className="layout-card" data-testid="permission-denied">
                The requested page is available to authorised users only.
            </div>
        ),
    },
    accountError: {
        title: 'Error',
        children: <div className="layout-card">There has been a problem. Please refresh and try again.</div>,
    },
};
