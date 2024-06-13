import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { getDlorViewPageUrl } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

const useStyles = makeStyles(theme => ({
    //
}));

// http://localhost:2020/digital-learning-hub/confirm/wrong_data
// http://localhost:2020/digital-learning-hub/confirm/a_conf_code_that_is_not_known
// http://localhost:2020/digital-learning-hub/confirm/a_known_conf_code_that_has_expired
// http://localhost:2020/digital-learning-hub/confirm/a_conf_code_that_is_known

export const DLOConfirmSubscription = ({ actions, dlorUpdatedItem, dlorItemUpdating, dlorUpdatedItemError }) => {
    console.log('Updating=', dlorItemUpdating, '; Error=', dlorUpdatedItemError, '; dlorItem=', dlorUpdatedItem);
    const { confirmationId } = useParams();
    const classes = useStyles();

    useEffect(() => {
        /* istanbul ignore else */
        if (!!confirmationId) {
            actions.loadDlorSubscriptionConfirmation(confirmationId);
        }
    }, [confirmationId]);

    if (!!dlorItemUpdating || dlorItemUpdating === null) {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

    if (!!dlorUpdatedItemError || !['ok', 'expired', 'missing'].includes(dlorUpdatedItem?.response)) {
        return (
            <StandardPage>
                <StandardCard title="Confirming a Digital Object subscription">
                    <Typography variant={'body1'} data-testid="dlor-detailpage-error">
                        {!!dlorUpdatedItemError
                            ? dlorUpdatedItemError
                            : 'Something seems to have gone wrong - please check your email and try again.'}
                    </Typography>
                </StandardCard>
            </StandardPage>
        );
    }

    function pageContents(dlorItemUpdating, dlorUpdatedItemError, dlorUpdatedItem) {
        let response = <p>Sorry, something went wrong with your request. Please try again later.</p>;
        if (dlorUpdatedItem.response === 'ok') {
            response = (
                <>
                    <Typography component={'p'}>Thank you for subscribing!</Typography>
                    <Typography component={'p'}>
                        Your subscription has been confirmed and you will receive any notable updates by email.
                    </Typography>
                    <ul>
                        <li>
                            Visit{' '}
                            <a href={getDlorViewPageUrl(dlorUpdatedItem.object_public_uuid)}>
                                {dlorUpdatedItem.object_title}
                            </a>{' '}
                            now.
                        </li>
                    </ul>
                </>
            );
        } else if (dlorUpdatedItem.response === 'expired') {
            response = (
                <>
                    <Typography component={'p'}>Thank you for subscribing!</Typography>
                    <Typography component={'p'}>
                        Unfortunately, your confirmation period expired before you were able to visit this link.
                    </Typography>
                    <Typography component={'p'}>
                        Visit{' '}
                        <a href={getDlorViewPageUrl(dlorUpdatedItem.object_public_uuid)}>
                            {dlorUpdatedItem.object_title}
                        </a>{' '}
                        to try again
                    </Typography>
                </>
            );
        } else {
            //  dlorUpdatedItem.response === 'missing':
            response = (
                <>
                    <Typography component={'p'}>
                        Thank you for your interest in subscribing to our Digital Learning Objects!
                    </Typography>
                    <Typography component={'p'}>
                        Unfortunately, your confirmation code isn't one that is currently available.
                    </Typography>
                    <Typography component={'p'}>Please check your email and try again.</Typography>
                </>
            );
        }
        return response;
    }

    return (
        <StandardPage notitle>
            <StandardCard title="Confirming a Digital Object subscription">
                <Grid container spacing={1}>
                    <Grid item xs={12} id="masquerade">
                        <Grid container spacing={3} alignItems={'flex-end'} style={{ marginTop: 12 }}>
                            <Grid item xs>
                                {pageContents(dlorItemUpdating, dlorUpdatedItemError, dlorUpdatedItem)}
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
