import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

const useStyles = makeStyles(theme => ({
    //
}));

export const DLOConfirmSubscription = ({ actions, dlorUpdatedItem, dlorItemUpdating, dlorUpdatedItemError }) => {
    const { confirmationId } = useParams();
    const classes = useStyles();

    useEffect(() => {
        /* istanbul ignore else */
        if (!!confirmationId) {
            actions.loadDlorSubscriptionConfirmation(confirmationId);
        }
    }, [confirmationId]);

    useEffect(() => {
        console.log('useEffect=', dlorItemUpdating, '; Error=', dlorUpdatedItemError, '; dlorItem=', dlorUpdatedItem);
    }, [dlorItemUpdating, dlorUpdatedItem, dlorUpdatedItemError]);

    if (!!dlorItemUpdating || dlorItemUpdating === null) {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

    if (!!dlorUpdatedItemError) {
        return (
            <StandardPage>
                <StandardCard className={classes.dlorEntry}>
                    <Typography variant="body1" data-testid="dlor-detailpage-error">
                        {dlorUpdatedItemError}
                    </Typography>
                </StandardCard>
            </StandardPage>
        );
    }

    return (
        <StandardPage title="Confirming a subscription to a Digital learning object">
            <StandardCard noHeader>
                <Grid container spacing={1}>
                    <Grid item xs={12} id="masquerade">
                        <Grid container spacing={3} alignItems={'flex-end'} style={{ marginTop: 12 }}>
                            <Grid item xs>
                                words!
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </StandardCard>
        </StandardPage>
    );
};

DLOConfirmSubscription.propTypes = {
    actions: PropTypes.any,
    dlorUpdatedItem: PropTypes.any,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
};

export default React.memo(DLOConfirmSubscription);
