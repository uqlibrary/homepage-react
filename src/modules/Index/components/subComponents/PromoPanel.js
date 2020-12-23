import React from 'react';
import { PropTypes } from 'prop-types';

import { promoPanel as locale } from './promoPanel.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@material-ui/core/Grid';

const PromoPanel = ({ account, accountLoading }) => {
    return !accountLoading ? (
        <StandardCard
            primaryHeader
            fullHeight
            standardCardId="promo-panel"
            title={
                <Grid container>
                    <Grid item xs={10} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {!!account && !!account.id ? locale.loggedin.title : locale.loggedout.title}
                    </Grid>
                </Grid>
            }
        >
            <Grid container spacing={1}>
                <Grid item xs>
                    {!!account && !!account.id ? locale.loggedin.content : locale.loggedout.content}
                </Grid>
            </Grid>
        </StandardCard>
    ) : (
        <div className="promopanel empty" />
    );
};

PromoPanel.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
};

PromoPanel.defaultProps = {};

export default PromoPanel;
