import React from 'react';
import MonthsSelector from './MonthsSelector';
import { render, act, fireEvent } from 'test-utils';

/*
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.array,
    currentValue: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    responsive: PropTypes.bool,
    disabled: PropTypes.bool,
    nextDateTextFormatter: PropTypes.func,
    fromDate: PropTypes.string,
    fromDateFormat: PropTypes.string,
    dateDisplayFormat: PropTypes.string,
    classNames: PropTypes.shape({ formControl: PropTypes.string, select: PropTypes.string }),
    */

const selectOptionFromListByIndex = (index, actions) => {
    expect(actions.getByRole('listbox')).not.toEqual(null);
    act(() => {
        const options = actions.getAllByRole('option');

        fireEvent.mouseDown(options[index]);
        options[index].click();
    });
};

const defaultOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
];

function setup(testProps = {}, renderer = render) {
    const { id = 'test', options = defaultOptions, ...props } = testProps;

    return renderer(<MonthsSelector id={id} options={options} {...props} />);
}

describe('MonthsSelector', () => {
    it('renders component disabled', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('months_selector-test')).toBeInTheDocument();
        expect(getByTestId('months_selector-test').classList.contains('Mui-disabled')).toBe(true);
    });
    it('renders component without label', () => {
        const { getByTestId, queryByTestId } = setup();
        expect(getByTestId('months_selector-test')).toBeInTheDocument();
        expect(queryByTestId('months_selector-test-label')).not.toBeInTheDocument();
    });
    it('renders component with label', () => {
        const { getByTestId } = setup({ label: 'Test label' });
        expect(getByTestId('months_selector-test')).toBeInTheDocument();
        expect(getByTestId('months_selector-test-label')).toHaveTextContent('Test label');
    });
    it('renders component with options default value selected', () => {
        const { getByTestId } = setup({ currentValue: '2' });
        expect(getByTestId('months_selector-test')).toBeInTheDocument();
        expect(getByTestId('months_selector-test-input')).toHaveAttribute('value', '2');
    });
    it('renders component with options and fires change event', () => {
        const mockOnChangeFn = jest.fn();
        const { getByTestId, getByRole, getAllByRole } = setup({ onChange: mockOnChangeFn });
        expect(getByTestId('months_selector-test')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('months_selector-test-select'));
        });
        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(mockOnChangeFn).toHaveBeenCalledWith(1);
    });
    it('renders component with options and fires nextDateTextFormatter event with calculated date', () => {
        const mockNextDateTextFormatterFn = jest.fn(value => `Next inspection: ${value}`);
        const { getByTestId } = setup({
            fromDate: '2023-07-26',
            fromDateFormat: 'YYYY-MM-DD',
            dateDisplayFormat: 'Do MMMM, YYYY',
            currentValue: '1',
            nextDateTextFormatter: mockNextDateTextFormatterFn,
        });
        expect(getByTestId('months_selector-test')).toBeInTheDocument();
        expect(getByTestId('months_selector-test-next-date-label')).toBeInTheDocument();

        expect(mockNextDateTextFormatterFn).toHaveBeenCalledWith('26th August, 2023');
        expect(getByTestId('months_selector-test-next-date-label')).toHaveTextContent(
            'Next inspection: 26th August, 2023',
        );
    });
});
