import React from 'react';
import locale from './PaymentRecept.locale';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import queryString from 'query-string';

// ?Success=1&Receipt=1234&AmountPaid=1250

export const PaymentReceipt = () => {
    const querystring = queryString.parse(location.search);
    const amountPaid = parseFloat(querystring.AmountPaid / 100).toFixed(2);
    const receipt = querystring.Receipt;
    const success = querystring.Success === '1' ? 'successful' : 'unsuccessful';
    if (!querystring.AmountPaid || !querystring.Receipt || !querystring.Success) {
        return (
            <StandardPage
                goBackFunc={() => history.back()}
                standardPageId="payment-receipt"
                title={locale.failed.title}
            >
                <section className="layout-card">
                    <b>{locale.failed.message}</b>
                </section>
            </StandardPage>
        );
    }
    return (
        <StandardPage goBackFunc={() => history.back()} standardPageId="payment-receipt" title={locale.title}>
            <section className="layout-card">
                <StandardCard noHeader>
                    <p>
                        <strong>{locale.thanks}</strong>
                    </p>
                    <p>{locale.transaction.replace('[AmountPaid]', amountPaid).replace('[Success]', success)}</p>
                    <p>{locale.check.replace('[Receipt]', receipt)}</p>
                    <sub>{locale.maintenance}</sub>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

PaymentReceipt.propTypes = {};

export default React.memo(PaymentReceipt);
