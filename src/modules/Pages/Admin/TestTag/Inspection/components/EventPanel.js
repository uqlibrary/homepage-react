import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';

import locale from '../../testTag.locale';

const moment = require('moment');
const inputLabelProps = { shrink: true };

const EventPanel = ({
    actions,
    location,
    setLocation,
    actionDate,
    handleChange,
    classes,
    hasInspection = false,
    isMobileView,
}) => {
    EventPanel.propTypes = {
        actions: PropTypes.any.isRequired,
        location: PropTypes.object.isRequired,
        setLocation: PropTypes.func.isRequired,
        actionDate: PropTypes.any,
        handleChange: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
        hasInspection: PropTypes.bool,
        isMobileView: PropTypes.bool,
    };

    const [eventExpanded, setEventExpanded] = React.useState(true);
    const pageLocale = locale.pages.inspect;
    const startDate = moment()
        .startOf('year')
        .subtract(5, 'year')
        .format(pageLocale.config.dateFormat);

    const { inspectionConfig, inspectionConfigLoading } = useSelector(state =>
        state.get?.('testTagOnLoadInspectionReducer'),
    );
    const { floorList, floorListLoading, roomList, roomListLoading } = useSelector(state =>
        state.get?.('testTagLocationReducer'),
    );

    const updateLocation = (update, useRoomId = false) => {
        setLocation(update);
        handleChange('room_id')(useRoomId ? update.formRoomId : -1);
    };

    useEffect(() => {
        if (!inspectionConfigLoading && !!inspectionConfig && inspectionConfig?.sites.length > 0) {
            setLocation({ formSiteId: inspectionConfig.sites[0].site_id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inspectionConfig, inspectionConfigLoading]);
    // console.log('pageLocale=', pageLocale);
    return (
        <StandardCard
            title={pageLocale.form.event.title}
            headerAction={
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: eventExpanded,
                    })}
                    aria-expanded={eventExpanded}
                    aria-label={pageLocale.form.event.aria.collapseButtonLabel}
                    onClick={() => setEventExpanded(!eventExpanded)}
                    id="testntagEventPanelExpander"
                    data-testid="testntagEventPanelExpander"
                >
                    <ExpandMoreIcon />
                </IconButton>
            }
            noPadding={!eventExpanded}
        >
            <Collapse in={eventExpanded} timeout="auto">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <KeyboardDatePicker
                            {...pageLocale.form.event.date}
                            id="testntag-form-event-date"
                            inputProps={{
                                'data-testid': 'testntag-form-event-date',
                            }}
                            InputLabelProps={inputLabelProps}
                            format={pageLocale.config.dateFormatNoTime}
                            minDate={startDate}
                            autoOk
                            disableFuture
                            showTodayButton
                            value={actionDate}
                            onChange={handleChange('action_date')}
                            required
                            autoFocus
                            fullWidth={isMobileView}
                            KeyboardButtonProps={{
                                'aria-label': 'Event date',
                                id: 'testntag-form-event-date-button',
                                'data-testid': 'testntag-form-event-date-button',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography component={'h3'} variant={'h6'}>
                            {pageLocale.form.event.location.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel shrink>{pageLocale.form.event.location.siteLabel}</InputLabel>
                            <Select
                                id="testntag-form-siteid"
                                data-testid="testntag-form-siteid"
                                className={classes.formSelect}
                                value={location.formSiteId === -1 ? '' : location.formSiteId}
                                onChange={e => {
                                    updateLocation({
                                        formSiteId: e.target.value,
                                        formBuildingId: -1,
                                        formFloorId: -1,
                                        formRoomId: -1,
                                    });
                                }}
                                error={location.formSiteId === -1}
                                inputProps={{
                                    id: 'testntag-form-siteid-input',
                                    'data-testid': 'testntag-form-siteid-input',
                                }}
                            >
                                {!!inspectionConfigLoading && (
                                    <MenuItem value={-1} disabled key={'site-loading'} data-testid="tester">
                                        {pageLocale.form.loading}
                                    </MenuItem>
                                )}
                                {!!inspectionConfig &&
                                    inspectionConfig?.sites?.length > 0 &&
                                    inspectionConfig.sites.map(site => (
                                        <MenuItem
                                            value={site.site_id}
                                            key={site.site_id}
                                            id={`testntag-form-siteid-option-${site.site_id}`}
                                            data-testid={`testntag-form-siteid-site.site_id-${site.site_id}`}
                                        >
                                            {site.site_id_displayed ?? ''}
                                            {site.site_id_displayed ? ' - ' : ''}
                                            {site.site_name ?? ''}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                                id="testntag-form-buildingid"
                                data-testid="testntag-form-buildingid"
                                fullWidth
                                options={
                                    inspectionConfig?.sites?.find(site => site.site_id === location.formSiteId)
                                        ?.buildings ?? []
                                }
                                value={
                                    inspectionConfig?.sites
                                        ?.find(site => site.site_id === location.formSiteId)
                                        ?.buildings?.find(
                                            building => building.building_id === location.formBuildingId,
                                        ) ?? null
                                }
                                onChange={(_, newValue) => {
                                    updateLocation({
                                        formBuildingId: newValue.building_id,
                                        formFloorId: -1,
                                        formRoomId: -1,
                                    });
                                    actions.loadFloors(newValue.building_id);
                                }}
                                getOptionLabel={option =>
                                    `${option.building_id_displayed ?? /* istanbul ignore next */ ''}${
                                        option.building_id_displayed ? ' - ' : /* istanbul ignore next */ ''
                                    }${option.building_name ?? /* istanbul ignore next */ ''}`
                                }
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        {...pageLocale.form.event.location.building}
                                        required={hasInspection}
                                        error={
                                            hasInspection &&
                                            location.formSiteId !== -1 &&
                                            location.formBuildingId === -1
                                        }
                                        variant="standard"
                                        InputLabelProps={{
                                            ...inputLabelProps,
                                            htmlFor: 'testntag-form-buildingid-input',
                                        }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {!!inspectionConfigLoading ? (
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                            id="buildingSpinner"
                                                            data-testid="buildingSpinner"
                                                        />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                        inputProps={{
                                            ...params.inputProps,
                                            id: 'testntag-form-buildingid-input',
                                            'data-testid': 'testntag-form-buildingid-input',
                                        }}
                                    />
                                )}
                                disabled={location.formSiteId === -1 || !!!inspectionConfig}
                                disableClearable
                                loading={!!!inspectionConfig}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                                id="testntag-form-floorid"
                                data-testid="testntag-form-floorid"
                                fullWidth
                                options={floorList?.floors ?? []}
                                value={
                                    floorList?.floors?.find(floor => floor.floor_id === location.formFloorId) ?? null
                                }
                                onChange={(_, newValue) => {
                                    updateLocation({ formFloorId: newValue.floor_id, formRoomId: -1 });
                                    actions.loadRooms(newValue.floor_id);
                                }}
                                getOptionLabel={option =>
                                    option.floor_id_displayed ?? /* istanbul ignore next */ option
                                }
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        {...pageLocale.form.event.location.floor}
                                        required={hasInspection}
                                        error={
                                            hasInspection &&
                                            location.formSiteId !== -1 &&
                                            location.formBuildingId !== -1 &&
                                            location.formFloorId === -1
                                        }
                                        variant="standard"
                                        InputLabelProps={{ ...inputLabelProps, htmlFor: 'testntag-form-floorid-input' }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {floorListLoading ? (
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                            id="floorSpinner"
                                                            data-testid="floorSpinner"
                                                        />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                        inputProps={{
                                            ...params.inputProps,
                                            id: 'testntag-form-floorid-input',
                                            'data-testid': 'testntag-form-floorid-input',
                                        }}
                                    />
                                )}
                                disabled={location.formBuildingId === -1 || floorListLoading}
                                disableClearable
                                loading={!!floorListLoading}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                                id="testntag-form-roomid"
                                data-testid="testntag-form-roomid"
                                fullWidth
                                options={roomList?.rooms ?? []}
                                value={roomList?.rooms?.find(room => room.room_id === location.formRoomId) ?? null}
                                onChange={(_, newValue) => {
                                    updateLocation({ formRoomId: newValue.room_id }, true);
                                }}
                                getOptionLabel={option => option.room_id_displayed ?? /* istanbul ignore next */ option}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        {...pageLocale.form.event.location.room}
                                        required={hasInspection}
                                        error={
                                            hasInspection &&
                                            location.formSiteId !== -1 &&
                                            location.formBuildingId !== -1 &&
                                            location.formFloorId !== -1 &&
                                            location.formRoomId === -1
                                        }
                                        variant="standard"
                                        InputLabelProps={{ ...inputLabelProps, htmlFor: 'testntag-form-roomid-input' }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {roomListLoading ? (
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                            id="roomSpinner"
                                                            data-testid="roomSpinner"
                                                        />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                        inputProps={{
                                            ...params.inputProps,
                                            id: 'testntag-form-roomid-input',
                                            'data-testid': 'testntag-form-roomid-input',
                                        }}
                                    />
                                )}
                                disabled={location.formFloorId === -1 || roomListLoading}
                                disableClearable
                                loading={!!roomListLoading}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </Collapse>
        </StandardCard>
    );
};

export default React.memo(EventPanel);
