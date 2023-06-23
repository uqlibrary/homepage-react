import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

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

function getNameStyles(name, inspectorName, theme) {
    return {
        fontWeight:
            inspectorName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    };
}

export const transformRow = row => {
    return row.map(line => ({
        ...line,
        start_date: moment(line.start_date).format('DD/MM/YYYY'),
        end_date: moment(line.end_date).format('DD/MM/YYYY'),
    }));
};

const AssetReportByFilters = ({
    // actions,
    // userInspections,
    // totalInspections,
    // licencedUsers,
    // userInspectionsLoading,
    // userInspectionsLoaded,
    // userInspectionsError,
    // licencedUsersLoading,
    // licencedUsersLoaded,
    // licencedUsersError,
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
    const theme = useTheme();
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
    const [selectedStartDate, setselectedStartDate] = React.useState({ date: null, error: null });
    const [selectedEndDate, setSelectedEndDate] = React.useState({ date: null, error: null });
    const [statusType, setStatusType] = React.useState(0);

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
            inspectionDateFrom: !!selectedStartDate.date ? selectedStartDate.date : null,
            inspectionDateTo: !!selectedEndDate.date ? selectedEndDate.date : null,
        };
    };

    const fetchReport = () => {
        console.log('Building Report Payload', buildPayload());
        actions.loadAssetReportByFilters(buildPayload());
    };

    const handleTaggedBuildingChange = event => {
        setTaggedBuildingName(event.target.value);
        // console.log('BuildPayload', buildPayload());
    };
    const handleTaggedBuildingClose = () => {
        console.log('handle tagged building close');
        console.log('BuildPayload', buildPayload());
    };
    const handleStatusTypeChange = event => {
        setStatusType(event.target.value);
        // buildPayload();
    };
    const handleStatusTypeClose = () => {
        console.log('handle status type close');
    };

    const handleStartDateChange = () => {
        console.log('start date');
    };
    const handleStartDateClose = () => {
        console.log('start date close');
    };

    /* UI HANDLERS */

    /* EFFECTS */
    useEffect(() => {
        actions.loadTaggedBuildingList();
    }, []);

    useEffect(() => {
        console.log('Fetching Report');
        fetchReport();
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
        if (taggedBuildingList.length > 0) {
            // console.log('config', config.defaults);
            buildPayload();
        }
    }, [taggedBuildingList]);

    useEffect(() => {
        if (!!assetList && assetList.length > 0) {
            setRow(assetList);
        }
    }, [assetList]);

    console.log('Asset List', assetList);
    console.log('Status Types', statusTypes);

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
                                <InputLabel id="asset-tagged-status-list">With Status</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="status-type-selector-label"
                                    id="status-type-selector"
                                    disabled={!!taggedBuildingListLoading || !!assetListLoading}
                                    value={statusType}
                                    onChange={handleStatusTypeChange}
                                    onClose={handleStatusTypeClose}
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
                                <InputLabel id="asset-tagged-building-list">Building Name</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="building-name-selector-label"
                                    id="building-name-selector"
                                    disabled={!!taggedBuildingListLoading || !!assetListLoading}
                                    value={taggedBuildingName}
                                    onChange={handleTaggedBuildingChange}
                                    onClose={handleTaggedBuildingClose}
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
                                label="Tagged date from"
                                value={selectedStartDate.date}
                                onChange={handleStartDateChange}
                                onBlur={handleStartDateClose}
                                onClose={handleStartDateClose}
                                error={!!selectedStartDate.error}
                                helperText={!!selectedStartDate.error && selectedStartDate.error}
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
                                id="inspections-start-date"
                                label="Tagged date to"
                                value={selectedStartDate.date}
                                onChange={handleStartDateChange}
                                onBlur={handleStartDateClose}
                                onClose={handleStartDateClose}
                                error={!!selectedStartDate.error}
                                helperText={!!selectedStartDate.error && selectedStartDate.error}
                                KeyboardButtonProps={{
                                    'aria-label': 'change start date',
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
                    {/* <ConfirmationAlert
                        isOpen={confirmationAlert.visible}
                        message={confirmationAlert.message}
                        type={confirmationAlert.type}
                        closeAlert={closeConfirmationAlert}
                        autoHideDuration={confirmationAlert.autoHideDuration}
                    /> */}
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
