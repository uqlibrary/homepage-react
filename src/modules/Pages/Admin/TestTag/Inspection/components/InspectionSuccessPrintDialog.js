import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';
import LabelPrinterSelector from '../../SharedComponents/LabelPrinter/LabelPrinterSelector';

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
    disableButtonsWhenBusy = true,
    isBusy = false,
    onPrint = null,
    onClose = null,
    onPrinterSelectionChange = null,
    printerPreference = null,
    availablePrinters = [],
    shouldDisableUnknownPrinters = false,
    forcePrinterSelection = false,
}) => {
    console.log('InspectionSuccessPrintDialog Rendered with props:', availablePrinters, forcePrinterSelection);
    const _onPrint = () => {
        console.log('Print button clicked');
        onPrint?.();
    };

    const _onCloseAction = () => {
        onClose?.();
    };

    const _onPrinterSelectionChange = (event, newValue) => {
        console.log('Printer selection changed:', newValue.name);
        onPrinterSelectionChange?.(newValue.name);
    };

    return (
        <Dialog style={{ padding: 6 }} open={isOpen} data-testid={`dialogbox-${inspectionSuccessPrintDialogId}`}>
            <DialogTitle data-testid="message-title">{locale.confirmationTitle}</DialogTitle>
            <DialogContent style={{ minWidth: !noMinContentWidth ? 400 : 'auto' }}>
                <DialogContentText data-testid="message-content" component="div">
                    {locale.confirmationMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1} justifyContent="space-between">
                    <Hidden smDown>
                        <Grid item xs />
                    </Hidden>

                    <Grid item xs={12} sm={'auto'}>
                        <StyledPrimaryButton
                            children={locale.confirmButtonLabel}
                            fullWidth
                            onClick={_onCloseAction}
                            id="confirm-action"
                            data-testid={`confirm-${inspectionSuccessPrintDialogId}`}
                            disabled={disableButtonsWhenBusy && isBusy}
                        />
                    </Grid>

                    <Grid item xs={12} sm={'auto'}>
                        <StyledSecondaryButton
                            variant={'contained'}
                            fullWidth
                            onClick={_onPrint}
                            id="confirm-alternate-action"
                            data-testid={`confirm-alternate-${inspectionSuccessPrintDialogId}`}
                            disabled={forcePrinterSelection || (disableButtonsWhenBusy && isBusy)}
                        >
                            Print Tag
                        </StyledSecondaryButton>
                    </Grid>
                </Grid>
            </DialogActions>
            <Accordion {...(forcePrinterSelection && { expanded: true })}>
                <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="printer-selector-content"
                    id="printerSelectorContainer"
                >
                    <Typography>Label Printer Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <LabelPrinterSelector
                        id={inspectionSuccessPrintDialogId}
                        list={availablePrinters}
                        value={printerPreference}
                        onChange={_onPrinterSelectionChange}
                        disableUnknownPrinters={shouldDisableUnknownPrinters}
                    />
                </AccordionDetails>
            </Accordion>
        </Dialog>
    );
};

InspectionSuccessPrintDialog.propTypes = {
    inspectionSuccessPrintDialogId: PropTypes.string.isRequired,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    InputForm: PropTypes.func,
    isOpen: PropTypes.bool,
    locale: PropTypes.object,
    inspectionLocale: PropTypes.object,
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
    printerPreference: PropTypes.string,
    availablePrinters: PropTypes.array,
    onPrint: PropTypes.func,
    onClose: PropTypes.func,
    onPrinterSelectionChange: PropTypes.func,
    shouldDisableUnknownPrinters: PropTypes.bool,
    forcePrinterSelection: PropTypes.bool,
};

export default React.memo(InspectionSuccessPrintDialog);
