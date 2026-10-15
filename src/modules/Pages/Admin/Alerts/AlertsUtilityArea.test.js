import React from 'react';
import { rtlRender, userEvent, waitFor } from 'test-utils';

import { AlertsUtilityArea } from './AlertsUtilityArea';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

function setup(props = {}) {
    const testProps = {
        ...props,
        actions: props.actions || { clearAnAlert: jest.fn() },
    };

    return rtlRender(<AlertsUtilityArea {...testProps} />);
}

describe('AlertsUtilityArea', () => {
    afterEach(() => {
        mockNavigate.mockClear();
    });

    it('hides help and add buttons when they are not configured', () => {
        const { queryByRole } = setup();

        expect(queryByRole('button', { name: 'Help' })).not.toBeInTheDocument();
        expect(queryByRole('button', { name: 'Add alert' })).not.toBeInTheDocument();
    });

    it('opens and closes the help drawer with the supplied content', async () => {
        const { getByRole, getByText, queryByText } = setup({
            helpButtonLabel: 'Alert guidance',
            helpContent: {
                title: 'Managing alerts',
                text: 'Review alert guidance here.',
                buttonLabel: 'Close guidance',
            },
        });

        await userEvent.click(getByRole('button', { name: 'Alert guidance' }));

        expect(getByRole('heading', { name: 'Managing alerts' })).toBeInTheDocument();
        expect(getByText('Review alert guidance here.')).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Close guidance' }));
        await waitFor(() => expect(queryByText('Review alert guidance here.')).not.toBeInTheDocument());
    });

    it('uses fallback help content when values are missing', async () => {
        const { getByRole, queryByRole } = setup({ helpContent: {} });

        await userEvent.click(getByRole('button', { name: 'Help' }));

        expect(getByRole('heading', { name: 'TBA' })).toBeInTheDocument();
        await userEvent.click(getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(queryByRole('heading', { name: 'TBA' })).not.toBeInTheDocument());
    });

    it('clears the current alert and navigates to the add page', async () => {
        const clearAnAlert = jest.fn();
        const { getByRole } = setup({ actions: { clearAnAlert }, showAddButton: true });

        await userEvent.click(getByRole('button', { name: 'Add alert' }));

        expect(clearAnAlert).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts/add');
        expect(clearAnAlert.mock.invocationCallOrder[0]).toBeLessThan(mockNavigate.mock.invocationCallOrder[0]);
    });
});
