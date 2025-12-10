import React from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { StandardPage } from '../../../../App/components/pages';
import { Button, FormControl, FormLabel, Input, InputLabel, Box, Modal } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const moment = require('moment-timezone');

export const DLOBulkSchedule = ({
    actions,
    dlorList,
    dlorListLoading,
    dlorListError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
    account,
    dlorFavouritesList,
    dlorFavouritesLoading,
    dlorFavouritesError,
    dlorTeamList,
    dlorTeamListLoading,
    dlorTeamListError,
    dlorScheduleLoading,
    dlorScheduleError,
    dlorSchedule,
}) => {
    const defaultFormValues = {
        schedule_status: true,
    };
    const [formValues, setFormValues] = React.useState(defaultFormValues);
    const [isEditBoxOpened, setIsEditBoxOpened] = React.useState(false);
    const [scheduleItems, setScheduleItems] = React.useState([]);
    const [editingScheduleId, setEditingScheduleId] = React.useState(null);
    const [formMessage, setFormMessage] = React.useState(null);

    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    const defaultDate = moment.tz('Australia/Brisbane').startOf('day');

    const handleAddToSchedule = item => {
        /* istanbul ignore if */
        if (!item) return;
        const exists = scheduleItems.some(si => si.object_public_uuid === item.object_public_uuid);
        /* istanbul ignore if */
        if (exists) return;
        setScheduleItems(prev => [...prev, item]);
    };

    const handleRemoveFromSchedule = idx => {
        setScheduleItems(prev => prev.filter((_, i) => i !== idx));
    };

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadCurrentDLORs();
        }
    }, [dlorList, dlorListError, dlorListLoading, actions]);

    React.useEffect(() => {
        if (!dlorScheduleError && !dlorScheduleLoading && !dlorSchedule) {
            actions.loadDLORSchedules();
        }
    }, [dlorScheduleError, dlorScheduleLoading, dlorSchedule, actions]);

    const handleChange = prop => e => {
        console.log('handleChange', prop, e);
        const theNewValue = e.target.value;

        const newValues = { ...formValues, schedule_status: true, [prop]: theNewValue };

        setFormValues(newValues);
        console.log('formValues =>', newValues);
    };

    const handleDeleteSchedule = id => {
        const confirmDelete = window.confirm('Are you sure you want to delete this schedule?');
        if (!confirmDelete) return;

        actions
            .deleteDlorSchedule(id)
            .then(() => {
                console.log('Schedule deleted successfully');
                setFormMessage('Schedule deleted successfully');
                setIsAlertOpen(true);
            })
            .catch(err => {
                const msg = err && err.message;
                setFormMessage(msg);
                setIsAlertOpen(true);
                console.error('Schedule delete error', err);
            });
    };
    /* istanbul ignore next */
    const handleDateChange = prop => newValue => {
        let val = null;
        if (!newValue) {
            val = null;
        } else if (typeof newValue.format === 'function') {
            val = moment.tz(newValue, 'Australia/Brisbane').format('YYYY-MM-DD');
        } else if (typeof newValue.toISOString === 'function') {
            val = moment
                .tz(newValue.toISOString().split('T')[0], 'YYYY-MM-DD', 'Australia/Brisbane')
                .format('YYYY-MM-DD');
        } else {
            val = String(newValue);
        }

        handleChange(prop)({ target: { value: val } });
    };

    const getItemsFromSchedule = schedule => {
        // if (!schedule) return [];

        // let uuids = null;
        // if (Array.isArray(schedule.schedule_objects) && schedule.schedule_objects.length) {
        //     uuids = schedule.schedule_objects;
        // } else if (Array.isArray(schedule.schedule_items) && schedule.schedule_items.length) {
        //     uuids = schedule.schedule_items;
        // }

        const uuids = schedule.schedule_objects;

        // if (
        //     Array.isArray(schedule.schedule_objects) &&
        //     schedule.schedule_objects.length &&
        //     typeof schedule.schedule_objects[0] === 'object'
        // ) {
        //     return schedule.schedule_objects;
        // }

        /* istanbul ignore if */

        if (!uuids) {
            return [];
        }

        const items = uuids.map(u => {
            const uuid = u;
            const found = dlorList.find(it => it.object_public_uuid === uuid);
            return found;
        });

        return items;
    };

    const editExistingSchedule = schedule => {
        const fv = {
            ...defaultFormValues,
            schedule_name: schedule.schedule_name,
            schedule_start_date: moment
                .tz(schedule.schedule_start_date, 'YYYY-MM-DD', 'Australia/Brisbane')
                .format('YYYY-MM-DD'),
            schedule_end_date: moment
                .tz(schedule.schedule_end_date, 'YYYY-MM-DD', 'Australia/Brisbane')
                .format('YYYY-MM-DD'),
            schedule_status: schedule.schedule_status,
        };

        setFormValues(fv);
        setScheduleItems(getItemsFromSchedule(schedule));
        setEditingScheduleId(schedule.schedule_id);
        setFormMessage(null);
        setIsEditBoxOpened(true);
    };

    const handleScheduleEditAdd = id => {
        setFormMessage(null);

        const defaultDate = moment.tz('Australia/Brisbane').startOf('day');
        const newStart = formValues?.schedule_start_date
            ? moment.tz(formValues.schedule_start_date, 'YYYY-MM-DD', 'Australia/Brisbane')
            : defaultDate;
        const newEnd = formValues?.schedule_end_date
            ? moment.tz(formValues.schedule_end_date, 'YYYY-MM-DD', 'Australia/Brisbane')
            : /* istanbul ignore next */ defaultDate;

        /* istanbul ignore if */
        if (!newStart.isValid() || !newEnd.isValid()) {
            window.alert('Please provide valid start and end dates for the schedule.');
            return;
        }
        if (!newEnd.isAfter(newStart)) {
            window.alert('End date must be after the start date (cannot be the same).');
            return;
        }

        const overlapping = dlorSchedule.filter(s => {
            if (id && s.schedule_id === id) return false;

            const sStart = moment.tz(s.schedule_start_date, 'YYYY-MM-DD', 'Australia/Brisbane');
            const sEnd = moment.tz(s.schedule_end_date, 'YYYY-MM-DD', 'Australia/Brisbane');

            return newStart.isBefore(sEnd) && newEnd.isAfter(sStart);
        });
        /* istanbul ignore if */
        if (overlapping.length > 0) {
            const list = overlapping
                .map(s => {
                    const start = s.schedule_start_date
                        ? moment.tz(s.schedule_start_date, 'YYYY-MM-DD', 'Australia/Brisbane').format('DD-MM-YYYY')
                        : 'N/A';
                    const end = s.schedule_end_date
                        ? moment.tz(s.schedule_end_date, 'YYYY-MM-DD', 'Australia/Brisbane').format('DD-MM-YYYY')
                        : 'N/A';
                    return `${s.schedule_name || 'Existing schedule'} (${start} → ${end})`;
                })
                .join('\n');

            window.alert(
                `Cannot save schedule: the following existing schedule(s) overlap this time period:\n\n${list}`,
            );
            return;
        }

        const payload = {
            ...formValues,
            schedule_start_date: newStart.tz('Australia/Brisbane').format('YYYY-MM-DD'),
            schedule_end_date: newEnd.tz('Australia/Brisbane').format('YYYY-MM-DD'),
            items: scheduleItems.map(item => item.object_public_uuid),
        };
        const actionPromise = !id
            ? actions.addDLORSchedule(payload) // Call the function directly
            : actions.editDLORSchedule(id, payload); // Call the function directly

        actionPromise
            .then(() => {
                console.log('Schedule saved successfully');
                setFormMessage('Schedule saved successfully');
                setIsEditBoxOpened(false);
                setFormValues(defaultFormValues);
                setScheduleItems([]);
                setEditingScheduleId(null);

                setIsAlertOpen(true);
            })
            .catch(err => {
                const msg = err && err.message;
                setFormMessage(msg);
                setIsAlertOpen(true);
                console.error('Schedule save error', err);
            });
    };
    return (
        <>
            <StandardPage title="Digital Learning Hub - Bulk Scheduling Management">
                <Typography variant="h6" component="h2">
                    Create New Bulk Schedule
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="schedule_name">Schedule name *</InputLabel>
                            <Input
                                id="schedule_name"
                                inputProps={{
                                    'data-testid': 'schedule_name',
                                }}
                                required
                                value={formValues?.schedule_name || ''}
                                onChange={handleChange('schedule_name')}
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl variant="standard" fullWidth>
                            <FormLabel>Status for this schedule</FormLabel>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled
                                        checked
                                        data-testid="schedule_status"
                                        onChange={handleChange('schedule_status')}
                                    />
                                }
                                label="Featured"
                                sx={{ paddingLeft: 0 }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <DatePicker
                            slotProps={{
                                textField: {
                                    'data-testid': 'schedule-start-date',
                                    fullWidth: true,
                                },
                            }}
                            label="Schedule start date"
                            value={
                                formValues?.schedule_start_date
                                    ? moment.tz(formValues.schedule_start_date, 'YYYY-MM-DD', 'Australia/Brisbane')
                                    : moment.tz('Australia/Brisbane')
                            }
                            onChange={handleDateChange('schedule_start_date')}
                            minDate={moment().subtract(12, 'months')}
                            format="DD/MM/YYYY"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <DatePicker
                            slotProps={{
                                textField: {
                                    'data-testid': 'schedule-end-date',
                                    fullWidth: true,
                                },
                            }}
                            label="Schedule end date"
                            value={
                                formValues?.schedule_end_date
                                    ? moment.tz(formValues.schedule_end_date, 'YYYY-MM-DD', 'Australia/Brisbane')
                                    : moment.tz('Australia/Brisbane')
                            }
                            onChange={handleDateChange('schedule_end_date')}
                            format="DD/MM/YYYY"
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="body1" component="div">
                            This schedule will set the assigned items to 'featured', and will change to{' '}
                            <b>
                                <i>NOT</i>
                            </b>
                            'featured' when the schedule completes.
                        </Typography>
                        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                            There are currently {scheduleItems.length} {scheduleItems.length === 1 ? 'item' : 'items'}{' '}
                            applied to this schedule
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                data-testid="schedule-add-items"
                                onClick={() => {
                                    setFormMessage(null);
                                    setIsAlertOpen(false);
                                    setIsEditBoxOpened(true);
                                }}
                                disabled={!formValues?.schedule_name}
                            >
                                Add / Edit items
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                data-testid="schedule-confirm-items"
                                disabled={!(formValues?.schedule_name && scheduleItems.length > 0)}
                                onClick={() => handleScheduleEditAdd(editingScheduleId)}
                            >
                                Save
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Accordion sx={{ marginTop: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" component="h2">
                                Existing Schedules
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <strong>Schedule Name</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Object Count</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Schedule Status</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Start Date</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>End Date</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Actions</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {!!dlorSchedule &&
                                            dlorSchedule.length > 0 &&
                                            dlorSchedule.map((schedule, index) => (
                                                <TableRow key={schedule.schedule_id}>
                                                    <TableCell sx={{ wordBreak: 'break-word' }}>
                                                        {schedule.schedule_name}{' '}
                                                    </TableCell>
                                                    <TableCell>{schedule.object_count}</TableCell>
                                                    <TableCell>Featured</TableCell>
                                                    <TableCell>
                                                        {moment
                                                            .tz(
                                                                schedule.schedule_start_date,
                                                                'YYYY-MM-DD',
                                                                'Australia/Brisbane',
                                                            )
                                                            .format('DD-MM-YYYY')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {moment
                                                            .tz(
                                                                schedule.schedule_end_date,
                                                                'YYYY-MM-DD',
                                                                'Australia/Brisbane',
                                                            )
                                                            .format('DD-MM-YYYY')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            data-testid={`existing-schedule-edit-button-${index}`}
                                                            data-analyticsid={`existing-schedule-edit-button-${index}`}
                                                            onClick={() => editExistingSchedule(schedule)}
                                                            aria-label={`Click to edit schedule: ${schedule.schedule_name}`}
                                                            size="large"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            data-testid={`existing-schedule-delete-button-${index}`}
                                                            data-analyticsid={`existing-schedule-delete-button-${index}`}
                                                            onClick={() => {
                                                                handleDeleteSchedule(schedule.schedule_id);
                                                            }}
                                                            aria-label={`Click to delete schedule: ${schedule.schedule_name}`}
                                                            size="large"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </StandardPage>
            <Snackbar
                id={'dlor-schedule-alert'}
                data-testid={'dlor-schedule-alert'}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={isAlertOpen}
                message={formMessage}
            >
                <Alert
                    onClose={() => setIsAlertOpen(false)}
                    severity={formMessage && formMessage.toLowerCase().includes('successfully') ? 'success' : 'error'}
                    id={'dlor-schedule-alert-info'}
                    data-testid={'dlor-schedule-alert-info'}
                >
                    {formMessage}
                </Alert>
            </Snackbar>
            <Modal
                open={isEditBoxOpened}
                aria-labelledby="modal-main-heading"
                aria-describedby="notify-lightbox-description"
                data-testid="notify-lightbox-modal"
                sx={{ zIndex: 1000 }}
                disableEnforceFocus
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: '95vw',
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 3,
                        overflow: 'auto',
                    }}
                >
                    <Typography variant="h6" component="h3" data-testid="Schedule-title" id="modal-main-heading">
                        {formValues?.schedule_name || 'Schedule'}
                    </Typography>
                    {editingScheduleId !== null && (
                        <>
                            <FormControl variant="standard" fullWidth sx={{ mt: 1, mb: 1 }}>
                                <InputLabel htmlFor="modal_schedule_name">Schedule name *</InputLabel>
                                <Input
                                    id="modal_schedule_name"
                                    data-testid="modal_schedule_name"
                                    required
                                    value={formValues?.schedule_name}
                                    onChange={handleChange('schedule_name')}
                                    type="text"
                                />
                            </FormControl>

                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <FormControl variant="standard" fullWidth>
                                        <FormLabel>Status for this schedule</FormLabel>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled
                                                    checked={!!formValues?.schedule_status}
                                                    data-testid="modal_schedule_status"
                                                    onChange={handleChange('schedule_status')}
                                                />
                                            }
                                            label="Featured"
                                            sx={{ paddingLeft: 0, mt: 0.5 }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <DatePicker
                                        slotProps={{
                                            textField: { 'data-testid': 'modal_schedule_start_date', fullWidth: true },
                                        }}
                                        label="Schedule start date"
                                        value={moment.tz(
                                            formValues.schedule_start_date,
                                            'YYYY-MM-DD',
                                            'Australia/Brisbane',
                                        )}
                                        onChange={handleDateChange('schedule_start_date')}
                                        format="DD/MM/YYYY"
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <DatePicker
                                        slotProps={{
                                            textField: { 'data-testid': 'modal_schedule_end_date', fullWidth: true },
                                        }}
                                        label="Schedule end date"
                                        value={moment.tz(
                                            formValues.schedule_end_date,
                                            'YYYY-MM-DD',
                                            'Australia/Brisbane',
                                        )}
                                        onChange={handleDateChange('schedule_end_date')}
                                        format="DD/MM/YYYY"
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}
                    <Typography variant="body2" component="p" data-testid="Schedule-dates" sx={{ mt: 0.5 }}>
                        {`Effective from ${
                            formValues?.schedule_start_date
                                ? moment.tz(formValues.schedule_start_date, 'Australia/Brisbane').format('DD/MM/YYYY')
                                : defaultDate.format('DD/MM/YYYY')
                        } to ${
                            formValues?.schedule_end_date
                                ? moment.tz(formValues.schedule_end_date, 'Australia/Brisbane').format('DD/MM/YYYY')
                                : defaultDate.format('DD/MM/YYYY')
                        } — Featured`}
                    </Typography>
                    {formMessage && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {formMessage}
                        </Typography>
                    )}
                    {scheduleItems.length > 0 && (
                        <>
                            <Typography variant="h6" component="h3" data-testid="Schedule-items-title">
                                {`Currently selected items for this schedule — ${scheduleItems.length} ${
                                    scheduleItems.length === 1 ? 'item' : 'items'
                                }`}
                            </Typography>

                            <TableContainer
                                component={Paper}
                                sx={{
                                    mt: 1,
                                    mb: 1,
                                    maxHeight: '22vh',
                                    overflow: 'auto',
                                    '& .MuiTableCell-root': { py: 0.5, px: 1, fontSize: '0.85rem' },
                                    '& .MuiTableCell-head': { fontSize: '0.9rem', fontWeight: 600 },
                                }}
                            >
                                <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: '30%' }}>
                                                <strong>Selected (to be scheduled)</strong>
                                            </TableCell>
                                            <TableCell sx={{ width: '55%' }}>
                                                <strong>Title</strong>
                                            </TableCell>
                                            <TableCell sx={{ width: '15%' }}>
                                                <strong>Actions</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* istanbul ignore next */
                                        scheduleItems.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center" sx={{ py: 1 }}>
                                                    No items selected
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {scheduleItems.map((si, idx) => (
                                            <TableRow key={si.object_public_uuid}>
                                                <TableCell sx={{ wordBreak: 'break-word' }}>
                                                    {si.object_public_uuid}
                                                </TableCell>
                                                <TableCell sx={{ wordBreak: 'break-word' }}>
                                                    {si.object_title}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleRemoveFromSchedule(idx)}
                                                        data-testid={`remove-selected-item-${idx}`}
                                                        aria-label={`Remove ${si.object_title} from schedule`}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                    <Typography variant="h6" component="h3" data-testid="Schedule-add-edit-title">
                        {'Add / Edit items to schedule'}
                    </Typography>
                    <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: '40vh',
                            overflow: 'auto',
                            mt: 1,
                            '& .MuiTableCell-root': { py: 0.5, px: 1, fontSize: '0.85rem' },
                            '& .MuiTableCell-head': { fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.2 },
                        }}
                    >
                        <Table size="small" stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '30%' }}>Object UUID</TableCell>
                                    <TableCell sx={{ width: '55%' }}>Object Title</TableCell>
                                    <TableCell sx={{ width: '15%' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!!dlorList &&
                                    dlorList
                                        .filter(
                                            item =>
                                                !scheduleItems.some(
                                                    si => si.object_public_uuid === item.object_public_uuid,
                                                ),
                                        )
                                        .map((item, index) => {
                                            return (
                                                <TableRow key={item.object_public_uuid}>
                                                    <TableCell sx={{ wordBreak: 'break-word' }}>
                                                        {item.object_public_uuid}
                                                    </TableCell>
                                                    <TableCell sx={{ wordBreak: 'break-word' }}>
                                                        {item.object_title}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="secondary"
                                                            data-testid={`add-schedule-item-${index}`}
                                                            onClick={() => handleAddToSchedule(item)}
                                                            // ACCESSIBILITY FIX 7: Descriptive aria-label
                                                            aria-label={`Add ${item.object_title} to schedule`}
                                                        >
                                                            Add
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        {editingScheduleId !== null && (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    data-testid="modal-save-button"
                                    disabled={!(formValues?.schedule_name && scheduleItems.length > 0)}
                                    onClick={() => handleScheduleEditAdd(editingScheduleId)}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setIsEditBoxOpened(false)}
                                    data-testid="schedule-close-button"
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                        {!!!editingScheduleId && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsEditBoxOpened(false)}
                                data-testid="schedule-close-button"
                            >
                                {scheduleItems.length > 0 ? 'Assign and close' : 'Close'}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

DLOBulkSchedule.propTypes = {
    actions: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
    dlorFavouritesList: PropTypes.array,
    dlorFavouritesLoading: PropTypes.bool,
    dlorFavouritesError: PropTypes.any,
    account: PropTypes.object,
    dlorTeamList: PropTypes.array,
    dlorTeamListLoading: PropTypes.bool,
    dlorTeamListError: PropTypes.any,
    dlorScheduleLoading: PropTypes.bool,
    dlorScheduleError: PropTypes.any,
    dlorSchedule: PropTypes.array,
};

export default DLOBulkSchedule;
