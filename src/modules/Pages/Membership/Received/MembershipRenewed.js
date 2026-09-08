import React, { useEffect } from 'react';

import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { breadcrumbs } from 'config/routes';

import locale from '../membership.locale';

const { renewed, received } = locale;

/**
 * The renewal acknowledgement.
 *
 * Nothing in the application routes here - a renewal is sent to the received page with its id, the same as a
 * fresh application. It is kept because the route exists and links sent out over the years may still point at
 * it.
 */
export const MembershipRenewed = () => {
    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.membership.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.membership.pathname);
    }, []);

    return (
        <StandardPage title={renewed.title}>
            <div data-testid="membership-renewed">
                <Typography variant="h6" component="p">
                    {renewed.thankYou}
                </Typography>
                <Typography sx={{ marginTop: 2 }}>{received.notifiedByEmail}</Typography>
                <Typography sx={{ marginTop: 3 }}>
                    <a href={received.backToHomePage.url}>{received.backToHomePage.label}</a>
                </Typography>
            </div>
        </StandardPage>
    );
};

export default MembershipRenewed;
