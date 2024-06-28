import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { loadDlorUnsubscribe } from '../../../../data/actions';

export const DLOConfirmUnsubscription = ({ actions, dlorUpdatedItem, dlorItemUpdating, dlorUpdatedItemError }) => {
    const { confirmationId } = useParams();
    console.log('confirmationId=', confirmationId);

    const [checkBoxChecked, setCheckBoxChecked] = React.useState(false);

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!!confirmationId) {
            actions.loadDlorFindObjectDetailsByUnsubscribeId(confirmationId);
        }
    }, [actions, confirmationId]);

    const userConfirms = 'thecheckbox';
    const handleChange = e => {
        setCheckBoxChecked(!!e?.target?.checked);
    };

    const sendRequest = e => {
        console.log('sendRequest', e);
        actions.loadDlorUnsubscribe(confirmationId);
    };

    function pageContents(dlorItemUpdating, dlorUpdatedItemError, dlorUpdatedItem) {
        if (!!dlorItemUpdating || dlorItemUpdating === null) {
            return (
                <div style={{ minHeight: 600 }}>
                    <InlineLoader message="Loading" />
                </div>
            );
        } else if (!!dlorUpdatedItemError) {
            const errorMsg =
                dlorUpdatedItemError === 'The requested page could not be found.'
                    ? "That unsubscribe request doesn't exist - have you already unsubscribed? Otherwise, something has gone wrong."
                    : dlorUpdatedItemError;
            return (
                <Typography
                    variant={'body1'}
                    data-testid="dlor-unsubscribe-error"
                    style={{ display: 'flex', alignItems: 'center', marginBlock: 6 }}
                >
                    <ErrorOutlineIcon style={{ fill: '#d62929', marginRight: 6 }} />
                    <span>{errorMsg}</span>
                </Typography>
            );
        } else if (!!dlorUpdatedItem && dlorUpdatedItem.response === 'ok') {
            // they have sent the actual unsub request
            return (
                <Grid item xs={12}>
                    <Typography variant={'p'} data-testid="dlor-unsubscribe-success">
                        Thank you. You have been unsubscribed from notifications for this title.
                    </Typography>
                </Grid>
            );
        } else {
            // initial load, we should have the object details
            return (
                <>
                    <Grid item xs={12}>
                        <Typography component={'p'} data-testid="dlor-unsubscribe-prompt">
                            Do you wish to unsubscribe from notifications about{' '}
                            <i>{dlorUpdatedItem?.object?.object_title}</i>?
                        </Typography>
                        <FormControlLabel
                            // className={classes.filterSidebarCheckboxControl}
                            control={
                                <Checkbox
                                    onChange={handleChange}
                                    aria-label={'Yes, please unsubscribe me'}
                                    checked={checkBoxChecked}
                                    data-testid="dlor-unsubscribe-checkbox"
                                    value={userConfirms}
                                />
                            }
                            label="Yes, please unsubscribe me"
                        />
                    </Grid>
                    <Grid item xs={2} justifyContent="flex-end">
                        <Button
                            color="primary"
                            data-testid="dlor-unsubscribe-button"
                            variant="contained"
                            children="Unsubscribe"
                            onClick={sendRequest}
                            disabled={checkBoxChecked === false}
                            // className={classes.saveButton}
                        />
                    </Grid>
                </>
            );
        }
    }

    return (
        <StandardPage notitle>
            <StandardCard title="Unsubscribing from your Digital Learning Hub notifications">
                <Grid container>
                    <Grid item xs={12}>
                        {pageContents(dlorItemUpdating, dlorUpdatedItemError, dlorUpdatedItem)}
                    </Grid>
                </Grid>
            </StandardCard>
        </StandardPage>
    );
};
DLOConfirmUnsubscription.propTypes = {
    actions: PropTypes.any,
    dlorUpdatedItem: PropTypes.any,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
};

export default React.memo(DLOConfirmUnsubscription);
