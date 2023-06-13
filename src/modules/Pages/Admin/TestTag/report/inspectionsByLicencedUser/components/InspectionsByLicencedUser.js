import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import DataTable from './../../../SharedComponents/DataTable/DataTable';

import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
const moment = require('moment');

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(2),
    },
    gridRoot: {
        border: 0,
    },
    inspectionOverdue: {
        backgroundColor: theme.palette.error.light,
    },
}));

const InspectionsByLicencedUser = ({
    actions,
    inspectionsDue,
    inspectionsDueLoading,
    inspectionsDueLoaded,
    inspectionsDueError,
}) => {
    const pageLocale = locale.pages.report.inspectionsDue;
    const monthsOptions = locale.config.monthsOptions;
    const classes = useStyles();

    const { row, setRow } = useDataTableRow();

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: false,
    });
    const qsPeriodValue = new URLSearchParams(window.location.search)?.get('period');
    const [monthRange, setMonthRange] = useState(qsPeriodValue ?? config.defaults.monthsPeriod);
    const [apiError, setApiError] = useState(inspectionsDueError);

    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
    };
    const openConfirmationAlert = (message, type) => {
        setConfirmationAlert({
            message: message,
            visible: true,
            type: !!type ? type : 'info',
            autoHideDuration: 2000,
            onClose: () => setApiError(null),
        });
    };

    useEffect(() => {
        if (!!apiError) openConfirmationAlert(apiError, 'error');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiError]);

    useEffect(() => {
        // Do what's needed here when triggering the monthRange.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthRange]);

    const today = moment().format(locale.pages.report.config.dateFormatNoTime);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_see_reports]}
        >
            <div className={classes.root}>
                <StandardCard title={pageLocale.form.title}>
                    <Grid container spacing={3}>
                        <Grid item>{/* Date Pickers go here */}</Grid>
                    </Grid>
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={row}
                                columns={columns}
                                rowId={'asset_barcode'}
                                loading={inspectionsDueLoading}
                                classes={{ root: classes.gridRoot }}
                                disableColumnFilter
                                disableColumnMenu
                                getCellClassName={params =>
                                    params.field === 'asset_next_test_due_date' && params.value <= today
                                        ? classes.inspectionOverdue
                                        : ''
                                }
                            />
                        </Grid>
                    </Grid>
                    <ConfirmationAlert
                        isOpen={confirmationAlert.visible}
                        message={confirmationAlert.message}
                        type={confirmationAlert.type}
                        closeAlert={closeConfirmationAlert}
                        autoHideDuration={confirmationAlert.autoHideDuration}
                    />
                </StandardCard>
            </div>
        </StandardAuthPage>
    );
};

InspectionsByLicencedUser.propTypes = {
    actions: PropTypes.object,
    inspectionsDue: PropTypes.array,
    inspectionsDueLoading: PropTypes.bool,
    inspectionsDueLoaded: PropTypes.bool,
    inspectionsDueError: PropTypes.string,
};

export default React.memo(InspectionsByLicencedUser);
