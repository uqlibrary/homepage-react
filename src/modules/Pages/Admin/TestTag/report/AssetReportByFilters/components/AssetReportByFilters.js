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
    const pageLocale = locale.pages.report.inspectionsByLicencedUser;
    const classes = useStyles();
    /* State */
    const [taggedBuildingName, setTaggedBuildingName] = React.useState(-1);
    const [buildingList, setBuildingList] = React.useState([{}]);
    /* HELPERS */
    const handleTaggedBuildingChange = event => {
        setTaggedBuildingName(event.target.value);
    };
    const handleTaggedBuildingClose = () => {
        console.log('handle tagged building close');
    };

    /* UI HANDLERS */

    /* EFFECTS */
    useEffect(() => {
        actions.loadTaggedBuildingList();
    }, []);

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
            console.log('config', config.defaults);
            actions.loadAssetReportByFilters(config.defaults);
        }
    }, [actions, taggedBuildingList]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_see_reports]}
        >
            <div className={classes.root}>
                <StandardCard title={pageLocale.form.title}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            {/* Date Pickers go here */}
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
                                        buildingList.map(building => (
                                            <MenuItem key={building.building_id} value={building.building_id}>
                                                {building.building_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            {/* <DataTable
                                rows={row}
                                columns={columns}
                                rowId={'user_uid'}
                                loading={userInspectionsLoading}
                                classes={{ root: classes.gridRoot }}
                                disableColumnFilter
                                disableColumnMenu
                            /> */}
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
