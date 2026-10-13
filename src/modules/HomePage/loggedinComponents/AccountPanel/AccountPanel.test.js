import React from 'react';
import { rtlRender, WithRouter } from 'test-utils';

import { accounts } from 'data/mock/data/account';

import { AccountPanel } from './AccountPanel';

jest.mock('./PaperCutMenu', () => ({
    __esModule: true,
    default: ({ printBalance, printBalanceError, printBalanceLoading }) => (
        <div
            data-testid="mock-papercut-menu"
            data-print-balance={printBalance?.balance ?? ''}
            data-print-balance-error={printBalanceError ? 'true' : 'false'}
            data-print-balance-loading={printBalanceLoading ? 'true' : 'false'}
        >
            PaperCutMenu
        </div>
    ),
}));

const defaultProps = {
    account: accounts.uqstaff,
    loans: {
        total_loans_count: 1,
        total_holds_count: 2,
        total_fines_count: 2,
        fines: [{ fineAmount: 10 }, { fineAmount: 2.5 }, { fineAmount: 'ignored' }],
    },
    loansLoading: false,
    printBalance: { balance: '12.50', email: 'uq.staff@example.uq.edu.au' },
    printBalanceLoading: false,
    printBalanceError: false,
};

function setup(testProps = {}) {
    const props = {
        ...defaultProps,
        ...testProps,
    };

    return rtlRender(
        <WithRouter>
            <AccountPanel {...props} />
        </WithRouter>,
    );
}

describe('AccountPanel', () => {
    it('renders the account links and count badges for a regular user', () => {
        const { getByTestId, getByRole, queryByTestId } = setup();

        expect(getByRole('heading', { name: 'Your library account' })).toBeInTheDocument();
        expect(getByTestId('catalogue-panel-content')).toBeInTheDocument();

        expect(getByRole('link', { name: 'Search history' })).toHaveAttribute(
            'href',
            'https://search.library.uq.edu.au/discovery/favorites?vid=61UQ_INST:61UQ&lang=en&section=search_history',
        );
        expect(getByRole('link', { name: 'Saved searches' })).toHaveAttribute(
            'href',
            'https://search.library.uq.edu.au/discovery/favorites?vid=61UQ_INST:61UQ&lang=en&section=queries',
        );
        expect(getByRole('link', { name: 'Requests (2)' })).toHaveAttribute(
            'href',
            'https://search.library.uq.edu.au/discovery/account?vid=61UQ_INST:61UQ&section=requests&lang=en',
        );
        expect(getByRole('link', { name: 'Loans (1)' })).toHaveAttribute(
            'href',
            'https://search.library.uq.edu.au/discovery/account?vid=61UQ_INST:61UQ&section=loans&lang=en',
        );

        expect(getByTestId('mock-papercut-menu')).toBeInTheDocument();
        expect(queryByTestId('show-testntag')).not.toBeInTheDocument();
    });

    it('omits requests and loans counts while loan data is loading', () => {
        const { getByRole } = setup({ loansLoading: true, loans: {} });

        expect(getByRole('link', { name: 'Requests' })).toBeInTheDocument();
        expect(getByRole('link', { name: 'Loans' })).toBeInTheDocument();
    });

    it('displays no request or loan counts when the account loan data is unavailable', () => {
        const { getByTestId } = setup({ loans: {}, loansLoading: false });

        // When there are requests, the text is "Requests (2)"
        expect(getByTestId('show-requests')).toHaveTextContent('Requests');
        // so if there's no parenthesis we know there's no count displayed
        expect(getByTestId('show-requests')).not.toHaveTextContent('(');
        // and same for loans "Loans (1)"
        expect(getByTestId('show-loans')).toHaveTextContent('Loans');
        expect(getByTestId('show-loans')).not.toHaveTextContent('(');
    });

    it('shows the fines alert with the summed payable amount', () => {
        const { getByTestId, getByRole } = setup();

        expect(getByTestId('show-fines')).toBeInTheDocument();
        expect(getByRole('heading', { name: 'Fines and charges' })).toBeInTheDocument();
        expect(getByRole('link', { name: '$12.5 payable' })).toHaveAttribute(
            'href',
            'https://search.library.uq.edu.au/discovery/account?vid=61UQ_INST:61UQ&section=fines&lang=en',
        );
    });

    it('does not show the fines alert when there are no fines', () => {
        const { queryByTestId } = setup({
            loans: {
                total_loans_count: 1,
                total_holds_count: 2,
                total_fines_count: 0,
                fines: [],
            },
        });

        expect(queryByTestId('show-fines')).not.toBeInTheDocument();
    });

    it('shows the test and tag link for a test tag user', () => {
        const { getByTestId, getByRole } = setup({ account: accounts.uqtesttag });

        expect(getByTestId('show-testntag')).toBeInTheDocument();
        expect(getByRole('link', { name: 'Test and tag' })).toHaveAttribute('href', '/admin/testntag');
    });
});
