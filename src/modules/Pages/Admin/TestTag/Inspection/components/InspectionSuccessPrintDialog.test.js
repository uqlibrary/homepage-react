/* eslint-disable react/prop-types */
import React from 'react';

import { rtlRender, fireEvent, screen, selectOptionFromListByIndex } from 'test-utils';
import InspectionSuccessPrintDialog, { hasPrinterError } from './InspectionSuccessPrintDialog';
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

    const defaultProps = {
        inspectionSuccessPrintDialogId: 'test',
        isOpen: true,
        locale: defaultLocale,
        availablePrinters,
        printerPreference: 'Printer1',
        onPrint: jest.fn(),
        onClose: jest.fn(),
        onPrinterSelectionChange: jest.fn(),
        ...testProps,
    };

    return renderer(<InspectionSuccessPrintDialog {...defaultProps} />);
}

describe('InspectionSuccessPrintDialog', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

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

    it('expands accordion when there is a printer error', () => {
        const { getByTestId } = setup({ printerPreference: null });

        // Check that the label printer selector is visible (accordion is expanded)
        expect(getByTestId('label_printer_selector-test-input')).toBeVisible();
    });

    const expandPrinterAccordion = () => {
        const accordionButton = screen.getByRole('button', { name: /label printer selection/i });
        expect(accordionButton).toBeInTheDocument();

        // Click to expand - accordion content should become visible
        fireEvent.click(accordionButton);
        expect(screen.getByTestId('label_printer_selector-test-input')).toBeVisible();
    };
    it('toggles accordion expansion on click', () => {
        setup();
        expandPrinterAccordion();
    });

    it('calls onPrinterSelectionChange when printer is selected', async () => {
        const onPrinterSelectionChange = jest.fn();

        const { getByTestId } = setup({ onPrinterSelectionChange });

        expandPrinterAccordion();

        fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));

        selectOptionFromListByIndex(1);

        expect(onPrinterSelectionChange).toHaveBeenCalledWith('Printer2');
    });

    it('handles null callback functions gracefully', () => {
        const { getByTestId } = setup({ onPrint: null, onClose: null, onPrinterSelectionChange: null });

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
        const { getByTestId } = setup({ onPrint: undefined, onClose: undefined, onPrinterSelectionChange: undefined });

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
        const { getByTestId } = setup({ printerPreference: 'Printer1' });

        // ensure accordion is initially collapsed
        expect(document.querySelector('#printerSelectorContainer')).toHaveAttribute('aria-expanded', 'false');
        expect(getByTestId('label_printer_selector-test-input')).not.toBeVisible();

        expandPrinterAccordion();

        expect(document.querySelector('#printerSelectorContainer')).toHaveAttribute('aria-expanded', 'true');

        expect(getByTestId('label_printer_selector-test-input')).toBeVisible();
    });

    describe('hasPrinterError', () => {
        const validPrinters = [{ name: 'Printer1' }, { name: 'Printer2' }, { name: 'Printer3' }];

        it('returns true when printerPreference is null', () => {
            expect(hasPrinterError(null, validPrinters)).toBe(true);
        });

        it('returns true when printerPreference is undefined', () => {
            expect(hasPrinterError(undefined, validPrinters)).toBe(true);
        });

        it('returns true when printerPreference is empty string', () => {
            expect(hasPrinterError('', validPrinters)).toBe(true);
        });

        it('returns true when availablePrinters array is empty', () => {
            expect(hasPrinterError('Printer1', [])).toBe(true);
        });

        it('returns true when all printers have noconfig set to true', () => {
            const noconfigPrinters = [
                { name: 'Printer1', noconfig: true },
                { name: 'Printer2', noconfig: true },
            ];
            expect(hasPrinterError('Printer1', noconfigPrinters)).toBe(true);
        });

        it('returns true when all printers have no name property', () => {
            const printersWithoutNames = [{ noconfig: false }, { noconfig: false }];
            expect(hasPrinterError('Printer1', printersWithoutNames)).toBe(true);
        });

        it('returns true when all printers have undefined name', () => {
            const printersWithUndefinedNames = [{ name: undefined }, { name: undefined }];
            expect(hasPrinterError('Printer1', printersWithUndefinedNames)).toBe(true);
        });

        it('returns true when all printers have null name', () => {
            const printersWithNullNames = [{ name: null }, { name: null }];
            expect(hasPrinterError('Printer1', printersWithNullNames)).toBe(true);
        });

        it('returns true when mix of noconfig and missing names', () => {
            const mixedPrinters = [{ name: 'Printer1', noconfig: true }, { name: undefined }, { noconfig: false }];
            expect(hasPrinterError('Printer2', mixedPrinters)).toBe(true);
        });

        it('returns true when printerPreference does not match any available printer', () => {
            expect(hasPrinterError('NonExistentPrinter', validPrinters)).toBe(true);
        });

        it('returns true when selected printer has noconfig set to true', () => {
            const printersWithNoconfig = [
                { name: 'Printer1', noconfig: true },
                { name: 'Printer2', noconfig: false },
            ];
            expect(hasPrinterError('Printer1', printersWithNoconfig)).toBe(true);
        });

        it('returns false when printerPreference matches a valid printer', () => {
            expect(hasPrinterError('Printer1', validPrinters)).toBe(false);
        });

        it('returns false when printerPreference matches a printer without noconfig', () => {
            const printersWithSomeNoconfig = [
                { name: 'Printer1', noconfig: true },
                { name: 'Printer2' },
                { name: 'Printer3' },
            ];
            expect(hasPrinterError('Printer2', printersWithSomeNoconfig)).toBe(false);
        });

        it('returns false when printerPreference matches a printer with noconfig explicitly false', () => {
            const printersWithExplicitNoconfig = [
                { name: 'Printer1', noconfig: false },
                { name: 'Printer2', noconfig: true },
            ];
            expect(hasPrinterError('Printer1', printersWithExplicitNoconfig)).toBe(false);
        });

        it('handles printers with only some having names correctly', () => {
            const mixedPrinters = [{ name: 'Printer1' }, { name: undefined }, { name: 'Printer2' }];
            // Should return false since there's at least one valid printer and it matches
            expect(hasPrinterError('Printer1', mixedPrinters)).toBe(false);
            // Should return true since Printer3 doesn't exist
            expect(hasPrinterError('Printer3', mixedPrinters)).toBe(true);
        });

        it('handles empty string printerPreference even with valid printers', () => {
            expect(hasPrinterError('', validPrinters)).toBe(true);
        });

        it('returns false for valid scenario with multiple printers', () => {
            const largePrinterList = [
                { name: 'Printer1', noconfig: false },
                { name: 'Printer2' },
                { name: 'Printer3', noconfig: false },
                { name: 'Printer4' },
            ];
            expect(hasPrinterError('Printer2', largePrinterList)).toBe(false);
            expect(hasPrinterError('Printer3', largePrinterList)).toBe(false);
        });

        describe('coverage', () => {
            it('returns true when availablePrinters parameter is not provided (uses default)', () => {
                // Test the default parameter branch
                expect(hasPrinterError('Printer1')).toBe(true);
            });

            it('handles array with null/undefined printer objects', () => {
                const printersWithNullEntries = [{ name: 'Printer1' }, null, undefined, { name: 'Printer2' }];
                // The optional chaining printer?.name should handle null/undefined entries
                expect(hasPrinterError('Printer1', printersWithNullEntries)).toBe(false);
                expect(hasPrinterError('Printer2', printersWithNullEntries)).toBe(false);
            });

            it('handles array with only null/undefined entries', () => {
                const onlyNullEntries = [null, undefined, null];
                // Should return true since no valid printers exist
                expect(hasPrinterError('Printer1', onlyNullEntries)).toBe(true);
            });

            it('handles mixed array with null entries and noconfig printers', () => {
                const mixedArray = [
                    null,
                    { name: 'Printer1', noconfig: true },
                    undefined,
                    { name: 'Printer2', noconfig: false },
                ];
                // Should return false for Printer2 since it's valid
                expect(hasPrinterError('Printer2', mixedArray)).toBe(false);
                // Should return true for Printer1 since it has noconfig
                expect(hasPrinterError('Printer1', mixedArray)).toBe(true);
            });
        });
    });
});
