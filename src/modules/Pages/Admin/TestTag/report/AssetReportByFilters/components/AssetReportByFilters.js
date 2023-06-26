import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Input from '@material-ui/core/Input';

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
    datePickerRoot: {
        marginTop: 0,
    },
}));
export const transformRow = row => {
    return row.map(line => ({
        ...line,
        start_date: moment(line.start_date).format('DD/MM/YYYY'),
        end_date: moment(line.end_date).format('DD/MM/YYYY'),
    }));
};

const AssetReportByFilters = ({
    actions,
    taggedBuildingList,
    assetList,
    taggedBuildingListLoading,
    taggedBuildingListLoaded,
    taggedBuildingListError,
    assetListLoading,
    assetListLoaded,
    assetListError,
}) => {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
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

    const { row, setRow } = useDataTableRow();
    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: false,
    });
    /* HELPERS */
    const buildPayload = () => {
        return {
            ...config.defaults,
            assetStatus: statusType > 0 ? statusTypes[statusType].status_type : null,
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
    const handleTaggedBuildingChange = event => {
        setTaggedBuildingName(event.target.value);
    };
    const handleStatusTypeChange = event => {
        setStatusType(event.target.value);
        // buildPayload();
    };
    const handleStartDateChange = date => {
        console.log('start date', date);
        setSelectedStartDate({ date: date, dateFormatted: !!date ? date.format('yyyy-MM-DD') : null });
    };
    const handleEndDateChange = date => {
        setSelectedEndDate({ date: date, dateFormatted: !!date ? date.format('yyyy-MM-DD') : null });
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
        fetchReport();
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
        if (assetListLoaded) {
            setRow(assetList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetList, assetListLoaded]);

    useEffect(() => {
        if (!!apiError) openConfirmationAlert(apiError, 'error');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiError]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_see_reports]}
        >
            <div className={classes.root}>
                <StandardCard title={pageLocale.form.title}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4}>
                            {/* Status Picker */}
                            <FormControl fullWidth className={classes.formControl}>
                                <InputLabel id="asset-tagged-status-list">
                                    {pageLocale.form.filterStatusLabel}
                                </InputLabel>
                                <Select
                                    fullWidth
                                    labelId="status-type-selector-label"
                                    id="status-type-selector"
                                    disabled={!!taggedBuildingListLoading || !!assetListLoading}
                                    value={statusType}
                                    onChange={handleStatusTypeChange}
                                    // onClose={handleStatusTypeClose}
                                    input={<Input id="status-type-input" />}
                                    MenuProps={MenuProps}
                                >
                                    {!!statusTypes &&
                                        statusTypes.map(type => (
                                            <MenuItem key={type.status_type_id} value={type.status_type_id}>
                                                {type.status_type_rendered}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/* Building Picker */}
                            <FormControl fullWidth className={classes.formControl}>
                                <InputLabel id="asset-tagged-building-list">
                                    {pageLocale.form.filterBuildingLabel}
                                </InputLabel>
                                <Select
                                    fullWidth
                                    labelId="building-name-selector-label"
                                    id="building-name-selector"
                                    disabled={!!taggedBuildingListLoading || !!assetListLoading}
                                    value={taggedBuildingName}
                                    onChange={handleTaggedBuildingChange}
                                    // onClose={handleTaggedBuildingClose}
                                    input={<Input id="building-selector-input" />}
                                    MenuProps={MenuProps}
                                >
                                    {!!buildingList &&
                                        buildingList.length > 0 &&
                                        buildingList.map(building => (
                                            <MenuItem
                                                key={building.building_id < 0 ? 9999999999 : building.building_id}
                                                value={building.building_id}
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
                                fullWidth
                                disabled={!!taggedBuildingListLoading || !!assetListLoading}
                                classes={{ root: classes.datePickerRoot }}
                                disableToolbar
                                variant="inline"
                                format="DD/MM/yyyy"
                                margin="normal"
                                id="inspections-start-date"
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
                                fullWidth
                                disabled={!!taggedBuildingListLoading || !!assetListLoading}
                                classes={{ root: classes.datePickerRoot }}
                                disableToolbar
                                variant="inline"
                                format="DD/MM/yyyy"
                                margin="normal"
                                id="inspections-end-date"
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
