import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import DataTable from './../../../SharedComponents/DataTable/DataTable';
import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';

import { useConfirmationAlert } from '../../../helpers/hooks';
import locale from '../../../testTag.locale';
import config from './config';
import { PERMISSIONS } from '../../../config/auth';
import { getNameStyles, transformRow } from './utils';
import { useDataTableColumns, useDataTableRow } from '../../../SharedComponents/DataTable/DataTableHooks';

const componentId = 'user-inspections';
const componentIdLower = 'user_inspections';

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
    // userInspectionsLoaded,
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
    /* locale and styles */
    const pageLocale = locale.pages.report.inspectionsByLicencedUser;
    const classes = useStyles();
    /* State */
    const [inspectorName, setInspectorName] = React.useState([]);
    const [selectedStartDate, setSelectedStartDate] = React.useState({ date: null, dateFormatted: null });
    const [selectedEndDate, setSelectedEndDate] = React.useState({ date: null, dateFormatted: null });
    const [startDateError, setStartDateError] = useState({ error: false, message: '' });
    const [endDateError, setEndDateError] = useState({ error: false, message: '' });
    // const [confirmationAlert, setConfirmationAlert] = React.useState({ message: '', visible: false });

    const onCloseConfirmationAlert = () => {
        if (!!userInspectionsError) actions.clearInspectionsError();
        if (!!licencedUsersError) actions.clearLicencedUsersError();
    };
    const { confirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: userInspectionsError || licencedUsersError,
    });

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: false,
    });
    const { row } = useDataTableRow(userInspections, transformRow);

    /* HELPERS */
    const reportSearch = () => {
        actions
            .getInspectionsByLicencedUser({
                startDate: selectedStartDate.dateFormatted,
                endDate: selectedEndDate.dateFormatted,
                userRange: inspectorName.toString(),
            })
            .catch(e => console.log('ERROR!', e));
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
    const handleInspectorChange = event => {
        setInspectorName(event.target.value);
    };
    const handleInspectorClose = () => {
        reportSearch();
    };

    const handleDateClose = () => {
        if (!!!selectedStartDate.date && !!!selectedEndDate.date) {
            clearDateErrors();
            reportSearch();
        } else {
            if (!!selectedStartDate.date && !!selectedEndDate.date) {
                if (selectedEndDate.date >= selectedStartDate.date) {
                    clearDateErrors();
                    reportSearch();
                } else {
                    setStartDateError({
                        error: true,
                        message: 'Start date must be before End Date',
                    });
                    setEndDateError({
                        error: true,
                        message: 'End date must be after Start Date',
                    });
                }
            } else {
                !!!selectedStartDate.date &&
                    setStartDateError({
                        error: true,
                        message: 'A start date is required to search by date',
                    });
                !!!selectedEndDate.date &&
                    setEndDateError({
                        error: true,
                        message: 'An end date is required to search by date',
                    });
            }
        }
    };

    /* EFFECTS */
    useEffect(() => {
        if (!!!licencedUsers || licencedUsers.length < 1) {
            actions.getLicencedUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [licencedUsers, licencedUsersLoaded]);

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
                                <InputLabel>Inspector Name</InputLabel>
                                <Select
                                    fullWidth
                                    id={`${componentIdLower}-user-name`}
                                    data-testid={`${componentIdLower}-user-name`}
                                    inputProps={{
                                        id: `${componentIdLower}-user-name-input`,
                                        'data-testid': `${componentIdLower}-user-name-input`,
                                    }}
                                    multiple
                                    disabled={!!userInspectionsLoading || !!licencedUsersLoading}
                                    value={inspectorName}
                                    onChange={handleInspectorChange}
                                    onClose={handleInspectorClose}
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
                                            id={`${componentIdLower}-user-name-option-${user.user_id}`}
                                            data-testid={`${componentIdLower}-user-name-option-${user.user_id}`}
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
                                id={`${componentIdLower}-tagged-start`}
                                data-testid={`${componentIdLower}-tagged-start`}
                                inputProps={{
                                    id: `${componentIdLower}-tagged-start-input`,
                                    'data-testid': `${componentIdLower}-tagged-start-input`,
                                }}
                                format={locale.config.format.dateFormatNoTime}
                                fullWidth
                                disabled={!!userInspectionsLoading || !!licencedUsersLoading}
                                classes={{ root: classes.datePickerRoot }}
                                disableToolbar
                                variant="inline"
                                margin="normal"
                                label="Period Start Date"
                                value={selectedStartDate.date}
                                onChange={handleStartDateChange}
                                onBlur={handleDateClose}
                                onClose={handleDateClose}
                                error={startDateError.error}
                                helperText={startDateError.error && startDateError.message}
                                KeyboardButtonProps={{
                                    'aria-label': 'change start date',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/* End Date */}
                            <KeyboardDatePicker
                                id={`${componentIdLower}-tagged-end`}
                                data-testid={`${componentIdLower}-tagged-end`}
                                inputProps={{
                                    id: `${componentIdLower}-tagged-end-input`,
                                    'data-testid': `${componentIdLower}-tagged-end-input`,
                                }}
                                format={locale.config.format.dateFormatNoTime}
                                fullWidth
                                disabled={!!userInspectionsLoading || !!licencedUsersLoading}
                                classes={{ root: classes.datePickerRoot }}
                                disableToolbar
                                variant="inline"
                                margin="normal"
                                label="Period End Date"
                                value={selectedEndDate.date}
                                onChange={handleEndDateChange}
                                onClose={handleDateClose}
                                onBlur={handleDateClose}
                                helperText={endDateError.error && endDateError.message}
                                error={endDateError.error}
                                KeyboardButtonProps={{
                                    'aria-label': 'change end date',
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Typography
                            component={'p'}
                            id={`${componentIdLower}-total-text`}
                            data-testid={`${componentIdLower}-total-text`}
                        >
                            {totalInspections} Total Inspections.
                        </Typography>
                    </Grid>
                    <Grid container spacing={3} className={classes.tableMarginTop}>
                        <Grid item padding={3} style={{ flex: 1 }}>
                            <DataTable
                                id={componentId}
                                rows={row}
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
