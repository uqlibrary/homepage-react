import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import LabelPrinterTemplateSelector from './LabelPrinterTemplateSelector';

function setup(testProps = {}, renderer = rtlRender) {
    const defaultLocale = {
        templateLabel: 'Template',
    };

    const defaultTemplates = [
        { id: 1, name: 'Template1' },
        { id: 2, name: 'Template2' },
        { id: 3, name: 'Template3' },
    ];

    const defaultProps = {
        id: 'test',
        list: defaultTemplates,
        value: null,
        onChange: jest.fn(),
        locale: defaultLocale,
        ...testProps,
    };

    return renderer(<LabelPrinterTemplateSelector {...defaultProps} />);
}

describe('LabelPrinterTemplateSelector', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders with basic props', () => {
        const { getByTestId, getByLabelText } = setup();

        expect(getByTestId('label_printer_template_selector-test')).toBeInTheDocument();
        expect(getByTestId('label_printer_template_selector-test-input')).toBeInTheDocument();
        expect(getByLabelText('Template')).toBeInTheDocument();
    });

    it('renders with all props', () => {
        const onChange = jest.fn();
        const classNames = { formControl: 'test-form', autocomplete: 'test-auto' };
        const templates = [
            { id: 1, name: 'Template1' },
            { id: 2, name: 'Template2' },
            { id: 3, name: 'Template3' },
        ];

        const { getByTestId } = setup({
            id: 'test',
            list: templates,
            value: 2,
            onChange,
            error: true,
            disabled: false,
            fullWidth: true,
            classNames,
            locale: { templateLabel: 'Template' },
        });

        expect(getByTestId('label_printer_template_selector-test')).toBeInTheDocument();
        expect(getByTestId('label_printer_template_selector-test-input')).toHaveValue('Template2');
    });

    it('renders with selected value', () => {
        const { getByTestId } = setup({ value: 1 });

        expect(getByTestId('label_printer_template_selector-test-input')).toHaveValue('Template1');
    });

    it('renders with empty value when id does not match any template', () => {
        const { getByTestId } = setup({ value: 999 });

        expect(getByTestId('label_printer_template_selector-test-input')).toHaveValue('');
    });

    it('displays options when opened', () => {
        const { getByTestId, getByRole } = setup();

        fireEvent.mouseDown(getByTestId('label_printer_template_selector-test-input'));

        expect(getByRole('option', { name: 'Template1' })).toBeInTheDocument();
        expect(getByRole('option', { name: 'Template2' })).toBeInTheDocument();
        expect(getByRole('option', { name: 'Template3' })).toBeInTheDocument();
    });

    it('calls onChange when option is selected', () => {
        const onChange = jest.fn();
        const { getByTestId, getByRole } = setup({ onChange });

        fireEvent.mouseDown(getByTestId('label_printer_template_selector-test-input'));
        fireEvent.click(getByRole('option', { name: 'Template2' }));

        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'click' }),
            expect.objectContaining({ id: 2, name: 'Template2' }),
            expect.anything(),
            expect.anything(),
        );
    });

    it('renders with error state', () => {
        setup({ error: true });

        expect(document.querySelector('#label_printer_template_selector-test-label')).toHaveClass('Mui-error');
    });

    it('renders in disabled state', () => {
        const { getByTestId } = setup({ disabled: true });

        expect(getByTestId('label_printer_template_selector-test-input')).toBeDisabled();
    });

    describe('coverage', () => {
        it('renders with fullWidth prop', () => {
            const { getByTestId } = setup({ fullWidth: true });

            expect(getByTestId('label_printer_template_selector-test').closest('.MuiFormControl-root')).toHaveClass(
                'MuiFormControl-fullWidth',
            );
        });

        it('renders without fullWidth when prop is false', () => {
            const { getByTestId } = setup({ fullWidth: false });

            expect(getByTestId('label_printer_template_selector-test').closest('.MuiFormControl-root')).not.toHaveClass(
                'MuiFormControl-fullWidth',
            );
        });
        it('applies custom classNames', () => {
            const classNames = {
                formControl: 'custom-form-control',
                autocomplete: 'custom-autocomplete',
            };
            const { getByTestId } = setup({ classNames });

            expect(getByTestId('label_printer_template_selector-test').closest('.MuiFormControl-root')).toHaveClass(
                'custom-form-control',
            );
            expect(getByTestId('label_printer_template_selector-test')).toHaveClass('custom-autocomplete');
        });

        it('handles empty list', () => {
            const { getByTestId, getByText } = setup({ list: [] });

            fireEvent.mouseDown(getByTestId('label_printer_template_selector-test-input'));
            expect(getByText('No options')).toBeInTheDocument();
        });

        it('handles null list', () => {
            const { getByTestId, getByText } = setup({ list: null });

            fireEvent.mouseDown(getByTestId('label_printer_template_selector-test-input'));
            expect(getByText('No options')).toBeInTheDocument();
        });

        it('handles undefined list', () => {
            const { getByTestId, getByText } = setup({ list: undefined });

            fireEvent.mouseDown(getByTestId('label_printer_template_selector-test-input'));
            expect(getByText('No options')).toBeInTheDocument();
        });
    });
});
