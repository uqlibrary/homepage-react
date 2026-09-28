import React, { useMemo, useState } from 'react';

import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Grid } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { standardText } from 'helpers/general';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import {
    displayToastErrorMessage,
    displayToastMessage,
} from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
import {
    buildBulkOutagePayload,
    buildSpaceOutagePayload,
    emptySpaceOutageDraft,
    OUTAGE_SCOPE_OPTIONS,
    formatSpaceOutageDateTimeForDisplay,
    formatSpaceOutageDateTimeForInput,
    getSpaceOutageShowTimePublic,
    getSpaceOutageStatus,
    sortSpaceOutages,
    validateSpaceOutageDraft,
} from './spaceOutageHelpers';

const StyledSummaryBox = styled('div')(({ theme }) => ({
    border: theme.palette.designSystem.border,
    borderRadius: '4px',
    padding: '1rem',
    backgroundColor: '#f9fbfd',
    '& p': {
        marginBlock: '0.25rem',
    },
}));

const StyledStatusPill = styled('span', {
    shouldForwardProp: prop => prop !== 'statusTone',
})(({ theme, statusTone }) => {
    const isDanger = statusTone === 'danger';
    /* istanbul ignore next */
    const color = isDanger ? '#842029' : theme.palette.primary.main;
    /* istanbul ignore next */
    const backgroundColor = isDanger ? '#f8d7da' : '#e8f0fe';

    return {
        display: 'inline-block',
        borderRadius: '999px',
        padding: '0.25rem 0.75rem',
        fontWeight: 600,
        color,
        backgroundColor,
    };
});

const StyledWarningBox = styled('div')(({ theme }) => ({
    marginTop: '0.75rem',
    padding: '0.75rem',
    borderRadius: '4px',
    backgroundColor: '#fffde7',
    border: `1px solid ${theme.palette.warning.light}`,
    display: 'flex',
    alignItems: 'flex-start',
    columnGap: '0.5rem',
    '& p': {
        margin: 0,
    },
}));

const StyledInfoBox = styled('div')(({ theme }) => ({
    border: theme.palette.designSystem.border,
    borderRadius: '4px',
    padding: '1rem',
    backgroundColor: theme.palette.designSystem.panelBackgroundColor,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& th, & td': {
        ...standardText(theme),
        verticalAlign: 'top',
    },
}));

const StyledActionButton = styled(Button)(() => ({
    textTransform: 'none',
    paddingInline: 0,
    minWidth: 'auto',
}));

const isOkResponse = response => response?.status?.toLowerCase?.() === 'ok';

export const SpaceOutagePanel = ({
    actions,
    spaceId,
    spaceName,
    floorId,
    libraryId,
    campusId,
    spaceOutageList,
    spaceOutageListLoading,
    spaceOutageListError,
    mode,
}) => {
    const outages = useMemo(() => sortSpaceOutages(spaceOutageList), [spaceOutageList]);

    const [draft, setDraft] = useState(emptySpaceOutageDraft);
    const [outageScope, setOutageScope] = useState('space');
    const [editingOutageId, setEditingOutageId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingOutageId, setDeletingOutageId] = useState(null);

    const validation = useMemo(
        () => validateSpaceOutageDraft(draft, outages, editingOutageId),
        [draft, outages, editingOutageId],
    );

    const currentOutages = useMemo(
        () => outages.filter(outage => getSpaceOutageStatus(outage) === 'Current'),
        [outages],
    );
    const upcomingOutages = useMemo(
        () => outages.filter(outage => getSpaceOutageStatus(outage) === 'Upcoming'),
        [outages],
    );
    const pastOutages = useMemo(() => outages.filter(outage => getSpaceOutageStatus(outage) === 'Past'), [outages]);
    const activeAndUpcomingOutages = useMemo(
        () => outages.filter(outage => getSpaceOutageStatus(outage) !== 'Past'),
        [outages],
    );

    const isPastOutage = outage => getSpaceOutageStatus(outage) === 'Past';

    const scopeIdMap = {
        space: spaceId,
        floor: floorId,
        library: libraryId,
        campus: campusId,
    };

    const resetDraft = () => {
        setDraft(emptySpaceOutageDraft);
        setEditingOutageId(null);
    };

    const refreshOutages = async () => {
        /* istanbul ignore next */
        if (!spaceId) {
            return;
        }
        await actions.loadBookableSpaceOutages(spaceId);
    };

    const handleDraftChange = fieldName => event => {
        /* istanbul ignore next */
        let value = event?.target?.type === 'checkbox' ? !!event?.target?.checked : event?.target?.value || '';
        /* istanbul ignore next */
        if (value && typeof value === 'string' && value.length >= 16) {
            const momentValue = require('moment')(
                value,
                ['YYYY-MM-DDTHH:mm', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
                true,
            );
            /* istanbul ignore next */
            if (momentValue.isValid()) {
                value = momentValue.format('YYYY-MM-DDTHH:mm');
            }
        }

        setDraft({
            ...draft,
            [fieldName]: value,
        });
    };

    const getFieldError = fieldName => validation.errors.find(error => error.field === fieldName)?.message || '';

    /* istanbul ignore next */
    const getScopeLabel = () => {
        const matchedOption = OUTAGE_SCOPE_OPTIONS.find(o => o.value === outageScope);
        return matchedOption?.label || 'space';
    };

    /* istanbul ignore next */
    const getStatusTone = () => {
        return currentOutages.length > 0 ? 'danger' : 'normal';
    };

    /* istanbul ignore next */
    const getNextClosureText = () => {
        if (upcomingOutages.length > 0) {
            return `${formatSpaceOutageDateTimeForDisplay(
                upcomingOutages[0]?.space_outage_start,
            )} to ${formatSpaceOutageDateTimeForDisplay(upcomingOutages[0]?.space_outage_end)}`;
        }
        return 'No upcoming closures recorded';
    };

    const getSpaceDisplayName = () => {
        /* istanbul ignore next */
        return spaceName || 'Current space';
    };

    /* istanbul ignore next */
    const isScopeOptionDisabled = option =>
        (option.value === 'floor' && !floorId) ||
        (option.value === 'library' && !libraryId) ||
        (option.value === 'campus' && !campusId);

    /* istanbul ignore next */
    const isOutageEditDisabled = outage => isPastOutage(outage);

    /* istanbul ignore next */
    const isOutageDeleteDisabled = outage =>
        isPastOutage(outage) || String(deletingOutageId) === String(outage?.space_outage_id);

    /* istanbul ignore next */
    const renderClosureTableSection = () => {
        if (spaceOutageListLoading && !outages?.length) {
            return <InlineLoader message="Loading closures" />;
        }
        if (spaceOutageListError) {
            return (
                <StyledInfoBox data-testid="space-outage-load-error">
                    <Typography component={'p'}>
                        Unable to load space closures right now. Please try again later.
                    </Typography>
                </StyledInfoBox>
            );
        }
        if (outages.length === 0) {
            return (
                <StyledInfoBox data-testid="space-outage-empty-state">
                    <Typography component={'p'}>No closures have been recorded for this space.</Typography>
                </StyledInfoBox>
            );
        }

        return (
            <>
                <Typography component={'h4'} variant={'subtitle1'} data-testid="space-outage-scheduled-heading">
                    Current and upcoming closures
                </Typography>
                {activeAndUpcomingOutages.length > 0 ? (
                    renderOutageTable(activeAndUpcomingOutages, 'space-outage-scheduled')
                ) : (
                    <StyledInfoBox data-testid="space-outage-scheduled-empty-state">
                        <Typography component={'p'}>
                            No current or upcoming closures are recorded for this space.
                        </Typography>
                    </StyledInfoBox>
                )}

                <Typography
                    component={'h4'}
                    variant={'subtitle1'}
                    sx={{ mt: 3 }}
                    data-testid="space-outage-past-heading"
                >
                    Past closures
                </Typography>
                {pastOutages.length > 0 ? (
                    renderOutageTable(pastOutages, 'space-outage-past')
                ) : (
                    <StyledInfoBox data-testid="space-outage-past-empty-state">
                        <Typography component={'p'}>No past closures are recorded for this space.</Typography>
                    </StyledInfoBox>
                )}
            </>
        );
    };

    /* istanbul ignore next */
    const handleSave = async () => {
        const currentValidation = validateSpaceOutageDraft(draft, outages, editingOutageId);
        if (currentValidation.errors.length > 0) {
            displayToastErrorMessage(
                `<p>These errors occurred:</p><ul>${currentValidation.errors
                    .map(error => `<li>${error.message}</li>`)
                    .join('')}</ul>`,
            );
            return;
        }

        setIsSaving(true);
        try {
            let response;
            if (editingOutageId) {
                const payload = buildSpaceOutagePayload({ spaceId, draft });
                response = await actions.updateBookableSpaceOutage(payload, editingOutageId);
            } else if (outageScope === 'space') {
                const payload = buildSpaceOutagePayload({ spaceId, draft });
                response = await actions.createBookableSpaceOutage(payload);
            } else {
                const payload = buildBulkOutagePayload({ draft });
                response = await actions.createBookableBulkOutage(payload, outageScope, scopeIdMap[outageScope]);
            }

            if (!isOkResponse(response)) {
                throw new Error(response?.message || 'Unable to save the space unavailability.');
            }

            /* istanbul ignore next */
            const scopeLabel = getScopeLabel();
            displayToastMessage(editingOutageId ? 'Space unavailability updated' : `Closure saved for: ${scopeLabel}`);
            resetDraft();
            await refreshOutages();
        } catch (error) {
            displayToastErrorMessage(error?.message || 'Unable to save the space unavailability.');
        } finally {
            setIsSaving(false);
        }
    };

    /* istanbul ignore next */
    const handleDelete = async outageId => {
        const outageToDelete = outages.find(outage => String(outage?.space_outage_id) === String(outageId));
        /* istanbul ignore next */
        if (isPastOutage(outageToDelete)) {
            displayToastErrorMessage('Past unavailability records are locked for audit purposes.');
            return;
        }

        if (!window.confirm('Delete this unavailability window?')) {
            return;
        }

        setDeletingOutageId(outageId);
        try {
            const response = await actions.deleteBookableSpaceOutage(outageId);
            if (!isOkResponse(response)) {
                throw new Error(response?.message || 'Unable to delete the space unavailability.');
            }

            displayToastMessage('Space unavailability deleted');
            if (String(editingOutageId) === String(outageId)) {
                resetDraft();
            }
            await refreshOutages();
        } catch (error) {
            displayToastErrorMessage(error?.message || 'Unable to delete the space unavailability.');
        } finally {
            setDeletingOutageId(null);
        }
    };

    /* istanbul ignore next */
    const handleEdit = outage => {
        /* istanbul ignore next */
        if (isPastOutage(outage)) {
            displayToastErrorMessage('Past unavailability records are locked for audit purposes.');
            return;
        }

        setEditingOutageId(outage?.space_outage_id);
        setDraft({
            space_outage_start: formatSpaceOutageDateTimeForInput(outage?.space_outage_start),
            space_outage_end: formatSpaceOutageDateTimeForInput(outage?.space_outage_end),
            space_outage_reason: outage?.space_outage_reason || '',
            space_outage_show_time_public: getSpaceOutageShowTimePublic(outage),
        });
    };

    if (mode !== 'edit' || !spaceId) {
        return (
            <StyledInfoBox data-testid="space-outage-add-mode-notice">
                <Typography component={'p'}>
                    Save this space first. Once the record exists, you can return here to manage unavailable periods.
                </Typography>
            </StyledInfoBox>
        );
    }

    /* istanbul ignore next */
    const renderOutageTable = (tableOutages, testIdPrefix) => (
        <TableContainer data-testid={`${testIdPrefix}-table`}>
            <Table aria-label="Space closure list">
                <TableHead>
                    <TableRow>
                        <TableCell>From</TableCell>
                        <TableCell>Until</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableOutages.map(outage => (
                        <StyledTableRow
                            key={outage?.space_outage_id}
                            data-testid={`space-outage-row-${outage?.space_outage_id}`}
                        >
                            <TableCell>{formatSpaceOutageDateTimeForDisplay(outage?.space_outage_start)}</TableCell>
                            <TableCell>{formatSpaceOutageDateTimeForDisplay(outage?.space_outage_end)}</TableCell>
                            <TableCell>{outage?.space_outage_reason || 'No reason supplied'}</TableCell>
                            <TableCell>{getSpaceOutageStatus(outage)}</TableCell>
                            <TableCell align="right">
                                <StyledActionButton
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEdit(outage)}
                                    disabled={isOutageEditDisabled(outage)}
                                    data-testid={`space-outage-edit-${outage?.space_outage_id}`}
                                >
                                    Edit
                                </StyledActionButton>{' '}
                                <StyledActionButton
                                    startIcon={<DeleteOutlineIcon />}
                                    onClick={() => handleDelete(outage?.space_outage_id)}
                                    disabled={isOutageDeleteDisabled(outage)}
                                    data-testid={`space-outage-delete-${outage?.space_outage_id}`}
                                >
                                    Delete
                                </StyledActionButton>
                            </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography component={'h3'} variant={'h6'}>
                    Closures
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <StyledSummaryBox data-testid="space-outage-summary">
                    <Typography component={'p'}>
                        <strong>Space:</strong> {getSpaceDisplayName()}
                    </Typography>
                    <Typography component={'p'} data-testid="space-outage-current-status">
                        <strong>Status:</strong>{' '}
                        <StyledStatusPill statusTone={getStatusTone()}>
                            {
                                /* istanbul ignore next */
                                currentOutages.length > 0 ? 'Unavailable now' : 'Available now'
                            }
                        </StyledStatusPill>
                    </Typography>
                    <Typography component={'p'}>
                        <strong>Next closure:</strong> {getNextClosureText()}
                    </Typography>
                </StyledSummaryBox>
            </Grid>
            <Grid item xs={12}>
                <FormControl component="fieldset" disabled={!!editingOutageId}>
                    <FormLabel component="legend">Apply closure to</FormLabel>
                    <RadioGroup
                        row
                        value={outageScope}
                        onChange={e => setOutageScope(e.target.value)}
                        data-testid="space-outage-scope"
                    >
                        {OUTAGE_SCOPE_OPTIONS.map(option => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        size="small"
                                        inputProps={{ 'data-testid': `space-outage-scope-${option.value}` }}
                                    />
                                }
                                label={option.label}
                                disabled={isScopeOptionDisabled(option)}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
                <TextField
                    id="space_outage_start"
                    label="Unavailable from"
                    type="datetime-local"
                    variant="standard"
                    fullWidth
                    required
                    value={draft?.space_outage_start}
                    onChange={handleDraftChange('space_outage_start')}
                    error={!!getFieldError('space_outage_start')}
                    helperText={getFieldError('space_outage_start')}
                    inputProps={{ 'data-testid': 'space-outage-start' }}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <TextField
                    id="space_outage_end"
                    label="Unavailable until"
                    type="datetime-local"
                    variant="standard"
                    fullWidth
                    required
                    value={draft?.space_outage_end}
                    onChange={handleDraftChange('space_outage_end')}
                    error={!!getFieldError('space_outage_end')}
                    helperText={getFieldError('space_outage_end')}
                    inputProps={{ 'data-testid': 'space-outage-end' }}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="space_outage_reason"
                    label="Reason"
                    variant="standard"
                    fullWidth
                    required
                    multiline
                    minRows={3}
                    value={draft?.space_outage_reason}
                    onChange={handleDraftChange('space_outage_reason')}
                    inputProps={{ 'data-testid': 'space-outage-reason' }}
                />
                {validation.warnings.map((warning, index) => (
                    <StyledWarningBox key={`outage-warning-${index}`} data-testid="space-outage-warning">
                        <WarningAmberIcon />
                        <Typography component={'p'}>{warning.message}</Typography>
                    </StyledWarningBox>
                ))}
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!draft?.space_outage_show_time_public}
                            onChange={handleDraftChange('space_outage_show_time_public')}
                            inputProps={{ 'data-testid': 'space-outage-show-time-public' }}
                        />
                    }
                    label="Show closure times on the public page"
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isSaving}
                    data-testid="space-outage-save-button"
                >
                    {editingOutageId ? 'Update closure' : 'Save closure'}
                </Button>{' '}
                <Button
                    variant="text"
                    onClick={resetDraft}
                    disabled={isSaving}
                    data-testid="space-outage-cancel-button"
                >
                    {editingOutageId ? 'Cancel edit' : 'Clear'}
                </Button>
            </Grid>
            <Grid item xs={12}>
                {renderClosureTableSection()}
            </Grid>
        </Grid>
    );
};

SpaceOutagePanel.propTypes = {
    actions: PropTypes.object,
    spaceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    spaceName: PropTypes.string,
    floorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    libraryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    campusId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    spaceOutageList: PropTypes.any,
    spaceOutageListLoading: PropTypes.any,
    spaceOutageListError: PropTypes.any,
    mode: PropTypes.string,
};

export default React.memo(SpaceOutagePanel);
