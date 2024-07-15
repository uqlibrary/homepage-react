import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { getDlorViewPageUrl, getPathRoot } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

const StyledInstructionList = styled('ul')(() => ({
    marginTop: 0,
}));

export const DLOConfirmSubscription = ({ actions, dlorUpdatedItem, dlorItemUpdating, dlorUpdatedItemError }) => {
    const { confirmationId } = useParams();

    useEffect(() => {
        /* istanbul ignore else */
        if (!!confirmationId) {
            actions.loadDlorSubscriptionConfirmation(confirmationId);
        }
    }, [actions, confirmationId]);

    function pageContents(dlorItemUpdating, dlorUpdatedItemError, dlorUpdatedItem) {
        if (!!dlorItemUpdating || dlorItemUpdating === null) {
            return (
                <Box sx={{ minHeight: '600px' }}>
                    <InlineLoader message="Loading" />
                </Box>
            );
        } else if (!!dlorUpdatedItemError) {
            return (
                <Typography
                    variant={'body1'}
                    data-testid="dlor-confirm-error"
                    sx={{ display: 'flex', alignItems: 'center', marginBlock: '6px' }}
                >
                    <ErrorOutlineIcon sx={{ fill: '#d62929', marginRight: '6px' }} />
                    <span>{dlorUpdatedItemError}</span>
                </Typography>
            );
        } else if (dlorUpdatedItem.response === 'ok') {
            return (
                <>
                    <Typography component={'p'} data-testid="dlor-confirm-line-1">
                        Thank you for your interest in following <b>{dlorUpdatedItem.object_title}</b>.
                    </Typography>
                    <Typography component={'p'} data-testid="dlor-confirm-line-2">
                        Your request has been confirmed. We will send an email when we update the object.
                    </Typography>
                    <ul>
                        <li data-testid="dlor-confirm-line-3">
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
            return (
                <>
                    <Typography component={'p'} data-testid="dlor-confirm-line-1">
                        Thank you for your interest in following <b>{dlorUpdatedItem.object_title}</b>.
                    </Typography>
                    <Typography component={'p'} data-testid="dlor-confirm-line-2">
                        Unfortunately, your confirmation period expired before you were able to visit this link.
                    </Typography>

                    <ul>
                        <li data-testid="dlor-confirm-line-3">
                            Visit{' '}
                            <a href={getDlorViewPageUrl(dlorUpdatedItem.object_public_uuid)}>
                                {dlorUpdatedItem.object_title}
                            </a>{' '}
                            to try again.
                        </li>
                    </ul>
                </>
            );
        } else if (dlorUpdatedItem.response === 'used') {
            return (
                <>
                    <Typography component={'p'} data-testid="dlor-confirm-line-1">
                        Thank you for your interest in following <b>{dlorUpdatedItem.object_title}</b>.
                    </Typography>
                    <Typography component={'p'} data-testid="dlor-confirm-line-2">
                        You have already confirmed this notification request.
                    </Typography>
                    <ul>
                        <li data-testid="dlor-confirm-line-3">
                            Visit{' '}
                            <a href={getDlorViewPageUrl(dlorUpdatedItem.object_public_uuid)}>
                                {dlorUpdatedItem.object_title}
                            </a>{' '}
                            now.
                        </li>
                    </ul>
                </>
            );
        } else if (!['ok', 'expired', 'missing', 'used'].includes(dlorUpdatedItem?.response)) {
            return (
                <Typography
                    variant={'body1'}
                    data-testid="dlor-confirm-error"
                    sx={{ display: 'flex', alignItems: 'center', marginBlock: '6px' }}
                >
                    <ErrorOutlineIcon sx={{ fill: '#d62929', marginRight: '6px' }} />
                    <span>Something seems to have gone wrong - please check your email and try again.</span>
                </Typography>
            );
        } else {
            // specifically dlorUpdatedItem.response === 'missing', which should cover all other 200 response cases
            return (
                <>
                    <Typography component={'p'} data-testid="dlor-confirm-line-1">
                        Thank you for your interest in our Digital learning hub.
                    </Typography>
                    <Typography
                        component={'p'}
                        data-testid="dlor-confirm-line-2"
                        sx={{ display: 'flex', alignItems: 'center', marginBlock: '6px' }}
                    >
                        <ErrorOutlineIcon sx={{ fill: '#d62929', marginRight: '6px' }} />
                        <span>Unfortunately, your confirmation code isn't one that is currently available.</span>
                    </Typography>
                    <Typography component={'p'} data-testid="dlor-confirm-line-3">
                        You could:
                    </Typography>
                    <StyledInstructionList sx={{ marginTop: 0 }}>
                        <li data-testid="dlor-confirm-line-3">check your email and try again</li>
                        <li data-testid="dlor-confirm-line-3">
                            visit <a href={`${getPathRoot()}/digital-learning-hub`}>our Digital learning hub</a> to view
                            available objects.
                        </li>
                    </StyledInstructionList>
                </>
            );
        }
    }

    return (
        <StandardPage notitle>
            <StandardCard title="Confirming your Digital Learning Hub notification request">
                <Grid container>
                    <Grid item xs={12}>
                        {pageContents(dlorItemUpdating, dlorUpdatedItemError, dlorUpdatedItem)}
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
