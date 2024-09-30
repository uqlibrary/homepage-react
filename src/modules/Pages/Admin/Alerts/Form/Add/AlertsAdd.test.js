import React from 'react';
import AlertsAdd from './AlertsAdd';
import { rtlRender, userEvent } from 'test-utils';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

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
    afterEach(() => {
        mockUseNavigate.mockClear();
    });
    it('the cancel button returns to the list page', async () => {
        const { getByText } = setup();

        expect(getByText('Cancel')).toBeEnabled();
        await userEvent.click(getByText('Cancel'));
        expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    });
});
