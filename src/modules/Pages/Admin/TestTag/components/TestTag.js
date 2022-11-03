import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { Grid, useTheme } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard, styles as StandardCardStyles } from 'modules/SharedComponents/Toolbox/StandardCard';
import { green, red } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';

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

const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Radio color="default" tabIndex={0} {...props} />);
const RedRadio = withStyles({
    root: {
        color: red[400],
        '&$checked': {
            color: red[600],
        },
    },
    checked: {},
})(props => <Radio color="default" tabIndex={0} {...props} />);

const location = {
    site: [{ id: 1, label: 'St Lucia', value: 1 }],
    building: [
        { id: 1, siteid: 1, label: 'Biological Sciences Library', value: '0094' },
        { id: 2, siteid: 1, label: 'Duhig Link', value: '0012A' },
    ],
    floor: [
        { id: 1, siteid: 1, buildingid: 1, label: '1', value: '1' },
        { id: 2, siteid: 1, buildingid: 1, label: '2', value: '2' },
        { id: 3, siteid: 1, buildingid: 1, label: '3', value: '3' },
        { id: 4, siteid: 1, buildingid: 2, label: '1', value: '1' },
        { id: 5, siteid: 1, buildingid: 2, label: '2', value: '2' },
        { id: 6, siteid: 1, buildingid: 2, label: '3', value: '3' },
        { id: 7, siteid: 1, buildingid: 2, label: '4', value: '4' },
    ],
    room: [
        { id: 1, siteid: 1, buildingid: 1, floorid: 1, label: 'Circulation Space', value: '101' },
        { id: 2, siteid: 1, buildingid: 1, floorid: 1, label: 'Reading Room/Study Space', value: '102' },
        { id: 3, siteid: 1, buildingid: 1, floorid: 2, label: 'Informal Learning', value: '103' },
        { id: 4, siteid: 1, buildingid: 1, floorid: 2, label: 'Group Study Room', value: '104' },
        { id: 5, siteid: 1, buildingid: 1, floorid: 3, label: 'Office Storage', value: '105' },
        {
            id: 6,
            siteid: 1,
            buildingid: 1,
            floorid: 3,
            label: 'Seminar/Tutorial/Class Room (30 or fewer seats)',
            value: '106',
        },
        { id: 7, siteid: 1, buildingid: 2, floorid: 4, label: 'Open Access computers', value: '201' },
        { id: 8, siteid: 1, buildingid: 2, floorid: 4, label: 'Computing Lab-Open Access', value: '202' },
        { id: 9, siteid: 1, buildingid: 2, floorid: 5, label: 'Library consultation room', value: '203' },
        { id: 10, siteid: 1, buildingid: 2, floorid: 5, label: 'Open Group Study', value: '204' },
        { id: 11, siteid: 1, buildingid: 2, floorid: 6, label: 'Reading Room/Study Space', value: '205' },
        { id: 12, siteid: 1, buildingid: 2, floorid: 6, label: 'Group Study Room', value: '206' },
        { id: 13, siteid: 1, buildingid: 2, floorid: 7, label: 'Library Services', value: '207' },
        { id: 14, siteid: 1, buildingid: 2, floorid: 7, label: 'Office-Professional/General Staff', value: '208' },
    ],
};

const assetType = [
    { id: 1, label: 'power board 3 outlet', value: 'pb3' },
    { id: 2, label: 'power board 5 outlet', value: 'pb5' },
    { id: 3, label: 'kettle', value: 'k1' },
    { id: 4, label: 'microwave', value: 'mw1' },
    { id: 5, label: '1 metre kettle lead', value: 'kl1' },
    { id: 6, label: '3 metre kettle lead', value: 'kl3' },
];

const status = {
    PASS: { label: 'PASS', value: 'pass' },
    FAIL: { label: 'FAIL', value: 'fail' },
    NONE: { label: 'NONE', value: 'none' },
};
const action = {
    OUTFORREPAIR: { label: 'OUT FOR REPAIR' },
    DISCARDED: { label: 'DISCARDED' },
};

const assets = [
    {
        id: 1001,
        assetTypeId: 1,
        location: {
            site: location.site[0].label,
            building: location.building[0].label,
            floor: location.floor[0].label,
            room: location.room[0].label,
        },
        lastTest: {
            date: '12/10/2022',
            status: status.PASS,
            testNotes: 'Everything working great :)',
            action: action.DISCARDED,
            actionNotes: 'Handed over to another department',
        },
    },
    {
        id: 1002,
        assetTypeId: 2,
        location: {
            site: location.site[0].label,
            building: location.building[0].label,
            floor: location.floor[0].label,
            room: location.room[1].label,
        },
        lastTest: {
            date: '12/09/2022',
            status: status.PASS,
            testNotes: null,
        },
    },
    {
        id: 1003,
        assetTypeId: 3,
        location: {
            site: location.site[0].label,
            building: location.building[0].label,
            floor: location.floor[1].label,
            room: location.room[2].label,
        },
        lastTest: {
            date: '12/08/2022',
            status: status.FAIL,
            failReason: 'Not powering up',
            action: action.OUTFORREPAIR,
            actionNotes: 'My Repairs PTY LTD, Some place, Some Town, QUEENSLAND. Tel: 0405123456',
            testNotes: null,
        },
    },
    {
        id: 1004,
        assetTypeId: 4,
        location: {
            site: location.site[0].label,
            building: location.building[0].label,
            floor: location.floor[1].label,
            room: location.room[3].label,
        },
        lastTest: {
            date: '12/09/2022',
            status: status.FAIL,
            failReason: 'Not powering up',
            action: action.DISCARDED,
            actionNotes: 'Binned for recycling in bin REC12',
            testNotes: 'Tried several attempts to pass test, all failed',
        },
    },
    {
        id: 1005,
        assetTypeId: 5,
        location: {
            site: location.site[0].label,
            building: location.building[0].label,
            floor: location.floor[2].label,
            room: location.room[4].label,
        },
        lastTest: {
            date: '12/10/2022',
            status: status.PASS,
            testNotes: null,
        },
    },
    {
        id: 1006,
        assetTypeId: 6,
        location: {
            site: location.site[0].label,
            building: location.building[0].label,
            floor: location.floor[2].label,
            room: location.room[5].label,
        },
        lastTest: {
            date: '12/09/2022',
            status: status.PASS,
            testNotes: null,
        },
    },
    {
        id: 1007,
        assetTypeId: 1,
        location: {
            site: location.site[0].label,
            building: location.building[1].label,
            floor: location.floor[3].label,
            room: location.room[6].label,
        },
        lastTest: {
            date: '12/08/2022',
            status: status.FAIL,
            failReason: 'Arcing when powered up',
            action: action.OUTFORREPAIR,
            actionNotes: 'My Repairs PTY LTD, Some place, Some Town, QUEENSLAND. Tel: 0405123456',
            testNotes: 'Dangerous device to even test',
        },
    },
    {
        id: 1008,
        assetTypeId: 2,
        location: {
            site: location.site[0].label,
            building: location.building[1].label,
            floor: location.floor[3].label,
            room: location.room[7].label,
        },
        lastTest: {
            date: '12/09/2022',
            status: status.PASS,
            testNotes: null,
        },
    },
    {
        id: 1009,
        assetTypeId: 3,
        location: {
            site: location.site[0].label,
            building: location.building[1].label,
            floor: location.floor[4].label,
            room: location.room[8].label,
        },
        lastTest: {
            date: '12/10/2022',
            status: status.FAIL,
            failReason: 'Power output not at required level',
            action: action.DISCARDED,
            actionNotes: 'Binned in general waste',
            testNotes: 'Insulation eroded rendering item unsafe',
        },
    },
    {
        id: 1010,
        assetTypeId: 4,
        location: {
            site: location.site[0].label,
            building: location.building[1].label,
            floor: location.floor[4].label,
            room: location.room[9].label,
        },
        lastTest: {
            date: '12/09/2022',
            status: status.PASS,
            testNotes: null,
        },
    },
    {
        id: 1011,
    },
    {
        id: 1012,
    },
];

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
    const [deviceid, setDeviceId] = React.useState(1);
    const [currentAsset, setCurrentAsset] = React.useState({});
    const [currentAssetType, setCurrentAssetType] = React.useState({});
    const [testStatus, setTestStatus] = React.useState(status.NONE);
    const [nextTestValue, setNextTestValue] = React.useState(12);
    const [discardingId, setDiscardingId] = React.useState(1);
    const [repairId, setRepairId] = React.useState(1);
    const [selectedTabValue, setSelectedTabValue] = React.useState(0);

    const handleChange = (event, li, source) => {
        const value =
            !!li && !!li.hasOwnProperty('props') ? parseInt(li?.props['data-id'] ?? li?.props.value, 10) : li ?? null;
        console.log(event, li, source, value);
        switch (source) {
            case 'eventDate':
                setEventDate(event.format(dateFormat));
                break;
            case 'site':
                setSiteId(value);
                setBuildingId(-1);
                setFloorId(-1);
                break;
            case 'building':
                setBuildingId(value);
                setFloorId(-1);
                setRoomId(-1);
                break;
            case 'floor':
                setFloorId(value);
                setRoomId(-1);
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
        actions.loadSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (siteid !== -1 && buildingid !== -1) {
            actions.loadFloors(siteid, buildingid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildingid]);

    useEffect(() => {
        console.log('LOADROOMS EVENT', siteid, buildingid, floorid);
        if (siteid !== -1 && buildingid !== -1 && floorid !== -1) {
            actions.loadRooms(siteid, buildingid, floorid);
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

    useEffect(() => {
        setCurrentAssetType(
            (Object.keys(currentAsset).length > 0 &&
                !!currentAsset.assetTypeId &&
                assetType.find(item => item.id === currentAsset.assetTypeId)) ??
                {},
        );
        setTestStatus(status.NONE);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, JSON.stringify(currentAsset));
    const expanded = true;
    console.log('roomList', roomListLoading, roomListError, roomList);
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
                            [classes.expandOpen]: expanded,
                        })}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                }
            >
                <Collapse in={expanded} timeout="auto">
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
                                <InputLabel shrink>Building</InputLabel>
                                <Select
                                    className={classes.formSelect}
                                    value={buildingid === -1 ? '' : buildingid}
                                    onChange={(e, child) => handleChange(e, child, 'building')}
                                >
                                    {!!siteListLoading && (
                                        <MenuItem value={-1} disabled key={'building-loading'}>
                                            Loading...
                                        </MenuItem>
                                    )}
                                    {!!!siteListLoading &&
                                        !!!siteListError &&
                                        !!siteList &&
                                        !!siteList.length > 0 &&
                                        siteList
                                            .find(site => site.site_id === siteid)
                                            ?.buildings.map(building => (
                                                <MenuItem value={building.building_id} key={building.building_id}>
                                                    {building.building_id_displayed}
                                                </MenuItem>
                                            ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} md={2}>
                            <FormControl className={classes.formControl} fullWidth>
                                <InputLabel shrink>Floor</InputLabel>
                                <Select
                                    className={classes.formSelect}
                                    value={floorid === -1 ? '' : floorid}
                                    onChange={(e, child) => handleChange(e, child, 'floor')}
                                >
                                    {!!floorListLoading && (
                                        <MenuItem value={-1} disabled key={'floor-loading'}>
                                            Loading...
                                        </MenuItem>
                                    )}
                                    {!!!floorListLoading &&
                                        !!!floorListError &&
                                        !!floorList &&
                                        floorList.floors.map(floor => (
                                            <MenuItem value={floor.floor_id} key={floor.floor_id}>
                                                {floor.floor_id_displayed}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} md={3}>
                            <FormControl className={classes.formControl} fullWidth>
                                <Autocomplete
                                    fullWidth
                                    options={!!!roomListLoading && !!!roomListError && !!roomList && roomList.rooms}
                                    value={roomid}
                                    onChange={(event, newValue) => {
                                        setRoomId(newValue);
                                    }}
                                    getOptionLabel={option => option.room_id_displayed}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Room"
                                            variant="standard"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
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
                                value={(currentAsset.length > 0 && currentAsset) ?? ''}
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                        setCurrentAsset({ id: newValue });
                                    } else if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        setCurrentAsset({
                                            id: newValue.inputValue,
                                        });
                                    } else {
                                        setCurrentAsset(newValue ?? {});
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
                                options={assets}
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
                                    return `${option.id ?? ''}`;
                                }}
                                renderOption={option => `${option.id}`}
                                freeSolo
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Asset ID"
                                        variant="standard"
                                        InputLabelProps={{ shrink: true }}
                                        helperText={'Enter a new ID to add'}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item sm={6}>
                        <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                                fullWidth
                                options={assetType}
                                value={currentAssetType}
                                onChange={(event, newValue) => {
                                    setCurrentAssetType(newValue);
                                }}
                                getOptionLabel={option => option.label}
                                style={{ width: 300 }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Asset type"
                                        variant="standard"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
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
                    {!!currentAsset && Object.keys(currentAsset).length > 0 && (
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
                    )}
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
                                [classes.expandOpen]: expanded,
                            })}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    }
                    style={{ borderLeft: `10px solid ${theme.palette.success.main}` }}
                >
                    <Collapse in={expanded} timeout="auto">
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
                                    value={deviceid}
                                    onChange={(e, child) => handleChange(e, child, 'device')}
                                >
                                    <MenuItem value={1} data-id={1}>
                                        Testing Device One
                                    </MenuItem>
                                    <MenuItem value={2} data-id={2}>
                                        Testing Device Two
                                    </MenuItem>
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
    siteList: PropTypes.any,
    siteListLoading: PropTypes.bool,
    siteListError: PropTypes.any,
    floorList: PropTypes.any,
    floorListLoading: PropTypes.bool,
    floorListError: PropTypes.any,
    roomList: PropTypes.any,
    roomListLoading: PropTypes.bool,
    roomListError: PropTypes.any,
};

export default React.memo(TestTag);
