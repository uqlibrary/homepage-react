import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
// import clsx from 'clsx';

const rootId = 'location_picker';
const inputLabelProps = { shrink: true };

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
}));

const LocationPicker = ({
    id,
    title,
    siteList,
    siteListLoading,
    buildingList,
    buildingListLoading,
    floorList,
    floorListLoading,
    // floorListError,
    roomList,
    roomListLoading,
    hasAllOption = false,
    locale,
    actions,
    location,
    setLocation,
    hide = [],
    disabled = false,
    inputProps = {},
}) => {
    const classes = useStyles();
    const divisor = 4 - hide.length;
    const fieldsToHide = hide.filter(item => item.indexOf('site') === -1);
    return (
        <>
            {!!title && (
                <Grid item xs={12}>
                    <Typography variant="h6" component={'h3'}>
                        {title}
                    </Typography>
                </Grid>
            )}

            <Grid item xs={12} sm={6} md={12 / divisor}>
                <FormControl className={classes.formControl} fullWidth>
                    <Autocomplete
                        id={`${rootId}-${id}-site`}
                        data-testid={`${rootId}-${id}-site`}
                        aria-controls={`${rootId}-${id}-site-popup`}
                        fullWidth
                        options={siteList}
                        value={
                            !hasAllOption && location.site === -1
                                ? ''
                                : siteList?.find(site => site.site_id === location.site) ?? siteList?.[0]
                        }
                        onChange={(_, newValue) => {
                            setLocation({
                                site: newValue.site_id,
                                building: -1,
                                floor: -1,
                                room: -1,
                            });
                            actions.clearFloors();
                        }}
                        getOptionLabel={option => `${option?.site_name ?? /* istanbul ignore next */ ''}`}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={locale.site.label}
                                variant="standard"
                                InputLabelProps={{
                                    ...inputLabelProps,
                                    htmlFor: `${rootId}-${id}-site-input`,
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {!!siteListLoading ? (
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                    id={`${rootId}-${id}-site-progress`}
                                                    data-testid={`${rootId}-${id}-site-progress`}
                                                />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                                inputProps={{
                                    ...params.inputProps,
                                    id: `${rootId}-${id}-site-input`,
                                    'data-testid': `${rootId}-${id}-site-input`,
                                }}
                                {...(inputProps?.site ?? {})}
                            />
                        )}
                        disabled={disabled || !!!siteList}
                        disableClearable
                        loading={siteListLoading}
                    />
                </FormControl>
            </Grid>
            {!fieldsToHide.includes('building') && (
                <Grid item xs={12} sm={6} md={12 / divisor}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id={`${rootId}-${id}-building`}
                            data-testid={`${rootId}-${id}-building`}
                            aria-controls={`${rootId}-${id}-building-popup`}
                            fullWidth
                            options={buildingList}
                            value={
                                !hasAllOption && location.building === -1
                                    ? ''
                                    : buildingList?.find(building => building.building_id === location.building)
                            }
                            onChange={(_, newValue) => {
                                setLocation({
                                    building: newValue.building_id,
                                    floor: -1,
                                    room: -1,
                                });

                                actions.clearFloors();
                                if (newValue.building_id !== -1) {
                                    actions.loadFloors(newValue.building_id);
                                }
                            }}
                            getOptionLabel={option => `${option?.building_name ?? /* istanbul ignore next */ ''}`}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.building.label}
                                    variant="standard"
                                    InputLabelProps={{
                                        ...inputLabelProps,
                                        htmlFor: `${rootId}-${id}-building-input`,
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {!!buildingListLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        id={`${rootId}-${id}-building-progress`}
                                                        data-testid={`${rootId}-${id}-building-progress`}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: `${rootId}-${id}-building-input`,
                                        'data-testid': `${rootId}-${id}-building-input`,
                                    }}
                                    {...(inputProps?.building ?? {})}
                                />
                            )}
                            disabled={disabled || location.site === -1 || !!!siteList}
                            disableClearable
                            loading={siteListLoading}
                        />
                    </FormControl>
                </Grid>
            )}

            {!fieldsToHide.includes('floor') && (
                <Grid item xs={12} sm={6} md={12 / divisor}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id={`${rootId}-${id}-floor`}
                            data-testid={`${rootId}-${id}-floor`}
                            aria-controls={`${rootId}-${id}-floor-popup`}
                            fullWidth
                            options={floorList}
                            value={
                                !hasAllOption && location.floor === -1
                                    ? ''
                                    : floorList?.find(floor => floor.floor_id === location.floor)
                            }
                            onChange={(_, newValue) => {
                                setLocation({ floor: newValue.floor_id, room: -1 });

                                actions.clearRooms();
                                if (newValue.floor_id !== -1) actions.loadRooms(newValue.floor_id);
                            }}
                            getOptionLabel={option => option.floor_id_displayed ?? /* istanbul ignore next */ option}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.floor.label}
                                    variant="standard"
                                    InputLabelProps={{ ...inputLabelProps, htmlFor: `${rootId}-${id}-floor-input` }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {floorListLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        id={`${rootId}-${id}-floor-progress`}
                                                        data-testid={`${rootId}-${id}-floor-progress`}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: `${rootId}-${id}-floor-input`,
                                        'data-testid': `${rootId}-${id}-floor-input`,
                                    }}
                                    {...(inputProps?.floor ?? {})}
                                />
                            )}
                            disabled={disabled || location.building === -1 || floorListLoading}
                            disableClearable
                            loading={!!floorListLoading}
                        />
                    </FormControl>
                </Grid>
            )}
            {!fieldsToHide.includes('room') && (
                <Grid item xs={12} sm={6} md={12 / divisor}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id={`${rootId}-${id}-room`}
                            data-testid={`${rootId}-${id}-room`}
                            aria-controls={`${rootId}-${id}-room-popup`}
                            fullWidth
                            options={roomList}
                            value={
                                !hasAllOption && location.room === -1
                                    ? ''
                                    : roomList?.find(room => room.room_id === location.room)
                            }
                            onChange={(_, newValue) => {
                                setLocation({ room: newValue.room_id }, true);
                            }}
                            getOptionLabel={option => option.room_id_displayed ?? option}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.room.label}
                                    variant="standard"
                                    InputLabelProps={{ ...inputLabelProps, htmlFor: `${rootId}-${id}-room-input` }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {roomListLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        id={`${rootId}-${id}-room-progress`}
                                                        data-testid={`${rootId}-${id}-room-progress`}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: `${rootId}-${id}-room-input`,
                                        'data-testid': `${rootId}-${id}-room-input`,
                                    }}
                                    {...(inputProps?.room ?? {})}
                                />
                            )}
                            disabled={disabled || location.floor === -1 || roomListLoading}
                            disableClearable
                            loading={!!roomListLoading}
                        />
                    </FormControl>
                </Grid>
            )}
        </>
    );
};

LocationPicker.propTypes = {
    id: PropTypes.string.isRequired,
    siteList: PropTypes.array,
    siteListLoading: PropTypes.bool,
    buildingList: PropTypes.array,
    buildingListLoading: PropTypes.bool,
    floorList: PropTypes.array,
    floorListLoading: PropTypes.bool,
    // floorListError,
    roomList: PropTypes.array,
    roomListLoading: PropTypes.bool,
    // roomListError,
    locale: PropTypes.object.isRequired,
    actions: PropTypes.object,
    location: PropTypes.object,
    setLocation: PropTypes.func,
    hide: PropTypes.array,
    withAllOption: PropTypes.bool,
    inputProps: PropTypes.object,
    hasAllOption: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.string,
};

export default React.memo(LocationPicker);
