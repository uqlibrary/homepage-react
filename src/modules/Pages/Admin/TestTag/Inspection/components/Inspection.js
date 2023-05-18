import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { useTheme } from '@material-ui/core';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import StandardAuthPage from '../../SharedComponents/StandardAuthPage/StandardAuthPage';
import EventPanel from './EventPanel';
import AssetPanel from './AssetPanel';
import { scrollToTopOfPage, statusEnum } from '../utils/helpers';
import { useForm, useValidation, useLocation } from '../utils/hooks';
import locale from '../../testTag.locale';
import { getSuccessDialog } from '../utils/saveDialog';
import { PERMISSIONS } from '../../config/auth';
const moment = require('moment');
const testStatusEnum = statusEnum(locale.pages.inspect.config);

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

const Inspection = ({
    actions,
    defaultFormValues,
    currentRetestList,
    defaultNextTestDateValue,
    assetsListError,
    inspectionConfig,
    // inspectionConfigLoading,
    inspectionConfigLoaded,
    inspectionConfigError,
    floorListError,
    roomListError,
    saveInspectionSaving,
    saveInspectionSuccess,
    saveInspectionError,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;
    const inspectionLocale = locale.pages.inspect;
    const today = moment().format(inspectionLocale.config.dateFormat);

    const [selectedAsset, setSelectedAsset] = useState({});
    const [isSaveErrorOpen, showSaveError, hideSaveError] = useConfirmationState();
    const [isNetworkErrorOpen, showNetworkError, hideNetworkError] = useConfirmationState();
    const [isSaveSuccessOpen, showSaveSuccessConfirmation, hideSaveSuccessConfirmation] = useConfirmationState();
    const { isValid, validateValues } = useValidation({ testStatusEnum });
    const assignAssetDefaults = React.useCallback(
        (asset = {}, formValues = {}, location = {}) => {
            return {
                ...defaultFormValues,
                asset_id_displayed: asset?.asset_id_displayed ?? undefined,
                asset_type_id: asset?.asset_type?.asset_type_id ?? undefined,
                room_id: location?.formRoomId ?? undefined,
                action_date: formValues?.action_date ?? today,
                inspection_device_id:
                    formValues?.inspection_device_id !== undefined
                        ? formValues?.inspection_device_id
                        : inspectionConfig?.inspection_devices?.[0]?.device_id ?? /* istanbul ignore next */ undefined,
            };
        },
        [inspectionConfig?.inspection_devices, defaultFormValues, today],
    );

    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
        defaultDateFormat: inspectionLocale.config.dateFormat,
    });

    const { location, setLocation } = useLocation();

    useEffect(() => {
        if (!!saveInspectionError) {
            showSaveError();
        }
        if (!!saveInspectionSuccess) {
            showSaveSuccessConfirmation();
        }
        if (!!inspectionConfigError || !!floorListError || !!roomListError || !!assetsListError) {
            showNetworkError();
        }
    }, [
        saveInspectionError,
        showSaveError,
        saveInspectionSuccess,
        showSaveSuccessConfirmation,
        showNetworkError,
        inspectionConfigError,
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
            !!inspectionConfig
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
        if (!inspectionConfigLoaded) actions.loadInspectionConfig();
    }, [actions, inspectionConfigLoaded]);

    useEffect(() => {
        (!!!inspectionConfigError || /* istanbul ignore next */ inspectionConfigError.length === 0) &&
            (!!!floorListError || /* istanbul ignore next */ floorListError.length === 0) &&
            (!!!roomListError || /* istanbul ignore next */ roomListError.length === 0) &&
            (!!!assetsListError || /* istanbul ignore next */ assetsListError.length === 0) &&
            validateValues(formValues, selectedAsset?.last_inspection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inspectionConfigError, floorListError, roomListError, assetsListError, formValues, selectedAsset]);

    const clearSaveError = () => {
        actions.clearSaveInspection();
        return hideSaveError();
    };

    const saveErrorLocale = {
        ...inspectionLocale.form.saveError,
        confirmationTitle: inspectionLocale.form.saveError.confirmationTitle(saveInspectionError),
    };

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={inspectionLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
        >
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="testTag-network-error"
                hideCancelButton
                onAction={hideNetworkError}
                onClose={hideNetworkError}
                isOpen={isNetworkErrorOpen}
                locale={inspectionLocale.form.networkError}
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
                locale={getSuccessDialog(saveInspectionSuccess, classes, inspectionLocale)}
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
                resetForm={() => resetForm()}
                department={inspectionConfig?.user?.user_department}
                currentRetestList={currentRetestList}
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
        </StandardAuthPage>
    );
};

Inspection.propTypes = {
    actions: PropTypes.object,
    defaultFormValues: PropTypes.object,
    currentRetestList: PropTypes.array,
    defaultNextTestDateValue: PropTypes.number,
    assetsList: PropTypes.any,
    assetsListLoading: PropTypes.bool,
    assetsListError: PropTypes.any,
    inspectionConfig: PropTypes.any,
    inspectionConfigError: PropTypes.any,
    inspectionConfigLoading: PropTypes.any,
    inspectionConfigLoaded: PropTypes.any,
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

export default React.memo(Inspection);
