import React, { useEffect } from 'react';

/**
 * The Art Trail section's entry point.
 *
 * This section carries its own look and feel, so it renders without the shared Library chrome (the header,
 * footer and alerts that App wraps every other route in — see App's standalone-route branch). It is a blank
 * canvas: the epic's pages are built out from here, styled independently of the rest of the site.
 */
export const ArtTrailLanding = () => {
    useEffect(() => {
        document.title = 'Art Trail';
    }, []);

    return (
        <main
            data-testid="art-trail-page"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <h1>Art Trail</h1>
        </main>
    );
};

export default ArtTrailLanding;
