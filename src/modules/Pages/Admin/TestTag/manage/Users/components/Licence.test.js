import React from 'react';
import userEvent from '@testing-library/user-event';
import { rtlRender } from 'test-utils';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import Licence from './Licence';

function setup(testProps = {}, renderer = rtlRender) {
    const { data, row, ...rest } = testProps;
    const defaultProps = {
        name: 'test',
        inputProps: {
            'data-testid': 'test-input',
        },
        data: { user_id: 'Auto', ...data },
        row: { ...row },
        onChange: jest.fn(),
    };

    const props = { ...defaultProps, ...rest };

    return {
        props,
        ...renderer(<Licence {...props} />),
    };
}

describe('Licence', () => {
    test('should call onChange when input value changes', async () => {
        const { props, getByTestId } = setup();

        await userEvent.type(getByTestId('test-input'), 'new licence');

        expect(props.onChange).toHaveBeenCalled();

        const lastCall = props.onChange.mock.calls.at(-1)[0];
        expect(lastCall.target.name).toBe('test');
        expect(lastCall.target.value).toBe('new licence');
    });

    describe('creation mode', () => {
        test('should render default state', () => {
            const { getByTestId, getByText, queryByText } = setup();

            expect(getByTestId('test-input')).toHaveAttribute('maxlength', '45');
            expect(getByText(locale.pages.general.helperText.maxChars(45))).toBeInTheDocument();
            expect(queryByText(locale.pages.manage.users.helperText.user_licence_number)).toBeNull();
        });

        test('should display required message based on users perms', () => {
            const { getByTestId, getByText, queryByText } = setup({
                data: { can_inspect_cb: true },
                error: true,
            });

            expect(getByTestId('test-input')).toBeRequired();
            expect(queryByText(locale.pages.general.helperText.maxChars(45))).toBeNull();
            expect(getByText(locale.pages.manage.users.helperText.user_licence_number)).toBeInTheDocument();
        });
    });

    describe('updating mode', () => {
        test('should allow to toggle input disable state', async () => {
            const { getByTestId } = setup({
                data: { user_id: 123 },
                row: { test: 'ABC123' },
            });

            const input = getByTestId('test-input');
            expect(input).toBeDisabled();

            const lockToggleButton = getByTestId('test-enable-button');
            await userEvent.click(lockToggleButton);
            expect(input).not.toBeDisabled();

            await userEvent.click(lockToggleButton);
            expect(input).toBeDisabled();
        });

        test('should show warning according to isDirt state', async () => {
            const initialValue = 'initial value';
            const { getByTestId, queryByText } = setup({
                data: { user_id: 123 },
                value: initialValue,
            });

            const input = getByTestId('test-input');

            expect(queryByText(locale.pages.manage.users.helperText.licence_update_warning)).not.toBeInTheDocument();
            await userEvent.click(getByTestId('test-enable-button'));

            await userEvent.type(input, 'updated');
            expect(queryByText(locale.pages.manage.users.helperText.licence_update_warning)).toBeInTheDocument();

            await userEvent.clear(input);
            await userEvent.type(input, initialValue);
            expect(queryByText(locale.pages.manage.users.helperText.licence_update_warning)).not.toBeInTheDocument();
        });

        test('should revert value when disabling field when the value has changed', async () => {
            const { props, getByTestId } = setup({
                data: { user_id: 123 },
                value: 'ORIGINAL',
            });

            await userEvent.click(getByTestId('test-enable-button'));

            const input = getByTestId('test-input');

            await userEvent.clear(input);
            await userEvent.type(input, 'UPDATED');

            await userEvent.click(getByTestId('test-disable-button'));

            expect(props.onChange).toHaveBeenLastCalledWith({
                target: {
                    name: 'test',
                    value: 'ORIGINAL',
                },
            });
        });
    });
});
