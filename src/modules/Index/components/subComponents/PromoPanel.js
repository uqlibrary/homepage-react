import React from 'react';
import { PropTypes } from 'prop-types';
import parse from 'html-react-parser';
import { promoPanel as locale } from './promoPanel.locale';
import * as Sentry from '@sentry/browser';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@material-ui/core/Grid';
import PromoPanelLoader from 'modules/Pages/Admin/PromoPanel/PromoPanelLoader';

export const reportToSentry = ([error, context = {}]) =>
    Sentry.withScope(scope => {
        scope.setExtras(context.extra);
        Sentry.captureException(error);
    });

const PromoPanel = ({ account, accountLoading, currentPromoPanel, promoPanelActionError, promoPanelLoading }) => {
    if (!!promoPanelActionError) {
        reportToSentry([
            new Error('Promo Panel API failed to load panel.'),
            {
                extra: {
                    message: 'PromoPanel Action load error',
                    panelError: promoPanelActionError,
                },
            },
        ]);
    }

    return accountLoading === false && promoPanelLoading === false ? (
        <StandardCard
            primaryHeader
            fullHeight
            standardCardId="promo-panel"
            title={
                <Grid container>
                    <Grid item xs={10} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {!!!promoPanelActionError && currentPromoPanel && currentPromoPanel.active_panel.panel_title}
                        {!!promoPanelActionError &&
                            (!!account && !!account.id ? locale.loggedin.title : locale.loggedout.title)}
                    </Grid>
                </Grid>
            }
        >
            <Grid container spacing={1}>
                <Grid item xs data-testid={!!promoPanelActionError ? 'panel-fallback-content' : null}>
                    {!!!promoPanelActionError &&
                        currentPromoPanel &&
                        parse(currentPromoPanel.active_panel.panel_content)}
                    {!!promoPanelActionError &&
                        (!!account && !!account.id ? locale.loggedin.content : locale.loggedout.content)}
                </Grid>
            </Grid>
        </StandardCard>
    ) : (
        <div className="promopanel empty">
            <PromoPanelLoader />
        </div>
    );
};

PromoPanel.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    currentPromoPanel: PropTypes.object,
    promoPanelActionError: PropTypes.string,
    promoPanelLoading: PropTypes.bool,
};

PromoPanel.defaultProps = {};

export default PromoPanel;
