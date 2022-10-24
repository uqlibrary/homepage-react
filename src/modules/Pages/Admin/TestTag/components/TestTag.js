import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { Grid } from '@material-ui/core';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { green, red } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

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
})(props => <Radio color="default" {...props} />);
const RedRadio = withStyles({
    root: {
        color: red[400],
        '&$checked': {
            color: red[600],
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);

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

export const TestTag = (/* { currentRetestList, ...rest }*/) => {
    const classes = useStyles();
    const today = moment().format('YYYY-MM-DD');
    const startDate = moment()
        .startOf('year')
        .format('YYYY-MM-DD');

    const [siteid] = useState(location.site[0].id);
    const [buildingid, setBuildingId] = useState('');
    const [floorid, setFloorId] = useState('');
    const [selectedRoom, setSelectedRoom] = React.useState({});
    const [deviceid, setDeviceId] = React.useState(1);
    const [currentAsset, setCurrentAsset] = React.useState({});
    const [currentAssetType, setCurrentAssetType] = React.useState({});
    const [testStatus, setTestStatus] = React.useState(status.NONE);
    const [nextTestValue, setNextTestValue] = React.useState(12);
    const [discardingId, setDiscardingId] = React.useState(1);
    const [repairId, setRepairId] = React.useState(1);

    const handleChange = (event, li, source) => {
        console.log(event, li, source);
        const value = !!li.hasOwnProperty('props') ? parseInt(li?.props['data-id'], 10) : li;
        switch (source) {
            case 'building':
                setBuildingId(value);
                break;
            case 'floor':
                setFloorId(value);
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
            default:
                return;
        }
    };

    useEffect(() => {
        setFloorId('');
        setSelectedRoom({});
    }, [buildingid]);

    useEffect(() => {
        setSelectedRoom({});
    }, [floorid]);

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

    return (
        <StandardPage title={locale.pageTitle}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard title={locale.testingPage.header}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography>Welcome Dave de Groot (Technical Services)</Typography>
                            </Grid>
                        </Grid>
                        <StandardCard title="Event Details" style={{ marginTop: 30 }}>
                            <Grid container spacing={3}>
                                <Grid item sm={12}>
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        label="Event date"
                                        type="date"
                                        value={today}
                                        inputProps={{
                                            min: startDate,
                                            max: today,
                                            required: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography component={'h3'}>Location</Typography>
                                </Grid>
                                <Grid item sm={2}>
                                    <FormControl className={classes.formControl} fullWidth>
                                        <InputLabel shrink>Site</InputLabel>
                                        <Select
                                            className={classes.formSelect}
                                            value={siteid}
                                            onChange={(e, child) => handleChange(e, child, 'site')}
                                        >
                                            Site
                                            <MenuItem value={location.site[0].value}>{location.site[0].label}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={3}>
                                    <FormControl className={classes.formControl} fullWidth>
                                        <InputLabel shrink>Building</InputLabel>
                                        <Select
                                            className={classes.formSelect}
                                            value={
                                                buildingid &&
                                                location.building.find(item => item.id === buildingid).value
                                            }
                                            onChange={(e, child) => handleChange(e, child, 'building')}
                                        >
                                            Building
                                            {location.building
                                                .filter(item => item.siteid === siteid)
                                                .map(item => (
                                                    <MenuItem key={item.id} value={item.value} data-id={item.id}>
                                                        {item.label}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={2}>
                                    <FormControl className={classes.formControl} fullWidth>
                                        <InputLabel shrink>Floor</InputLabel>
                                        <Select
                                            className={classes.formSelect}
                                            value={floorid && location.floor.find(item => item.id === floorid).value}
                                            onChange={(e, child) => handleChange(e, child, 'floor')}
                                        >
                                            Floor
                                            {location.floor
                                                .filter(
                                                    item => item.siteid === siteid && item.buildingid === buildingid,
                                                )
                                                .map(item => (
                                                    <MenuItem key={item.id} value={item.value} data-id={item.id}>
                                                        {item.label}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sm={5}>
                                    <FormControl className={classes.formControl} fullWidth>
                                        <Autocomplete
                                            fullWidth
                                            value={selectedRoom}
                                            onChange={(event, newValue) => {
                                                if (newValue && newValue.inputValue) {
                                                    // Create a new value from the user input
                                                    setSelectedRoom({
                                                        id: (location.room.sort((a, b) => a.id > b.id).pop().id += 1),
                                                        siteid,
                                                        buildingid,
                                                        floorid,
                                                        label: newValue.inputValue,
                                                        value: 'new',
                                                    });
                                                } else {
                                                    setSelectedRoom(newValue);
                                                }
                                            }}
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);

                                                // Suggest the creation of a new value
                                                if (params.inputValue !== '') {
                                                    filtered.push({
                                                        inputValue: params.inputValue,
                                                        label: `Add "${params.inputValue}"`,
                                                    });
                                                }

                                                return filtered;
                                            }}
                                            selectOnFocus
                                            clearOnBlur
                                            handleHomeEndKeys
                                            options={location.room.filter(
                                                item =>
                                                    item.siteid === siteid &&
                                                    item.buildingid === buildingid &&
                                                    item.floorid === floorid,
                                            )}
                                            getOptionLabel={option => {
                                                // Add "xxx" option created dynamically
                                                if (option.inputValue) {
                                                    return option.inputValue;
                                                }
                                                // Regular option
                                                return option.label;
                                            }}
                                            renderOption={option => option.label}
                                            freeSolo
                                            style={{ width: 300 }}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label="Room"
                                                    variant="standard"
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography component={'h3'}>Asset</Typography>
                                </Grid>
                                <Grid item sm={3}>
                                    <FormControl className={classes.formControl} fullWidth>
                                        <Autocomplete
                                            fullWidth
                                            options={assets}
                                            onChange={(event, newValue) => {
                                                setCurrentAsset(newValue ?? {});
                                            }}
                                            getOptionLabel={option => `${option.id}`}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label="Asset ID"
                                                    variant="standard"
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6}>
                                    <FormControl className={classes.formControl} fullWidth>
                                        <Autocomplete
                                            fullWidth
                                            value={currentAssetType}
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);

                                                // Suggest the creation of a new value
                                                if (params.inputValue !== '') {
                                                    filtered.push({
                                                        inputValue: params.inputValue,
                                                        label: `Add "${params.inputValue}"`,
                                                    });
                                                }

                                                return filtered;
                                            }}
                                            onChange={(event, newValue) => {
                                                if (typeof newValue === 'string') {
                                                    setCurrentAssetType({ id: 10, label: newValue, value: 'nv10' });
                                                } else if (newValue && newValue.inputValue) {
                                                    // Create a new value from the user input
                                                    setCurrentAssetType({
                                                        id: 10,
                                                        label: newValue.inputValue,
                                                        value: 'nv10',
                                                    });
                                                } else {
                                                    setCurrentAssetType(newValue);
                                                }
                                            }}
                                            selectOnFocus
                                            handleHomeEndKeys
                                            options={assetType}
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
                                                return option.label;
                                            }}
                                            renderOption={option => option.label}
                                            freeSolo
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
                                            <Typography component={'p'}>
                                                Last location: {getLastLocation(currentAsset)}
                                            </Typography>
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
                        </StandardCard>
                        {!!currentAsset &&
                            Object.keys(currentAsset).length > 0 &&
                            (!currentAsset.hasOwnProperty('lastTest') ||
                                currentAsset.lastTest?.action !== action.DISCARDED) && (
                                <StandardCard title="Testing Details" style={{ marginTop: 30 }}>
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
                                        <Grid item sm={6}>
                                            <FormControl component="fieldset" fullWidth>
                                                <FormLabel required component={'legend'}>
                                                    Testing Result
                                                </FormLabel>
                                                <RadioGroup
                                                    row
                                                    value={testStatus.value}
                                                    defaultChecked={false}
                                                    onChange={(e, child) => handleChange(e, child, 'testStatusRadio')}
                                                >
                                                    <FormControlLabel
                                                        value={status.PASS.value}
                                                        control={<GreenRadio />}
                                                        label={status.PASS.label}
                                                        labelPlacement="end"
                                                    />
                                                    <FormControlLabel
                                                        value={status.FAIL.value}
                                                        control={<RedRadio />}
                                                        label={status.FAIL.label}
                                                        labelPlacement="end"
                                                    />
                                                </RadioGroup>
                                            </FormControl>
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
                                                        <MenuItem value={3} data-id={3}>
                                                            3 months
                                                        </MenuItem>
                                                        <MenuItem value={6} data-id={6}>
                                                            6 months
                                                        </MenuItem>
                                                        <MenuItem value={12} data-id={12}>
                                                            1 year
                                                        </MenuItem>
                                                        <MenuItem value={60} data-id={60}>
                                                            5 years
                                                        </MenuItem>
                                                    </Select>
                                                    <Typography component={'span'}>
                                                        Next test due:{' '}
                                                        {moment()
                                                            .add(nextTestValue, 'months')
                                                            .format('DD/MM/YYYY')}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        )}
                                        {!!testStatus && testStatus.value === status.FAIL.value && (
                                            <Grid item sm={12}>
                                                <FormControl className={classes.formControl} fullWidth>
                                                    <TextField
                                                        label="Fail Notes"
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
                                </StandardCard>
                            )}
                        {!!currentAsset &&
                            Object.keys(currentAsset).length > 0 &&
                            (testStatus !== status.NONE ||
                                !currentAsset.hasOwnProperty('lastTest') ||
                                currentAsset.lastTest?.action === '') && (
                                <StandardCard title="Discard Asset" style={{ marginTop: 30 }}>
                                    <Grid container spacing={3}>
                                        <Grid item sm={12}>
                                            <Typography
                                                component={'h2'}
                                                style={{ backgroundColor: 'black', color: 'white', padding: 10 }}
                                            >
                                                IMPORTANT: Only complete this section if you are actually discarding
                                                this asset
                                            </Typography>
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
                                                    disabled={repairId === 2}
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
                                            <FormControl
                                                className={classes.formControl}
                                                fullWidth
                                                disabled={repairId === 2}
                                            >
                                                <TextField
                                                    label="Discarding Reason"
                                                    multiline
                                                    rows={4}
                                                    defaultValue=""
                                                    variant="standard"
                                                    InputProps={{ fullWidth: true }}
                                                    disabled={discardingId === 1}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            )}
                        {!!currentAsset &&
                            Object.keys(currentAsset).length > 0 &&
                            (testStatus === status.FAIL ||
                                !currentAsset.hasOwnProperty('lastTest') ||
                                currentAsset.lastTest?.action === '') && (
                                <StandardCard title="Out for Repair" style={{ marginTop: 30 }}>
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
                                                    disabled={discardingId === 2}
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
                                            <FormControl
                                                className={classes.formControl}
                                                fullWidth
                                                disabled={discardingId === 2}
                                            >
                                                <TextField
                                                    label="Repairer Details"
                                                    multiline
                                                    rows={4}
                                                    defaultValue=""
                                                    variant="standard"
                                                    InputProps={{ fullWidth: true }}
                                                    disabled={repairId === 1}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            )}
                    </StandardCard>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

// TestTag.propTypes = {
//     currentRetestList: PropTypes.array,
// };

export default TestTag;
