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

    return (
        <>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <Autocomplete
                        id="testntag-form-siteid"
                        data-testid="testntag-form-siteid"
                        fullWidth
                        options={siteList?.find(site => site.site_id === location.formSiteId)?.buildings ?? []}
                        value={
                            siteList
                                ?.find(site => site.site_id === location.formSiteId)
                                ?.buildings?.find(building => building.building_id === location.formBuildingId) ?? null
                        }
                        onChange={(_, newValue) => {
                            setLocation({
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
                                {...locale.building}
                                // required={hasInspection}
                                error={location.formSiteId !== -1 && location.formBuildingId === -1}
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
                                    id: 'testntag-form-siteid-input',
                                    'data-testid': 'testntag-form-siteid-input',
                                }}
                            />
                        )}
                        disabled={location.formSiteId === -1 || !!!siteList}
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
                        options={siteList?.find(site => site.site_id === location.formSiteId)?.buildings ?? []}
                        value={
                            siteList
                                ?.find(site => site.site_id === location.formSiteId)
                                ?.buildings?.find(building => building.building_id === location.formBuildingId) ?? null
                        }
                        onChange={(_, newValue) => {
                            setLocation({
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
                                {...locale.building}
                                // required={hasInspection}
                                error={location.formSiteId !== -1 && location.formBuildingId === -1}
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
                        options={floorList?.floors ?? []}
                        value={floorList?.floors?.find(floor => floor.floor_id === location.formFloorId) ?? null}
                        onChange={(_, newValue) => {
                            setLocation({ formFloorId: newValue.floor_id, formRoomId: -1 });
                            actions.loadRooms(newValue.floor_id);
                        }}
                        getOptionLabel={option => option.floor_id_displayed ?? /* istanbul ignore next */ option}
                        renderInput={params => (
                            <TextField
                                {...params}
                                {...locale.floor}
                                // required={hasInspection}
                                error={
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
        </>
    );
};

LocationPicker.propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    setLocation: PropTypes.func.isRequired,
};

export default React.memo(LocationPicker);

