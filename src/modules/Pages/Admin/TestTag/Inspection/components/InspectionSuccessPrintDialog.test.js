/* eslint-disable react/prop-types */
import React from 'react';

import { rtlRender, fireEvent, screen, selectOptionFromListByIndex } from 'test-utils';
import InspectionSuccessPrintDialog from './InspectionSuccessPrintDialog';
import inspectLocale from 'modules/Pages/Admin/TestTag/testTag.locale';

function setup(testProps = {}, renderer = rtlRender) {
    const defaultLocale = {
        confirmationTitle: 'Test Title',
        confirmationMessage: 'Test Message',
        cancelButtonLabel: 'Cancel',
        confirmButtonLabel: 'Confirm',
        alternateActionButtonLabel: 'Alternate',
    };

    const availablePrinters = [{ name: 'Printer1' }, { name: 'Printer2' }, { name: 'Printer3' }];
    const templateStore = [
        { id: 1, name: 'Template1', printers: ['Printer1', 'Printer2'] },
        { id: 2, name: 'Template2', printers: ['Printer2', 'Printer3'] },
        { id: 3, name: 'Template3', printers: ['Printer1'] },
    ];
    const defaultProps = {
        inspectionSuccessPrintDialogId: 'test',
        isOpen: true,
        locale: defaultLocale,
        availablePrinters,
        templateStore,
        printerPreference: { name: 'Printer1', shortName: 'Printer1', templateId: 1 },
        onPrint: jest.fn(),
        onClose: jest.fn(),
        onPrinterTemplateSelectionChange: jest.fn(),
        ...testProps,
    };

    return renderer(<InspectionSuccessPrintDialog {...defaultProps} />);
}

describe('InspectionSuccessPrintDialog', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const expandPrinterAccordion = () => {
        const accordionButton = screen.getByRole('button', { name: /Label printing/i });
        expect(accordionButton).toBeInTheDocument();

        // Click to expand - accordion content should become visible
        fireEvent.click(accordionButton);
        expect(screen.getByTestId('label_printer_selector-test-input')).toBeVisible();
    };

    it('renders the dialog when open', () => {
        const { getByTestId } = setup();

        expect(getByTestId('dialogbox-test')).toBeInTheDocument();
        expect(getByTestId('message-title')).toHaveTextContent('Test Title');
        expect(getByTestId('message-content')).toHaveTextContent('Test Message');
        expect(getByTestId('confirm-test')).toHaveTextContent('Confirm');
        expect(getByTestId('confirm-alternate-test')).toHaveTextContent(
            inspectLocale.pages.inspect.labelPrinting.printButton,
        );

        const dialogContent = getByTestId('message-content').parentElement;
        expect(dialogContent).toHaveStyle({ minWidth: '400px' });
    });

    it('renders with default locale when not provided', () => {
        const { getByTestId } = setup({ locale: undefined });

        expect(getByTestId('message-title')).toHaveTextContent('Confirmation');
        expect(getByTestId('message-content')).toHaveTextContent('Are you sure?');
    });

    it('calls onClose when confirm button is clicked', () => {
        const onClose = jest.fn();
        const { getByTestId } = setup({ onClose });

        fireEvent.click(getByTestId('confirm-test'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onPrint when print button is clicked', () => {
        const onPrint = jest.fn();
        const { getByTestId } = setup({ onPrint });

        fireEvent.click(getByTestId('confirm-alternate-test'));
        expect(onPrint).toHaveBeenCalledTimes(1);
    });

    it('removes minimum content width when noMinContentWidth is true', () => {
        const { getByTestId } = setup({ noMinContentWidth: true });

        const dialogContent = getByTestId('message-content').parentElement;
        expect(dialogContent).toHaveStyle({ minWidth: 'auto' });
    });

    it('disables buttons when isBusy and disableButtonsWhenBusy is true', () => {
        const { getByTestId } = setup({ isBusy: true, disableButtonsWhenBusy: true });

        expect(getByTestId('confirm-test')).toBeDisabled();
        expect(getByTestId('confirm-alternate-test')).toBeDisabled();
    });

    it('does not disable buttons when isBusy but disableButtonsWhenBusy is false', () => {
        const { getByTestId } = setup({ isBusy: true, disableButtonsWhenBusy: false });
        expect(getByTestId('confirm-test')).not.toBeDisabled();
        expect(getByTestId('confirm-alternate-test')).not.toBeDisabled();
    });

    it('does not disable buttons when not busy', () => {
        const { getByTestId } = setup({ isBusy: false, disableButtonsWhenBusy: true });
        expect(getByTestId('confirm-test')).not.toBeDisabled();
        expect(getByTestId('confirm-alternate-test')).not.toBeDisabled();
    });

    it('toggles accordion expansion on click', () => {
        setup();
        expandPrinterAccordion();
    });

    it('calls onPrinterTemplateSelectionChange when printer is selected', async () => {
        const onPrinterTemplateSelectionChange = jest.fn();

        const { getByTestId } = setup({ onPrinterTemplateSelectionChange });

        expandPrinterAccordion();

        // mock sets template to id=1, change to id=3
        fireEvent.mouseDown(getByTestId('label_printer_template_selector-test-input'));
        selectOptionFromListByIndex(1);

        expect(onPrinterTemplateSelectionChange).toHaveBeenCalledWith(
            expect.objectContaining({ templateId: 3, templateName: 'Template3' }),
        );
    });

    it('handles null callback functions gracefully', () => {
        const { getByTestId } = setup({ onPrint: null, onClose: null, onPrinterTemplateSelectionChange: null });

        expandPrinterAccordion();

        // Should not throw errors when clicking buttons with non-existant callbacks
        expect(() => {
            fireEvent.click(getByTestId('confirm-test'));
            fireEvent.click(getByTestId('confirm-alternate-test'));
        }).not.toThrow();

        // Should not throw errors when changing printer selection with non-existant callback
        expect(() => {
            fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));
            selectOptionFromListByIndex(1);
        }).not.toThrow();
    });

    it('handles completely undefined callback functions', () => {
        const { getByTestId } = setup({
            onPrint: undefined,
            onClose: undefined,
            onPrinterTemplateSelectionChange: undefined,
        });

        expandPrinterAccordion();

        // Should not throw errors when clicking buttons with non-existant callbacks
        expect(() => {
            fireEvent.click(getByTestId('confirm-test'));
            fireEvent.click(getByTestId('confirm-alternate-test'));
        }).not.toThrow();

        // Should not throw errors when changing printer selection with non-existant callback
        expect(() => {
            fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));
            selectOptionFromListByIndex(1);
        }).not.toThrow();
    });

    it('disables print button when both isBusy and printer error exist', () => {
        const { getByTestId } = setup({ isBusy: true, disableButtonsWhenBusy: true, printerPreference: null });

        expect(getByTestId('confirm-alternate-test')).toBeDisabled();
    });

    it('accordion remains expandable even when no printer error', () => {
        const { getByTestId } = setup({ printerPreference: { name: 'Printer1', templateId: 1 } });

        // ensure accordion is initially collapsed
        expect(document.querySelector('#printerSelectorContainer')).toHaveAttribute('aria-expanded', 'false');
        expect(getByTestId('label_printer_selector-test-input')).not.toBeVisible();

        expandPrinterAccordion();

        expect(document.querySelector('#printerSelectorContainer')).toHaveAttribute('aria-expanded', 'true');

        expect(getByTestId('label_printer_selector-test-input')).toBeVisible();
    });

    describe('coverage', () => {
        it('does not render the dialog when open=false', () => {
            const { queryByTestId } = setup({ isOpen: false });

            expect(queryByTestId('dialogbox-test')).not.toBeInTheDocument();
        });
        it('does not render the dialog when open=undefined', () => {
            const { queryByTestId } = setup({ isOpen: undefined });

            expect(queryByTestId('dialogbox-test')).not.toBeInTheDocument();
        });
        it('handles no printer preference', () => {
            const { getByTestId } = setup({ printerPreference: undefined });

            // Check that the label printer selector is visible (accordion is expanded)
            expect(getByTestId('label_printer_selector-test-input')).toBeVisible();
            expect(getByTestId('label_printer_selector-test-input')).toHaveValue('');
        });
        it('handles no available printers', () => {
            const { getByTestId, queryAllByRole } = setup({ availablePrinters: undefined });

            // Check that the label printer selector is visible (accordion is expanded)
            expect(getByTestId('label_printer_selector-test-input')).toBeVisible();
            fireEvent.click(getByTestId('label_printer_selector-test-input'));
            expect(queryAllByRole('option')).toHaveLength(0);
        });
    });
});
