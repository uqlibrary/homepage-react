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
import IconButton from '@material-ui/core/IconButton';

import ClearIcon from '@material-ui/icons/Clear';

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

const InspectionsByLicencedUser = ({
    actions,
    userInspections,
    totalInspections,
    licencedUsers,
    userInspectionsLoading,
    userInspectionsLoaded,
    userInspectionsError,
    licencedUsersLoading,
    licencedUsersLoaded,
    licencedUsersError,
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
    const [inspectorName, setInspectorName] = React.useState([]);
    const [selectedStartDate, setSelectedStartDate] = React.useState({ date: null, dateFormatted: null });
    const [selectedEndDate, setSelectedEndDate] = React.useState({ date: null, dateFormatted: null });
    const handleStartDateChange = date => {
        setSelectedStartDate({
            date: date,
            dateFormatted: !!date ? date.format('yyyy-MM-DD') : null,
        });
    };
    const handleEndDateChange = date => {
        setSelectedEndDate({
            date: date,
            dateFormatted: !!date ? date.format('yyyy-MM-DD') : null,
        });
    };
    const pageLocale = locale.pages.report.inspectionsByLicencedUser;
    const classes = useStyles();

    const { row, setRow } = useDataTableRow();

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: false,
    });

    const reportSearch = () => {
        actions
            .getInspectionsByLicencedUser({
                startDate: selectedStartDate.dateFormatted,
                endDate: selectedEndDate.dateFormatted,
                userRange: inspectorName.toString(),
            })
            .catch(e => console.log('ERROR!', e));
    };

    const [apiError, setApiError] = useState(licencedUsersError || userInspectionsError);

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

    const handleInspectorChange = event => {
        setInspectorName(event.target.value);
    };

    // Action for firing should be on a different method (and same with the dates).
    const handleInspectorClose = event => {
        console.log('Close', event);
        console.log('InspectorName', inspectorName.toString());
        reportSearch();
    };
    const handleStartClearClick = () => {
        setSelectedStartDate({ date: null, dateFormatted: null });
    };
    const handleDateClose = () => {
        if (!!selectedStartDate.date && !!selectedEndDate.date) {
            if (selectedEndDate.date >= selectedStartDate.date) {
                reportSearch();
            } else {
                console.log('Date range is impossible');
            }
        } else {
            console.log('Both dates must be present');
        }
        // console.log(selectedStartDate.format('yyyy-MM-DD'));
    };

    function getNameStyles(name, inspectorName, theme) {
        return {
            fontWeight:
                inspectorName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    useEffect(() => {
        if (!!apiError) {
            openConfirmationAlert(apiError, 'error');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiError]);

    useEffect(() => {
        if (!!!licencedUsers || licencedUsers.length < 1) {
            actions.getLicencedUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [licencedUsers]);

    useEffect(() => {
        actions.getInspectionsByLicencedUser({ startDate: null, endDate: null, userRange: null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                <InputLabel id="inspector-name-selector-label">Inspector Name</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="inspector-name-selector-label"
                                    id="inspector-name-selector"
                                    multiple
                                    disabled={!!userInspectionsLoading}
                                    value={inspectorName}
                                    onChange={handleInspectorChange}
                                    onClose={handleInspectorClose}
                                    input={<Input id="inspector-selector-input" />}
                                    renderValue={selected => {
                                        return (
                                            <div className={classes.chips}>
                                                {!!selected &&
                                                    licencedUsers
                                                        .filter(user => selected.includes(user.user_id))
                                                        .slice(0, 2) // Extract the first two users
                                                        .map(value => value.user_name)
                                                        .concat(
                                                            selected.length > 2
                                                                ? ` (and ${selected.length - 2} more)`
                                                                : [],
                                                        )
                                                        .join(', ')}
                                            </div>
                                        );
                                    }}
                                    MenuProps={MenuProps}
                                >
                                    {licencedUsers.map(user => (
                                        <MenuItem
                                            key={user.user_id}
                                            value={user.user_id}
                                            style={getNameStyles(user, inspectorName, theme)}
                                        >
                                            {user.user_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/* Start Date */}
                            <KeyboardDatePicker
                                InputProps={{
                                    endAdornment: selectedStartDate.date && (
                                        <IconButton aria-label="clear date" onClick={handleStartClearClick} edge="end">
                                            <ClearIcon />
                                        </IconButton>
                                    ),
                                }}
                                fullWidth
                                disabled={!!userInspectionsLoading}
                                classes={{ root: classes.datePickerRoot }}
                                disableToolbar
                                variant="inline"
                                format="DD/MM/yyyy"
                                margin="normal"
                                id="inspections-start-date"
                                label="Inspection Start Date"
                                value={selectedStartDate.date}
                                onChange={handleStartDateChange}
                                onClose={handleDateClose}
                                KeyboardButtonProps={{
                                    'aria-label': 'change start date',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/* End Date */}
                            <KeyboardDatePicker
                                fullWidth
                                disabled={!!userInspectionsLoading}
                                classes={{ root: classes.datePickerRoot }}
                                disableToolbar
                                variant="inline"
                                format="DD/MM/yyyy"
                                margin="normal"
                                id="inspections-end-date"
                                label="Inspection End Date"
                                value={selectedEndDate.date}
                                onChange={handleEndDateChange}
                                onClose={handleDateClose}
                                KeyboardButtonProps={{
                                    'aria-label': 'change end date',
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Typography component={'p'}>{totalInspections} Total Inspections.</Typography>
                    </Grid>
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                rows={userInspections}
                                columns={columns}
                                rowId={'user_uid'}
                                loading={userInspectionsLoading}
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

InspectionsByLicencedUser.propTypes = {
    actions: PropTypes.object,
    userInspections: PropTypes.array,
    totalInspections: PropTypes.number,
    licencedUsers: PropTypes.array,
    userInspectionsLoading: PropTypes.bool,
    userInspectionsLoaded: PropTypes.bool,
    userInspectionsError: PropTypes.string,
    licencedUsersLoading: PropTypes.bool,
    licencedUsersLoaded: PropTypes.bool,
    licencedUsersError: PropTypes.string,
};

export default React.memo(InspectionsByLicencedUser);
