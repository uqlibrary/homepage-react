import React from 'react';
import AssetStatusSelector from './AssetStatusSelector';
import { render, act, fireEvent, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

/*
  id,
    label,
    options,
    initialOptionIndex = -1,
    required = false,
    onChange,
    classNames,
    disabled,
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
    const { state = {}, ...rest } = testProps;
    const { options = defaultOptions, ...props } = rest;

    const _state = {
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AssetStatusSelector id={props.id} label={'Asset Status'} options={options} {...props} />
        </WithReduxStore>,
    );
}

describe('AssetStatusSelector', () => {
    it('renders component', () => {
        const { getByTestId, getByText, getByRole, getAllByRole } = setup({
            id: 'test',
        });
        expect(getByTestId('asset_status_selector-test')).toBeInTheDocument();
        expect(getByText('Asset Status')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('asset_status_selector-test-input'));
        });
        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(getByTestId('asset_status_selector-test-input')).toHaveAttribute('value', 'Option 1');
    });
    it('renders component with initially selected option', () => {
        const { getByTestId } = setup({
            id: 'test',
            initialOptionIndex: 1,
        });
        expect(getByTestId('asset_status_selector-test')).toBeInTheDocument();

        expect(getByTestId('asset_status_selector-test-input')).toHaveAttribute('value', 'Option 2');
    });
    it('renders component in disabled state', () => {
        const { getByTestId } = setup({
            id: 'test',
            initialOptionIndex: 1,
            disabled: true,
        });
        expect(getByTestId('asset_status_selector-test')).toBeInTheDocument();
        expect(getByTestId('asset_status_selector-test-input')).toHaveAttribute('value', 'Option 2');
        expect(getByTestId('asset_status_selector-test-input')).toHaveAttribute('disabled');
    });
    it('renders component in error state when required', () => {
        setup({
            id: 'test',
            required: true,
        });
        const label = document.querySelector('#asset_status_selector-test-label');
        expect(label.classList.contains('Mui-error')).toBe(true);
    });
    it('fires onChange function when value changes', () => {
        const mockOnChangeFn = jest.fn();
        const { getByTestId, getByText, getByRole, getAllByRole } = setup({
            id: 'test',
            onChange: mockOnChangeFn,
        });
        expect(getByTestId('asset_status_selector-test')).toBeInTheDocument();
        expect(getByText('Asset Status')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('asset_status_selector-test-input'));
        });
        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(getByTestId('asset_status_selector-test-input')).toHaveAttribute('value', 'Option 1');
        expect(mockOnChangeFn).toHaveBeenCalledWith(defaultOptions[0]);
    });
});
