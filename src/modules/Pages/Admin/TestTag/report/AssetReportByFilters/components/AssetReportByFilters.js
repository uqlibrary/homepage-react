import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import AssetStatusSelector from '../../../SharedComponents/AssetStatusSelector/AssetStatusSelector';

import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';
import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';

const componentId = 'assets-inspected';
const componentIdLower = 'assets_inspected';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;

// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };

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
    const [apiError, setApiError] = useState(taggedBuildingListError || assetListError);
    const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });
    const [startDateError, setStartDateError] = useState({ error: false, message: '' });
    const [endDateError, setEndDateError] = useState({ error: false, message: '' });

    const { row } = useDataTableRow(assetList);
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: false,
    });

    /* HELPERS */
    const buildPayload = () => ({
        ...config.defaults,
        assetStatus: statusType > 0 ? statusTypes[statusType].status_type : null,
        locationType: 'building',
        locationId: taggedBuildingName > 0 ? taggedBuildingName : null,
        inspectionDateFrom: !!selectedStartDate.dateFormatted ? selectedStartDate.dateFormatted : null,
        inspectionDateTo: !!selectedEndDate.dateFormatted ? selectedEndDate.dateFormatted : null,
    });

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
    const handleTaggedBuildingChange = event => {
        setTaggedBuildingName(event.target.value);
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
                building_name: 'All Buildings',
                building_site_id: -1,
                building_id_displayed: 'All',
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

    useEffect(() => {
        if (!!apiError) openConfirmationAlert(locale.config.alerts.error(apiError), 'error');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiError]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_see_reports]}
        >
            <div className={classes.root}>
                <StandardCard title={pageLocale.form.title} id={componentId}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4}>
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
                        <Grid item xs={12} md={4}>
                            {/* Building Picker */}
                            <FormControl fullWidth className={classes.formControl}>
                                <InputLabel shrink>{pageLocale.form.filterBuildingLabel}</InputLabel>
                                <Select
                                    fullWidth
                                    id={`${componentIdLower}-building`}
                                    data-testid={`${componentIdLower}-building`}
                                    inputProps={{
                                        id: `${componentIdLower}-building-input`,
                                        'data-testid': `${componentIdLower}-building-input`,
                                    }}
                                    disabled={!!taggedBuildingListLoading || !!assetListLoading}
                                    value={taggedBuildingName}
                                    onChange={handleTaggedBuildingChange}
                                >
                                    {!!buildingList &&
                                        buildingList.length > 0 &&
                                        buildingList.map(building => (
                                            <MenuItem
                                                key={building.building_id < 0 ? 9999999999 : building.building_id}
                                                value={building.building_id}
                                                id={`${componentIdLower}-building-option-${building.building_id}`}
                                                data-testid={`${componentIdLower}-building-option-${building.building_id}`}
                                            >
                                                {building.building_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
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
                                label={pageLocale.form.filterTaggedDateFrom}
                                value={selectedStartDate.date}
                                onChange={handleStartDateChange}
                                error={!!startDateError.error}
                                helperText={!!startDateError.error && startDateError.error}
                                KeyboardButtonProps={{
                                    'aria-label': 'change start date',
                                }}
                            />
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
                                label={pageLocale.form.filterTaggedDateTo}
                                value={selectedEndDate.date}
                                onChange={handleEndDateChange}
                                error={!!endDateError.error}
                                helperText={!!endDateError.error && endDateError.error}
                                KeyboardButtonProps={{
                                    'aria-label': 'change end date',
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

AssetReportByFilters.propTypes = {
    actions: PropTypes.object,
    taggedBuildingList: PropTypes.array,
    assetList: PropTypes.array,
    taggedBuildingListLoading: PropTypes.bool,
    taggedBuildingListLoaded: PropTypes.bool,
    taggedBuildingListError: PropTypes.bool,
    assetListLoading: PropTypes.bool,
    assetListLoaded: PropTypes.bool,
    assetListError: PropTypes.bool,
};

export default React.memo(AssetReportByFilters);
