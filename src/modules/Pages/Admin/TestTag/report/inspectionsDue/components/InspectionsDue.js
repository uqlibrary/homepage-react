import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { useSelector } from 'react-redux';

import Grid from '@mui/material/Unstable_Grid2';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import DataTable from '../../../SharedComponents/DataTable/DataTable';
import AutoLocationPicker from '../../../SharedComponents/LocationPicker/AutoLocationPicker';
import MonthsSelector from '../../../SharedComponents/MonthsSelector/MonthsSelector';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import { useLocation, useSelectLocation } from '../../../SharedComponents/LocationPicker/LocationPickerHooks';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import { useConfirmationAlert } from '../../../helpers/hooks';

import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import { transformRow } from './utils';

const moment = require('moment');

const componentId = 'inspections-due';

const StyledWrapper = styled('div')(({ theme }) => ({
    flexGrow: 1,
    '& .tableMarginTop': {
        marginTop: theme.spacing(2),
    },
    '& .inspectionOverdue': {
        backgroundColor: theme.palette.error.main,
        color: 'white',
    },
}));

const InspectionsDue = ({
    actions,
    inspectionsDue,
    inspectionsDueLoading,

    inspectionsDueError,
}) => {
    const pageLocale = locale.pages.report.inspectionsDue;
    const monthsOptions = locale.config.monthsOptions;

    const store = useSelector(state => state.get('testTagLocationReducer'));
    const { location, setLocation } = useLocation();
    const { lastSelectedLocation } = useSelectLocation({
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
    const { row } = useDataTableRow(inspectionsDue, transformRow);
    const qsPeriodValue = new URLSearchParams(window.location.search)?.get('period');
    const [monthRange, setMonthRange] = useState(qsPeriodValue ?? config.defaults.monthsPeriod);

    const onCloseConfirmationAlert = () => actions.clearInspectionsDueError();
    const { confirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: inspectionsDueError,
        errorMessageFormatter: locale.config.alerts.error,
    });

    useEffect(() => {
        const locationId = location[lastSelectedLocation];

        actions.getInspectionsDue({
            period: monthRange,
            periodType: 'month',
            ...(!!locationId && locationId !== -1 ? { locationId, locationType: lastSelectedLocation } : {}),
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastSelectedLocation, location, monthRange]);

    const today = moment().format(locale.config.format.dateFormatNoTime);

    const onMonthRangeChange = value => {
        setMonthRange(value);
    };

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_see_reports]}
        >
            <StyledWrapper>
                <StandardCard title={pageLocale.form.title}>
                    <Grid container spacing={3}>
                        <AutoLocationPicker
                            id={componentId}
                            actions={actions}
                            location={location}
                            setLocation={setLocation}
                            hasAllOption
                            locale={locale.pages.general.locationPicker}
                        />
                        <Grid>
                            <MonthsSelector
                                id={componentId}
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
                                classNames={{ formControl: 'formControl', select: 'formSelect' }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} className={'tableMarginTop'}>
                        <Grid sx={{ flex: 1 }}>
                            <DataTable
                                id={componentId}
                                rows={row}
                                columns={columns}
                                rowId={'asset_barcode'}
                                loading={inspectionsDueLoading}
                                getCellClassName={params =>
                                    params.field === 'asset_next_test_due_date' && params.value <= today
                                        ? 'inspectionOverdue'
                                        : ''
                                }
                                {...(config.sort ?? /* istanbul ignore next */ {})}
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
            </StyledWrapper>
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
