import React from 'react';
import DebouncedTextField from './DebouncedTextField';
import { rtlRender, rerender, act, fireEvent, waitFor } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(<DebouncedTextField {...testProps} />);
}

describe('DebouncedTextField Renders component', () => {
    it('renders component without value', () => {
        const handleChange = jest.fn();

        const { getByTestId } = setup({
            handleChange,
            updateKey: 'my-key',
            id: 'testing',
        });
        expect(getByTestId('debounced_text_field-testing-input')).toBeInTheDocument();
        expect(getByTestId('debounced_text_field-testing-input')).toHaveAttribute('value', '');
    });
    it('renders component with value', () => {
        const handleChange = jest.fn();
        const value = 'some value';

        const { getByTestId } = setup({
            handleChange,
            updateKey: 'my-key',
            id: 'testing',
            value,
        });
        expect(getByTestId('debounced_text_field-testing-input')).toBeInTheDocument();
        expect(getByTestId('debounced_text_field-testing-input')).toHaveAttribute('value', value);
    });

    it('rerenders component with reset value', () => {
        const handleChange = jest.fn();
        const value = 'some value';
        const resetValue = 'reset value';

        const { getByTestId } = setup({
            handleChange,
            updateKey: 'my-key',
            value,
            id: 'testing',
        });
        expect(getByTestId('debounced_text_field-testing-input')).toBeInTheDocument();
        expect(getByTestId('debounced_text_field-testing-input')).toHaveAttribute('value', value);

        setup(
            {
                handleChange,
                updateKey: 'my-key',
                value: resetValue,
                id: 'testing-rerendered',
            },
            rerender,
        );
        expect(getByTestId('debounced_text_field-testing-rerendered-input')).toHaveAttribute('value', resetValue);
    });

    it('fires update handler onChange', async () => {
        const value = '';
        const updateKey = 'my-key';
        const newValue = 'new value';
        const handleChange = jest.fn(prop =>
            jest.fn(event => {
                expect(prop).toEqual(updateKey);
                expect(event.target.value).toEqual(newValue);
            }),
        );

        const { getByTestId } = setup({
            handleChange,
            value,
            updateKey,
            id: 'testing',
        });
        expect(getByTestId('debounced_text_field-testing-input')).toBeInTheDocument();
        expect(getByTestId('debounced_text_field-testing-input')).toHaveAttribute('value', value);

        act(() => {
            fireEvent.change(getByTestId('debounced_text_field-testing-input'), { target: { value: newValue } });
        });
        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey));
    });
});
