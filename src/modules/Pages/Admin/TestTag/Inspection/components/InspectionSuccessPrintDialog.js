import React, { useState, useMemo } from 'react';
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

import inspectLocale from 'modules/Pages/Admin/TestTag/testTag.locale';

import { StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';
import { LabelPrinterSelector, LabelPrinterTemplateSelector } from '../../SharedComponents/LabelPrinter';

const MIN_CONTENT_WIDTH = 400;

export const hasPrinterError = (printerPreference, availablePrinters = []) => {
    return (
        !!!printerPreference ||
        availablePrinters?.length === 0 ||
        availablePrinters?.every(printer => !!!printer?.name) ||
        availablePrinters?.findIndex(printer => printer?.name === printerPreference?.name) === -1
    );
};

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
    noMinContentWidth = false,
    disableButtonsWhenBusy = true,
    isBusy = false,
    onPrint = null,
    onClose = null,
    onPrinterTemplateSelectionChange = null,
    printerPreference = null,
    availablePrinters = [],
    availableTemplates = [],
}) => {
    const inspectionLocale = inspectLocale.pages.inspect;
    const [selectedPrinter, setSelectedPrinter] = useState(printerPreference);
    const printerError = useMemo(() => hasPrinterError(selectedPrinter, availablePrinters), [
        selectedPrinter,
        availablePrinters,
    ]);
    // here - templates arent populating when printer selected
    // due to us not passing the selcted printed back up the chain now.
    // probs should do that and see what happens
    console.log(selectedPrinter, availablePrinters, printerError, availableTemplates);
    const [expanded, setExpanded] = useState(false);

    const handleExpand = (event, isExpanded) => {
        setExpanded(isExpanded);
    };

    const _onPrint = () => {
        onPrint?.();
    };

    const _onCloseAction = () => {
        onClose?.();
    };

    const onPrinterSelectionChange = (event, newValue) => {
        console.log(newValue);
        setSelectedPrinter(newValue);
    };
    const _onPrinterTemplateSelectionChange = (event, newValue) => {
        onPrinterTemplateSelectionChange?.({ ...selectedPrinter, templateId: newValue });
    };

    return (
        <Dialog style={{ padding: 6 }} open={isOpen} data-testid={`dialogbox-${inspectionSuccessPrintDialogId}`}>
            <DialogTitle data-testid="message-title">{locale.confirmationTitle}</DialogTitle>
            <DialogContent style={{ minWidth: !noMinContentWidth ? MIN_CONTENT_WIDTH : 'auto' }}>
                <DialogContentText data-testid="message-content" component="div">
                    {locale.confirmationMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1} padding={2} justifyContent="space-between">
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
                            onClick={_onPrint}
                            fullWidth
                            id="confirm-alternate-action"
                            data-testid={`confirm-alternate-${inspectionSuccessPrintDialogId}`}
                            disabled={printerError || (disableButtonsWhenBusy && isBusy)}
                        >
                            {inspectionLocale.labelPrinting.printButton}
                        </StyledSecondaryButton>
                    </Grid>
                </Grid>
            </DialogActions>

            <Accordion expanded={printerError || expanded} onChange={handleExpand}>
                <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="printer-selector-content"
                    id="printerSelectorContainer"
                >
                    <Typography sx={{ color: theme => (printerError ? theme.palette.error.main : 'inherit') }}>
                        {inspectionLocale.labelPrinting.selectPrinter}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <LabelPrinterSelector
                        id={inspectionSuccessPrintDialogId}
                        list={availablePrinters}
                        value={selectedPrinter?.name}
                        onChange={onPrinterSelectionChange}
                        locale={inspectionLocale.labelPrinting}
                        error={printerError}
                    />
                    <LabelPrinterTemplateSelector
                        id={inspectionSuccessPrintDialogId}
                        list={availableTemplates}
                        value={selectedPrinter}
                        onChange={_onPrinterTemplateSelectionChange}
                        disabled={printerError || !!!selectedPrinter?.templateId}
                    />
                </AccordionDetails>
            </Accordion>
        </Dialog>
    );
};

InspectionSuccessPrintDialog.propTypes = {
    inspectionSuccessPrintDialogId: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    locale: PropTypes.object,
    noMinContentWidth: PropTypes.bool,
    disableButtonsWhenBusy: PropTypes.bool,
    isBusy: PropTypes.bool,
    onPrint: PropTypes.func,
    onClose: PropTypes.func,
    onPrinterTemplateSelectionChange: PropTypes.func,
    printerPreference: PropTypes.object,
    availablePrinters: PropTypes.array,
    availableTemplates: PropTypes.array,
};

export default React.memo(InspectionSuccessPrintDialog);
