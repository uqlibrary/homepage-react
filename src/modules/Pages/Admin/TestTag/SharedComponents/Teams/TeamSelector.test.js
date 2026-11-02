import React from 'react';
import TeamSelector from './TeamSelector';
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

    return renderer(<TeamSelector id={id} options={options} {...props} />);
}

describe('TeamSelector', () => {
    it('renders component disabled', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('team_selector-test')).toBeInTheDocument();
        expect(getByTestId('team_selector-test').classList.contains('Mui-disabled')).toBe(true);
    });
    it('renders component without label', () => {
        const { getByTestId, queryByTestId } = setup();
        expect(getByTestId('team_selector-test')).toBeInTheDocument();
        expect(queryByTestId('team_selector-test-label')).not.toBeInTheDocument();
    });
    it('renders component with label', () => {
        const { getByTestId } = setup({ label: 'Test label' });
        expect(getByTestId('team_selector-test')).toBeInTheDocument();
        expect(getByTestId('team_selector-test-label')).toHaveTextContent('Test label');
    });
    it('renders component with options default value selected', () => {
        const { getByTestId } = setup({ currentValue: '2' });
        expect(getByTestId('team_selector-test')).toBeInTheDocument();
        expect(getByTestId('team_selector-test-input')).toHaveAttribute('value', '2');
    });
    it('renders component with options and fires change event', () => {
        const mockOnChangeFn = jest.fn();
        const { getByTestId, getByRole, getAllByRole } = setup({ onChange: mockOnChangeFn });
        expect(getByTestId('team_selector-test')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('team_selector-test-select'));
        });
        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(mockOnChangeFn).toHaveBeenCalledWith(1);
    });
    it('renders component with hasAllOption prepending "All teams"', () => {
        const { getByTestId, getAllByRole } = setup({ hasAllOption: true });
        expect(getByTestId('team_selector-test')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('team_selector-test-select'));
        });
        const options = getAllByRole('option');
        expect(options).toHaveLength(3);
        expect(options[0]).toHaveTextContent('All teams');
    });
});
