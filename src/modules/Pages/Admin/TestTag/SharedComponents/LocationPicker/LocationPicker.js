import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
// import clsx from 'clsx';

import locale from '../../testTag.locale';

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

const LocationPicker = ({ actions, location, setLocation, hide = [] }) => {
    const classes = useStyles();
    const {
        siteList,
        siteListLoading,
        // siteListError,
        // buildingList,
        // buildingListLoading,
        // buildingListError,
        floorList,
        floorListLoading,
        // floorListError,
        roomList,
        roomListLoading,
        // roomListError,
    } = useSelector(state => state.get?.('testTagLocationReducer'));
    const fieldsToHide = hide.filter(item => item.indexOf('site') === -1);

    const fullSiteList = [{ site_id: -1, site_id_displayed: 'All sites' }, ...(siteList ?? [])];
    const fullBuildingList = [
        { building_id: -1, building_id_displayed: 'All buildings' },
        ...(siteList?.find(site => site.site_id === location.site)?.buildings ?? []),
    ];
    const fullFloorList = [{ floor_id: -1, floor_id_displayed: 'All floors' }, ...(floorList?.floors ?? [])];
    const fullRoomList = [{ room_id: -1, room_id_displayed: 'All rooms' }, ...(roomList?.rooms ?? [])];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl} fullWidth>
                    <Autocomplete
                        id="testntag-form-siteid"
                        data-testid="testntag-form-siteid"
                        fullWidth
                        options={fullSiteList}
                        value={fullSiteList?.find(site => site.site_id === location.site) ?? fullSiteList?.[0]}
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
                                {...locale.site}
                                // required={hasInspection}

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
                            />
                        )}
                        disabled={!!!siteList}
                        disableClearable
                        loading={!!!siteList}
                    />
                </FormControl>
            </Grid>
            {!fieldsToHide.includes('building') && (
                <Grid item xs={12} sm={6} md={5}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id="testntag-form-buildingid"
                            data-testid="testntag-form-buildingid"
                            fullWidth
                            options={fullBuildingList}
                            value={
                                fullBuildingList?.find(building => building.building_id === location.building) ??
                                fullBuildingList?.[0]
                            }
                            onChange={(_, newValue) => {
                                setLocation({
                                    building: newValue.building_id,
                                    floor: -1,
                                    room: -1,
                                });
                                if (newValue.building_id !== -1) actions.loadFloors(newValue.building_id);
                                else actions.clearFloors();
                            }}
                            getOptionLabel={option =>
                                `${option.building_id_displayed ?? /* istanbul ignore next */ ''}${
                                    option.building_id_displayed ? ' - ' : /* istanbul ignore next */ ''
                                }${option.building_name ?? /* istanbul ignore next */ ''}`
                            }
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    {...locale.building}
                                    // required={hasInspection}
                                    // error={location.site !== -1 && location.building === -1}
                                    variant="standard"
                                    InputLabelProps={{
                                        ...inputLabelProps,
                                        htmlFor: 'testntag-form-buildingid-input',
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {!!siteListLoading ? (
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
                            disabled={location.site === -1 || !!!siteList}
                            disableClearable
                            loading={!!!siteList}
                        />
                    </FormControl>
                </Grid>
            )}
            {!fieldsToHide.includes('floor') && (
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id="testntag-form-floorid"
                            data-testid="testntag-form-floorid"
                            fullWidth
                            options={fullFloorList}
                            value={
                                fullFloorList?.find(floor => floor.floor_id === location.floor) ?? fullFloorList?.[0]
                            }
                            onChange={(_, newValue) => {
                                setLocation({ floor: newValue.floor_id, room: -1 });

                                if (newValue.floor_id !== -1) actions.loadRooms(newValue.floor_id);
                            }}
                            getOptionLabel={option => option.floor_id_displayed ?? /* istanbul ignore next */ option}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    {...locale.floor}
                                    // required={hasInspection}
                                    // error={
                                    //     location.site !== -1 &&
                                    //     location.building !== -1 &&
                                    //     location.floor === -1
                                    // }
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
                            disabled={location.building === -1 || floorListLoading}
                            disableClearable
                            loading={!!floorListLoading}
                        />
                    </FormControl>
                </Grid>
            )}
            {!fieldsToHide.includes('room') && (
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl className={classes.formControl} fullWidth>
                        <Autocomplete
                            id="testntag-form-roomid"
                            data-testid="testntag-form-roomid"
                            fullWidth
                            options={fullRoomList}
                            value={fullRoomList?.find(room => room.room_id === location.room) ?? fullRoomList[0]}
                            onChange={(_, newValue) => {
                                setLocation({ room: newValue.room_id }, true);
                            }}
                            getOptionLabel={option => option.room_id_displayed ?? option}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    {...locale.room}
                                    // required={hasInspection}
                                    // error={
                                    //     location.site !== -1 &&
                                    //     location.building !== -1 &&
                                    //     location.floor !== -1 &&
                                    //     location.room === -1
                                    // }
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
                            disabled={location.floor === -1 || roomListLoading}
                            disableClearable
                            loading={!!roomListLoading}
                        />
                    </FormControl>
                </Grid>
            )}
        </Grid>
    );
};

LocationPicker.propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    setLocation: PropTypes.func.isRequired,
    hide: PropTypes.array,
};

export default React.memo(LocationPicker);
