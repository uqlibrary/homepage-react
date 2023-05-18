import React from 'react';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import clsx from 'clsx';

import { statusEnum } from '../utils/helpers';
import locale from '../../testTag.locale';
const testStatusEnum = statusEnum(locale);

const savedDialogMessages = {
    [testStatusEnum.CURRENT.value]: (data, classes, locale) => (
        <Grid
            container
            item
            xs={12}
            sm={6}
            alignItems="center"
            className={clsx([classes.dialogContainer, classes.dialogPassedContainer])}
        >
            <Grid item xs={12} className={clsx([classes.dialogTitle, classes.dialogSuccessTitle])} variant="subtitle1">
                <Typography gutterBottom>
                    {locale.testedBy} {data.user_licence_number}
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.dialogBarcode}>
                <Typography gutterBottom variant="h6">
                    {data.asset_id_displayed}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.dialogSuccessLineItems} variant="subtitle1">
                <Typography gutterBottom>{locale.testedDate}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.dialogSuccessLineItems} variant="subtitle1">
                <Typography gutterBottom>{data.action_date}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.dialogSuccessLineItems} variant="subtitle1">
                <Typography gutterBottom>{locale.dateNextDue}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.dialogSuccessLineItems} variant="subtitle1">
                <Typography gutterBottom>{data.asset_next_test_due_date ?? locale.notApplicable}</Typography>
            </Grid>
        </Grid>
    ),
    other: (data, classes, locale) => (
        <Grid
            container
            item
            xs={12}
            sm={6}
            alignItems="center"
            className={clsx([classes.dialogContainer, classes.dialogFailedContainer])}
        >
            <Grid item xs={12} className={clsx([classes.dialogTitle, classes.dialogFailedTitle])}>
                <Typography gutterBottom variant="h4">
                    {locale.outOfService}
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.dialogBarcode}>
                <Typography gutterBottom variant="h6">
                    {data.asset_id_displayed}
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.dialogFailedLineItems} variant="subtitle1">
                <Typography gutterBottom data-testid="testTagDialogTaggedBy">
                    {locale.tagPlacedBy}
                    <br />
                    {data.user_licence_number}
                </Typography>
            </Grid>
        </Grid>
    ),
};
export const getSuccessDialog = (response, classes, locale) => {
    if (!!!response || !!!response?.data) return {};
    const { data } = response;
    const key = data.asset_status !== testStatusEnum.CURRENT.value ? 'other' : data.asset_status;
    const messageFragment = (
        <Box display="flex" alignItems="center" justifyContent="center">
            {savedDialogMessages[key](data, classes, locale.form.dialogLabels)}
        </Box>
    );
    return locale.form.saveSuccessConfirmation(locale.form.defaultSaveSuccessTitle, messageFragment);
};
