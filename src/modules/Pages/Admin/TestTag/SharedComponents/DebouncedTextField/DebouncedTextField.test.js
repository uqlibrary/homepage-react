import React from 'react';
import DebouncedTextField from './DebouncedTextField';
import { rtlRender, rerender, act, fireEvent, waitFor } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(<DebouncedTextField {...testProps} />);
}

describe('DebouncedTextField Renders component', () => {
    it('renders component without value', () => {
        const onChange = jest.fn();
        const value = '';

        const { getByTestId } = setup({
            onChange,
            value,
            id: 'testing',
        });
        expect(getByTestId('testing-input')).toBeInTheDocument();
        expect(getByTestId('testing-input')).toHaveAttribute('value', '');
    });
    it('renders component with undefined value', () => {
        const onChange = jest.fn();
        const value = undefined;

        const { getByTestId } = setup({
            onChange,
            value,
            id: 'testing',
        });
        expect(getByTestId('testing-input')).toBeInTheDocument();
        expect(getByTestId('testing-input')).toHaveAttribute('value', '');
    });
    it('renders component with value', () => {
        const onChange = jest.fn();
        const value = 'some value';

        const { getByTestId } = setup({
            onChange,

            id: 'testing',
            value,
        });
        expect(getByTestId('testing-input')).toBeInTheDocument();
        expect(getByTestId('testing-input')).toHaveAttribute('value', value);
    });

    it('rerenders component with reset value', () => {
        const onChange = jest.fn();
        const value = 'some value';
        const resetValue = 'reset value';

        const { getByTestId } = setup({
            onChange,

            value,
            id: 'testing',
        });
        expect(getByTestId('testing-input')).toBeInTheDocument();
        expect(getByTestId('testing-input')).toHaveAttribute('value', value);

        setup(
            {
                onChange,

                value: resetValue,
                id: 'testing-rerendered',
            },
            rerender,
        );
        expect(getByTestId('testing-rerendered-input')).toHaveAttribute('value', resetValue);
    });

    it('fires update handler onChange', async () => {
        const value = '';
        const newValue = 'new value';
        const onChange = jest.fn(() =>
            jest.fn(event => {
                expect(event.target.value).toEqual(newValue);
            }),
        );

        const { getByTestId } = setup({
            onChange,
            value,
            id: 'testing',
        });
        expect(getByTestId('testing-input')).toBeInTheDocument();
        expect(getByTestId('testing-input')).toHaveAttribute('value', value);

        act(() => {
            fireEvent.change(getByTestId('testing-input'), { target: { value: newValue } });
        });
        await waitFor(() =>
            expect(onChange).toHaveBeenCalledWith(
                expect.objectContaining({ target: expect.objectContaining({ value: newValue }) }),
            ),
        );
    });
});
