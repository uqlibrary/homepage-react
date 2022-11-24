import React, { useState, useEffect } from 'react';
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

import locale from '../testTag.locale';

const moment = require('moment');

const EventPanel = ({ actions, location, setLocation, actionDate, handleChange, classes, isMobileView } = {}) => {
    EventPanel.propTypes = {
        actions: PropTypes.any.isRequired,
        location: PropTypes.object.isRequired,
        setLocation: PropTypes.func.isRequired,
        actionDate: PropTypes.any,
        handleChange: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
        isMobileView: PropTypes.bool,
    };

    const [eventExpanded, setEventExpanded] = useState(true);

    const startDate = moment()
        .startOf('year')
        .format(locale.config.dateFormat);

    const { initConfig, initConfigLoading } = useSelector(state => state.get?.('testTagOnLoadReducer'));
    const { floorList, floorListLoading, roomList, roomListLoading } = useSelector(state =>
        state.get?.('testTagLocationReducer'),
    );

    const updateLocation = (update, useRoomId = false) => {
        setLocation(update);
        handleChange('room_id')(useRoomId ? update.formRoomId : -1);
    };

    useEffect(() => {
        if (!initConfigLoading && !!initConfig && initConfig?.sites.length > 0) {
            setLocation({ formSiteId: initConfig.sites[0].site_id });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initConfigLoading]);

    return (
        <StandardCard
            title={locale.form.event.title}
            headerAction={
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: eventExpanded,
                    })}
                    aria-expanded={eventExpanded}
                    aria-label={locale.form.event.aria.collapseButtonLabel}
                    onClick={() => setEventExpanded(!eventExpanded)}
                >
                    <ExpandMoreIcon />
                </IconButton>
            }
        >
            <Collapse in={eventExpanded} timeout="auto">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <KeyboardDatePicker
                            {...locale.form.event.date}
                            id="testntag-form-action-date"
                            data-testid="testntag-form-action-date"
                            InputLabelProps={{ shrink: true }}
                            format={locale.config.dateFormatNoTime}
                            minDate={startDate}
                            autoOk
                            disableFuture
                            showTodayButton
                            value={actionDate}
                            onChange={handleChange('action_date')}
                            required
                            autoFocus
                            fullWidth={isMobileView}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography component={'h4'} variant={'h6'}>
                            {locale.form.event.location.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel shrink>{locale.form.event.location.siteLabel}</InputLabel>
                            <Select
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
                            >
                                {!!initConfigLoading && (
                                    <MenuItem value={-1} disabled key={'site-loading'}>
                                        {locale.form.loading}
                                    </MenuItem>
                                )}
                                {!!initConfig &&
                                    initConfig?.sites?.length > 0 &&
                                    initConfig.sites.map(site => (
                                        <MenuItem value={site.site_id} key={site.site_id}>
                                            {site.site_name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                                fullWidth
                                options={
                                    initConfig?.sites?.find(site => site.site_id === location.formSiteId)?.buildings ??
                                    []
                                }
                                value={
                                    initConfig?.sites
                                        ?.find(site => site.site_id === location.formSiteId)
                                        ?.buildings?.find(
                                            building => building.building_id === location.formBuildingId,
                                        ) ?? ''
                                }
                                onChange={(_, newValue) => {
                                    if (location.formSiteId !== -1 && newValue.building_id !== -1) {
                                        updateLocation({
                                            formBuildingId: newValue.building_id,
                                            formFloorId: -1,
                                            formRoomId: -1,
                                        });
                                        actions.loadFloors(newValue.building_id);
                                    } else {
                                        updateLocation({ formBuildingId: newValue.building_id });
                                    }
                                }}
                                getOptionLabel={option => option.building_id_displayed}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        {...locale.form.event.location.building}
                                        required
                                        error={location.formSiteId !== -1 && location.formBuildingId === -1}
                                        variant="standard"
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {!!initConfigLoading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                                disabled={location.formSiteId === -1 || !!!initConfig}
                                disableClearable
                                loading={!!!initConfig}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                                fullWidth
                                options={floorList?.floors ?? []}
                                value={floorList?.floors?.find(floor => floor.floor_id === location.formFloorId) ?? ''}
                                onChange={(_, newValue) => {
                                    if (
                                        location.formSiteId !== -1 &&
                                        location.formBuildingId !== -1 &&
                                        newValue.floor_id !== -1
                                    ) {
                                        updateLocation({ formFloorId: newValue.floor_id, formRoomId: -1 });
                                        actions.loadRooms(newValue.floor_id);
                                    } else updateLocation({ formFloorId: newValue.floor_id });
                                }}
                                getOptionLabel={option => option.floor_id_displayed ?? option}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        {...locale.form.event.location.floor}
                                        error={
                                            location.formSiteId !== -1 &&
                                            location.formBuildingId !== -1 &&
                                            location.formFloorId === -1
                                        }
                                        required
                                        variant="standard"
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {floorListLoading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
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
                                fullWidth
                                options={roomList?.rooms ?? []}
                                value={roomList?.rooms?.find(room => room.room_id === location.formRoomId) ?? ''}
                                onChange={(_, newValue) => {
                                    updateLocation({ formRoomId: newValue.room_id }, true);
                                }}
                                getOptionLabel={option => option.room_id_displayed ?? option}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        {...locale.form.event.location.room}
                                        required
                                        error={
                                            location.formSiteId !== -1 &&
                                            location.formBuildingId !== -1 &&
                                            location.formFloorId !== -1 &&
                                            location.formRoomId === -1
                                        }
                                        variant="standard"
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {roomListLoading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
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
