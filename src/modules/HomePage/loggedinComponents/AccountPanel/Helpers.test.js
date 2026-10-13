import React from 'react';
import { rtlRender } from 'test-utils';

import { getTopUrl, markedLoanQuantity, markedPrintBalance, markedRequestQuantity, totalFines } from './Helpers';

describe('AccountPanel helpers', () => {
    it('sums numeric fines and ignores non-numeric amounts', () => {
        expect(totalFines([{ fineAmount: 10 }, { fineAmount: 2.5 }, { fineAmount: '5' }])).toBe(12.5);
        expect(totalFines([])).toBe(0);
    });

    it('renders loan counts including zero', () => {
        const { getByText } = rtlRender(<div>Loans{markedLoanQuantity({ total_loans_count: 0 }, false)}</div>);

        expect(getByText('Loans (0)')).toBeInTheDocument();
    });

    it('omits loan counts while loading or when the count is missing', () => {
        expect(markedLoanQuantity({ total_loans_count: 1 }, true)).toBeNull();
        expect(markedLoanQuantity({}, false)).toBeNull();
        expect(markedLoanQuantity(null, false)).toBeNull();
    });

    it('renders request counts including zero', () => {
        const { getByText } = rtlRender(<div>Requests{markedRequestQuantity({ total_holds_count: 0 }, false)}</div>);

        expect(getByText('Requests (0)')).toBeInTheDocument();
    });

    it('omits request counts while loading or when the count is missing', () => {
        expect(markedRequestQuantity({ total_holds_count: 2 }, true)).toBeNull();
        expect(markedRequestQuantity({}, false)).toBeNull();
        expect(markedRequestQuantity(null, false)).toBeNull();
    });

    it('renders an available print balance', () => {
        const { getByText } = rtlRender(
            <div>Print balance{markedPrintBalance({ balance: '12.50' }, false, false)}</div>,
        );

        expect(getByText('Print balance ($12.50)')).toBeInTheDocument();
    });

    it('omits print balance while loading, on error, or when no balance is provided', () => {
        expect(markedPrintBalance({ balance: '12.50' }, true, false)).toBeNull();
        expect(markedPrintBalance({ balance: '12.50' }, false, true)).toBeNull();
        expect(markedPrintBalance({}, false, false)).toBeNull();
        expect(markedPrintBalance(null, false, false)).toBeNull();
    });

    it('builds the print balance top-up URL with account, amount, and email', () => {
        expect(getTopUrl('12345', '20.00', 'reader@example.com')).toBe(
            'https://payments.uq.edu.au/OneStopWeb/aspx/TranAdd.aspx?TRAN-TYPE=W361&username=12345&unitamountinctax=20.00&email=reader@example.com',
        );
    });
});
