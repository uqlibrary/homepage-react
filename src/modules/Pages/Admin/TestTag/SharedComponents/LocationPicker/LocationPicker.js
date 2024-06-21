import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Popper from '@mui/material/Popper';

const rootId = 'location_picker';
const inputLabelProps = { shrink: true };

export const GridWrapper = ({ withGrid = true, divisor = 1, children }) => {
    GridWrapper.propTypes = {
        withGrid: PropTypes.bool,
        divisor: PropTypes.number,
        children: PropTypes.node,
    };

    return withGrid ? (
        <Grid xs={12} sm={6} md={12 / divisor}>
            {children}
        </Grid>
    ) : (
        children
    );
};

export const getBuildingLabel = building => {
    const prefix = !!building.building_id_displayed ? `${building.building_id_displayed} - ` : '';
    return `${prefix}${building.building_name ?? ''}`;
};

const LocationPicker = ({
    id,
    autoFocus = false,
    focusTarget,
    siteList,
    siteListLoading,
    buildingList,
    buildingListLoading,
    floorList,
    floorListLoading,
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
    withGrid = true,
}) => {
    const componentId = `${rootId}-${id}`;
    const divisor = 4 - hide.length;

    const focusElementRef = React.useRef();

    const customPopper = props => (
        <Popper {...props} id={`${componentId}-options`} data-testid={`${componentId}-options`} />
    );

    React.useLayoutEffect(() => {
        /* istanbul ignore else */
        if (
            autoFocus &&
            !!focusTarget &&
            ((focusTarget === 'site' &&
                (siteList?.length ?? /* istanbul ignore next */ 0) > 0 &&
                location.site === -1) ||
                (focusTarget === 'building' &&
                    (buildingList?.length ?? /* istanbul ignore next */ 0) > 0 &&
                    location.building === -1) ||
                (focusTarget === 'floor' &&
                    (floorList?.length ?? /* istanbul ignore next */ 0) > 0 &&
                    location.floor === -1) ||
                (focusTarget === 'room' &&
                    (roomList?.length ?? /* istanbul ignore next */ 0) > 0 &&
                    location.room === -1))
        ) {
            focusElementRef?.current?.focus();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFocus, focusTarget, siteList, buildingList, floorList, roomList]);

    const siteDisabled = disabled || !!!siteList;
    const buildingDisabled = disabled || (!hide.includes('site') && (location.site === -1 || !!!siteList));
    const floorDisabled = disabled || (!hide.includes('building') && (location.building === -1 || floorListLoading));
    const roomDisabled = disabled || (!hide.includes('floor') && (location.floor === -1 || roomListLoading));

    return (
        <>
            {!hide.includes('site') && (
                <GridWrapper withGrid={withGrid} divisor={divisor}>
                    <FormControl variant="standard" className={'formControl'} fullWidth>
                        <Autocomplete
                            id={`${componentId}-site`}
                            data-testid={`${componentId}-site`}
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
                                actions?.clearFloors?.();
                            }}
                            getOptionLabel={option => `${option?.site_name ?? /* istanbul ignore next */ ''}`}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.site.label}
                                    variant="standard"
                                    InputLabelProps={{
                                        ...inputLabelProps,
                                        htmlFor: `${componentId}-site-input`,
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {!!siteListLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        id={`${componentId}-site-progress`}
                                                        data-testid={`${componentId}-site-progress`}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: `${componentId}-site-input`,
                                        'data-testid': `${componentId}-site-input`,
                                    }}
                                    inputRef={
                                        !siteDisabled && autoFocus && focusTarget === 'site' ? focusElementRef : null
                                    }
                                    {...(inputProps?.site ?? {})}
                                />
                            )}
                            PopperComponent={customPopper}
                            disabled={siteDisabled}
                            disableClearable
                            loading={siteListLoading}
                        />
                    </FormControl>
                </GridWrapper>
            )}
            {!hide.includes('building') && (
                <GridWrapper withGrid={withGrid} divisor={divisor}>
                    <FormControl variant="standard" className={'formControl'} fullWidth>
                        <Autocomplete
                            id={`${componentId}-building`}
                            data-testid={`${componentId}-building`}
                            fullWidth
                            options={buildingList}
                            value={
                                buildingList?.length === 0 || (!hasAllOption && location.building === -1)
                                    ? ''
                                    : buildingList?.find(building => building.building_id === location.building)
                            }
                            onChange={(_, newValue) => {
                                setLocation({
                                    building: newValue.building_id,
                                    floor: -1,
                                    room: -1,
                                });

                                actions?.clearFloors?.();
                                /* istanbul ignore else */ if (newValue.building_id !== -1) {
                                    actions?.loadFloors?.(newValue.building_id);
                                }
                            }}
                            getOptionLabel={option => getBuildingLabel(option)}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.building.label}
                                    variant="standard"
                                    InputLabelProps={{
                                        ...inputLabelProps,
                                        htmlFor: `${componentId}-building-input`,
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {!!buildingListLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        id={`${componentId}-building-progress`}
                                                        data-testid={`${componentId}-building-progress`}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: `${componentId}-building-input`,
                                        'data-testid': `${componentId}-building-input`,
                                    }}
                                    inputRef={
                                        !buildingDisabled && autoFocus && focusTarget === 'building'
                                            ? focusElementRef
                                            : null
                                    }
                                    {...(inputProps?.building ?? {})}
                                />
                            )}
                            PopperComponent={customPopper}
                            disabled={buildingDisabled}
                            disableClearable
                            loading={siteListLoading}
                        />
                    </FormControl>
                </GridWrapper>
            )}

            {!hide.includes('floor') && (
                <GridWrapper withGrid={withGrid} divisor={divisor}>
                    <FormControl variant="standard" className={'formControl'} fullWidth>
                        <Autocomplete
                            id={`${componentId}-floor`}
                            data-testid={`${componentId}-floor`}
                            fullWidth
                            options={floorList}
                            value={
                                !hasAllOption && location.floor === -1
                                    ? ''
                                    : floorList?.find(floor => floor.floor_id === location.floor)
                            }
                            onChange={(_, newValue) => {
                                setLocation({ floor: newValue.floor_id, room: -1 });

                                actions?.clearRooms?.();
                                /* istanbul ignore else */ if (newValue.floor_id !== -1) {
                                    actions?.loadRooms?.(newValue.floor_id);
                                }
                            }}
                            getOptionLabel={option => option.floor_id_displayed ?? /* istanbul ignore next */ option}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={locale.floor.label}
                                    variant="standard"
                                    InputLabelProps={{ ...inputLabelProps, htmlFor: `${componentId}-floor-input` }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {floorListLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        id={`${componentId}-floor-progress`}
                                                        data-testid={`${componentId}-floor-progress`}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: `${componentId}-floor-input`,
                                        'data-testid': `${componentId}-floor-input`,
                                    }}
                                    inputRef={
                                        !floorDisabled && autoFocus && focusTarget === 'floor' ? focusElementRef : null
                                    }
                                    {...(inputProps?.floor ?? {})}
                                />
                            )}
                            PopperComponent={customPopper}
                            disabled={floorDisabled}
                            disableClearable
                            loading={!!floorListLoading}
                        />
                    </FormControl>
                </GridWrapper>
            )}
            {!hide.includes('room') && (
                <GridWrapper withGrid={withGrid} divisor={divisor}>
                    <FormControl variant="standard" className={'formControl'} fullWidth>
                        <Autocomplete
                            id={`${componentId}-room`}
                            data-testid={`${componentId}-room`}
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
                                    InputLabelProps={{ ...inputLabelProps, htmlFor: `${componentId}-room-input` }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {roomListLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        id={`${componentId}-room-progress`}
                                                        data-testid={`${componentId}-room-progress`}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: `${componentId}-room-input`,
                                        'data-testid': `${componentId}-room-input`,
                                    }}
                                    inputRef={
                                        !roomDisabled && autoFocus && focusTarget === 'room' ? focusElementRef : null
                                    }
                                    {...(inputProps?.room ?? {})}
                                />
                            )}
                            PopperComponent={customPopper}
                            disabled={roomDisabled}
                            disableClearable
                            loading={!!roomListLoading}
                        />
                    </FormControl>
                </GridWrapper>
            )}
        </>
    );
};

LocationPicker.propTypes = {
    id: PropTypes.string.isRequired,
    locale: PropTypes.object.isRequired,
    focusTarget: PropTypes.oneOf(['site', 'building', 'floor', 'room']),
    autoFocus: PropTypes.bool,
    siteList: PropTypes.array,
    siteListLoading: PropTypes.bool,
    buildingList: PropTypes.array,
    buildingListLoading: PropTypes.bool,
    floorList: PropTypes.array,
    floorListLoading: PropTypes.bool,
    roomList: PropTypes.array,
    roomListLoading: PropTypes.bool,
    actions: PropTypes.object,
    location: PropTypes.object,
    setLocation: PropTypes.func,
    hide: PropTypes.array,
    inputProps: PropTypes.object,
    hasAllOption: PropTypes.bool,
    disabled: PropTypes.bool,
    withGrid: PropTypes.bool,
};

export default React.memo(LocationPicker);
