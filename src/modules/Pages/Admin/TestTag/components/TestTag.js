import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { FormLabel, Grid, useTheme } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard, styles as StandardCardStyles } from 'modules/SharedComponents/Toolbox/StandardCard';

import { DatePicker } from '@material-ui/pickers';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { throttle } from 'throttle-debounce';

// import Checkbox from '@material-ui/core/Checkbox';

import locale from '../testTag.locale';

const moment = require('moment');

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    formSelect: {
        minWidth: 120,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));

const filter = createFilterOptions();

const MINIMUM_ASSET_ID_PATTERN_LENGTH = 7;

const testStatusEnum = {
    CURRENT: { label: 'PASS', value: 'CURRENT' },
    FAILED: { label: 'FAIL', value: 'FAILED' },
    NONE: { label: 'NONE', value: 'none' },
};

// const getLastLocation = asset => {
//     return asset && typeof asset === 'object' && !!asset.location
//         ? `Site: ${asset.location.site}, Building: ${asset.location.building},
// Floor: ${asset.location.floor}, Room: ${asset.location.room}`
//         : 'Unknown';
// };

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} paddingLeft={0} paddingRight={0}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useTestPanelStyles = makeStyles(theme => ({
    card: props => ({
        borderColor: !props.pass ? theme.palette.error.main : theme.palette.success.main,
        [theme.breakpoints.down('xs')]: {
            borderTopWidth: 10,
        },
        [theme.breakpoints.up('sm')]: {
            borderLeftWidth: 10,
        },
    }),
    chip: props => ({
        backgroundColor: !props.pass ? theme.palette.error.main : theme.palette.success.main,
        color: theme.palette.primary.contrastText,
    }),
    chipIcon: {
        color: theme.palette.primary.contrastText,
    },
    pastTestLabel: {
        fontWeight: 'bold',
    },
}));

const LastTestPanel = ({ asset, currentLocation, disabled }) => {
    LastTestPanel.propTypes = { asset: PropTypes.object, currentLocation: PropTypes.object, disabled: PropTypes.bool };

    const {
        asset_status: assetStatus,
        location: lastLocation,
        test_last: lastTest,
        asset_next_test_due_date: nextTestDate,
    } = asset;

    const didPass = lastTest?.test_last_status === testStatusEnum.CURRENT.value;

    const theme = useTheme();
    const globalClasses = useStyles();
    const testPanelClasses = useTestPanelStyles({ pass: didPass });
    const [previousTestExpanded, setPreviousTestExpanded] = useState(!disabled);
    const [mismatchingLocation, setMismatchingLocation] = useState(false);

    useEffect(() => {
        if (!!asset?.asset_id) {
            setMismatchingLocation(
                currentLocation.siteid !== lastLocation?.last_site ||
                    currentLocation.buildingid !== lastLocation?.last_building ||
                    currentLocation.floorid !== lastLocation?.last_floor ||
                    currentLocation.roomid !== lastLocation?.last_room,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        asset?.asset_id,
        currentLocation.siteid,
        currentLocation.buildingid,
        currentLocation.floorid,
        currentLocation.roomid,
    ]);

    useEffect(() => {
        if (disabled) {
            setPreviousTestExpanded(false);
        }
    }, [disabled]);

    // if (!!!lastTest) return <></>;

    return (
        <StandardCard
            variant="outlined"
            noPadding={!previousTestExpanded}
            title={
                <>
                    <Typography component={'span'} variant={'h6'} color={disabled ? 'textSecondary' : 'textPrimary'}>
                        Previous Test {disabled ? 'Unavailable' : ''}
                    </Typography>
                    {!!!disabled && (
                        <>
                            <Chip
                                icon={
                                    didPass ? (
                                        <DoneIcon classes={{ root: testPanelClasses.chipIcon }} />
                                    ) : (
                                        <ClearIcon classes={{ root: testPanelClasses.chipIcon }} />
                                    )
                                }
                                classes={{ root: testPanelClasses.chip }}
                                label={didPass ? testStatusEnum.CURRENT.label : testStatusEnum.FAILED.label}
                                component={'span'}
                            />
                            {!!mismatchingLocation && (
                                <ReportProblemOutlinedIcon style={{ color: theme.palette.warning.main }} />
                            )}
                        </>
                    )}
                </>
            }
            headerAction={
                <IconButton
                    className={clsx(globalClasses.expand, {
                        [globalClasses.expandOpen]: previousTestExpanded,
                    })}
                    aria-expanded={previousTestExpanded}
                    aria-label="show more"
                    onClick={() => setPreviousTestExpanded(!previousTestExpanded)}
                    disabled={disabled}
                >
                    <ExpandMoreIcon />
                </IconButton>
            }
            classes={!disabled ? testPanelClasses : {}}
        >
            <Collapse in={previousTestExpanded} timeout="auto">
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography component={'span'} className={testPanelClasses.pastTestLabel}>
                            Status:{' '}
                        </Typography>
                        <Typography component={'span'}>{assetStatus?.toUpperCase() ?? 'UNKNOWN'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component={'span'} className={testPanelClasses.pastTestLabel}>
                            Test Date:{' '}
                        </Typography>
                        <Typography component={'span'}>{lastTest?.test_last_date}</Typography>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} sm={6} lg={!!mismatchingLocation ? 2 : 3}>
                            <Typography component={'span'} className={testPanelClasses.pastTestLabel}>
                                Site:{' '}
                            </Typography>
                            <Typography component={'span'}>{lastLocation?.last_site_display}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <Typography component={'span'} className={testPanelClasses.pastTestLabel}>
                                Building:{' '}
                            </Typography>
                            <Typography component={'span'}>{lastLocation?.last_building_display}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={!!mismatchingLocation ? 2 : 3}>
                            <Typography component={'span'} className={testPanelClasses.pastTestLabel}>
                                Floor:{' '}
                            </Typography>
                            <Typography component={'span'}>{lastLocation?.last_floor_display}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={!!mismatchingLocation ? 2 : 3}>
                            <Typography component={'span'} className={testPanelClasses.pastTestLabel}>
                                Room:{' '}
                            </Typography>
                            <Typography component={'span'}>{lastLocation?.last_room_display}</Typography>
                        </Grid>
                        {!!mismatchingLocation && (
                            <Grid item xs={12} lg={3}>
                                <ReportProblemOutlinedIcon
                                    style={{
                                        color: theme.palette.warning.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    fontSize="small"
                                />
                                <Typography
                                    component={'span'}
                                    className={testPanelClasses.pastTestLabel}
                                    style={{ color: theme.palette.warning.main }}
                                >
                                    Locations do not match
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                    {!didPass && (
                        <Grid item xs={12}>
                            <Typography component={'p'} className={testPanelClasses.pastTestLabel}>
                                Fail Reason:
                            </Typography>
                            <Typography component={'p'}>{lastTest?.test_last_fail_reason ?? 'None'}</Typography>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Typography component={'p'} className={testPanelClasses.pastTestLabel}>
                            Test Notes:
                        </Typography>
                        <Typography component={'p'}>{lastTest?.test_notes ?? 'None'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component={'span'} className={testPanelClasses.pastTestLabel}>
                            Next Test Date:{' '}
                        </Typography>
                        <Typography component={'span'}>{nextTestDate}</Typography>
                    </Grid>
                </Grid>
            </Collapse>
        </StandardCard>
    );
};

export const TestTag = ({
    actions,
    currentRetestList,
    currentAssetOwnersList,
    assetsList,
    assetsListLoading,
    assetsListError,
    assetTypes,
    assetTypesLoading,
    assetTypesError,
    testDevices,
    testDevicesLoading,
    testDevicesError,
    siteList,
    siteListLoading,
    siteListError,
    floorList,
    floorListLoading,
    floorListError,
    roomList,
    roomListLoading,
    roomListError,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const standardCardClasses = useStyles(StandardCardStyles);
    const dateFormat = 'YYYY-MM-DD';
    const today = moment().format(dateFormat);
    const startDate = moment()
        .startOf('year')
        .format(dateFormat);

    const [siteid, setSiteId] = useState(
        !!!siteListLoading && !!!siteListError && !!siteList && !!siteList.length > 0 ? siteList[0].site_id : -1,
    );
    const [eventDate, setEventDate] = useState(today);
    const [buildingid, setBuildingId] = useState(-1);
    const [floorid, setFloorId] = useState(-1);
    const [roomid, setRoomId] = React.useState(-1);
    const [deviceid, setDeviceId] = React.useState(
        !!!testDevicesLoading && !!!testDevicesError && !!testDevices && !!testDevices.length > 0
            ? testDevices[0].device_id
            : -1,
    );
    // const [currentAssetid, setCurrentAssetId] = React.useState(-1);
    // const [assetType, setAssetType] = useState(-1);
    const [selectedAsset, setSelectedAsset] = useState({});
    const [formAssetType, setFormAssetType] = useState({});
    const [currentAssetList, setCurrentAssetList] = useState(assetsList ?? []);
    const [formTestStatus, setFormTestStatus] = React.useState(testStatusEnum.NONE);
    const [nextTestValue, setNextTestValue] = React.useState(12);
    const [discardingId, setDiscardingId] = React.useState(1);
    const [repairId, setRepairId] = React.useState(1);
    const [selectedTabValue, setSelectedTabValue] = React.useState(0);
    const [eventExpanded, setEventExpanded] = useState(true);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            setCurrentAssetList([]);
        }
    }, [open]);
    React.useEffect(() => {
        console.log('assetlist effect', assetsList);
        !!assetsList && setCurrentAssetList(...[assetsList]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsList]);
    // const currentAsset = useMemo(
    //     assetid => {
    //         console.log(
    //             'currentasset usememo',
    //             assetid,
    //             assetid !== -1
    //                 ? (assetsList && assetsList?.find(asset => asset.asset_id === assetid)) ?? { asset_id: assetid }
    //                 : {},
    //         );
    //         assetid !== -1
    //             ? (assetsList && assetsList?.find(asset => asset.asset_id === assetid)) ?? { asset_id: assetid }
    //             : {};
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [assetid, assetsList],
    // );

    // useEffect(
    //     () => {
    //         console.log(
    //             'currentasset effect',
    //             assetid,
    //             !!assetid && assetid !== -1
    //                 ? (currentAssetList && currentAssetList?.find(asset => asset.asset_id === assetid)) ?? {
    //                       asset_id: assetid,
    //                   }
    //                 : {},
    //         );
    //         if (!!assetid && assetid !== -1) {
    //             setAssetId(assetid);

    //             setCurrentAsset(
    //                 (currentAssetList && currentAssetList?.find(asset => asset.asset_id === assetid)) ?? {
    //                     asset_id: assetid,
    //                 },
    //             );
    //         }
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [assetid],
    // );

    const assignCurrentAsset = asset => {
        console.log('assignCurrentAsset', asset);
        setSelectedAsset(asset ?? {});
    };

    // useEffect(()=>{
    //     if(!!currentAssetid && currentAssetid > -1){
    //         setCurrentAssetType
    //     }else{
    //         setCurrentAssetId(-1);
    //     }
    // }, [currentAssetid]);

    const handleChange = (event, li, source) => {
        const value =
            !!li && !!li.hasOwnProperty('props') ? parseInt(li?.props['data-id'] ?? li?.props.value, 10) : li ?? null;

        switch (source) {
            case 'eventDate':
                setEventDate(event.format(dateFormat));
                break;
            case 'site':
                setSiteId(value);
                setBuildingId(-1);
                setFloorId(-1);
                break;
            case 'device':
                setDeviceId(value);
                break;
            case 'testStatusRadio':
                console.log('testStatusRadio', value, testStatusEnum[value.toUpperCase()]);
                setFormTestStatus(testStatusEnum[value.toUpperCase()]);
                break;
            case 'nextTest':
                setNextTestValue(value);
                break;
            case 'discard':
                setDiscardingId(value);
                break;
            case 'repair':
                setRepairId(value);
                break;
            case 'tabs':
                setSelectedTabValue(value);
                break;
            default:
                return;
        }
    };

    useEffect(() => {
        actions.loadAssetTypes();
        actions.loadTestDevices();
        actions.loadSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (siteid !== -1 && buildingid !== -1) {
            actions.loadFloors(buildingid);
            setFloorId(-1);
            setRoomId(-1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildingid]);

    useEffect(() => {
        if (siteid !== -1 && buildingid !== -1 && floorid !== -1) {
            actions.loadRooms(floorid);
            setRoomId(-1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [floorid]);

    // useEffect(() => {
    //     setRoomId({});
    // }, [floorid]);

    // useEffect(() => {
    //     setAssetIdType(
    //         (Object.keys(currentAsset).length > 0 &&
    //             !!currentAsset.assetTypeId &&
    //             assetType.find(item => item.id === currentAsset.assetTypeId)) ??
    //             {},
    //     );
    //     setTestStatus(testStatusEnum.NONE);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, JSON.stringify(currentAsset));

    const throttledAssetsSearch = React.useRef(
        throttle(
            250,
            pattern => !!pattern && pattern.length >= MINIMUM_ASSET_ID_PATTERN_LENGTH && actions.loadAssets(pattern),
        ),
    );

    return (
        <StandardPage title={locale.pageTitle}>
            <Typography component={'h2'} variant={'h5'}>
                Managing Assets for Technical Services
            </Typography>
            <Typography variant={'body1'} component={'p'}>
                All fields are required unless otherwise stated.
            </Typography>
            <StandardCard
                title="Event"
                headerAction={
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: eventExpanded,
                        })}
                        aria-expanded={eventExpanded}
                        aria-label="show more"
                        onClick={() => setEventExpanded(!eventExpanded)}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                }
            >
                <Collapse in={eventExpanded} timeout="auto">
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                            <DatePicker
                                InputLabelProps={{ shrink: true }}
                                label="Event date"
                                format={dateFormat}
                                minDate={startDate}
                                disableFuture
                                autoOk
                                disableToolbar
                                name="startDate"
                                type="date"
                                value={eventDate}
                                onChange={e => handleChange(e, null, 'eventDate')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography component={'h4'} variant={'h6'}>
                                Location
                            </Typography>
                        </Grid>
                        <Grid item sm={6} md={3}>
                            <FormControl className={classes.formControl} fullWidth>
                                <InputLabel shrink>Site</InputLabel>
                                <Select
                                    className={classes.formSelect}
                                    value={siteid === -1 ? '' : siteid}
                                    onChange={(e, child) => handleChange(e, child, 'site')}
                                >
                                    {!!siteListLoading && (
                                        <MenuItem value={-1} disabled key={'site-loading'}>
                                            Loading...
                                        </MenuItem>
                                    )}
                                    {!!!siteListLoading &&
                                        !!!siteListError &&
                                        !!siteList &&
                                        siteList?.length > 0 &&
                                        siteList.map(site => (
                                            <MenuItem value={site.site_id} key={site.site_id}>
                                                {site.site_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} md={4}>
                            <FormControl className={classes.formControl} fullWidth>
                                <Autocomplete
                                    fullWidth
                                    options={siteList?.find(site => site.site_id === siteid)?.buildings ?? []}
                                    value={
                                        siteList
                                            ?.find(site => site.site_id === siteid)
                                            ?.buildings?.find(building => building.building_id === buildingid) ?? ''
                                    }
                                    onChange={(event, newValue) => {
                                        setBuildingId(newValue.building_id);
                                    }}
                                    getOptionLabel={option => option.building_id_displayed}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Building"
                                            variant="standard"
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {siteListLoading ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                    disabled={siteid === -1 || siteListLoading}
                                    disableClearable
                                    autoSelect
                                    loading={!!siteListLoading}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} md={2}>
                            <FormControl className={classes.formControl} fullWidth>
                                <Autocomplete
                                    fullWidth
                                    options={floorList?.floors ?? []}
                                    value={floorList?.floors?.find(floor => floor.floor_id === floorid) ?? ''}
                                    onChange={(event, newValue) => {
                                        setFloorId(newValue.floor_id);
                                    }}
                                    getOptionLabel={option => option.floor_id_displayed ?? option}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Floor"
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
                                    disabled={buildingid === -1 || floorListLoading}
                                    disableClearable
                                    autoSelect
                                    loading={!!floorListLoading}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} md={3}>
                            <FormControl className={classes.formControl} fullWidth>
                                <Autocomplete
                                    fullWidth
                                    options={roomList?.rooms ?? []}
                                    value={roomList?.rooms?.find(room => room.room_id === roomid) ?? ''}
                                    onChange={(event, newValue) => {
                                        setRoomId(newValue.room_id);
                                    }}
                                    getOptionLabel={option => option.room_id_displayed ?? option}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Room"
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
                                    disabled={floorid === -1 || roomListLoading}
                                    disableClearable
                                    autoSelect
                                    loading={!!roomListLoading}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Collapse>
            </StandardCard>

            <StandardCard title="Asset" style={{ marginTop: '30px' }}>
                <Grid container spacing={3}>
                    <Grid item sm={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                                fullWidth
                                open={open}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                onChange={(event, newValue) => {
                                    console.log('onchange', event, newValue);
                                    if (typeof newValue === 'string') {
                                        assignCurrentAsset({ asset_id: newValue, isNew: true });
                                    } else if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        assignCurrentAsset({ asset_id: newValue.inputValue, isNew: true });
                                    } else {
                                        assignCurrentAsset(newValue);
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);
                                    // Suggest the creation of a new value
                                    if (params.inputValue !== '') {
                                        filtered.push({
                                            inputValue: params.inputValue,
                                            asset_id_displayed: `Add "${params.inputValue}"`,
                                        });
                                    }

                                    return filtered;
                                }}
                                selectOnFocus
                                handleHomeEndKeys
                                options={currentAssetList}
                                getOptionLabel={option => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return `${option.asset_id_displayed ?? ''}`;
                                }}
                                renderOption={option => option.asset_id_displayed}
                                freeSolo
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Asset ID"
                                        variant="standard"
                                        InputLabelProps={{ shrink: true }}
                                        helperText={'Enter a new ID to add'}
                                        placeholder="UQL000000"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {!!assetsListLoading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                        onChange={e => throttledAssetsSearch.current(e.target.value)}
                                    />
                                )}
                                loading={!!assetsListLoading}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item sm={6}>
                        <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                                fullWidth
                                options={
                                    (!!!assetTypesLoading && !!!assetTypesError && !!assetTypes && assetTypes) ?? []
                                }
                                value={
                                    assetTypes?.find(
                                        assetType =>
                                            assetType.asset_type_id ===
                                            (formAssetType?.asset_type ?? selectedAsset?.asset_type?.asset_type),
                                    ) ?? ''
                                }
                                onChange={(event, newValue) => {
                                    setFormAssetType(newValue.asset_type);
                                }}
                                getOptionLabel={option => option.asset_type_name ?? option}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Asset type"
                                        variant="standard"
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {assetTypesLoading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                                disabled={assetTypesLoading}
                                disableClearable
                                autoSelect
                                loading={!!assetTypesLoading}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item sm={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel shrink>Asset owner</InputLabel>
                            <Select className={classes.formSelect} value={currentAssetOwnersList[0].value}>
                                {currentAssetOwnersList.map(owner => (
                                    <MenuItem value={owner.value}>{owner.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <LastTestPanel
                    asset={selectedAsset ?? {}}
                    currentLocation={{ siteid, buildingid, floorid, roomid }}
                    disabled={!!!selectedAsset?.test_last?.test_last_status ?? true}
                />
                <StandardCard title="Test" style={{ marginTop: 30, marginBottom: 30 }} smallTitle variant="outlined">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel required htmlFor="testResultTestingDevice">
                                    Testing device
                                </InputLabel>
                                <Select
                                    fullWidth
                                    className={classes.formSelect}
                                    id="testResultTestingDevice"
                                    value={deviceid ?? ''}
                                    onChange={e => setDeviceId(e.target.value)}
                                    required
                                >
                                    {!!testDevicesLoading && (
                                        <MenuItem value={-1} disabled key={'devicetypes-loading'}>
                                            Loading...
                                        </MenuItem>
                                    )}
                                    {!!!testDevicesLoading &&
                                        !!!testDevicesError &&
                                        !!testDevices &&
                                        testDevices?.length > 0 &&
                                        testDevices.map(device => (
                                            <MenuItem value={device.device_id} key={device.device_id}>
                                                {device.device_model_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Box margin={1}>
                                <InputLabel shrink required htmlFor="testResultToggleButtons">
                                    Test Result
                                </InputLabel>
                                <ToggleButtonGroup
                                    value={(!!formTestStatus && formTestStatus.value) ?? testStatusEnum.NONE.value}
                                    exclusive
                                    id="testResultToggleButtons"
                                    size="small"
                                    defaultChecked={false}
                                    onChange={(e, child) => setFormTestStatus(testStatusEnum[child.toUpperCase()])}
                                >
                                    <ToggleButton
                                        value={testStatusEnum.CURRENT.value}
                                        aria-label="pass"
                                        style={{
                                            backgroundColor:
                                                formTestStatus?.value === testStatusEnum.CURRENT.value
                                                    ? theme.palette.success.main
                                                    : theme.palette.grey[300],
                                            color:
                                                formTestStatus?.value === testStatusEnum.CURRENT.value
                                                    ? theme.palette.primary.contrastText
                                                    : theme.palette.text.main,
                                        }}
                                    >
                                        <DoneIcon /> PASS
                                    </ToggleButton>
                                    <ToggleButton
                                        value={testStatusEnum.FAILED.value}
                                        aria-label="fail"
                                        style={{
                                            backgroundColor:
                                                formTestStatus?.value === testStatusEnum.FAILED.value
                                                    ? theme.palette.error.main
                                                    : theme.palette.grey[300],
                                            color:
                                                formTestStatus?.value === testStatusEnum.FAILED.value
                                                    ? theme.palette.primary.contrastText
                                                    : theme.palette.text.main,
                                        }}
                                    >
                                        <ClearIcon /> FAIL
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Grid>

                        {formTestStatus?.value === testStatusEnum.CURRENT.value && (
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink required>
                                        Next test due
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={nextTestValue}
                                        onChange={(e, child) => handleChange(e, child, 'nextTest')}
                                        required
                                    >
                                        {currentRetestList.map(retestPeriod => (
                                            <MenuItem
                                                value={retestPeriod.value}
                                                data-id={retestPeriod.value}
                                                key={retestPeriod.value}
                                            >
                                                {retestPeriod.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography component={'span'}>
                                        Next test due:{' '}
                                        {moment()
                                            .add(nextTestValue, 'months')
                                            .format(dateFormat)}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        )}
                        {formTestStatus?.value === testStatusEnum.FAILED.value && (
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        label="Fail Reason"
                                        multiline
                                        rows={4}
                                        defaultValue=""
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        required
                                    />
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item sm={12}>
                            <FormControl className={classes.formControl} fullWidth>
                                <TextField
                                    label="Test Notes"
                                    multiline
                                    rows={4}
                                    defaultValue=""
                                    variant="standard"
                                    InputProps={{ fullWidth: true }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item sm={12}>
                            <Typography component={'h4'} variant={'h6'}>
                                Action
                            </Typography>
                        </Grid>
                    </Grid>
                    <Tabs
                        value={selectedTabValue}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={(e, child) => handleChange(e, child, 'tabs')}
                    >
                        <Tab label="Repair" {...a11yProps(0)} disabled={discardingId === 2} />
                        <Tab label="Discard" {...a11yProps(1)} disabled={repairId === 2} />
                    </Tabs>
                    <TabPanel value={selectedTabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl} disabled={discardingId === 2}>
                                    <InputLabel shrink>Send for Repair</InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={repairId}
                                        onChange={(e, child) => handleChange(e, child, 'repair')}
                                        style={{ minWidth: 200 }}
                                    >
                                        <MenuItem value={1} data-id={1}>
                                            NO
                                        </MenuItem>
                                        <MenuItem value={2} data-id={2}>
                                            YES
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl} fullWidth disabled={discardingId === 2}>
                                    <TextField
                                        label="Repairer Details"
                                        multiline
                                        rows={4}
                                        defaultValue=""
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={selectedTabValue} index={1}>
                        <Grid container spacing={3}>
                            <Grid item sm={12}>
                                <Alert severity="warning">
                                    IMPORTANT: Only complete this section if you are actually discarding the asset.
                                </Alert>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl} disabled={repairId === 2}>
                                    <InputLabel shrink>DISCARD THIS ASSET</InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={discardingId}
                                        onChange={(e, child) => handleChange(e, child, 'discard')}
                                        style={{ minWidth: 200 }}
                                    >
                                        <MenuItem value={1} data-id={1}>
                                            NO
                                        </MenuItem>
                                        <MenuItem value={2} data-id={2}>
                                            YES
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl} fullWidth disabled={repairId === 2}>
                                    <TextField
                                        label="Discarding Reason"
                                        multiline
                                        rows={4}
                                        defaultValue=""
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </TabPanel>
                </StandardCard>
                <Grid container spacing={3} justify="flex-end">
                    <Grid item>
                        <Button variant="outlined">CANCEL</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary">
                            SAVE
                        </Button>
                    </Grid>
                </Grid>
            </StandardCard>
        </StandardPage>
    );
};

TestTag.propTypes = {
    actions: PropTypes.object,
    currentRetestList: PropTypes.array,
    currentAssetOwnersList: PropTypes.array,
    assetsList: PropTypes.any,
    assetsListLoading: PropTypes.bool,
    assetsListError: PropTypes.any,
    siteList: PropTypes.any,
    siteListLoading: PropTypes.bool,
    siteListError: PropTypes.any,
    floorList: PropTypes.any,
    floorListLoading: PropTypes.bool,
    floorListError: PropTypes.any,
    roomList: PropTypes.any,
    roomListLoading: PropTypes.bool,
    roomListError: PropTypes.any,
    testDevices: PropTypes.any,
    testDevicesLoading: PropTypes.bool,
    testDevicesError: PropTypes.any,
    assetTypes: PropTypes.any,
    assetTypesLoading: PropTypes.bool,
    assetTypesError: PropTypes.any,
};

export default React.memo(TestTag);
