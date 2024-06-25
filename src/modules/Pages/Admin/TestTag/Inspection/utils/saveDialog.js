import React from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import { statusEnum } from '../utils/helpers';
import locale from '../../testTag.locale';
const testStatusEnum = statusEnum(locale.pages.inspect.config);

const savedDialogMessages = {
    [testStatusEnum.CURRENT.value]: (data, locale) => (
        <Grid container item xs={12} sm={6} alignItems="center" className={'dialogContainer dialogPassedContainer'}>
            <Grid item xs={12} className={'dialogTitle dialogSuccessTitle'} variant="subtitle1">
                <Typography gutterBottom id="saved-asset-id" data-testid="saved-licence-number">
                    <span id="saved-licence-number-label" data-testid="saved-licence-number-label">
                        {locale.testedBy}
                    </span>{' '}
                    <span id="saved-licence-number" data-testid="saved-licence-number">
                        {data.user_licence_number}
                    </span>
                </Typography>
            </Grid>
            <Grid item xs={12} className={'dialogBarcode'}>
                <Typography gutterBottom variant="h6" id="saved-asset-id" data-testid="saved-asset-id">
                    {data.asset_id_displayed}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={'dialogSuccessLineItems'} variant="subtitle1">
                <Typography gutterBottom id="saved-test-date-label" data-testid="saved-test-date-label">
                    {locale.testedDate}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={'dialogSuccessLineItems'} variant="subtitle1">
                <Typography gutterBottom id="saved-test-date" data-testid="saved-test-date">
                    {data.action_date}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={'dialogSuccessLineItems'} variant="subtitle1">
                <Typography gutterBottom id="saved-next-test-date-label" data-testid="saved-next-test-date-label">
                    {locale.dateNextDue}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={'dialogSuccessLineItems'} variant="subtitle1">
                <Typography gutterBottom id="saved-asset-id" data-testid="saved-asset-id">
                    {data.asset_next_test_due_date ?? locale.notApplicable}
                </Typography>
            </Grid>
        </Grid>
    ),
    other: (data, locale) => (
        <Grid container item xs={12} sm={6} alignItems="center" className={'dialogContainer dialogFailedContaine'}>
            <Grid item xs={12} className={'dialogTitle dialogFailedTitle'}>
                <Typography gutterBottom variant="h4" id="saved-title-label" data-testid="saved-title-label">
                    {locale.outOfService}
                </Typography>
            </Grid>
            <Grid item xs={12} className={'dialogBarcode'}>
                <Typography gutterBottom variant="h6" id="saved-asset-id" data-testid="saved-asset-id">
                    {data.asset_id_displayed}
                </Typography>
            </Grid>
            <Grid item xs={12} className={'dialogFailedLineItems'} variant="subtitle1">
                <Typography gutterBottom>
                    <span id="saved-licence-number-label" data-testid="saved-licence-number-label">
                        {locale.tagPlacedBy}
                    </span>
                    <br />
                    <span id="saved-licence-number" data-testid="saved-licence-number">
                        {data.user_licence_number}
                    </span>
                </Typography>
            </Grid>
        </Grid>
    ),
};

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& .dialogContainer': {
        borderRadius: '6px',
        borderWidth: '1px',
        borderStyle: 'solid',
        color: 'black',
    },
    '& .dialogPassedContainer': {
        backgroundColor: '#69B400',
        borderColor: '#69B400',
    },
    '& .dialogFailedContainer': {
        backgroundColor: '#ef000c',
        borderColor: '#ef000c',
    },
    '& .dialogTitle': {
        textAlign: 'center',
        padding: '8px',
        '& >p': {
            fontWeight: '500',
            fontFamily: 'monospace, monospace',
        },
    },
    '& .dialogFailedTitle': {
        '& >h4': {
            fontWeight: '700',
            fontFamily: 'monospace, monospace',
            textDecoration: 'underline',
        },
    },
    '& .dialogFailedAssetStatus': {
        textAlign: 'center',
        padding: '8px',
        '& >h5': {
            fontWeight: '700',
            fontFamily: 'monospace, monospace',
        },
    },
    '& .dialogBarcode': {
        backgroundColor: 'white',
        padding: '8px',
        textAlign: 'center',
        '& >h6': {
            fontFamily: 'monospace, monospace',
        },
    },
    '& .dialogSuccessLineItems': {
        padding: '8px',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
        '& >p': {
            fontWeight: '500',
            fontFamily: 'monospace, monospace',
        },
    },
    '& .dialogFailedLineItems': {
        padding: '8px',
        textAlign: 'center',
        '& >p': {
            fontWeight: '500',
            fontFamily: 'monospace, monospace',
        },
    },
}));

export const getSuccessDialog = (response, locale) => {
    if (!!!response) return {};
    const key = response.asset_status !== testStatusEnum.CURRENT.value ? 'other' : response.asset_status;
    const messageFragment = <StyledBox>{savedDialogMessages[key](response, locale.form.dialogLabels)}</StyledBox>;
    return locale.form.saveSuccessConfirmation(locale.form.defaultSaveSuccessTitle, messageFragment);
};
