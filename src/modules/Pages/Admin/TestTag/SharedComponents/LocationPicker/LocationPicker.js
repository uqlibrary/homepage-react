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

const LocationPicker = ({ actions, location, setLocation }) => {
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

    const fullSiteList = [{ site_id: -1, site_id_displayed: 'All sites' }, ...(siteList ?? [])];
    const fullBuildingList = [
        { building_id: -1, building_id_displayed: 'All buildings' },
        ...(siteList?.find(site => site.site_id === location.formSiteId)?.buildings ?? []),
    ];
    const fullfloorList = [{ floor_id: -1, floor_id_displayed: 'All floors' }, ...(floorList?.floors ?? [])];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <Autocomplete
                        id="testntag-form-siteid"
                        data-testid="testntag-form-siteid"
                        fullWidth
                        options={fullSiteList}
                        value={fullSiteList?.find(site => site.site_id === location.formSiteId) ?? fullSiteList?.[0]}
                        onChange={(_, newValue) => {
                            setLocation({
                                formSiteId: newValue.site_id,
                                formBuildingId: -1,
                                formFloorId: -1,
                                formRoomId: -1,
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
            <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl} fullWidth>
                    <Autocomplete
                        id="testntag-form-buildingid"
                        data-testid="testntag-form-buildingid"
                        fullWidth
                        options={fullBuildingList}
                        value={
                            fullBuildingList?.find(building => building.building_id === location.formBuildingId) ??
                            fullBuildingList?.[0]
                        }
                        onChange={(_, newValue) => {
                            setLocation({
                                formBuildingId: newValue.building_id,
                                formFloorId: -1,
                                formRoomId: -1,
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
                                // error={location.formSiteId !== -1 && location.formBuildingId === -1}
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
                        disabled={location.formSiteId === -1 || !!!siteList}
                        disableClearable
                        loading={!!!siteList}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
                <FormControl className={classes.formControl} fullWidth>
                    <Autocomplete
                        id="testntag-form-floorid"
                        data-testid="testntag-form-floorid"
                        fullWidth
                        options={fullfloorList}
                        value={
                            fullfloorList?.find(floor => floor.floor_id === location.formFloorId) ?? fullfloorList?.[0]
                        }
                        onChange={(_, newValue) => {
                            setLocation({ formFloorId: newValue.floor_id, formRoomId: -1 });

                            if (newValue.floor_id !== -1) actions.loadRooms(newValue.floor_id);
                        }}
                        getOptionLabel={option => option.floor_id_displayed ?? /* istanbul ignore next */ option}
                        renderInput={params => (
                            <TextField
                                {...params}
                                {...locale.floor}
                                // required={hasInspection}
                                // error={
                                //     location.formSiteId !== -1 &&
                                //     location.formBuildingId !== -1 &&
                                //     location.formFloorId === -1
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
                            setLocation({ formRoomId: newValue.room_id }, true);
                        }}
                        getOptionLabel={option => option.room_id_displayed ?? /* istanbul ignore next */ option}
                        renderInput={params => (
                            <TextField
                                {...params}
                                {...locale.room}
                                // required={hasInspection}
                                error={
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
    );
};

LocationPicker.propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    setLocation: PropTypes.func.isRequired,
};

export default React.memo(LocationPicker);

/*
    HERE - LOCATION SSTUFF ABOVE NEEDS WIRING IN TO REDUX ACTIONS. SHOULD OPTIONALLY 'STEP', WHERE
    ONLY THE NEXT FIELD IS SHOWN OR ENABLED. THIS WILL BE NEEDED FOR LOCATION MANAGEMENT ACCORDING
    TO WHICH TAB IS SELECTED.

    IF WE GET THROUGH THAT, RETURN TO LOCATION MANAGER PAGE AND INTEGRATE THIS COMPONENT, THEN
    WIRE THE PAGE IN TO THE API TO GET DATA BACK, AND SEND NEW/EDITED DATA BACK TO THE SERVER.
    THEN ADD IN DELETE ACTION.

    GOOD LUCK GETTING THAT WORKING
*/
