import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import { KeyboardDatePicker } from '@material-ui/pickers';

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
        backgroundColor: theme.palette.error.light,
    },
    datePickerRoot: {
        marginTop: 0,
    },
}));

const AssetReportByFilters = ({
    actions,
    taggedBuildingList,
    assetList,
    taggedBuildingListLoading,
    taggedBuildingListLoaded,
    taggedBuildingListError,
    assetListLoading,
    // assetListLoaded,
    assetListError,
}) => {
    /* locale and styles */
    const pageLocale = locale.pages.report.assetReportByFilters;
    const statusTypes = pageLocale.form.statusTypes;

    const classes = useStyles();
    /* State */
    const [taggedBuildingName, setTaggedBuildingName] = React.useState(-1);
    const [buildingList, setBuildingList] = React.useState([]);
    const [selectedStartDate, setSelectedStartDate] = React.useState({ date: null, error: null });
    const [selectedEndDate, setSelectedEndDate] = React.useState({ date: null, error: null });
    const [statusType, setStatusType] = React.useState(0);

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

    const fetchReport = () => {
        if (!!selectedStartDate.date && !!selectedEndDate.date) {
            if (selectedEndDate.date >= selectedStartDate.date) {
                clearDateErrors();
                actions.loadAssetReportByFilters(buildPayload());
            } else {
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
            actions.loadAssetReportByFilters(buildPayload());
        }
    };
    /* UI HANDLERS */
    const handleTaggedBuildingChange = location => {
        setTaggedBuildingName(location.building);
    };
    const handleStatusTypeChange = selected => {
        setStatusType(selected.id);
        // buildPayload();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        !!!assetListLoading && fetchReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusType, taggedBuildingName, selectedStartDate, selectedEndDate]);

    useEffect(() => {
        setBuildingList([
            {
                building_id: -1,
                building_name: locale.pages.general.locationPicker.building.labelAll,
                building_site_id: -1,
                building_id_displayed: locale.pages.general.locationPicker.allLabel,
                building_current_flag: 1,
            },
            ...taggedBuildingList,
        ]);
    }, [taggedBuildingList]);

    useEffect(() => {
        if (taggedBuildingList.length > 0 && taggedBuildingListLoaded) {
            buildPayload();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taggedBuildingList, taggedBuildingListLoaded]);

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
                            <KeyboardDatePicker
                                id={`${componentIdLower}-tagged-start`}
                                data-testid={`${componentIdLower}-tagged-start`}
                                inputProps={{
                                    id: `${componentIdLower}-tagged-start-input`,
                                    'data-testid': `${componentIdLower}-tagged-start-input`,
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
                                onChange={handleStartDateChange}
                                error={!!startDateError.error}
                                helperText={!!startDateError.error && startDateError.error}
                                KeyboardButtonProps={{
                                    'aria-label': pageLocale.form.keyboardDatePicker.startDateAriaLabel,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <KeyboardDatePicker
                                id={`${componentIdLower}-tagged-end`}
                                data-testid={`${componentIdLower}-tagged-end`}
                                inputProps={{
                                    id: `${componentIdLower}-tagged-end-input`,
                                    'data-testid': `${componentIdLower}-tagged-end-input`,
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
                                onChange={handleEndDateChange}
                                error={!!endDateError.error}
                                helperText={!!endDateError.error && endDateError.error}
                                KeyboardButtonProps={{
                                    'aria-label': pageLocale.form.keyboardDatePicker.endDateAriaLabel,
                                }}
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
                                {...(config.sort ?? {})}
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
