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
    // selected items for this schedule (store actual DLO items from dlorList)
    const [scheduleItems, setScheduleItems] = React.useState([]);
    // when editing an existing schedule, store its id
    const [editingScheduleId, setEditingScheduleId] = React.useState(null);

    const defaultDate = moment.tz('Australia/Brisbane').startOf('day');

    // add an item to the selected list (if not already present)
    const handleAddToSchedule = item => {
        if (!item) return;
        const exists = scheduleItems.some(si => si.object_public_uuid === item.object_public_uuid);
        if (exists) return;
        setScheduleItems(prev => [...prev, item]);
    };

    // remove selected item by index
    const handleRemoveFromSchedule = idx => {
        setScheduleItems(prev => prev.filter((_, i) => i !== idx));
    };

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadCurrentDLORs();
        }
    }, [dlorList, dlorListError, dlorListLoading, actions]);

    React.useEffect(() => {
        if (!dlorScheduleError && !dlorScheduleLoading && (!dlorSchedule || dlorSchedule.length === 0)) {
            actions.loadDLORSchedules();
        }
    }, [dlorScheduleError, dlorScheduleLoading, dlorSchedule, actions]);

    const handleChange = prop => e => {
        console.log('handleChange', prop, e);
        const theNewValue =
            e.target.hasOwnProperty('checked') && e.target.type !== 'radio' ? e.target.checked : e.target.value;

        const newValues = { ...formValues, schedule_status: true, [prop]: theNewValue };

        setFormValues(newValues);
        console.log('formValues =>', newValues);
    };
    const handleDateChange = prop => newValue => {
        let val = null;
        if (!newValue) {
            val = null;
        } else if (typeof newValue.format === 'function') {
            // normalize to Brisbane timezone and store YYYY-MM-DD
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

    // map stored schedule object uuids to full dlorList items (best-effort)
    const getItemsFromSchedule = schedule => {
        if (!schedule) return [];

        const uuids =
            Array.isArray(schedule.schedule_objects) && schedule.schedule_objects.length
                ? schedule.schedule_objects
                : Array.isArray(schedule.schedule_items) && schedule.schedule_items.length
                ? schedule.schedule_items
                : null;

        // if schedule already stores full objects return them
        if (
            Array.isArray(schedule.schedule_objects) &&
            schedule.schedule_objects.length &&
            typeof schedule.schedule_objects[0] === 'object'
        ) {
            return schedule.schedule_objects;
        }

        if (!uuids) {
            // no object list available on schedule
            return [];
        }

        // match uuids to loaded dlorList entries; if not found create placeholder
        const items = uuids.map(u => {
            const uuid = typeof u === 'string' ? u : u.object_public_uuid || String(u);
            const found = Array.isArray(dlorList) ? dlorList.find(it => it.object_public_uuid === uuid) : null;
            return (
                found || {
                    object_public_uuid: uuid,
                    object_title: 'Unknown title',
                }
            );
        });

        return items;
    };

    // open the modal to edit an existing schedule's items
    const editExistingSchedule = schedule => {
        if (!schedule) return;

        // populate form values from schedule (preserve defaultFormValues)
        const fv = {
            ...defaultFormValues,
            schedule_name: schedule.schedule_name || defaultFormValues.schedule_name,
            schedule_start_date: schedule.schedule_start_date || null,
            schedule_end_date: schedule.schedule_end_date || null,
            schedule_status: schedule.hasOwnProperty('schedule_status')
                ? schedule.schedule_status
                : defaultFormValues.schedule_status,
        };

        setFormValues(fv);
        setScheduleItems(getItemsFromSchedule(schedule));
        setEditingScheduleId(schedule.schedule_id || null);
        setIsEditBoxOpened(true);
    };

    const handleScheduleEdit = (id = null) => {
        // basic logging
        console.log('handleScheduleEdit', id, formValues, scheduleItems);

        // default to today's date when user hasn't explicitly picked dates
        const defaultDate = moment.tz('Australia/Brisbane').startOf('day');
        const newStart = formValues?.schedule_start_date
            ? moment.tz(formValues.schedule_start_date, 'YYYY-MM-DD', 'Australia/Brisbane')
            : defaultDate;
        const newEnd = formValues?.schedule_end_date
            ? moment.tz(formValues.schedule_end_date, 'YYYY-MM-DD', 'Australia/Brisbane')
            : defaultDate;

        if (!newStart.isValid() || !newEnd.isValid()) {
            window.alert('Please provide valid start and end dates for the schedule.');
            return;
        }
        // require end > start (cannot be the same)
        if (!newEnd.isAfter(newStart)) {
            window.alert('End date must be after the start date (cannot be the same).');
            return;
        }

        // find all existing schedules (same state) that truly overlap the new interval
        const overlapping = Array.isArray(dlorSchedule)
            ? dlorSchedule.filter(s => {
                  if (id && s.schedule_id === id) return false;

                  const sStart = s.schedule_start_date
                      ? moment.tz(s.schedule_start_date, 'YYYY-MM-DD', 'Australia/Brisbane')
                      : null;
                  const sEnd = s.schedule_end_date
                      ? moment.tz(s.schedule_end_date, 'YYYY-MM-DD', 'Australia/Brisbane')
                      : null;
                  if (!sStart || !sStart.isValid() || !sEnd || !sEnd.isValid()) return false;

                  // only consider schedules with the same featured state
                  const sStatus = !!s.schedule_status;
                  const newStatus = !!formValues?.schedule_status;
                  if (sStatus !== newStatus) return false;

                  // true overlap (touching endpoints allowed)
                  return newStart.isBefore(sEnd) && newEnd.isAfter(sStart);
              })
            : [];

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

        // prepare payload: ensure dates are provided (default to today) in the expected string format
        const payload = {
            ...formValues,
            schedule_start_date: newStart.tz('Australia/Brisbane').format('YYYY-MM-DD'),
            schedule_end_date: newEnd.tz('Australia/Brisbane').format('YYYY-MM-DD'),
        };

        // proceed to add or edit
        if (!id) {
            actions.addDLORSchedule({
                ...payload,
                items: scheduleItems.map(item => item.object_public_uuid),
            });
        } else {
            actions.editDLORSchedule({
                schedule_id: id,
                ...payload,
                items: scheduleItems.map(item => item.object_public_uuid),
            });
        }

        // close edit box and reset form
        setIsEditBoxOpened(false);
        setFormValues(defaultFormValues);
        setScheduleItems([]);
        setEditingScheduleId(null);
    };
    return (
        <>
            <StandardPage title="DLO Bulk Schedule">
                <Typography variant="h6">Create New Bulk Schedule</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="team_email_new">Schedule name *</InputLabel>
                            <Input
                                id="schedule_name"
                                data-testid="new_schedule_name"
                                required
                                value={formValues?.schedule_name || ''}
                                onChange={handleChange('schedule_name')}
                                type="text"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl variant="standard" fullWidth>
                            {/* optional descriptive label above */}
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
                            label="Shedule start date"
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
                            label="Shedule end date"
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
                        <p>
                            This shedule will set the assigned items to{' '}
                            <b>
                                <u>{!!!formValues?.schedule_status && 'NOT'}</u>
                            </b>{' '}
                            'featured', and will change to{' '}
                            <strong>
                                <u>{!!formValues?.schedule_status && 'NOT'}</u>
                            </strong>{' '}
                            'featured' when the schedule completes.
                            <p>
                                There are currently {scheduleItems.length}{' '}
                                {scheduleItems.length === 1 ? 'item' : 'items'} applied to this schedule
                            </p>
                        </p>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                data-testid="schedule-add-items"
                                onClick={() => setIsEditBoxOpened(true)}
                                disabled={!formValues?.schedule_name}
                            >
                                Add / Edit items
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                data-testid="schedule-confirm-items"
                                disabled={!(formValues?.schedule_name && scheduleItems.length > 0)}
                                onClick={() => handleScheduleEdit(editingScheduleId)}
                            >
                                Save
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Accordion sx={{ marginTop: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="p">Existing Schedules</Typography>
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
                                                <TableRow key={schedule.schedule_id || index}>
                                                    <TableCell sx={{ wordBreak: 'break-word' }}>
                                                        {schedule.schedule_name}{' '}
                                                    </TableCell>
                                                    <TableCell>{schedule.schedule_objects_count || 0}</TableCell>
                                                    <TableCell>
                                                        {!!schedule.schedule_status ? 'Featured' : 'Not Featured'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {schedule.schedule_start_date
                                                            ? moment
                                                                  .tz(
                                                                      schedule.schedule_start_date,
                                                                      'YYYY-MM-DD',
                                                                      'Australia/Brisbane',
                                                                  )
                                                                  .format('DD-MM-YYYY')
                                                            : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {schedule.schedule_end_date
                                                            ? moment
                                                                  .tz(
                                                                      schedule.schedule_end_date,
                                                                      'YYYY-MM-DD',
                                                                      'Australia/Brisbane',
                                                                  )
                                                                  .format('DD-MM-YYYY')
                                                            : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            data-testid="existing-schedule-edit-button"
                                                            data-analyticsid="existing-schedule-edit-button"
                                                            onClick={() => editExistingSchedule(schedule)}
                                                            aria-label="Click to edit schedule"
                                                            size="large"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            data-testid="existing-schedule-delete-button"
                                                            data-analyticsid="existing-schedule-delete-button"
                                                            onClick={() => {
                                                                console.log('Schedule', schedule);
                                                            }}
                                                            aria-label="Click to delete schedule"
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
            <Modal
                open={isEditBoxOpened}
                aria-labelledby="notify-lightbox-title"
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
                        maxHeight: '90vh', // constrain modal height to viewport
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 3,
                        overflow: 'auto', // allow modal content to scroll
                    }}
                >
                    <Typography variant="h6" component="h2" data-testid="Schedule-title">
                        {`Schedule ${formValues?.schedule_name || ''}`}
                    </Typography>
                    <Typography variant="p" component="p" data-testid="Schedule-title">
                        {`Effective from the morning of ${(formValues?.schedule_start_date
                            ? moment.tz(formValues.schedule_start_date, 'Australia/Brisbane')
                            : defaultDate
                        ).format('DD/MM/YYYY')} to the afternoon of ${(formValues?.schedule_end_date
                            ? moment.tz(formValues.schedule_end_date, 'Australia/Brisbane')
                            : defaultDate
                        ).format('DD/MM/YYYY')} - objects to be ${
                            !!formValues?.schedule_status ? 'featured' : 'not featured'
                        }`}
                    </Typography>
                    {scheduleItems.length > 0 && (
                        <>
                            <Typography variant="h6" component="h2" data-testid="Schedule-title">
                                {`Currently selected items for this schedule — ${scheduleItems.length} ${
                                    scheduleItems.length === 1 ? 'item' : 'items'
                                }`}
                            </Typography>

                            {/* Selected items - use fixed table layout + matching column widths */}
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
                                        {scheduleItems.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center" sx={{ py: 1 }}>
                                                    No items selected
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {scheduleItems.map((si, idx) => (
                                            <TableRow key={si.object_public_uuid || idx}>
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
                    <Typography variant="h6" component="h2" data-testid="Schedule-title">
                        {'Add / Edit items to schedule'}
                    </Typography>
                    {/* Dense, scrollable table: reduced padding + smaller fonts for compact modal */}
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
                                                <TableRow key={item.object_public_uuid || index}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsEditBoxOpened(false)}
                            data-testid="schedule-close-button"
                        >
                            {scheduleItems.length > 0 ? 'Assign and close' : 'Close'}
                        </Button>
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
