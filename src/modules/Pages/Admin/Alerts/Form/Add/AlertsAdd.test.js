import React from 'react';
import userEvent from '@testing-library/user-event';
import AlertsAdd from './AlertsAdd';
import { render } from 'test-utils';
import { mui1theme } from 'config';
import { ThemeProvider } from '@material-ui/core/styles';

function setup(testProps, renderer = render) {
    const props = {
        classes: {},
        actions: {
            clearAlerts: jest.fn(),
            clearAnAlert: jest.fn(),
        },
        ...testProps,
    };
    return renderer(
        <ThemeProvider theme={mui1theme}>
            <AlertsAdd {...props} />
        </ThemeProvider>,
    );
}

describe('Form Tests', () => {
    it('the cancel button returns to the list page', () => {
        const testFn2 = jest.fn();
        const wrapper = setup({
            history: { push: testFn2 },
        });

        expect(wrapper.getByText('Cancel')).toBeEnabled();
        userEvent.click(wrapper.getByText('Cancel'));
        expect(testFn2).toHaveBeenCalledTimes(1);
    });
});
