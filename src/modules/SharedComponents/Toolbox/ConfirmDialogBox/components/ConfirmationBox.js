import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import { StyledPrimaryButton, StyledSecondaryButton, StyledTertiaryButton } from 'helpers/general';

export const ConfirmationBox = ({
    actionButtonVariant,
    confirmationBoxId,
    InputForm,
    hideActionButton = false,
    hideCancelButton = false,
    isOpen = false,
    locale = {
        confirmationTitle: 'Confirmation',
        confirmationMessage: 'Are you sure?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
        alternateActionButtonLabel: 'Cancel',
    },
    onAction,
    onAlternateAction,
    onCancelAction,
    onClose,
    showAlternateActionButton = false,
    showInputForm = false,
    showAdditionalInformation = false,
    additionalInformation = null,
    noMinContentWidth = false,
    disableButtonsWhenBusy = false,
    isBusy = false,
    actionProps = {},
    altActionProps = {},
    cancelProps = {},
}) => {
    const _onAction = () => {
        onClose?.();
        onAction?.(actionProps);
    };

    const _onCancelAction = () => {
        onClose?.();
        onCancelAction?.(cancelProps);
    };

    const _onAlternateAction = () => {
        onClose?.();
        onAlternateAction?.(altActionProps);
    };
    return (
        <Dialog style={{ padding: 6 }} open={isOpen} data-testid={`dialogbox-${confirmationBoxId}`}>
            <DialogTitle data-testid="message-title">{locale.confirmationTitle}</DialogTitle>
            <DialogContent style={{ minWidth: !noMinContentWidth ? 400 : 'auto' }}>
                <DialogContentText data-testid="message-content" component="div">
                    {locale.confirmationMessage}
                </DialogContentText>
                {!!showAdditionalInformation && !!additionalInformation && (
                    <DialogContentText data-testid="message-content-additional">
                        <strong>Info: </strong>
                        {additionalInformation}
                    </DialogContentText>
                )}

                {!!showInputForm && /* istanbul ignore next */ <InputForm />}
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1} sx={{ justifyContent: 'space-between' }}>
                    <Hidden smDown>
                        <Grid item xs />
                    </Hidden>
                    {!hideActionButton && (
                        <Grid item xs={12} sm={'auto'}>
                            <StyledPrimaryButton
                                {...(!!actionButtonVariant ? { variant: actionButtonVariant } : {})}
                                children={locale.confirmButtonLabel}
                                autoFocus
                                fullWidth
                                onClick={_onAction}
                                id="confirm-action"
                                data-testid={`confirm-${confirmationBoxId}`}
                                disabled={disableButtonsWhenBusy && isBusy}
                            />
                        </Grid>
                    )}
                    {showAlternateActionButton && (
                        // an optional middle button that will display in a warning colour
                        <Grid item xs={12} sm={'auto'}>
                            <StyledTertiaryButton
                                variant={'contained'}
                                children={locale.alternateActionButtonLabel}
                                fullWidth
                                onClick={_onAlternateAction}
                                id="confirm-alternate-action"
                                data-testid={`confirm-alternate-${confirmationBoxId}`}
                                disabled={disableButtonsWhenBusy && isBusy}
                            />
                        </Grid>
                    )}
                    {!hideCancelButton && (
                        <Grid item xs={12} sm={'auto'}>
                            <StyledSecondaryButton
                                variant={'contained'}
                                children={locale.cancelButtonLabel}
                                fullWidth
                                onClick={_onCancelAction}
                                id="confirm-cancel-action"
                                data-testid={`cancel-${confirmationBoxId}`}
                                disabled={disableButtonsWhenBusy && isBusy}
                            />
                        </Grid>
                    )}
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

ConfirmationBox.propTypes = {
    actionButtonVariant: PropTypes.string,
    confirmationBoxId: PropTypes.string.isRequired,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    InputForm: PropTypes.func,
    isOpen: PropTypes.bool,
    locale: PropTypes.object,
    onAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onAlternateAction: PropTypes.func,
    onClose: PropTypes.func,
    showAlternateActionButton: PropTypes.bool,
    showInputForm: PropTypes.bool,
    additionalInformation: PropTypes.string,
    showAdditionalInformation: PropTypes.bool,
    noMinContentWidth: PropTypes.bool,
    actionProps: PropTypes.object,
    altActionProps: PropTypes.object,
    cancelProps: PropTypes.object,
    disableButtonsWhenBusy: PropTypes.bool,
    isBusy: PropTypes.bool,
};

export default React.memo(ConfirmationBox);
