import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import DataTable from './../../../SharedComponents/DataTable/DataTable';

import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import MonthsSelector from '../../../SharedComponents/MonthsSelector/MonthsSelector';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
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
}));

/*
HERE - NEED TO FINISH THE REST OF THIS REPORT. SENDING REQUESTS TO THE API. THEN UPDATING THE TABLE
*/
const InspectionsDue = ({
    actions,
    inspectionsDue,
    inspectionsDueLoading,
    inspectionsDueLoaded,
    inspectionsDueError,
}) => {
    const pageLocale = locale.pages.report.inspectionsDue;
    const monthsOptions = locale.config.monthsOptions;
    const classes = useStyles();

    const store = useSelector(state => state.get('testTagLocationReducer'));
    const { row, setRow } = useDataTableRow();
    const { location, setLocation } = useLocation();
    const { selectedLocation } = useSelectLocation({
        location,
        setLocation,
        actions,
        store,
    });
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: false,
    });
    const [monthRange, setMonthRange] = useState(config.defaults.monthsPeriod);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLocation, location.site, location.building, location.floor, location.room]);

    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

    const closeConfirmationAlert = () => {
        setConfirmationAlert({ message: '', visible: false, type: confirmationAlert.type });
    };
    const openConfirmationAlert = (message, type) => {
        setConfirmationAlert({ message: message, visible: true, type: !!type ? type : 'info', autoHideDuration: 6000 });
    };

    useEffect(() => {
        if (!!inspectionsDueError) openConfirmationAlert(inspectionsDueError, 'error');
        else {
            if (inspectionsDueLoaded) setRow(inspectionsDue);
            else {
                actions.clearInspectionsDue();
                // locationId = '', locationType = '', period = '', periodType = ''
                const locationId = location[selectedLocation];
                actions.getInspectionsDue({
                    period: monthRange,
                    periodType: 'month',
                    ...(locationId !== -1 ? { locationId, locationType: selectedLocation } : {}),
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inspectionsDue, inspectionsDueLoaded, inspectionsDueError, selectedLocation, location, monthRange]);

    const today = moment().format();

    const onMonthRangeChange = value => {
        setMonthRange(value);
    };

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_see_reports]}
        >
            <div className={classes.root}>
                <StandardCard title={pageLocale.form.title}>
                    <Grid container spacing={3}>
                        <AutoLocationPicker
                            actions={actions}
                            location={location}
                            setLocation={setLocation}
                            hasAllOption
                            locale={locale.pages.general.locationPicker}
                        />
                        <Grid item>
                            <MonthsSelector
                                id="testResultNextDate"
                                label={pageLocale.form.filterToDateLabel}
                                options={monthsOptions}
                                currentValue={monthRange}
                                onChange={onMonthRangeChange}
                                required={false}
                                responsive
                                nextDateTextFormatter={pageLocale.form.filterToDateFormatted}
                                fromDate={today}
                                fromDateFormat={locale.pages.report.config.dateFormat}
                                dateDisplayFormat={locale.pages.report.config.dateFormatDisplay}
                                classNames={{ formControl: classes.formControl, select: classes.formSelect }}
                            />
                        </Grid>
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

InspectionsDue.propTypes = {
    actions: PropTypes.object,
    inspectionsDue: PropTypes.array,
    inspectionsDueLoading: PropTypes.bool,
    inspectionsDueLoaded: PropTypes.bool,
    inspectionsDueError: PropTypes.string,
};

export default React.memo(InspectionsDue);
