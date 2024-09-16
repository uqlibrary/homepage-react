import React from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import { pathConfig } from 'config/pathConfig';
import { breadcrumbs } from 'config/routes';
import locale from './PaymentRecept.locale';

const StyledStandardCard = styled(StandardCard)(() => ({
    backgroundColor: 'white',
}));

export const PaymentReceipt = () => {
    const urlObj = new URL(window.location.href);
    const querystring = urlObj.searchParams;

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.paymentreceipt.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.paymentreceipt.pathname);
    }, []);

    const amountPaidInterim = querystring.get('AmountPaid');
    const amountPaid =
        querystring.has('AmountPaid') && !Number.isNaN(amountPaidInterim) && amountPaidInterim > 0
            ? parseFloat(amountPaidInterim).toFixed(2)
            : false;
    const receiptValue = querystring.has('Receipt') ? querystring.get('Receipt') : false;
    const successful = querystring.has('Success') ? querystring.get('Success') : false;
    const receipt = querystring.get('Receipt');
    const successStatus =
        querystring.has('Success') && querystring.get('Success') === '1' ? 'successful' : 'unsuccessful';
    if (querystring.has('Success') && querystring.get('Success') !== '1') {
        return (
            <StandardPage standardPageId="payment-receipt" title={locale.failed.title}>
                <StyledStandardCard noHeader>
                    <b>{locale.failed.message}</b>
                </StyledStandardCard>
            </StandardPage>
        );
    }
    if (!amountPaid || !receiptValue || !successful) {
        return (
            <StandardPage standardPageId="payment-receipt" title={locale.error.title}>
                <StyledStandardCard noHeader>
                    <b>{locale.error.message}</b>
                </StyledStandardCard>
            </StandardPage>
        );
    }
    return (
        <StandardPage standardPageId="payment-receipt" title={locale.title}>
            <StyledStandardCard noHeader>
                <p>
                    <strong>{locale.thanks}</strong>
                </p>
                <p>{locale.transaction.replace('[AmountPaid]', amountPaid).replace('[Success]', successStatus)}</p>
                <p>{locale.check.replace('[Receipt]', receipt)}</p>
                <sub>{locale.maintenance}</sub>
            </StyledStandardCard>
            <Grid container style={{ marginTop: 16 }}>
                <Grid item xs>
                    <a href={pathConfig.index}>Return to the Library homepage</a>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

PaymentReceipt.propTypes = {};

export default React.memo(PaymentReceipt);
