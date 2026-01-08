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

// HERE, UPDATE THIS TO BE PRINTER SPECIFIC. ADD IN LOGIC, USE LABELPRINTERSELECTOR ETC
export const InspectionSuccessPrintDialog = ({
    inspectionSuccessPrintDialogId,
    isOpen = false,
    locale = {
        confirmationTitle: 'Confirmation',
        confirmationMessage: 'Are you sure?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
        alternateActionButtonLabel: 'Cancel',
    },
    noMinContentWidth = true,
    disableButtonsWhenBusy = false,
    isBusy = false,
    actionProps = {},
    altActionProps = {},
    cancelProps = {},
    autoFocusPrimaryButton = false,
    onPrint = null,
    onClose = null,
    printer = null,
    onPrinterSelectionChange = null,
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
        <Dialog style={{ padding: 6 }} open={isOpen} data-testid={`dialogbox-${inspectionSuccessPrintDialogId}`}>
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
                <Grid container spacing={1} justifyContent="space-between">
                    <Hidden smDown>
                        <Grid item xs />
                    </Hidden>
                    {!hideActionButton && (
                        <Grid item xs={12} sm={'auto'}>
                            <StyledPrimaryButton
                                children={locale.confirmButtonLabel}
                                autoFocus={!!autoFocusPrimaryButton}
                                fullWidth
                                onClick={_onAction}
                                id="confirm-action"
                                data-testid={`confirm-${inspectionSuccessPrintDialogId}`}
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
                                data-testid={`confirm-alternate-${inspectionSuccessPrintDialogId}`}
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
                                data-testid={`cancel-${inspectionSuccessPrintDialogId}`}
                                disabled={disableButtonsWhenBusy && isBusy}
                            />
                        </Grid>
                    )}
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

InspectionSuccessPrintDialog.propTypes = {
    InspectionSuccessPrintDialogId: PropTypes.string.isRequired,
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
    autoFocusPrimaryButton: PropTypes.bool,
};

export default React.memo(InspectionSuccessPrintDialog);
