import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

import Grid from '@mui/material/Unstable_Grid2';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

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

import FooterRow from './FooterRow';

const componentId = 'user-inspections';
const componentIdLower = 'user_inspections';

const StyledWrapper = styled('div')(({ theme }) => ({
    flexGrow: 1,
    '& .tableMarginTop': {
        marginTop: theme.spacing(2),
    },

    '& .datePickerRoot': {
        marginTop: 0,
    },
}));

const InspectionsByLicencedUser = ({
    actions,
    userInspections,
    totalInspections,
    licencedUsers,
    userInspectionsLoading,

    userInspectionsError,
    licencedUsersLoading,
    licencedUsersLoaded,
    licencedUsersError,
}) => {
    const theme = useTheme();
    const pageLocale = locale.pages.report.inspectionsByLicencedUser;

    const [inspectorName, setInspectorName] = React.useState([]);
    const [selectedStartDate, setSelectedStartDate] = React.useState({ date: null, dateFormatted: null });
    const [selectedEndDate, setSelectedEndDate] = React.useState({ date: null, dateFormatted: null });
    const [startDateError, setStartDateError] = useState({ error: false, message: '' });
    const [endDateError, setEndDateError] = useState({ error: false, message: '' });

    const onCloseConfirmationAlert = () => {
        if (!!userInspectionsError) actions.clearInspectionsError();
        if (!!licencedUsersError) actions.clearLicencedUsersError();
    };
    const { confirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage: userInspectionsError || licencedUsersError,
        errorMessageFormatter: locale.config.alerts.error,
    });

    const { columns } = useDataTableColumns({
        config,
        locale: pageLocale.form.columns,
        withActions: false,
    });
    const { row } = useDataTableRow(userInspections, transformRow);

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
    const handleInspectorChange = event => {
        setInspectorName(event.target.value);
    };

    useEffect(() => {
        let shouldCallReport = true;
        if (!!!selectedStartDate.date && !!!selectedEndDate.date) {
            clearDateErrors();
        } else {
            if (!!selectedStartDate.date && !!selectedEndDate.date) {
                if (selectedEndDate.date >= selectedStartDate.date) {
                    clearDateErrors();
                } else {
                    shouldCallReport = false;
                    setStartDateError({
                        error: true,
                        message: pageLocale.form.errors.startDateBeforeEnd,
                    });
                    setEndDateError({
                        error: true,
                        message: pageLocale.form.errors.endDateAfterStart,
                    });
                }
            } else {
                if (!!!selectedStartDate.date) {
                    shouldCallReport = false;
                    setStartDateError({
                        error: true,
                        message: pageLocale.form.errors.startDateRequired,
                    });
                }
                if (!!!selectedEndDate.date) {
                    shouldCallReport = false;
                    setEndDateError({
                        error: true,
                        message: pageLocale.form.errors.endDateRequired,
                    });
                }
            }
        }
        if (shouldCallReport) {
            actions.getInspectionsByLicencedUser({
                startDate: selectedStartDate.dateFormatted,
                endDate: selectedEndDate.dateFormatted,
                userRange: inspectorName.toString(),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inspectorName, selectedStartDate, selectedEndDate]);

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
            <StyledWrapper>
                <StandardCard title={pageLocale.form.title}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            {/* Date Pickers go here */}
                            <FormControl variant="standard" fullWidth className={'formControl'}>
                                <InputLabel>Inspector Name</InputLabel>
                                <Select
                                    variant="standard"
                                    id={`${componentIdLower}-user-name`}
                                    data-testid={`${componentIdLower}-user-name`}
                                    MenuProps={{
                                        id: `${componentIdLower}-user-name-options`,
                                        'data-testid': `${componentIdLower}-user-name-options`,
                                    }}
                                    inputProps={{
                                        id: `${componentIdLower}-user-name-input`,
                                        ['data-testid']: `${componentIdLower}-user-name-input`,
                                        'aria-label': 'Select Inspector Name',
                                    }}
                                    SelectDisplayProps={{
                                        id: `${componentIdLower}-user-name-select`,
                                        'data-testid': `${componentIdLower}-user-name-select`,
                                    }}
                                    fullWidth
                                    multiple
                                    disabled={!!userInspectionsLoading || !!licencedUsersLoading}
                                    value={inspectorName}
                                    onChange={handleInspectorChange}
                                    renderValue={selected => {
                                        return (
                                            <div className={'chips'}>
                                                {!!selected &&
                                                    licencedUsers
                                                        .filter(user => selected.includes(user.user_id))
                                                        .slice(0, 2) // Extract the first two users
                                                        .map(value => value.user_name)
                                                        .concat(
                                                            selected.length > 2
                                                                ? pageLocale.form.selectedAndMore(selected.length - 2)
                                                                : [],
                                                        )
                                                        .join(', ')}
                                            </div>
                                        );
                                    }}
                                >
                                    {licencedUsers?.map((user, index) => (
                                        <MenuItem
                                            key={user.user_id}
                                            value={user.user_id}
                                            style={getNameStyles(user, inspectorName, theme)}
                                            id={`${componentIdLower}-user-name-option-${index}`}
                                            data-testid={`${componentIdLower}-user-name-option-${index}`}
                                        >
                                            {user.user_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/* Start Date */}
                            <DatePicker
                                inputProps={{
                                    id: `${componentIdLower}-tagged-start-input`,
                                    'data-testid': `${componentIdLower}-tagged-start-input`,
                                    'aria-labelledby': `${componentIdLower}-tagged-start-label`,
                                }}
                                inputFormat={locale.config.format.dateFormatNoTime}
                                disabled={!!userInspectionsLoading || !!licencedUsersLoading}
                                classes={{ root: 'datePickerRoot' }}
                                disableToolbar
                                variant="inline"
                                margin="normal"
                                label={pageLocale.form.keyboardDatePicker.startDateLabel}
                                value={selectedStartDate.date}
                                onChange={startDate =>
                                    (!!!startDate || (!!startDate && startDate.isValid())) &&
                                    handleStartDateChange(startDate)
                                }
                                KeyboardButtonProps={{
                                    'aria-label': pageLocale.form.keyboardDatePicker.startDateAriaLabel,
                                }}
                                autoOk
                                renderInput={params => (
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        {...params}
                                        error={startDateError.error}
                                        helperText={startDateError.error && startDateError.message}
                                        id={`${componentIdLower}-tagged-start`}
                                        data-testid={`${componentIdLower}-tagged-start`}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/* End Date */}
                            <DatePicker
                                inputProps={{
                                    id: `${componentIdLower}-tagged-end-input`,
                                    'data-testid': `${componentIdLower}-tagged-end-input`,
                                    'aria-labelledby': `${componentIdLower}-tagged-start-label`,
                                }}
                                inputFormat={locale.config.format.dateFormatNoTime}
                                disabled={!!userInspectionsLoading || !!licencedUsersLoading}
                                classes={{ root: 'datePickerRoot' }}
                                disableToolbar
                                variant="inline"
                                margin="normal"
                                label={pageLocale.form.keyboardDatePicker.endDateLabel}
                                value={selectedEndDate.date}
                                onChange={endDate =>
                                    (!!!endDate || (!!endDate && endDate.isValid())) && handleEndDateChange(endDate)
                                }
                                KeyboardButtonProps={{
                                    'aria-label': pageLocale.form.keyboardDatePicker.endDateAriaLabel,
                                }}
                                autoOk
                                renderInput={params => (
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        {...params}
                                        helperText={endDateError.error && endDateError.message}
                                        error={endDateError.error}
                                        id={`${componentIdLower}-tagged-end`}
                                        data-testid={`${componentIdLower}-tagged-end`}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} className={'tableMarginTop'}>
                        <Grid item sx={{ flex: 1 }}>
                            <DataTable
                                id={componentId}
                                rows={row}
                                columns={columns}
                                rowId={'user_uid'}
                                loading={userInspectionsLoading}
                                disableColumnFilter
                                disableColumnMenu
                                components={{
                                    Footer: () => (
                                        <FooterRow count={totalInspections} columns={columns} locale={pageLocale} />
                                    ),
                                }}
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
