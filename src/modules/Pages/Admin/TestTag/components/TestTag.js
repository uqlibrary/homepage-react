import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { Grid, useTheme } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { KeyboardDatePicker } from '@material-ui/pickers';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

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
import Box from '@material-ui/core/Box';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { debounce } from 'throttle-debounce';

import TabPanel from './TabPanel';
import LastTestPanel from './LastTestPanel';
import { useForm } from '../utils/hooks';

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
    OUTFORREPAIR: { label: 'REPAIR', value: 'OUTFORREPAIR' },
    DISCARDED: { label: 'DISCARD', value: 'DISCARDED' },
    NONE: { label: 'NONE', value: 'NONE' },
};

const DEFAULT_FORM_VALUES = {
    asset_id_displayed: undefined,
    user_id: undefined, // TODO
    asset_department_owned_by: undefined,
    room_id: undefined,
    asset_type_id: undefined,
    action_date: undefined,
    with_inspection: {
        inspection_status: undefined,
        inspection_device_id: undefined,
        inspection_fail_reason: undefined,
        inspection_notes: undefined,
        inspection_date_next: undefined,
    },
    with_repair: {
        isRepair: false,
        repairer_details: undefined,
    },
    with_discarded: {
        isDiscarded: false,
        discard_reason: undefined,
    },
};

const a11yProps = index => ({
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
});

export const isEmpty = value => {
    return !!!value || value === '' || (!!value.length && value.length === 0);
};
export const isValidEventDate = (date, format) => {
    if (isEmpty(date)) return false;
    const today = new moment();
    const formattedToday = today.startOf('day');

    const formattedEventDate = new moment(date, format).startOf('day');
    const result = !!moment(formattedEventDate).isValid() && moment(formattedEventDate).isSameOrBefore(formattedToday);

    console.log('isValidEventDate', result, formattedToday, formattedEventDate);
    return result;
};
export const isValidNextTestDate = (date, format) => {
    if (isEmpty(date)) return false;
    const today = new moment();
    const formattedToday = today.startOf('day');

    const formattedNextTestDate = new moment(date, format).startOf('day');
    const result = !!moment(formattedNextTestDate).isValid() && moment(formattedNextTestDate).isAfter(formattedToday);

    console.log('isValidNextTestDate', result, formattedToday, formattedNextTestDate);
    return result;
    // console.log('isValidNextTestDate', date, new moment().isAfter(date));
    // if (isEmpty(date)) return false;
    // return new moment().isAfter(date);
};
export const isValidAssetId = assetId => !isEmpty(assetId);
export const isValidOwner = owner => !isEmpty(owner);
export const isValidRoomId = roomId => !!roomId && Number.isFinite(roomId) && roomId > 0;
export const isValidAssetTypeId = assetTypeId => !!assetTypeId && Number.isFinite(assetTypeId) && assetTypeId > 0;
export const isValidTestingDeviceId = testingDeviceId =>
    !!testingDeviceId && Number.isFinite(testingDeviceId) && testingDeviceId > 0;
export const isValidFailReason = reason => !isEmpty(reason);
export const isValidInspection = inspection => {
    // console.log(
    //     'isValidInspection',
    //     inspection,
    //     isValidTestingDeviceId(inspection.inspection_device_id),
    //     inspection.inspection_status === undefined,
    //     inspection.inspection_status === testStatusEnum.CURRENT.value,
    //     isValidNextTestDate(inspection.inspection_date_next),
    //     inspection.inspection_status === testStatusEnum.FAILED.value,
    //     isValidFailReason(inspection.inspection_fail_reason),
    // );

    return (
        inspection.inspection_status === undefined ||
        (isValidTestingDeviceId(inspection.inspection_device_id) &&
            ((inspection.inspection_status === testStatusEnum.CURRENT.value &&
                isValidNextTestDate(inspection.inspection_date_next)) ||
                (inspection.inspection_status === testStatusEnum.FAILED.value &&
                    isValidFailReason(inspection.inspection_fail_reason))))
    );
};

export const isValidRepairDetails = repairDetails => !isEmpty(repairDetails);
export const isValidRepair = repair => !!repair.isRepair && isValidRepairDetails(repair.repairer_details);
export const isValidDiscardedDetails = discardedDetails => !isEmpty(discardedDetails);
export const isValidDiscard = discard => !!discard.isDiscarded && isValidDiscardedDetails(discard.discard_reason);
export const isAssetDiscarded = lastTest => lastTest.test_status === testStatusEnum.DISCARDED.value;
export const isAssetOutForRepair = lastTest => lastTest.test_status === testStatusEnum.OUTFORREPAIR.value;
export const validateValues = (currentValues, loaders) => {
    const isValid =
        !loaders.assetListLoading &&
        !loaders.initConfigLoading &&
        !loaders.initConfigLoading &&
        !loaders.initConfigLoading &&
        !loaders.floorListLoading &&
        !loaders.roomListLoading &&
        currentValues.user_id > 0 &&
        isValidEventDate(currentValues.action_date) &&
        isValidAssetId(currentValues.asset_id_displayed) &&
        isValidOwner(currentValues.asset_department_owned_by) &&
        isValidRoomId(currentValues.room_id) &&
        isValidAssetTypeId(currentValues.asset_type_id) &&
        isValidInspection(currentValues.with_inspection) &&
        ((!!!currentValues.with_repair.isRepair && !!!currentValues.with_discarded.isDiscarded) ||
            (!!currentValues.with_repair.isRepair !== !!currentValues.with_discarded.isDiscarded &&
                ((!!currentValues.with_repair.isRepair && isValidRepair(currentValues.with_repair)) ||
                    (!!currentValues.with_discarded.isDiscarded && isValidDiscard(currentValues.with_discarded)))));
    // console.log(
    //     'validateValues',
    //     currentValues,
    //     !loaders.assetListLoading,
    //     !loaders.initConfigLoading,
    //     !loaders.initConfigLoading,
    //     !loaders.initConfigLoading,
    //     !loaders.floorListLoading,
    //     !loaders.roomListLoading,
    //     currentValues.user_id > 0,
    //     isValidEventDate(currentValues.action_date),
    //     isValidAssetId(currentValues.asset_id_displayed),
    //     isValidOwner(currentValues.asset_department_owned_by),
    //     isValidRoomId(currentValues.room_id),
    //     isValidAssetTypeId(currentValues.asset_type_id),
    //     isValidInspection(currentValues.with_inspection),
    //     !!!currentValues.with_repair.isRepair && !!!currentValues.with_discarded.isDiscarded,
    //     !!currentValues.with_repair.isRepair !== !!currentValues.with_discarded.isDiscarded,
    //     !!currentValues.with_repair.isRepair && isValidRepair(currentValues.with_repair),
    //     !!currentValues.with_discarded.isDiscarded && isValidDiscard(currentValues.with_discarded),
    // );

    // console.log('isValid', isValid);
    return isValid;
};

const TestTag = ({
    actions,
    currentRetestList,
    currentAssetOwnersList,
    defaultNextTestDateValue,
    assetsList,
    assetsListLoading,
    assetsListError,
    initConfig,
    initConfigLoading,
    initConfigError,
    floorList,
    floorListLoading,
    floorListError,
    roomList,
    roomListLoading,
    roomListError,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    // const standardCardClasses = useStyles(StandardCardStyles);
    const dateFormat = 'YYYY-MM-DD HH:MM';
    const dateFormatNoTime = 'YYYY-MM-DD';
    const dateFormatDisplay = 'Do MMMM, YYYY';
    const today = moment().format(dateFormat);
    const startDate = moment()
        .startOf('year')
        .format(dateFormat);

    const [selectedAsset, setSelectedAsset] = useState({});

    const [formSiteId, setFormSiteId] = useState(-1);
    // const [formEventDate, setFormEventDate] = useState(today);
    const [formBuildingId, setFormBuildingId] = useState(-1);
    const [formFloorId, setFormFloorId] = useState(-1);
    // const [formRoomId, setFormRoomId] = useState(-1);
    // const [formDeviceId, setFormDeviceId] = useState(
    //     !!!initConfigLoading && !!!initConfigError && !!initConfig && !!initConfig.length > 0
    //         ? initConfig[0].device_id
    //         : -1,
    // );
    // const [formAssetType, setFormAssetType] = useState({});
    const [formAssetList, setFormAssetList] = useState(assetsList ?? []);
    // const [formTestStatus, setFormTestStatus] = useState(testStatusEnum.NONE);
    const [formNextTestDate, setFormNextTestDate] = useState(defaultNextTestDateValue);
    const [formDiscardingId, setFormDiscardingId] = useState(1);
    const [formRepairId, setFormRepairId] = useState(1);
    const [formOwnerId] = useState(currentAssetOwnersList[0].value); // TODO if more owners added
    const [selectedTabValue, setSelectedTabValue] = useState(0);
    const [eventExpanded, setEventExpanded] = useState(true);
    const [open, setOpen] = useState(false);

    const [isFormValid, setFormValidity] = useState(false);

    const assignAssetDefaults = (asset = {}, formValues = {}) => {
        return {
            ...DEFAULT_FORM_VALUES,
            asset_id_displayed: asset?.asset_id_displayed ?? undefined,
            asset_department_owned_by: formOwnerId ?? undefined,
            asset_type_id: asset?.asset_type?.asset_type ?? undefined,
            user_id: 1, // TODO
            room_id: formValues?.room_id ?? undefined,
            action_date: formValues?.action_date ?? today,
            with_inspection: {
                ...DEFAULT_FORM_VALUES.with_inspection,
                inspection_device_id:
                    formValues?.with_inspection?.inspection_device_id !== -1
                        ? formValues?.with_inspection?.inspection_device_id
                        : initConfig.inspection_devices?.[0].device_id ?? undefined,
            },
        };
    };

    const [formValues, resetFormValues, handleChange] = useForm({
        defaultValues: { ...assignAssetDefaults() },
        defaultDateFormat: dateFormat,
    });

    const assignCurrentAsset = asset => {
        const newFormValues = assignAssetDefaults(asset, formValues);
        console.log('assignCurrentAsset', newFormValues);
        resetFormValues(newFormValues);
        setSelectedAsset(asset);
    };

    useEffect(() => {
        actions.loadConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!open) {
            setFormAssetList([]);
        }
    }, [open]);
    React.useEffect(() => {
        console.log('assetlist effect', assetsList);
        !!assetsList && setFormAssetList(...[assetsList]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsList]);

    useEffect(() => {
        setFormValidity(
            validateValues(formValues, {
                initConfigLoading,
                floorListLoading,
                roomListLoading,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);
    useEffect(() => {
        if (!initConfigLoading && !!initConfig && initConfig?.sites.length > 0) {
            setFormSiteId(initConfig.sites[0].site_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initConfigLoading]);

    useEffect(() => {
        setFormBuildingId(-1);
        setFormFloorId(-1);
    }, [formSiteId]);

    useEffect(() => {
        if (formSiteId !== -1 && formBuildingId !== -1) {
            actions.loadFloors(formBuildingId);
            setFormFloorId(-1);
            // setFormRoomId(-1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formBuildingId]);

    useEffect(() => {
        if (formSiteId !== -1 && formBuildingId !== -1 && formFloorId !== -1) {
            actions.loadRooms(formFloorId);
            // setFormRoomId(-1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formFloorId]);

    useEffect(() => {
        if (formValues?.with_inspection?.inspection_status === testStatusEnum.CURRENT.value) {
            handleChange('with_inspection.inspection_date_next')(moment().add(formNextTestDate, 'months'));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues?.with_inspection?.inspection_status, formNextTestDate]);

    useEffect(() => {
        handleChange('with_repair.isRepair')(formRepairId === 2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formRepairId]);
    useEffect(() => {
        handleChange('with_discarded.isDiscarded')(formDiscardingId === 2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formDiscardingId]);

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

    const debounceAssetsSearch = React.useRef(
        debounce(
            500,
            pattern => !!pattern && pattern.length >= MINIMUM_ASSET_ID_PATTERN_LENGTH && actions.loadAssets(pattern),
        ),
        { noLeading: true, noTrailing: true },
    ).current;

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
                            <KeyboardDatePicker
                                id="testntag-form-action-date"
                                data-testid="testntag-form-action-date"
                                InputLabelProps={{ shrink: true }}
                                label="Event date"
                                format={dateFormatNoTime}
                                minDate={startDate}
                                autoOk
                                disableFuture
                                showTodayButton
                                value={formValues.action_date}
                                onChange={handleChange('action_date')}
                                required
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
                                    value={formSiteId === -1 ? '' : formSiteId}
                                    onChange={e => {
                                        setFormSiteId(e.target.value);
                                    }}
                                >
                                    {!!initConfigLoading && (
                                        <MenuItem value={-1} disabled key={'site-loading'}>
                                            Loading...
                                        </MenuItem>
                                    )}
                                    {!!!initConfigLoading &&
                                        !!!initConfigError &&
                                        !!initConfig &&
                                        initConfig?.sites?.length > 0 &&
                                        initConfig.sites.map(site => (
                                            <MenuItem value={site.site_id} key={site.site_id}>
                                                {site.site_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* HERE
                        Then retest the validation object with the new sites etc, maybe add some
                        validation error handling using the functions made
                        then work on a mock test of sending data to the back end plus the required UI elements */}
                        <Grid item sm={6} md={4}>
                            <FormControl className={classes.formControl} fullWidth>
                                <Autocomplete
                                    fullWidth
                                    options={
                                        initConfig?.sites?.find(site => site.site_id === formSiteId)?.buildings ?? []
                                    }
                                    value={
                                        initConfig?.sites
                                            ?.find(site => site.site_id === formSiteId)
                                            ?.buildings?.find(building => building.building_id === formBuildingId) ?? ''
                                    }
                                    onChange={(_, newValue) => {
                                        setFormBuildingId(newValue.building_id);
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
                                                        {initConfigLoading ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                    disabled={formSiteId === -1 || initConfigLoading}
                                    disableClearable
                                    autoSelect
                                    loading={!!initConfigLoading}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} md={2}>
                            <FormControl className={classes.formControl} fullWidth>
                                <Autocomplete
                                    fullWidth
                                    options={floorList?.floors ?? []}
                                    value={floorList?.floors?.find(floor => floor.floor_id === formFloorId) ?? ''}
                                    onChange={(_, newValue) => {
                                        setFormFloorId(newValue.floor_id);
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
                                    disabled={formBuildingId === -1 || floorListLoading}
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
                                    value={roomList?.rooms?.find(room => room.room_id === formValues.room_id) ?? ''}
                                    onChange={(_, newValue) => {
                                        handleChange('room_id')(newValue.room_id);
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
                                    disabled={formFloorId === -1 || roomListLoading}
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
                                        assignCurrentAsset({ asset_id_displayed: newValue, isNew: true });
                                    } else if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        assignCurrentAsset({ asset_id_displayed: newValue.inputValue, isNew: true });
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
                                options={formAssetList}
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
                                        placeholder="Enter at least 7 characters"
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
                                        onChange={e => debounceAssetsSearch(e.target.value)}
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
                                options={initConfig?.asset_types ?? []}
                                value={
                                    initConfig?.asset_types?.find(
                                        assetType => assetType.asset_type_id === formValues.asset_type_id,
                                    ) ?? ''
                                }
                                onChange={(_, newValue) => {
                                    handleChange('asset_type_id')(newValue.asset_type_id);
                                }}
                                getOptionLabel={option => option.asset_type_name}
                                getOptionSelected={(option, value) => option.asset_type_id === value.asset_type_id}
                                autoHighlight
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
                                                    {initConfigLoading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                                disabled={initConfigLoading}
                                disableClearable
                                autoSelect
                                loading={!!initConfigLoading}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item sm={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel shrink>Asset owner</InputLabel>
                            <Select className={classes.formSelect} value={formOwnerId}>
                                {currentAssetOwnersList.map(owner => (
                                    <MenuItem value={owner.value} key={owner.value}>
                                        {owner.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <LastTestPanel
                    asset={selectedAsset ?? {}}
                    currentLocation={{ formSiteId, formBuildingId, formFloorId, formRoomId: formValues.room_id }}
                    dateFormatPattern={dateFormatDisplay}
                    disabled={!!!selectedAsset?.last_test?.test_status ?? true}
                    testStatusEnums={testStatusEnum}
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
                                    value={formValues?.with_inspection?.inspection_device_id ?? ''}
                                    onChange={e => handleChange('with_inspection.inspection_device_id')(e.target.value)}
                                    required
                                >
                                    {!!initConfigLoading && (
                                        <MenuItem value={-1} disabled key={'devicetypes-loading'}>
                                            Loading...
                                        </MenuItem>
                                    )}
                                    {!!!initConfigLoading &&
                                        !!!initConfigError &&
                                        !!initConfig &&
                                        !!initConfig?.inspection_devices &&
                                        initConfig?.inspection_devices?.length > 0 &&
                                        initConfig.inspection_devices.map(device => (
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
                                    value={formValues?.with_inspection?.inspection_status ?? testStatusEnum.NONE.value}
                                    exclusive
                                    id="testResultToggleButtons"
                                    size="small"
                                    defaultChecked={false}
                                    onChange={(_, child) => {
                                        handleChange('with_inspection.inspection_status')(child);
                                    }}
                                >
                                    <ToggleButton
                                        value={testStatusEnum.CURRENT.value}
                                        aria-label="pass"
                                        style={{
                                            backgroundColor:
                                                formValues?.with_inspection?.inspection_status ===
                                                testStatusEnum.CURRENT.value
                                                    ? theme.palette.success.main
                                                    : theme.palette.grey[300],
                                            color:
                                                formValues?.with_inspection?.inspection_status ===
                                                testStatusEnum.CURRENT.value
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
                                                formValues?.with_inspection?.inspection_status ===
                                                testStatusEnum.FAILED.value
                                                    ? theme.palette.error.main
                                                    : theme.palette.grey[300],
                                            color:
                                                formValues?.with_inspection?.inspection_status ===
                                                testStatusEnum.FAILED.value
                                                    ? theme.palette.primary.contrastText
                                                    : theme.palette.text.main,
                                        }}
                                    >
                                        <ClearIcon /> FAIL
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Grid>

                        {formValues?.with_inspection?.inspection_status === testStatusEnum.CURRENT.value && (
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink required>
                                        Next test due
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={formNextTestDate}
                                        onChange={e => setFormNextTestDate(e.target.value)}
                                        required
                                    >
                                        {currentRetestList.map(retestPeriod => (
                                            <MenuItem value={retestPeriod.value} key={retestPeriod.value}>
                                                {retestPeriod.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography component={'span'}>
                                        Next test due:{' '}
                                        {moment()
                                            .add(formNextTestDate, 'months')
                                            .format(dateFormatDisplay)}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        )}

                        {formValues?.with_inspection?.inspection_status === testStatusEnum.FAILED.value && (
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
                                        value={formValues?.with_inspection?.inspection_fail_reason ?? undefined}
                                        onChange={handleChange('with_inspection.inspection_fail_reason')}
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
                                    value={formValues?.with_inspection?.inspection_notes ?? undefined}
                                    onChange={handleChange('with_inspection.inspection_notes')}
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
                        onChange={(e, value) => setSelectedTabValue(value)}
                    >
                        <Tab label="Repair" {...a11yProps(0)} disabled={formDiscardingId === 2} />
                        <Tab label="Discard" {...a11yProps(1)} disabled={formRepairId === 2} />
                    </Tabs>
                    <TabPanel value={selectedTabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item sm={12}>
                                <FormControl className={classes.formControl} disabled={formDiscardingId === 2}>
                                    <InputLabel shrink>Send for Repair</InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={formRepairId}
                                        onChange={e => setFormRepairId(e.target.value)}
                                        style={{ minWidth: 200 }}
                                    >
                                        <MenuItem value={1}>NO</MenuItem>
                                        <MenuItem value={2}>YES</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sm={12}>
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                    disabled={formDiscardingId === 2}
                                    required
                                >
                                    <TextField
                                        required
                                        label="Repairer Details"
                                        multiline
                                        rows={4}
                                        defaultValue=""
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        disabled={formRepairId === 1}
                                        value={formValues?.with_repair?.repairer_details ?? undefined}
                                        onChange={handleChange('with_repair.repairer_details')}
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
                                <FormControl className={classes.formControl} disabled={formRepairId === 2}>
                                    <InputLabel shrink>DISCARD THIS ASSET</InputLabel>
                                    <Select
                                        fullWidth
                                        className={classes.formSelect}
                                        value={formDiscardingId}
                                        onChange={e => setFormDiscardingId(e.target.value)}
                                        style={{ minWidth: 200 }}
                                    >
                                        <MenuItem value={1}>NO</MenuItem>
                                        <MenuItem value={2}>YES</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sm={12}>
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                    disabled={formRepairId === 2}
                                    required
                                >
                                    <TextField
                                        required
                                        label="Discarding Reason"
                                        multiline
                                        rows={4}
                                        defaultValue=""
                                        variant="standard"
                                        InputProps={{ fullWidth: true }}
                                        disabled={formDiscardingId === 1}
                                        value={formValues?.with_discarded?.discard_reason ?? undefined}
                                        onChange={handleChange('with_discarded.discard_reason')}
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
                        <Button variant="contained" color="primary" disabled={!isFormValid}>
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
    defaultNextTestDateValue: PropTypes.number,
    assetsList: PropTypes.any,
    assetsListLoading: PropTypes.bool,
    assetsListError: PropTypes.any,
    initConfig: PropTypes.any,
    initConfigLoading: PropTypes.bool,
    initConfigError: PropTypes.any,
    floorList: PropTypes.any,
    floorListLoading: PropTypes.bool,
    floorListError: PropTypes.any,
    roomList: PropTypes.any,
    roomListLoading: PropTypes.bool,
    roomListError: PropTypes.any,
};

export default React.memo(TestTag);
