import React from 'react';
import { PropTypes } from 'prop-types';
import parse from 'html-react-parser';
import { promoPanel as locale } from './promoPanel.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@material-ui/core/Grid';
import PromoPanelLoader from 'modules/Pages/Admin/PromoPanel/PromoPanelLoader';

const PromoPanel = ({ account, accountLoading, currentPromoPanel, promoPanelActionError }) => {
    return accountLoading === false ? (
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
                <Grid item xs>
                    {console.log('Current Promo panel', currentPromoPanel)}
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
};

PromoPanel.defaultProps = {};

export default PromoPanel;
