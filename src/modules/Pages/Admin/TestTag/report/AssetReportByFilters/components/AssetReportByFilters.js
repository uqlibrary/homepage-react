import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import AssetStatusSelector from '../../../SharedComponents/AssetStatusSelector/AssetStatusSelector';
import LocationPicker from '../../../SharedComponents/LocationPicker/LocationPicker';

import { useConfirmationAlert } from '../../../helpers/hooks';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';

const moment = require('moment');

const componentId = 'assets-inspected';
const componentIdLower = 'assets_inspected';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(2),
    },
    inspectionOverdue: {
        backgroundColor: theme.palette.error.main,
        color: 'white',
    },
    datePickerRoot: {
        marginTop: 0,
    },
}));

const AssetReportByFilters = ({
    actions,
    taggedBuildingList,
    taggedBuildingListLoading,
    taggedBuildingListLoaded,
    taggedBuildingListError,
    assetList,
    assetListLoading,
    assetListError,
}) => {
    /* locale and styles */
    const pageLocale = locale.pages.report.assetReportByFilters;
    const statusTypes = pageLocale.form.statusTypes;

    const today = moment().format(locale.config.format.dateFormatNoTime);

    const classes = useStyles();
    /* State */
    const [taggedBuildingName, setTaggedBuildingName] = React.useState(-1);
    const [selectedStartDate, setSelectedStartDate] = React.useState({ date: null, error: null });
    const [selectedEndDate, setSelectedEndDate] = React.useState({ date: null, error: null });
    const [statusType, setStatusType] = React.useState(0);

    const buildingList = useMemo(() => {
        /* istanbul ignore else */
        if (taggedBuildingList.length > 0 && taggedBuildingListLoaded) {
            return [
                {
                    building_id: -1,
                    building_name: locale.pages.general.locationPicker.building.labelAll,
                    building_site_id: -1,
                    building_id_displayed: locale.pages.general.locationPicker.allLabel,
                    building_current_flag: 1,
                },
                ...taggedBuildingList,
            ];
        }
        /* istanbul ignore next */
        return [];
    }, [taggedBuildingList, taggedBuildingListLoaded]);

    const onCloseConfirmationAlert = () => {
        if (!!taggedBuildingListError) actions.clearTaggedBuildingListError();
        if (!!assetListError) actions.clearAssetReportByFiltersError();
    };
    const { confirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: taggedBuildingListError || assetListError,
        errorMessageFormatter: locale.config.alerts.error,
    });

    const [startDateError, setStartDateError] = useState({ error: false, message: '' });
    const [endDateError, setEndDateError] = useState({ error: false, message: '' });

    const { row } = useDataTableRow(assetList);
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: false,
    });

    /* HELPERS */
    const buildPayload = () => {
        return {
            ...config.defaults,
            assetStatus: statusType > 0 ? statusTypes[statusType].value : null,
            locationType: 'building',
            locationId: taggedBuildingName > 0 ? taggedBuildingName : null,
            inspectionDateFrom: !!selectedStartDate.dateFormatted ? selectedStartDate.dateFormatted : null,
            inspectionDateTo: !!selectedEndDate.dateFormatted ? selectedEndDate.dateFormatted : null,
        };
    };

    const clearDateErrors = () => {
        setStartDateError({
            error: false,
            message: '',
        });
        setEndDateError({
            error: false,
            message: '',
        });
    };

    /* UI HANDLERS */
    const handleTaggedBuildingChange = location => {
        setTaggedBuildingName(location.building);
    };
    const handleStatusTypeChange = selected => {
        setStatusType(selected.id);
    };
    const handleStartDateChange = date => {
        setSelectedStartDate({
            date: date,
            dateFormatted: !!date ? date.format(locale.config.format.dateFormatNoTime) : null,
        });
    };
    const handleEndDateChange = date => {
        setSelectedEndDate({
            date: date,
            dateFormatted: !!date ? date.format(locale.config.format.dateFormatNoTime) : null,
        });
    };

    /* EFFECTS */
    useEffect(() => {
        actions.loadTaggedBuildingList();
        buildPayload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        /* istanbul ignore else */
        if (!!!assetListLoading) {
            let shouldCallReport = true;
            if (!!selectedStartDate.date && !!selectedEndDate.date) {
                if (selectedEndDate.date >= selectedStartDate.date) {
                    clearDateErrors();
                } else {
                    shouldCallReport = false;
                    setStartDateError({
                        error: true,
                        message: pageLocale.errors.startDate,
                    });
                    setEndDateError({
                        error: true,
                        message: pageLocale.errors.endDate,
                    });
                }
            } else {
                clearDateErrors();
            }
            if (shouldCallReport) {
                actions.loadAssetReportByFilters(buildPayload());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusType, taggedBuildingName, selectedStartDate, selectedEndDate]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_see_reports]}
        >
            <div className={classes.root}>
                <StandardCard title={pageLocale.form.title} id={componentId}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={3}>
                            {/* Status Picker */}
                            <AssetStatusSelector
                                id={componentId}
                                label={pageLocale.form.filterStatusLabel}
                                onChange={handleStatusTypeChange}
                                options={statusTypes}
                                initialOptionIndex={0}
                                disabled={!!taggedBuildingListLoading || !!assetListLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            {/* Building Picker */}
                            <LocationPicker
                                id={componentIdLower}
                                locale={{
                                    building: { label: pageLocale.form.filterBuildingLabel },
                                }}
                                hide={['site', 'floor', 'room']}
                                buildingList={buildingList}
                                buildingListLoading={taggedBuildingListLoading}
                                withGrid={false}
                                setLocation={handleTaggedBuildingChange}
                                location={{ building: taggedBuildingName }}
                                hasAllOption
                                disabled={!!taggedBuildingListLoading || !!assetListLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            {/* Start Date */}
                            <DatePicker
                                id={`${componentIdLower}-tagged-start`}
                                data-testid={`${componentIdLower}-tagged-start`}
                                inputProps={{
                                    id: `${componentIdLower}-tagged-start-input`,
                                    'data-testid': `${componentIdLower}-tagged-start-input`,
                                    'aria-labelledby': `${componentIdLower}-tagged-start-label`,
                                }}
                                format={locale.config.format.dateFormatNoTime}
                                fullWidth
                                disabled={!!taggedBuildingListLoading || !!assetListLoading}
                                classes={{ root: classes.datePickerRoot }}
                                disableToolbar
                                variant="inline"
                                margin="normal"
                                label={pageLocale.form.keyboardDatePicker.startDateLabel}
                                value={selectedStartDate.date}
                                onChange={startDate =>
                                    (!!!startDate || (!!startDate && startDate.isValid())) &&
                                    handleStartDateChange(startDate)
                                }
                                error={!!startDateError.error}
                                helperText={!!startDateError.error && startDateError.message}
                                KeyboardButtonProps={{
                                    'aria-label': pageLocale.form.keyboardDatePicker.startDateAriaLabel,
                                }}
                                autoOk
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <DatePicker
                                id={`${componentIdLower}-tagged-end`}
                                data-testid={`${componentIdLower}-tagged-end`}
                                inputProps={{
                                    id: `${componentIdLower}-tagged-end-input`,
                                    'data-testid': `${componentIdLower}-tagged-end-input`,
                                    'aria-labelledby': `${componentIdLower}-tagged-end-label`,
                                }}
                                format={locale.config.format.dateFormatNoTime}
                                fullWidth
                                disabled={!!taggedBuildingListLoading || !!assetListLoading}
                                classes={{ root: classes.datePickerRoot }}
                                disableToolbar
                                variant="inline"
                                margin="normal"
                                label={pageLocale.form.keyboardDatePicker.endDateLabel}
                                value={selectedEndDate.date}
                                onChange={endDate =>
                                    (!!!endDate || (!!endDate && endDate.isValid())) && handleEndDateChange(endDate)
                                }
                                error={!!endDateError.error}
                                helperText={!!endDateError.error && endDateError.message}
                                KeyboardButtonProps={{
                                    'aria-label': pageLocale.form.keyboardDatePicker.endDateAriaLabel,
                                }}
                                autoOk
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                id={componentId}
                                rows={row}
                                columns={columns}
                                rowId={'asset_id'}
                                rowKey={'asset_id'}
                                loading={!!assetListLoading}
                                getCellClassName={params =>
                                    params.field === 'asset_next_test_due_date' && params.value <= today
                                        ? classes.inspectionOverdue
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
            </div>
        </StandardAuthPage>
    );
};

AssetReportByFilters.propTypes = {
    actions: PropTypes.object,
    taggedBuildingList: PropTypes.array,
    assetList: PropTypes.array,
    taggedBuildingListLoading: PropTypes.bool,
    taggedBuildingListLoaded: PropTypes.bool,
    taggedBuildingListError: PropTypes.string,
    assetListLoading: PropTypes.bool,
    assetListLoaded: PropTypes.bool,
    assetListError: PropTypes.string,
};

export default React.memo(AssetReportByFilters);
