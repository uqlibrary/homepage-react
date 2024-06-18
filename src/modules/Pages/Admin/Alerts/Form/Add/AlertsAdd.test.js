import React from 'react';
import AlertsAdd from './AlertsAdd';
import { rtlRender, userEvent } from 'test-utils';

function setup(testProps) {
    const props = {
        classes: {},
        actions: {
            clearAlerts: jest.fn(),
            clearAnAlert: jest.fn(),
        },
        ...testProps,
    };
    return rtlRender(<AlertsAdd {...props} />);
}

describe('Form Tests', () => {
    it('the cancel button returns to the list page', async () => {
        const testFn2 = jest.fn();
        const { getByText } = setup({
            history: { push: testFn2 },
        });

        expect(getByText('Cancel')).toBeEnabled();
        await userEvent.click(getByText('Cancel'));
        expect(testFn2).toHaveBeenCalledTimes(1);
    });
});
