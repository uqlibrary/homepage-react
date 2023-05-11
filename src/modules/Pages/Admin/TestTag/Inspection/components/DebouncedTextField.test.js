import React from 'react';
import DebouncedTextField from './DebouncedTextField';
import { rtlRender, rerender, act, fireEvent, waitFor } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(<DebouncedTextField {...testProps} />);
}

describe('DebouncedTextField Renders component', () => {
    it('renders component without value', () => {
        const handleChange = jest.fn();
        const testId = 'testField';
        const testInputId = 'testField-input';

        const { getByTestId } = setup({
            handleChange,
            updateKey: 'my-key',
            'data-testid': testId,
        });
        expect(getByTestId(testId)).toBeInTheDocument();
        expect(getByTestId(testInputId)).toBeInTheDocument();
        expect(getByTestId(testInputId)).toHaveAttribute('value', '');
    });
    it('renders component with value', () => {
        const handleChange = jest.fn();
        const testId = 'testField';
        const testInputId = 'testField-input';
        const value = 'some value';

        const { getByTestId } = setup({
            handleChange,
            updateKey: 'my-key',
            value,
            'data-testid': testId,
        });
        expect(getByTestId(testId)).toBeInTheDocument();
        expect(getByTestId(testInputId)).toBeInTheDocument();
        expect(getByTestId(testInputId)).toHaveAttribute('value', value);
    });

    it('rerenders component with reset value', () => {
        const handleChange = jest.fn();
        const testId = 'testField';
        const testInputId = 'testField-input';
        const value = 'some value';
        const resetValue = 'reset value';

        const { getByTestId } = setup({
            handleChange,
            updateKey: 'my-key',
            value,
            'data-testid': testId,
        });
        expect(getByTestId(testId)).toBeInTheDocument();
        expect(getByTestId(testInputId)).toBeInTheDocument();
        expect(getByTestId(testInputId)).toHaveAttribute('value', value);

        setup(
            {
                handleChange,
                updateKey: 'my-key',
                value: resetValue,
                'data-testid': `${testId}-rerendered`,
            },
            rerender,
        );
        expect(getByTestId(`${testId}-rerendered-input`)).toHaveAttribute('value', resetValue);
    });

    it('fires update handler onChange', async () => {
        const testId = 'testField';
        const testInputId = 'testField-input';
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
            'data-testid': testId,
        });
        expect(getByTestId(testId)).toBeInTheDocument();
        expect(getByTestId(testInputId)).toBeInTheDocument();
        expect(getByTestId(testInputId)).toHaveAttribute('value', value);
        act(() => {
            fireEvent.change(getByTestId(testInputId), { target: { value: newValue } });
        });
        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey));
    });
});
