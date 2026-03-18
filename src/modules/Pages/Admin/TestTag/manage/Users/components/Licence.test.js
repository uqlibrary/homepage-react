import React from 'react';
import userEvent from '@testing-library/user-event';
import { rtlRender } from 'test-utils';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import Licence from './Licence';
import { waitFor } from '@testing-library/react';

function setup(testProps = {}, renderer = rtlRender) {
    const { data, row, ...rest } = testProps;
    const defaultProps = {
        name: 'test',
        inputProps: {
            'data-testid': 'test-input',
        },
        data: { user_id: 'Auto', ...data },
        row: { ...row },
        onChange: testProps.onChange || jest.fn(),
    };

    const props = { ...defaultProps, ...rest };

    return {
        props,
        ...renderer(<Licence {...props} />),
    };
}

describe('Licence', () => {
    test('should call given onChange on input value changes', async () => {
        const { props, getByTestId } = setup({
            data: { can_inspect_cb: true },
        });

        await userEvent.type(getByTestId('test-input'), 'new licence');

        expect(props.onChange).toHaveBeenCalled();

        const lastCall = props.onChange.mock.calls.at(-1)[0];
        expect(lastCall.target.name).toBe('test');
        expect(lastCall.target.value).toBe('new licence');
    });

    describe('creation mode', () => {
        test('should render as disabled', () => {
            const { getByTestId, getByText, queryByText } = setup();

            const input = getByTestId('test-input');
            expect(input).toBeDisabled();
            expect(input).toHaveAttribute('maxlength', '45');

            expect(getByText(locale.pages.general.helperText.maxChars(45))).toBeInTheDocument();
            expect(queryByText(locale.pages.manage.users.helperText.user_licence_number)).toBeNull();
        });

        test('should render as unlockd', () => {
            const { getByTestId, getByText, queryByText } = setup({
                data: { can_inspect_cb: true },
            });

            const input = getByTestId('test-input');
            expect(input).not.toBeDisabled();
            expect(input).toBeRequired();

            expect(getByText(locale.pages.general.helperText.maxChars(45))).toBeInTheDocument();
            expect(queryByText(locale.pages.manage.users.helperText.user_licence_number)).toBeNull();
        });

        test('should display required message', () => {
            const { getByTestId, getByText, queryByText } = setup({
                data: { can_inspect_cb: true },
                error: true,
            });

            const input = getByTestId('test-input');
            expect(input).not.toBeDisabled();
            expect(input).toBeRequired();

            expect(queryByText(locale.pages.general.helperText.maxChars(45))).toBeNull();
            expect(getByText(locale.pages.manage.users.helperText.user_licence_number)).toBeInTheDocument();
        });
    });

    describe('update mode', () => {
        test('should allow to toggle input lock state', async () => {
            const { getByTestId } = setup({
                data: { user_id: 123, can_inspect_cb: true },
                row: { test: 'ABC123' },
            });

            const input = getByTestId('test-input');
            expect(input).toBeDisabled();

            const lockToggleButton = getByTestId('test-unlock-button');
            await userEvent.click(lockToggleButton);
            expect(input).not.toBeDisabled();

            await userEvent.click(lockToggleButton);
            expect(input).toBeDisabled();
        });

        test('should show licence update warning', async () => {
            const initialValue = 'initial value';
            const { getByTestId, queryByText } = setup({
                data: { user_id: 123, can_inspect_cb: true },
                value: initialValue,
            });

            const input = getByTestId('test-input');

            expect(queryByText(locale.pages.manage.users.helperText.licence_update_warning)).not.toBeInTheDocument();
            await userEvent.click(getByTestId('test-unlock-button'));

            await userEvent.type(input, 'updated');
            expect(queryByText(locale.pages.manage.users.helperText.licence_update_warning)).toBeInTheDocument();

            await userEvent.clear(input);
            await userEvent.type(input, initialValue);
            expect(queryByText(locale.pages.manage.users.helperText.licence_update_warning)).not.toBeInTheDocument();
        });

        describe('changes rollback', () => {
            test('should rollback changes when locking the field on dirty state', async () => {
                const { props, getByTestId } = setup({
                    data: { user_id: 123, can_inspect_cb: true },
                    value: 'ORIGINAL',
                });

                await userEvent.click(getByTestId('test-unlock-button'));

                const input = getByTestId('test-input');

                await userEvent.clear(input);
                await userEvent.type(input, 'UPDATED');

                await userEvent.click(getByTestId('test-lock-button'));

                expect(props.onChange).toHaveBeenLastCalledWith({
                    target: {
                        name: 'test',
                        value: 'ORIGINAL',
                    },
                });
            });

            test('should revert changes the field is disabled', async () => {
                const { rerender, props, getByTestId } = setup({
                    data: { user_id: 123, can_inspect_cb: true },
                    value: 'ORIGINAL',
                });

                await userEvent.click(getByTestId('test-unlock-button'));

                const input = getByTestId('test-input');

                await userEvent.clear(input);
                await userEvent.type(input, 'UPDATED');

                setup(
                    {
                        ...props,
                        data: { user_id: 123 },
                    },
                    rerender,
                );

                await waitFor(() => {
                    expect(props.onChange).toHaveBeenLastCalledWith({
                        target: { name: 'test', value: 'ORIGINAL' },
                    });
                });
            });
        });
    });
});
