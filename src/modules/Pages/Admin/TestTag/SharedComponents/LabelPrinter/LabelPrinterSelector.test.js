import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import LabelPrinterSelector from './LabelPrinterSelector';

describe('LabelPrinterSelector', () => {
    function setup(testProps = {}, renderer = rtlRender) {
        const defaultLocale = {
            unknownPrinter: 'Unknown Printer',
        };

        const defaultPrinters = [{ name: 'Printer1' }, { name: 'Printer2' }, { name: 'Printer3', noconfig: true }];

        const defaultProps = {
            id: 'test',
            list: defaultPrinters,
            value: null,
            onChange: jest.fn(),
            locale: defaultLocale,
            ...testProps,
        };

        return renderer(<LabelPrinterSelector {...defaultProps} />);
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders with basic props', () => {
        const { getByTestId, getByLabelText } = setup();

        expect(getByTestId('label_printer_selector-test')).toBeInTheDocument();
        expect(getByTestId('label_printer_selector-test-input')).toBeInTheDocument();
        expect(getByLabelText('Printer')).toBeInTheDocument();
    });

    it('renders with all props combined', () => {
        const onChange = jest.fn();
        const classNames = { formControl: 'test-form', autocomplete: 'test-auto' };
        const printers = [{ name: 'Printer1' }, { name: 'Printer2' }, { name: 'Printer3', noconfig: true }];

        const { getByTestId } = setup({
            id: 'combined',
            list: printers,
            value: 'Printer2',
            onChange,
            error: true,
            disabled: false,
            disableUnknownPrinters: true,
            fullWidth: true,
            classNames,
            locale: { unknownPrinter: 'Unknown Printer' },
        });

        expect(getByTestId('label_printer_selector-combined')).toBeInTheDocument();
        const input = getByTestId('label_printer_selector-combined-input');
        expect(input).toHaveValue('Printer2');
    });

    it('renders with selected value', () => {
        const { getByTestId } = setup({ value: 'Printer1' });

        expect(getByTestId('label_printer_selector-test-input')).toHaveValue('Printer1');
    });

    it('renders with null value when value does not match any printer', () => {
        const { getByTestId } = setup({ value: 'NonExistent' });

        expect(getByTestId('label_printer_selector-test-input')).toHaveValue('');
    });

    it('displays options when opened', () => {
        const { getByTestId, getByRole } = setup();

        fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));

        expect(getByRole('option', { name: 'Printer1' })).toBeInTheDocument();
        expect(getByRole('option', { name: 'Printer2' })).toBeInTheDocument();
        expect(getByRole('option', { name: /Printer3.*Unknown Printer/ })).toBeInTheDocument();
    });

    it('shows unknown printer suffix for printers with noconfig', () => {
        const { getByTestId, getByRole } = setup();

        const input = getByTestId('label_printer_selector-test-input');
        fireEvent.mouseDown(input);

        const option = getByRole('option', { name: /Printer3.*Unknown Printer/ });
        expect(option).toHaveTextContent('Printer3 (Unknown Printer)');
    });

    it('calls onChange when option is selected', () => {
        const onChange = jest.fn();
        const { getByTestId, getByRole } = setup({ onChange });

        fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));
        fireEvent.click(getByRole('option', { name: 'Printer2' }));

        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'click' }),
            expect.objectContaining({ name: 'Printer2' }),
            expect.anything(),
            expect.anything(),
        );
    });

    it('disables unknown printers when disableUnknownPrinters is true', () => {
        const { getByTestId, getByRole } = setup({ disableUnknownPrinters: true });

        fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));

        expect(getByRole('option', { name: 'Printer1' })).not.toHaveAttribute('aria-disabled', 'true');
        expect(getByRole('option', { name: /Printer3.*Unknown Printer/ })).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not disable unknown printers when disableUnknownPrinters is false', () => {
        const { getByTestId, getByRole } = setup({ disableUnknownPrinters: false });

        fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));
        expect(getByRole('option', { name: 'Printer1' })).not.toHaveAttribute('aria-disabled', 'true');
        expect(getByRole('option', { name: /Printer3.*Unknown Printer/ })).not.toHaveAttribute('aria-disabled', 'true');
    });

    it('renders with error state', () => {
        setup({ error: true });

        expect(document.querySelector('#label_printer_selector-test-label')).toHaveClass('Mui-error');
    });

    it('renders in disabled state', () => {
        const { getByTestId } = setup({ disabled: true });

        expect(getByTestId('label_printer_selector-test-input')).toBeDisabled();
    });

    it('renders with fullWidth prop', () => {
        const { getByTestId } = setup({ fullWidth: true });

        expect(getByTestId('label_printer_selector-test').closest('.MuiFormControl-root')).toHaveClass(
            'MuiFormControl-fullWidth',
        );
    });

    it('renders without fullWidth when prop is false', () => {
        const { getByTestId } = setup({ fullWidth: false });

        expect(getByTestId('label_printer_selector-test').closest('.MuiFormControl-root')).not.toHaveClass(
            'MuiFormControl-fullWidth',
        );
    });

    describe('coverage', () => {
        it('applies custom classNames', () => {
            const classNames = {
                formControl: 'custom-form-control',
                autocomplete: 'custom-autocomplete',
            };
            const { getByTestId } = setup({ classNames });

            expect(getByTestId('label_printer_selector-test').closest('.MuiFormControl-root')).toHaveClass(
                'custom-form-control',
            );
            expect(getByTestId('label_printer_selector-test')).toHaveClass('custom-autocomplete');
        });
        it('handles empty list', () => {
            const { getByTestId, getByText } = setup({ list: [] });

            fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));
            expect(getByText('No options')).toBeInTheDocument();
        });

        it('handles null list', () => {
            const { getByTestId, getByText } = setup({ list: null });

            fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));
            expect(getByText('No options')).toBeInTheDocument();
        });

        it('handles undefined list', () => {
            const { getByTestId, getByText } = setup({ list: undefined });

            fireEvent.mouseDown(getByTestId('label_printer_selector-test-input'));
            expect(getByText('No options')).toBeInTheDocument();
        });
    });
});
