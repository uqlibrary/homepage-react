import React from 'react';
import { rtlRender, fireEvent } from 'test-utils';
import { AccordionWithCheckbox } from './AccordionWithCheckbox';

function setup(testProps = {}) {
    const {
        id = 'test-accordion',
        label = 'Test Label',
        disabled = false,
        children = <div>Test Content</div>,
        slotProps = {},
        ...props
    } = testProps;

    return rtlRender(
        <AccordionWithCheckbox id={id} label={label} disabled={disabled} slotProps={slotProps} {...props}>
            {children}
        </AccordionWithCheckbox>,
    );
}

describe('AccordionWithCheckbox', () => {
    it('renders component with basic props', () => {
        const { getByTestId, getByText } = setup();

        expect(getByTestId('accordionWithCheckbox-test-accordion-checkbox')).toBeInTheDocument();
        expect(getByText('Test Label')).toBeInTheDocument();
        expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with custom id and label', () => {
        const { getByTestId, getByText } = setup({
            id: 'custom-id',
            label: 'Custom Label',
        });

        expect(getByTestId('accordionWithCheckbox-custom-id-checkbox')).toBeInTheDocument();
        expect(getByText('Custom Label')).toBeInTheDocument();
    });

    it('renders checkbox with correct data-testid attribute', () => {
        const { getByTestId } = setup({ id: 'my-accordion' });

        const checkbox = getByTestId('accordionWithCheckbox-my-accordion-checkbox');
        expect(checkbox).toHaveAttribute('data-testid', 'accordionWithCheckbox-my-accordion-checkbox');
    });

    it('renders accordion header with correct aria attributes', () => {
        const { container } = setup({ id: 'test-id' });

        const accordionSummary = container.querySelector('#test-id-header');
        expect(accordionSummary).toBeInTheDocument();
        expect(accordionSummary).toHaveAttribute('aria-controls', 'test-id-content');
    });

    it('renders children content inside accordion details', () => {
        const { getByText } = setup({
            children: <div>Custom child content</div>,
        });

        expect(getByText('Custom child content')).toBeInTheDocument();
    });

    it('renders with React node as label', () => {
        const customLabel = (
            <div>
                <span>Custom</span> <strong>Label</strong>
            </div>
        );
        const { getByText } = setup({ label: customLabel });

        expect(getByText('Custom')).toBeInTheDocument();
        expect(getByText('Label')).toBeInTheDocument();
    });

    it('renders Clear button in accordion actions', () => {
        const { getByText } = setup();

        expect(getByText('Clear')).toBeInTheDocument();
    });

    it('checkbox is enabled by default', () => {
        const { getByTestId } = setup();

        const checkbox = getByTestId('accordionWithCheckbox-test-accordion-checkbox');
        expect(checkbox).not.toBeDisabled();
    });

    it('disables checkbox when disabled prop is true', () => {
        const { getByTestId } = setup({ disabled: true });

        const checkbox = getByTestId('accordionWithCheckbox-test-accordion-checkbox');
        expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables accordion when disabled prop is true', () => {
        const { container } = setup({ disabled: true });

        const accordion = container.querySelector('.MuiAccordion-root');
        expect(accordion).toHaveClass('Mui-disabled');
    });

    it('checkbox click does not trigger accordion expansion', () => {
        const { getByTestId, container } = setup();

        const checkbox = getByTestId('accordionWithCheckbox-test-accordion-checkbox');
        const accordion = container.querySelector('.MuiAccordion-root');

        // Check initial state - accordion should be collapsed
        expect(accordion).not.toHaveClass('Mui-expanded');

        // Click checkbox
        fireEvent.click(checkbox);

        // Accordion should still be collapsed after checkbox click
        expect(accordion).not.toHaveClass('Mui-expanded');
    });

    it('applies custom slotProps to accordion', () => {
        const { container } = setup({
            slotProps: {
                accordion: {
                    className: 'custom-accordion-class',
                    'data-custom': 'accordion-value',
                },
            },
        });

        const accordion = container.querySelector('.MuiAccordion-root');
        expect(accordion).toHaveClass('custom-accordion-class');
        expect(accordion).toHaveAttribute('data-custom', 'accordion-value');
    });

    it('applies custom slotProps to checkbox', () => {
        const mockOnChange = jest.fn();
        const { getByTestId, container } = setup({
            slotProps: {
                checkbox: {
                    onChange: mockOnChange,
                    checked: true,
                    'data-custom': 'checkbox-value',
                },
            },
        });

        const checkbox = getByTestId('accordionWithCheckbox-test-accordion-checkbox');
        const checkboxInput = container.querySelector('input[type="checkbox"]');
        expect(checkboxInput).toBeChecked();
        expect(checkbox).toHaveAttribute('data-custom', 'checkbox-value');

        fireEvent.click(checkbox);
        expect(mockOnChange).toHaveBeenCalled();
    });

    it('applies custom slotProps to accordionSummary', () => {
        const { container } = setup({
            slotProps: {
                accordionSummary: {
                    className: 'custom-summary-class',
                    'data-custom': 'summary-value',
                },
            },
        });

        const summary = container.querySelector('.MuiAccordionSummary-root');
        expect(summary).toHaveClass('custom-summary-class');
        expect(summary).toHaveAttribute('data-custom', 'summary-value');
    });

    it('applies custom slotProps to accordionDetails', () => {
        const { container } = setup({
            slotProps: {
                accordionDetails: {
                    className: 'custom-details-class',
                    'data-custom': 'details-value',
                },
            },
        });

        const details = container.querySelector('.MuiAccordionDetails-root');
        expect(details).toHaveClass('custom-details-class');
        expect(details).toHaveAttribute('data-custom', 'details-value');
    });

    it('applies custom slotProps to accordionActions', () => {
        const mockOnClick = jest.fn();
        const { getByText } = setup({
            slotProps: {
                accordionActions: {
                    onClick: mockOnClick,
                    'data-custom': 'actions-value',
                },
            },
        });

        const clearButton = getByText('Clear');
        expect(clearButton).toHaveAttribute('data-custom', 'actions-value');

        fireEvent.click(clearButton);
        expect(mockOnClick).toHaveBeenCalled();
    });

    it('renders with all slotProps combined', () => {
        const mockCheckboxChange = jest.fn();
        const mockButtonClick = jest.fn();

        const { getByTestId, getByText, container } = setup({
            id: 'combined-test',
            label: 'Combined Test Label',
            checked: false,
            disabled: false,
            slotProps: {
                accordion: {
                    className: 'test-accordion',
                },
                accordionSummary: {
                    className: 'test-summary',
                },
                accordionDetails: {
                    className: 'test-details',
                },
                accordionActions: {
                    onClick: mockButtonClick,
                },
                checkbox: {
                    onChange: mockCheckboxChange,
                },
            },
        });

        expect(container.querySelector('.test-accordion')).toBeInTheDocument();
        expect(container.querySelector('.test-summary')).toBeInTheDocument();
        expect(container.querySelector('.test-details')).toBeInTheDocument();
        expect(getByTestId('accordionWithCheckbox-combined-test-checkbox')).not.toHaveClass('Mui-checked');

        fireEvent.click(getByTestId('accordionWithCheckbox-combined-test-checkbox'));
        expect(mockCheckboxChange).toHaveBeenCalled();

        fireEvent.click(getByText('Clear'));
        expect(mockButtonClick).toHaveBeenCalled();
    });

    it('checkbox has primary color', () => {
        const { getByTestId } = setup();

        const checkbox = getByTestId('accordionWithCheckbox-test-accordion-checkbox');
        expect(checkbox).toHaveClass('MuiCheckbox-colorPrimary');
    });

    it('accordion summary has no expand icon', () => {
        const { container } = setup();

        const expandIcon = container.querySelector('.MuiAccordionSummary-expandIconWrapper');
        // The expand icon wrapper should exist but be empty
        expect(expandIcon?.children.length || 0).toBe(0);
    });

    it('prevents event propagation on FormControlLabel click', () => {
        const mockStopPropagation = jest.fn();
        const { getByText } = setup();

        const label = getByText('Test Label');
        const formControlLabel = label.closest('.MuiFormControlLabel-root');

        // Create a custom event with stopPropagation
        const clickEvent = new MouseEvent('click', { bubbles: true });
        Object.defineProperty(clickEvent, 'stopPropagation', {
            value: mockStopPropagation,
        });

        formControlLabel?.dispatchEvent(clickEvent);

        expect(mockStopPropagation).toHaveBeenCalled();
    });

    it('renders multiple children correctly', () => {
        const { getByText } = setup({
            children: (
                <>
                    <div>First child</div>
                    <div>Second child</div>
                    <span>Third child</span>
                </>
            ),
        });

        expect(getByText('First child')).toBeInTheDocument();
        expect(getByText('Second child')).toBeInTheDocument();
        expect(getByText('Third child')).toBeInTheDocument();
    });
});
