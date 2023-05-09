import React from 'react';
import { PropTypes } from 'prop-types';
import parse from 'html-react-parser';
import { promoPanel as locale } from './promoPanel.locale';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import PromoPanelLoader from 'modules/Pages/Admin/PromoPanel/PromoPanelLoader';
const PromoPanel = ({
    useAPI,
    account,
    accountLoading,
    currentPromoPanel,
    promoPanelActionError,
    promoPanelLoading,
}) => {
    function getContent(panelRawContent) {
        // add a data-analyticsid entry to any links for the current user's promo panel
        const anchorList = document.querySelectorAll('#promo-panel a');
        anchorList.forEach(anchor => {
            const href = !!anchor?.href && new URL(anchor.href);
            const host = !!href?.hostname ? href.hostname : /* istanbul ignore next */ '';
            if (!anchor.hasAttribute('data-analyticsid')) {
                anchor.setAttribute('data-analyticsid', `promo-panel-link-${host}`);
            }
        });
        return parse(panelRawContent);
    }

    return accountLoading === false && promoPanelLoading === false ? (
        <StandardCard
            primaryHeader
            fullHeight
            standardCardId="promo-panel"
            title={
                <Grid container>
                    <Grid item xs={10} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {!!useAPI &&
                            !promoPanelActionError &&
                            currentPromoPanel &&
                            currentPromoPanel.active_panel.panel_title}
                        {!useAPI && (!!account && !!account.id ? locale.loggedin.title : locale.loggedout.title)}
                        {!!useAPI && !!promoPanelActionError && locale.apiError.title}
                    </Grid>
                </Grid>
            }
        >
            <Grid container spacing={1}>
                <Grid item xs data-testid={!useAPI || !!promoPanelActionError ? 'panel-fallback-content' : null}>
                    {!!useAPI &&
                        !promoPanelActionError &&
                        currentPromoPanel &&
                        getContent(currentPromoPanel.active_panel.panel_content)}
                    {!useAPI && (!!account && !!account.id ? locale.loggedin.content : locale.loggedout.content)}
                    {!!useAPI && !!promoPanelActionError && locale.apiError.content}
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
    useAPI: PropTypes.bool,
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    currentPromoPanel: PropTypes.object,
    promoPanelActionError: PropTypes.string,
    promoPanelLoading: PropTypes.bool,
};

PromoPanel.defaultProps = {};

export default PromoPanel;
