import React from 'react';

export const totalFines = fines => {
    return fines.reduce((sum, fine) => {
        return sum + (typeof fine.fineAmount === 'number' ? fine.fineAmount : /* istanbul ignore next */ 0);
    }, 0);
};
export const markedLoanQuantity = (loans, loansLoading) => {
    if (!!loansLoading || !loans?.hasOwnProperty('total_loans_count')) {
        return null;
    }
    return <> ({`${loans?.total_loans_count}`})</>;
};

export const markedRequestQuantity = (loans, loansLoading) => {
    if (!!loansLoading || !loans?.hasOwnProperty('total_holds_count')) {
        return null;
    }
    return <> ({`${loans?.total_holds_count}`})</>;
};

export const markedPrintBalance = (printBalance, printBalanceLoading, printBalanceError) => {
    if (!!printBalanceLoading || !printBalance?.hasOwnProperty('balance') || !!printBalanceError) {
        return null;
    }
    return <> (${printBalance?.balance})</>;
};

export const getTopUrl = (accountId, topupAmount, email) => {
    return 'https://payments.uq.edu.au/OneStopWeb/aspx/TranAdd.aspx?TRAN-TYPE=W361&username=[id]&unitamountinctax=[topupAmount]&email=[email]'
        .replace('[id]', accountId)
        .replace('[topupAmount]', topupAmount)
        .replace('[email]', email);
};
