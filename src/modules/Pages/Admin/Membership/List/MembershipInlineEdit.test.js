import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';

import MembershipInlineEdit from './MembershipInlineEdit';

const BARCODE_PATTERN = /^24067[0-9]{8,9}$/;

const setup = (props = {}) =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MembershipInlineEdit
                    fieldId="barcode-1"
                    field="barcode"
                    label="Barcode"
                    pattern={BARCODE_PATTERN}
                    invalidMessage="A barcode starts with 24067 and is 13 or 14 digits long"
                    name="Dr Already Confirmed"
                    editable
                    onSave={jest.fn()}
                    {...props}
                />
            </ThemeProvider>
        </StyledEngineProvider>,
    );

describe('MembershipInlineEdit', () => {
    it('shows the stored value with an edit affordance named for the field and applicant', () => {
        setup({ value: '2406700012345' });

        expect(screen.getByTestId('barcode-1-value')).toHaveTextContent('2406700012345');
        expect(screen.getByRole('button', { name: 'Edit the barcode for Dr Already Confirmed' })).toBeInTheDocument();
    });

    it('reads "Not set" and offers an add affordance when there is no value yet', () => {
        setup({ value: undefined });

        expect(screen.getByTestId('barcode-1-value')).toHaveTextContent('Not set');
        expect(screen.getByRole('button', { name: 'Add a barcode for Dr Already Confirmed' })).toBeInTheDocument();
    });

    it('shows the value read-only, with no control, when the field is not editable', () => {
        setup({ value: '2406700012345', editable: false });

        expect(screen.getByTestId('barcode-1-value')).toHaveTextContent('2406700012345');
        expect(screen.queryByTestId('barcode-1-edit-button')).not.toBeInTheDocument();
    });

    it('opens onto the input with focus, and starts from the stored value', async () => {
        setup({ value: '2406700012345' });

        await userEvent.click(screen.getByTestId('barcode-1-edit-button'));

        const input = screen.getByTestId('barcode-1-input');
        expect(input).toHaveFocus();
        expect(input).toHaveValue('2406700012345');
    });

    it('opens onto an empty input when there is no value to start from', async () => {
        setup({ value: undefined });

        await userEvent.click(screen.getByTestId('barcode-1-edit-button'));

        expect(screen.getByTestId('barcode-1-input')).toHaveValue('');
    });

    it('flags a malformed value once the field is left, and keeps save out of reach until it is valid', async () => {
        const onSave = jest.fn();
        setup({ value: '', onSave });

        await userEvent.click(screen.getByTestId('barcode-1-edit-button'));
        const input = screen.getByTestId('barcode-1-input');

        await userEvent.type(input, '123');
        // Nothing is said until the admin moves on: an error on every keystroke would nag mid-entry.
        expect(screen.queryByText('A barcode starts with 24067 and is 13 or 14 digits long')).not.toBeInTheDocument();

        await userEvent.tab();
        expect(screen.getByText('A barcode starts with 24067 and is 13 or 14 digits long')).toBeInTheDocument();
        expect(screen.getByTestId('barcode-1-save-button')).toBeDisabled();

        await userEvent.clear(input);
        await userEvent.type(input, '2406700012345');
        expect(screen.getByTestId('barcode-1-save-button')).toBeEnabled();

        await userEvent.click(screen.getByTestId('barcode-1-save-button'));
        expect(onSave).toHaveBeenCalledWith('2406700012345');
        // The editor closes back to the value once saved.
        expect(screen.getByTestId('barcode-1-value')).toBeInTheDocument();
    });

    it('cancels without saving and returns focus to the trigger', async () => {
        const onSave = jest.fn();
        setup({ value: '2406700012345', onSave });

        await userEvent.click(screen.getByTestId('barcode-1-edit-button'));
        await userEvent.type(screen.getByTestId('barcode-1-input'), '999');
        await userEvent.click(screen.getByTestId('barcode-1-cancel-button'));

        expect(onSave).not.toHaveBeenCalled();
        expect(screen.getByTestId('barcode-1-edit-button')).toHaveFocus();
    });

    it('disables the input and shows a saving label while a save is in flight', async () => {
        setup({ value: '2406700012345', saving: true });

        await userEvent.click(screen.getByTestId('barcode-1-edit-button'));

        expect(screen.getByTestId('barcode-1-input')).toBeDisabled();
        const save = screen.getByTestId('barcode-1-save-button');
        expect(save).toBeDisabled();
        expect(save).toHaveTextContent('Saving..');
    });
});
