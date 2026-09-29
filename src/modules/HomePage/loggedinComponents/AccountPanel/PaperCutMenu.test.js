import React from 'react';
import { fireEvent, rtlRender, userEvent, waitFor } from 'test-utils';

import { accounts } from 'data/mock/data/account';

import { PaperCutMenu } from './PaperCutMenu';

const defaultProps = {
    account: accounts.uqstaff,
    printBalance: {
        balance: '12.50',
        email: 'uq.staff@example.uq.edu.au',
    },
    printBalanceLoading: false,
    printBalanceError: false,
};

function setup(testProps = {}) {
    const props = {
        ...defaultProps,
        ...testProps,
    };

    return rtlRender(
        <>
            <PaperCutMenu {...props} />
            <button id="training-event-detail-more-training-button">Outside button</button>
        </>,
    );
}

describe('PaperCutMenu', () => {
    it('shows the print balance and opens the menu with top up and help links', async () => {
        const { getByTestId, getByRole, findByTestId } = setup();

        expect(getByTestId('papercut-print-balance')).toHaveTextContent('Print balance ($12.50)');

        await userEvent.click(getByTestId('papercut-menu-button'));

        expect(await findByTestId('papercut-item-button-1')).toBeVisible();
        expect(getByRole('link', { name: 'Top up your print balance - $5' })).toHaveAttribute(
            'href',
            'https://payments.uq.edu.au/OneStopWeb/aspx/TranAdd.aspx?TRAN-TYPE=W361&username=uqstaff&unitamountinctax=5&email=uq.staff@example.uq.edu.au',
        );
        expect(getByRole('link', { name: 'Top up your print balance - $10' })).toHaveAttribute(
            'href',
            'https://payments.uq.edu.au/OneStopWeb/aspx/TranAdd.aspx?TRAN-TYPE=W361&username=uqstaff&unitamountinctax=10&email=uq.staff@example.uq.edu.au',
        );
        expect(getByRole('link', { name: 'Top up your print balance - $20' })).toHaveAttribute(
            'href',
            'https://payments.uq.edu.au/OneStopWeb/aspx/TranAdd.aspx?TRAN-TYPE=W361&username=uqstaff&unitamountinctax=20&email=uq.staff@example.uq.edu.au',
        );
        expect(getByRole('link', { name: 'More about your printing account' })).toHaveAttribute(
            'href',
            'https://dev-library-uq.pantheonsite.io/library-and-student-it-help/print-scan-and-copy/your-printing-account ',
        );
    });

    it('focuses the first menu item when opened', async () => {
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('papercut-menu-button'));

        await waitFor(() => expect(getByTestId('papercut-item-button-1')).toHaveFocus());
    });

    it('moves focus between top up items and back to the opener at the first item', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('papercut-menu-button'));
        const firstItem = getByTestId('papercut-item-button-1');
        await waitFor(() => expect(firstItem).toHaveFocus());

        fireEvent.keyDown(firstItem, { key: 'Tab' });
        expect(getByTestId('papercut-item-button-2')).toHaveFocus();

        fireEvent.keyDown(getByTestId('papercut-item-button-2'), { key: 'Tab', shiftKey: true });
        expect(firstItem).toHaveFocus();

        fireEvent.keyDown(firstItem, { key: 'Tab', shiftKey: true });
        expect(getByTestId('papercut-menu-button')).toHaveFocus();
        expect(queryByTestId('papercut-item-button-1')).not.toBeInTheDocument();
    });

    it('moves focus back from help and out of the menu on Tab', async () => {
        const { getByTestId, queryByTestId, getByRole } = setup();

        await userEvent.click(getByTestId('papercut-menu-button'));
        const helpItem = getByTestId('papercut-item-button-4');
        await waitFor(() => expect(helpItem).toBeVisible());

        fireEvent.keyDown(helpItem, { key: 'Tab', shiftKey: true });
        expect(getByTestId('papercut-item-button-3')).toHaveFocus();

        fireEvent.keyDown(getByTestId('papercut-item-button-3'), { key: 'Tab' });
        expect(helpItem).toHaveFocus();

        fireEvent.keyDown(helpItem, { key: 'Tab' });
        expect(getByRole('button', { name: 'Outside button' })).toHaveFocus();
        expect(queryByTestId('papercut-item-button-4')).not.toBeInTheDocument();
    });

    it('closes the menu when escape is pressed', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('papercut-menu-button'));
        await waitFor(() => expect(getByTestId('papercut-item-button-4')).toBeVisible());

        fireEvent.keyDown(document, { key: 'Escape' });

        await waitFor(() => expect(queryByTestId('papercut-item-button-4')).not.toBeInTheDocument());
    });

    it('closes the menu when the button is clicked again', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('papercut-menu-button'));
        await waitFor(() => expect(getByTestId('papercut-item-button-4')).toBeVisible());

        await userEvent.click(getByTestId('papercut-menu-button'));

        await waitFor(() => expect(queryByTestId('papercut-item-button-4')).not.toBeInTheDocument());
    });

    it('closes the menu when clicking away', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('papercut-menu-button'));
        await waitFor(() => expect(getByTestId('papercut-item-button-4')).toBeVisible());

        await userEvent.click(document.getElementById('training-event-detail-more-training-button'));

        await waitFor(() => expect(queryByTestId('papercut-item-button-4')).not.toBeInTheDocument());
    });

    it('shows a loading message instead of top up links while the print balance loads', async () => {
        const { getByTestId, queryByTestId, getByRole } = setup({ printBalanceLoading: true });

        expect(getByTestId('papercut-print-balance')).toHaveTextContent('Print balance');
        expect(getByTestId('papercut-print-balance')).not.toHaveTextContent('12.50');

        await userEvent.click(getByTestId('papercut-menu-button'));

        await waitFor(() => expect(getByTestId('papercut-menu')).toHaveTextContent('Loading...'));
        expect(queryByTestId('papercut-item-button-1')).not.toBeInTheDocument();
        expect(getByRole('link', { name: 'More about your printing account' })).toBeInTheDocument();
    });

    it('shows only the help link when top up details are unavailable', async () => {
        const { getByTestId, queryByTestId } = setup({
            printBalance: null,
            printBalanceError: true,
        });

        expect(getByTestId('papercut-print-balance')).toHaveTextContent('Print balance');

        await userEvent.click(getByTestId('papercut-menu-button'));

        await waitFor(() => expect(getByTestId('papercut-item-button-4')).toBeVisible());
        expect(getByTestId('papercut-menu')).toHaveTextContent(
            'Top up is currently unavailable - please try again later.',
        );
        expect(queryByTestId('papercut-item-button-1')).not.toBeInTheDocument();
    });

    it('does not offer top ups when the balance has no email', async () => {
        const { getByTestId, queryByTestId } = setup({ printBalance: { balance: '12.50' } });

        expect(getByTestId('papercut-print-balance')).toHaveTextContent('Print balance ($12.50)');

        await userEvent.click(getByTestId('papercut-menu-button'));

        expect(getByTestId('papercut-menu')).toHaveTextContent(
            'Top up is currently unavailable - please try again later.',
        );
        expect(queryByTestId('papercut-item-button-1')).not.toBeInTheDocument();
        expect(getByTestId('papercut-item-button-4')).toBeVisible();
    });
});
