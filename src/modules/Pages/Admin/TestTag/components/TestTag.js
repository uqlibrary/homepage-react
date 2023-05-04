import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { Box, useTheme } from '@material-ui/core';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import clsx from 'clsx';

import TestTagHeader from './TestTagHeader';
import EventPanel from './EventPanel';
import AssetPanel from './AssetPanel';
import { scrollToTopOfPage, statusEnum } from '../utils/helpers';
import { useForm, useValidation, useLocation } from '../utils/hooks';
import locale from '../testTag.locale';
const moment = require('moment');
const testStatusEnum = statusEnum(locale);

const useStyles = makeStyles(theme => ({
    formControl: {
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
    toggleButtonMobile: {
        flex: 1,
    },
    header: {
        paddingBottom: theme.spacing(2),
    },
    dialogContainer: {
        borderRadius: '6px',
        borderWidth: '1px',
        borderStyle: 'solid',
        color: 'black',
    },
    dialogPassedContainer: {
        backgroundColor: '#69B400',
        borderColor: '#69B400',
    },
    dialogFailedContainer: {
        backgroundColor: '#ef000c',
        borderColor: '#ef000c',
    },
    dialogTitle: {
        textAlign: 'center',
        padding: '8px',
        '& >p': {
            fontWeight: '500',
            fontFamily: 'monospace, monospace',
        },
    },
    dialogFailedTitle: {
        '& >h4': {
            fontWeight: '700',
            fontFamily: 'monospace, monospace',
            textDecoration: 'underline',
        },
    },
    dialogFailedAssetStatus: {
        textAlign: 'center',
        padding: '8px',
        '& >h5': {
            fontWeight: '700',
            fontFamily: 'monospace, monospace',
        },
    },
    dialogBarcode: {
        backgroundColor: 'white',
        padding: '8px',
        textAlign: 'center',
        '& >h6': {
            fontFamily: 'monospace, monospace',
        },
    },
    dialogSuccessLineItems: {
        padding: '8px',
        [theme.breakpoints.down('xs')]: {
            textAlign: 'center',
        },
        '& >p': {
            fontWeight: '500',
            fontFamily: 'monospace, monospace',
        },
    },
    dialogFailedLineItems: {
        padding: '8px',
        textAlign: 'center',
        '& >p': {
            fontWeight: '500',
            fontFamily: 'monospace, monospace',
        },
    },
}));
const savedDialogMessages = {
    [testStatusEnum.CURRENT.value]: (data, classes, locale) => (
        <Grid
            container
            item
            xs={12}
            sm={6}
            alignItems="center"
            className={clsx([classes.dialogContainer, classes.dialogPassedContainer])}
        >
            <Grid item xs={12} className={clsx([classes.dialogTitle, classes.dialogSuccessTitle])} variant="subtitle1">
                <Typography gutterBottom>
                    {locale.testedBy} {data.user_licence_number}
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.dialogBarcode}>
                <Typography gutterBottom variant="h6">
                    {data.asset_id_displayed}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.dialogSuccessLineItems} variant="subtitle1">
                <Typography gutterBottom>{locale.testedDate}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.dialogSuccessLineItems} variant="subtitle1">
                <Typography gutterBottom>{data.action_date}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.dialogSuccessLineItems} variant="subtitle1">
                <Typography gutterBottom>{locale.dateNextDue}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.dialogSuccessLineItems} variant="subtitle1">
                <Typography gutterBottom>{data.asset_next_test_due_date ?? locale.notApplicable}</Typography>
            </Grid>
        </Grid>
    ),
    other: (data, classes, locale) => (
        <Grid
            container
            item
            xs={12}
            sm={6}
            alignItems="center"
            className={clsx([classes.dialogContainer, classes.dialogFailedContainer])}
        >
            <Grid item xs={12} className={clsx([classes.dialogTitle, classes.dialogFailedTitle])}>
                <Typography gutterBottom variant="h4">
                    {locale.outOfService}
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.dialogBarcode}>
                <Typography gutterBottom variant="h6">
                    {data.asset_id_displayed}
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.dialogFailedLineItems} variant="subtitle1">
                <Typography gutterBottom data-testid="testTagDialogTaggedBy">
                    {locale.tagPlacedBy}
                    <br />
                    {data.user_licence_number}
                </Typography>
            </Grid>
        </Grid>
    ),
};
const getSuccessDialog = (response, classes, locale) => {
    if (!!!response || !!!response?.data) return {};
    const { data } = response;
    const key = data.asset_status !== testStatusEnum.CURRENT.value ? 'other' : data.asset_status;
    const messageFragment = (
        <Box display="flex" alignItems="center" justifyContent="center">
            {savedDialogMessages[key](data, classes, locale.form.dialogLabels)}
        </Box>
    );
    return locale.form.saveSuccessConfirmation(locale.form.defaultSaveSuccessTitle, messageFragment);
};

const TestTag = ({
    actions,
    defaultFormValues,
    currentRetestList,
    currentAssetOwnersList,
    defaultNextTestDateValue,
    assetsListError,
    initConfig,
    initConfigLoading,
    initConfigError,
    floorListError,
    roomListError,
    saveInspectionSaving,
    saveInspectionSuccess,
    saveInspectionError,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;
    const today = moment().format(locale.config.dateFormat);

    const [selectedAsset, setSelectedAsset] = useState({});
    const [formOwnerId] = useState(currentAssetOwnersList[0].value);
    const [isSaveErrorOpen, showSaveError, hideSaveError] = useConfirmationState();
    const [isNetworkErrorOpen, showNetworkError, hideNetworkError] = useConfirmationState();
    const [isSaveSuccessOpen, showSaveSuccessConfirmation, hideSaveSuccessConfirmation] = useConfirmationState();
    const { isValid, validateValues } = useValidation({ testStatusEnum });
    const assignAssetDefaults = React.useCallback(
        (asset = {}, formValues = {}, location = {}) => {
            return {
                ...defaultFormValues,
                asset_id_displayed: asset?.asset_id_displayed ?? undefined,
                asset_department_owned_by: formOwnerId ?? /* istanbul ignore next */ undefined,
                asset_type_id: asset?.asset_type?.asset_type_id ?? undefined,
                user_id: formValues?.user_id ?? undefined,
                room_id: location?.formRoomId ?? undefined,
                action_date: formValues?.action_date ?? today,
                inspection_device_id:
                    formValues?.inspection_device_id !== undefined
                        ? formValues?.inspection_device_id
                        : initConfig?.inspection_devices?.[0].device_id ?? /* istanbul ignore next */ undefined,
            };
        },
        [formOwnerId, initConfig?.inspection_devices, defaultFormValues, today],
    );

    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
        defaultDateFormat: locale.config.dateFormat,
    });

    const { location, setLocation } = useLocation();

    const headerDepartmentText = React.useMemo(
        () =>
            locale?.form?.pageSubtitle?.(initConfig?.user?.user_department ?? /* istanbul ignore next */ '') ??
            /* istanbul ignore next */ '',
        [initConfig],
    );
    useEffect(() => {
        /* istanbul ignore else */ if (!initConfigLoading && !!initConfig) {
            handleChange('user_id')(initConfig.user.user_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initConfig, initConfigLoading]);

    useEffect(() => {
        if (!!saveInspectionError) {
            showSaveError();
        }
        if (!!saveInspectionSuccess) {
            showSaveSuccessConfirmation();
        }
        if (!!initConfigError || !!floorListError || !!roomListError || !!assetsListError) {
            showNetworkError();
        }
    }, [
        saveInspectionError,
        showSaveError,
        saveInspectionSuccess,
        showSaveSuccessConfirmation,
        showNetworkError,
        initConfigError,
        floorListError,
        roomListError,
        assetsListError,
    ]);

    const assignCurrentAsset = asset => {
        const newFormValues = assignAssetDefaults(asset, formValues, location);
        resetFormValues(newFormValues);
        setSelectedAsset(asset);
    };

    const assetIdElementRef = React.useRef();

    const resetForm = (scroll = true) => {
        actions.clearAssets();
        actions.clearSaveInspection();
        !!scroll && scrollToTopOfPage();
        assignCurrentAsset({});
    };
    useEffect(() => {
        /* istanbul ignore else */ if (
            formValues?.asset_id_displayed === undefined &&
            assetIdElementRef.current &&
            !!initConfig
        ) {
            assetIdElementRef.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues?.asset_id_displayed]);

    const hideSuccessMessage = () => {
        hideSaveSuccessConfirmation();
        resetForm();
    };

    useEffect(() => {
        actions.loadConfig();
    }, [actions]);

    useEffect(() => {
        (!!!initConfigError || /* istanbul ignore next */ initConfigError.length === 0) &&
            (!!!floorListError || /* istanbul ignore next */ floorListError.length === 0) &&
            (!!!roomListError || /* istanbul ignore next */ roomListError.length === 0) &&
            (!!!assetsListError || /* istanbul ignore next */ assetsListError.length === 0) &&
            validateValues(formValues, selectedAsset?.last_inspection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initConfigError, floorListError, roomListError, assetsListError, formValues, selectedAsset]);

    const clearSaveError = () => {
        actions.clearSaveInspection();
        return hideSaveError();
    };

    const saveErrorLocale = {
        ...locale.form.saveError,
        confirmationTitle: locale.form.saveError.confirmationTitle(saveInspectionError),
    };

    return (
        <StandardPage title={locale.form.pageTitle}>
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="testTag-network-error"
                hideCancelButton
                onAction={hideNetworkError}
                onClose={hideNetworkError}
                isOpen={isNetworkErrorOpen}
                locale={locale.form.networkError}
                noMinContentWidth
            />
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="testTag-save-succeeded"
                hideCancelButton
                onAction={hideSuccessMessage}
                onClose={hideSuccessMessage}
                isOpen={isSaveSuccessOpen}
                locale={getSuccessDialog(saveInspectionSuccess, classes, locale)}
                noMinContentWidth
            />
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="testTag-save-failed"
                onClose={clearSaveError}
                onAction={/* istanbul ignore next */ () => /* istanbul ignore next */ clearSaveError()}
                isOpen={isSaveErrorOpen}
                locale={saveErrorLocale}
                hideCancelButton
                noMinContentWidth
            />
            <TestTagHeader
                departmentText={headerDepartmentText}
                requiredText={locale?.form?.requiredText ?? /* istanbul ignore next */ ''}
                className={classes.header}
            />

            <EventPanel
                actions={actions}
                location={location}
                setLocation={setLocation}
                actionDate={formValues?.action_date ?? /* istanbul ignore next */ ''}
                handleChange={handleChange}
                classes={classes}
                hasInspection={formValues?.inspection_status !== undefined}
                isMobileView={isMobileView}
            />

            <AssetPanel
                actions={actions}
                location={location}
                resetForm={() => resetForm}
                department={initConfig?.user?.user_department}
                currentRetestList={currentRetestList}
                currentAssetOwnersList={currentAssetOwnersList}
                formValues={formValues}
                selectedAsset={selectedAsset}
                assignCurrentAsset={assignCurrentAsset}
                handleChange={handleChange}
                focusElementRef={assetIdElementRef}
                classes={classes}
                setSelectedAsset={setSelectedAsset}
                defaultNextTestDateValue={defaultNextTestDateValue}
                saveInspectionSaving={saveInspectionSaving}
                isMobileView={isMobileView}
                isValid={isValid}
            />
        </StandardPage>
    );
};

TestTag.propTypes = {
    actions: PropTypes.object,
    defaultFormValues: PropTypes.object,
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
    saveInspectionSaving: PropTypes.bool,
    saveInspectionSuccess: PropTypes.any,
    saveInspectionError: PropTypes.any,
};

export default React.memo(TestTag);
