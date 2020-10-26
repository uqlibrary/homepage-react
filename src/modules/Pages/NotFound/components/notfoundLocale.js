import React from 'react';

import Grid from '@material-ui/core/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

export default {
    notFound: {
        children: (
            <StandardPage title="Page not found">
                <div className="layout-card" style={{ margin: '-8px auto 16px' }}>
                    <StandardCard noPadding noHeader>
                        <Grid
                            alignItems={'flex-end'}
                            container
                            spacing={1}
                            style={{ paddingTop: 12, paddingRight: 30, paddingBottom: 12, paddingLeft: 30 }}
                        >
                            <Grid item xs={12} md={'auto'} data-testid="notfound" id="notfound">
                                <p>The requested page could not be found.</p>
                                <p>Sorry about that, but here's what you can do next:</p>
                                <ul>
                                    <li>
                                        Try re-typing the address, checking for spelling, capitalisation and/or
                                        punctuation.
                                    </li>
                                    <li>Start again at the home page.</li>
                                    <li>
                                        If you’re sure the page should be at this address, email us at{' '}
                                        <a href="mailto:webmaster@library.uq.edu.au">webmaster@library.uq.edu.au</a>.
                                    </li>
                                </ul>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </div>
            </StandardPage>
        ),
    },
    authenticationRequired: {
        children: (
            <StandardPage title="Authentication required">
                <div className="layout-card" style={{ margin: '-8px auto 16px' }}>
                    <StandardCard noPadding noHeader>
                        <Grid
                            alignItems={'flex-end'}
                            container
                            spacing={1}
                            style={{ paddingTop: 12, paddingRight: 30, paddingBottom: 12, paddingLeft: 30 }}
                        >
                            <Grid
                                data-testid="notfound-authenticate"
                                id="notfound-authenticate"
                                item
                                md={'auto'}
                                xs={12}
                            >
                                <p>The requested page is available to authenticated users only.</p>
                                <p>Please login to continue</p>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </div>
            </StandardPage>
        ),
    },
    permissionDenied: {
        children: (
            <StandardPage title="Permissions denied">
                <div className="layout-card" style={{ margin: '-8px auto 16px' }}>
                    <StandardCard noPadding noHeader>
                        <Grid
                            alignItems={'flex-end'}
                            container
                            spacing={1}
                            style={{ paddingTop: 12, paddingRight: 30, paddingBottom: 12, paddingLeft: 30 }}
                        >
                            <Grid
                                data-testid="notfound-unauthorised"
                                id="notfound-unauthorised"
                                item
                                md={'auto'}
                                xs={12}
                            >
                                <p>The requested page is available to authorised users only.</p>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </div>
            </StandardPage>
        ),
    },
    accountError: {
        children: (
            <StandardPage title="Error">
                <div className="layout-card" style={{ margin: '-8px auto 16px' }}>
                    <StandardCard noPadding noHeader>
                        <Grid
                            alignItems={'flex-end'}
                            container
                            spacing={1}
                            style={{ paddingTop: 12, paddingRight: 30, paddingBottom: 12, paddingLeft: 30 }}
                        >
                            <Grid item xs={12} md={'auto'} data-testid="notfound-error" id="notfound-error">
                                <p>There has been a problem. Please refresh and try again.</p>
                            </Grid>
                        </Grid>
                    </StandardCard>
                </div>
            </StandardPage>
        ),
    },
};
