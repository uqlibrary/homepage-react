import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { Grid, useTheme } from '@material-ui/core';
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
const status = {
    PASS: { label: 'PASS', value: 'pass' },
    FAIL: { label: 'FAIL', value: 'fail' },
    NONE: { label: 'NONE', value: 'none' },
};

const MINIMUM_ASSET_ID_PATTERN_LENGTH = 8;

const getLastLocation = asset => {
    return asset && typeof asset === 'object' && !!asset.location
        ? `Site: ${asset.location.site}, Building: ${asset.location.building}, Floor: ${asset.location.floor}, Room: ${asset.location.room}`
        : 'Unknown';
};

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

export const TestTag = ({
    actions,
    currentRetestList,
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
    const [assetid, setAssetId] = React.useState(-1);
    const [assetTypeid, setAssetTypeId] = useState(-1);
    const [testStatus, setTestStatus] = React.useState(status.NONE);
    const [nextTestValue, setNextTestValue] = React.useState(12);
    const [discardingId, setDiscardingId] = React.useState(1);
    const [repairId, setRepairId] = React.useState(1);
    const [selectedTabValue, setSelectedTabValue] = React.useState(0);
    const [eventExpanded, setEventExpanded] = useState(true);
    const [previousTestExpanded, setPreviousTestExpanded] = useState(false);

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
                setTestStatus(status[value.toUpperCase()]);
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
    //     setFloorId('');
    //     setRoomId({});
    // }, [buildingid]);

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
    //     setTestStatus(status.NONE);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, JSON.stringify(currentAsset));

    const throttledAssetsSearch = React.useRef(
        throttle(
            250,
            pattern => !!pattern && pattern.length >= MINIMUM_ASSET_ID_PATTERN_LENGTH && actions.loadAssets(pattern),
        ),
    );
    console.log('assetsList', assetsList);
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
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                        setAssetId(newValue);
                                    } else if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        setAssetId(newValue.inputValue);
                                    } else {
                                        setAssetId(newValue);
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    // Suggest the creation of a new value
                                    if (params.inputValue !== '') {
                                        filtered.push({
                                            inputValue: params.inputValue,
                                            id: `Add "${params.inputValue}"`,
                                        });
                                    }

                                    return filtered;
                                }}
                                selectOnFocus
                                handleHomeEndKeys
                                options={assetsList ?? []}
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
                                        placeholder="UQL-"
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
                                value={assetTypes?.find(assetType => assetType.asset_type_id === assetTypeid) ?? ''}
                                onChange={(event, newValue) => {
                                    setAssetTypeId(newValue.asset_type_id);
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
                            <Select className={classes.formSelect} value={'UQ LIBRARY'}>
                                <MenuItem value="UQ LIBRARY">UQ LIBRARY</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* {!!currentAsset && Object.keys(currentAsset).length > 0 && (
                        <>
                            <Grid item sm={12}>
                                <Typography component={'p'}>Last location: {getLastLocation(currentAsset)}</Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography component={'p'}>
                                    Last test date: {currentAsset.lastTest?.date ?? 'Unknown'}
                                </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography component={'p'}>
                                    Last test status: {currentAsset.lastTest?.status?.label ?? 'Unknown'}
                                </Typography>
                            </Grid>
                            <Grid item sm={12}>
                                <Typography component={'p'}>
                                    Last test notes: {currentAsset.lastTest?.testNotes ?? 'None'}
                                </Typography>
                            </Grid>
                            {!!currentAsset.lastTest &&
                                !!currentAsset.lastTest?.action &&
                                (currentAsset.lastTest?.status === status.FAIL ||
                                    (currentAsset.lastTest?.status === status.PASS &&
                                        currentAsset.lastTest?.action === action.DISCARDED)) && (
                                    <Grid item sm={12}>
                                        <Typography component={'p'}>
                                            {currentAsset.lastTest?.action.label} Notes:{' '}
                                            {currentAsset.lastTest?.actionNotes ?? 'None'}
                                        </Typography>
                                    </Grid>
                                )}
                        </>
                    )} */}
                </Grid>
                <StandardCard
                    variant="outlined"
                    title={
                        <>
                            <Typography component={'span'} variant={'h6'}>
                                Previous Test
                            </Typography>
                            <Chip
                                style={{
                                    backgroundColor: theme.palette.success.main,
                                    color: theme.palette.primary.contrastText,
                                }}
                                avatar={<DoneIcon style={{ color: theme.palette.primary.contrastText }} />}
                                label="PASS"
                                component={'span'}
                            />
                            <ReportProblemOutlinedIcon style={{ color: theme.palette.warning.main }} />
                        </>
                    }
                    headerAction={
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: previousTestExpanded,
                            })}
                            aria-expanded={previousTestExpanded}
                            aria-label="show more"
                            onClick={() => setPreviousTestExpanded(!previousTestExpanded)}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    }
                    style={{ borderLeft: `10px solid ${theme.palette.success.main}` }}
                >
                    <Collapse in={previousTestExpanded} timeout="auto">
                        <Grid item xs={12}>
                            <Typography component={'p'}>Next Test Date: October 21, 2022</Typography>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <Typography component={'span'}>Date: April 22, 2022</Typography>
                            <Typography component={'span'}>Site: St Lucia</Typography>
                            <Typography component={'span'}>Building: Biological Sciences Library</Typography>
                            <Typography component={'span'}>Floor: 1</Typography>
                            <Typography component={'span'}>Room: L104B</Typography>
                            <Typography component={'span'}>Date: April 22, 2022</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Typography component={'span'} style={{ color: theme.palette.warning.main }}>
                                <ReportProblemOutlinedIcon style={{ color: theme.palette.warning.main }} /> Locations do
                                not match
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component={'p'}>Test Notes:</Typography>
                            <Typography component={'p'}>
                                The test went well, need to watch out for potential to arc at the next test as
                                connection is looking slightly wobbly. Defo keep an eye on that for the next test
                            </Typography>
                        </Grid>
                    </Collapse>
                </StandardCard>
                <StandardCard title="Test" style={{ marginTop: 30, marginBottom: 30 }} smallTitle>
                    <Grid container spacing={3}>
                        <Grid item sm={6}>
                            <FormControl className={classes.formControl}>
                                <InputLabel shrink>Testing device</InputLabel>
                                <Select
                                    fullWidth
                                    className={classes.formSelect}
                                    value={deviceid ?? ''}
                                    onChange={e => setDeviceId(e.target.value)}
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
                        <Grid item sm={6} style={{ textAlign: 'end' }}>
                            <Typography component={'span'}>Test Result</Typography>
                            <ToggleButtonGroup
                                value={testStatus.value}
                                exclusive
                                aria-label="test result"
                                size="small"
                                defaultChecked={false}
                                onChange={(e, child) => handleChange(e, child, 'testStatusRadio')}
                            >
                                <ToggleButton
                                    value={status.PASS.value}
                                    aria-label="pass"
                                    style={{
                                        backgroundColor:
                                            testStatus.value === status.PASS.value
                                                ? theme.palette.success.main
                                                : theme.palette.grey[300],
                                        color:
                                            testStatus.value === status.PASS.value
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.text.main,
                                    }}
                                >
                                    <DoneIcon /> PASS
                                </ToggleButton>
                                <ToggleButton
                                    value={status.FAIL.value}
                                    aria-label="fail"
                                    style={{
                                        backgroundColor:
                                            testStatus.value === status.FAIL.value
                                                ? theme.palette.error.main
                                                : theme.palette.grey[300],
                                        color:
                                            testStatus.value === status.FAIL.value
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.text.main,
                                    }}
                                >
                                    <ClearIcon /> FAIL
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>

                        {!!testStatus && testStatus.value === status.PASS.value && (
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink>Next test due</InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={nextTestValue}
                                        onChange={(e, child) => handleChange(e, child, 'nextTest')}
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
                        {!!testStatus && testStatus.value === status.FAIL.value && (
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <TextField
                                        label="Fail Reason"
                                        multiline
                                        rows={4}
                                        defaultValue=""
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
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
