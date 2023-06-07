import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
// import clsx from 'clsx';

import locale from './location.locale';

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
    siteList,
    siteListLoading,
    buildingList,
    buildingListLoading,
    floorList,
    floorListLoading,
    // floorListError,
    roomList,
    roomListLoading,
    actions,
    location,
    setLocation,
    hide = [],
    inputProps = {},
}) => {
    // console.log({
    //     siteList,
    //     siteListLoading,
    //     buildingList,
    //     buildingListLoading,
    //     floorList,
    //     floorListLoading,
    //     // floorListError,
    //     roomList,
    //     roomListLoading,
    //     actions,
    //     location,
    //     setLocation,
    //     hide,
    //     inputProps,
    // });
    const classes = useStyles();
    const divisor = 4 - hide.length;

    const fieldsToHide = hide.filter(item => item.indexOf('site') === -1);

    return (
        <>
            <Grid item xs={12} sm={6} md={12 / divisor}>
                <FormControl className={classes.formControl} fullWidth>
                    <Autocomplete
                        id="testntag-form-siteid"
                        data-testid="testntag-form-siteid"
                        fullWidth
                        options={siteList}
                        value={siteList?.find(site => site.site_id === location.site) ?? siteList?.[0]}
                        onChange={(_, newValue) => {
                            setLocation({
                                site: newValue.site_id,
                                building: -1,
                                floor: -1,
                                room: -1,
                            });
                            if (newValue.site_id === -1) {
                                actions.clearRooms();
                                actions.clearFloors();
                            }
                        }}
                        getOptionLabel={option =>
                            `${option.site_id_displayed ?? /* istanbul ignore next */ ''}${
                                option.site_id_displayed ? ' - ' : /* istanbul ignore next */ ''
                            }${option.site_name ?? /* istanbul ignore next */ ''}`
                        }
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={locale.site.label}
                                variant="standard"
                                InputLabelProps={{
                                    ...inputLabelProps,
                                    htmlFor: 'testntag-form-siteid-input',
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {!!siteListLoading ? (
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                    id="siteSpinner"
                                                    data-testid="siteSpinner"
                                                />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                                inputProps={{
                                    ...params.inputProps,
                                    id: 'testntag-form-siteid-input',
                                    'data-testid': 'testntag-form-siteid-input',
                                }}
                                {...(inputProps?.site ?? {})}
                            />
                        )}
                        disabled={!!!siteList}
                        disableClearable
                        loading={!!!siteList}
                    />
                </FormControl>
            </Grid>
            {!fieldsToHide.includes('building') && (
                <Grid item xs={12} sm={6} md={12 / divisor}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id="testntag-form-buildingid"
                            data-testid="testntag-form-buildingid"
                            fullWidth
                            options={buildingList}
                            value={
                                buildingList?.find(building => building.building_id === location.building) ??
                                buildingList?.[0]
                            }
                            onChange={(_, newValue) => {
                                setLocation({
                                    building: newValue.building_id,
                                    floor: -1,
                                    room: -1,
                                });
                                actions.clearFloors();
                                if (newValue.building_id !== -1) {
                                    actions.clearRooms();
                                    actions.loadFloors(newValue.building_id);
                                }
                            }}
                            getOptionLabel={option =>
                                `${option.building_id_displayed ?? /* istanbul ignore next */ ''}${
                                    option.building_id_displayed ? ' - ' : /* istanbul ignore next */ ''
                                }${option.building_name ?? /* istanbul ignore next */ ''}`
                            }
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.building.label}
                                    variant="standard"
                                    InputLabelProps={{
                                        ...inputLabelProps,
                                        htmlFor: 'testntag-form-buildingid-input',
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {!!buildingListLoading ? (
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
                                    {...(inputProps?.building ?? {})}
                                />
                            )}
                            disabled={location.site === -1 || !!!siteList}
                            disableClearable
                            loading={!!!siteList}
                        />
                    </FormControl>
                </Grid>
            )}

            {!fieldsToHide.includes('floor') && (
                <Grid item xs={12} sm={6} md={12 / divisor}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id="testntag-form-floorid"
                            data-testid="testntag-form-floorid"
                            fullWidth
                            options={floorList}
                            value={floorList?.find(floor => floor.floor_id === location.floor) ?? floorList?.[0]}
                            onChange={(_, newValue) => {
                                setLocation({ floor: newValue.floor_id, room: -1 });

                                if (newValue.floor_id !== -1) actions.loadRooms(newValue.floor_id);
                                else actions.clearRooms();
                            }}
                            getOptionLabel={option => option.floor_id_displayed ?? /* istanbul ignore next */ option}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.floor.label}
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
                                    {...(inputProps?.floor ?? {})}
                                />
                            )}
                            disabled={location.building === -1 || floorListLoading}
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
                            id="testntag-form-roomid"
                            data-testid="testntag-form-roomid"
                            fullWidth
                            options={roomList}
                            value={roomList?.find(room => room.room_id === location.room) ?? roomList?.[0]}
                            onChange={(_, newValue) => {
                                setLocation({ room: newValue.room_id }, true);
                            }}
                            getOptionLabel={option => option.room_id_displayed ?? option}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.room.label}
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
                                    {...(inputProps?.room ?? {})}
                                />
                            )}
                            disabled={location.floor === -1 || roomListLoading}
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
    actions: PropTypes.object,
    location: PropTypes.object,
    setLocation: PropTypes.func,
    hide: PropTypes.array,
    withAllOption: PropTypes.bool,
    inputProps: PropTypes.object,
};

export default React.memo(LocationPicker);
