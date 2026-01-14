import React, { useState } from 'react';
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
import LabelPrinterSelector from '../../SharedComponents/LabelPrinter/LabelPrinterSelector';

const MIN_CONTENT_WIDTH = 400;

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
    onPrinterSelectionChange = null,
    printerPreference = null,
    availablePrinters = [],
    shouldDisableUnknownPrinters = false,
}) => {
    const inspectionLocale = inspectLocale.pages.inspect;
    const printerError =
        !!!printerPreference || availablePrinters.findIndex(printer => printer.name === printerPreference) === -1;

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

    const _onPrinterSelectionChange = (event, newValue) => {
        onPrinterSelectionChange?.(newValue.name);
    };

    return (
        <Dialog style={{ padding: 6 }} open={isOpen} data-testid={`dialogbox-${inspectionSuccessPrintDialogId}`}>
            <DialogTitle data-testid="message-title">{locale.confirmationTitle}</DialogTitle>
            <DialogContent style={{ maxWidth: !noMinContentWidth ? MIN_CONTENT_WIDTH : 'auto' }}>
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
                        value={printerPreference}
                        onChange={_onPrinterSelectionChange}
                        disableUnknownPrinters={shouldDisableUnknownPrinters}
                        locale={inspectionLocale.labelPrinting}
                        error={printerError}
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
    onPrinterSelectionChange: PropTypes.func,
    printerPreference: PropTypes.string,
    availablePrinters: PropTypes.array,
    shouldDisableUnknownPrinters: PropTypes.bool,
};

export default React.memo(InspectionSuccessPrintDialog);
