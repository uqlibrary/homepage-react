import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { useTheme } from '@material-ui/core';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { debounce } from 'throttle-debounce';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { transformer } from '../utils/transformers';
import TestTagHeader from './TestTagHeader';
import EventPanel from './EventPanel';
import AssetPanel from './AssetPanel';
import { scrollToTopOfPage, statusEnum } from '../utils/helpers';
import { useForm, useValidation, useLocation } from '../utils/hooks';
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
    toggleButtonMobile: {
        flex: 1,
    },
}));

const MINIMUM_ASSET_ID_PATTERN_LENGTH = 7;

const testStatusEnum = statusEnum(locale);

const DEFAULT_FORM_VALUES = {
    asset_barcode: null, // TODO, what name are we using here - this or asset_id_displayed?
    user_id: null,
    asset_department_owned_by: null,
    room_id: null,
    asset_type_id: null,
    action_date: null,
    inspection_status: null,
    inspection_device_id: null,
    inspection_fail_reason: null,
    inspection_notes: null,
    inspection_date_next: null,
    isRepair: false,
    repairer_name: null, // TODO, not needed for MVP
    repairer_contact_details: null, // TODO, check name for API
    isDiscarded: false,
    discard_reason: null,
};

const TestTag = ({
    actions,
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
    const [isValid, validateValues] = useValidation({ testStatusEnum });
    const assignAssetDefaults = React.useCallback(
        (asset = {}, formValues = {}, location = {}) => {
            return {
                ...DEFAULT_FORM_VALUES,
                asset_barcode: asset?.asset_barcode ?? null,
                asset_department_owned_by: formOwnerId ?? null,
                asset_type_id: asset?.asset_type?.asset_type ?? null,
                user_id: formValues?.user_id ?? null,
                room_id: location?.formRoomId ?? null,
                action_date: formValues?.action_date ?? today,
                inspection_device_id:
                    formValues?.inspection_device_id !== -1
                        ? formValues?.inspection_device_id
                        : initConfig?.inspection_devices?.[0].device_id ?? null,
            };
        },
        [formOwnerId, initConfig?.inspection_devices, today],
    );

    const [formValues, resetFormValues, handleChange] = useForm({
        defaultValues: { ...assignAssetDefaults() },
        defaultDateFormat: locale.config.dateFormat,
    });

    const [location, setLocation] = useLocation();

    const headerDepartmentText = locale?.form?.pageSubtitle?.(initConfig?.user?.user_department ?? '') ?? '';
    const headerRequiredText = locale?.form?.requiredText ?? '';

    useEffect(() => {
        if (!initConfigLoading && !!initConfig && !!initConfig?.user) {
            const newUserId = initConfig.user.user_id ?? 1; // TODO - remove this bodge when API fixed
            handleChange('user_id')(newUserId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initConfig, initConfigLoading]);

    useEffect(() => {
        if (!!saveInspectionError) {
            showSaveError();
        }
        if (saveInspectionSuccess) {
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
    const hideSuccessMessage = () => {
        assignCurrentAsset({});
        hideSaveSuccessConfirmation();
        actions.clearSaveInspection();
        if (!!assetIdElementRef.current) {
            scrollToTopOfPage();
            assetIdElementRef.current.focus();
        }
    };

    useEffect(() => {
        actions.loadConfig();
    }, [actions]);

    useEffect(() => {
        (!!!initConfigError || initConfigError.length === 0) &&
            (!!!floorListError || floorListError.length === 0) &&
            (!!!roomListError || roomListError.length === 0) &&
            (!!!assetsListError || assetsListError.length === 0) &&
            validateValues(formValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initConfigError, floorListError, roomListError, assetsListError, formValues]);

    const debounceAssetsSearch = React.useRef(
        debounce(
            500,
            pattern => !!pattern && pattern.length >= MINIMUM_ASSET_ID_PATTERN_LENGTH && actions.loadAssets(pattern),
        ),
        { noLeading: true, noTrailing: true },
    ).current;

    const clearSaveError = () => {
        actions.clearSaveInspection();
        return hideSaveError();
    };

    const saveErrorLocale = {
        ...locale.form.saveError,
        confirmationTitle: !!saveInspectionError
            ? /* istanbul ignore next */ `An error occurred: ${JSON.stringify(saveInspectionError)}`
            : 'An unknown error occurred',
    };

    const saveForm = () => {
        if (isValid && !saveInspectionSaving) {
            const transformedData = transformer(
                formValues,
                locale.config.transformerRules(testStatusEnum.PASSED.value, testStatusEnum.FAILED.value),
            );
            console.log('saveForm', formValues, transformedData);
            actions.saveInspection(transformedData);
        }
    };

    return (
        <StandardPage title={locale.form.pageTitle}>
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="tag-test-network-error"
                hideCancelButton
                onAction={hideNetworkError}
                onClose={hideNetworkError}
                isOpen={isNetworkErrorOpen}
                locale={locale.form.networkError}
            />
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="tag-test-save-succeeded"
                hideCancelButton
                onAction={hideSuccessMessage}
                onClose={hideSuccessMessage}
                isOpen={isSaveSuccessOpen}
                locale={locale.form.saveSuccessConfirmation}
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
            />
            <TestTagHeader departmentText={headerDepartmentText} requiredText={headerRequiredText} />

            <EventPanel
                actions={actions}
                location={location}
                setLocation={setLocation}
                actionDate={formValues?.action_date ?? ''}
                handleChange={handleChange}
                classes={classes}
                isMobileView={isMobileView}
            />

            <AssetPanel
                saveForm={saveForm}
                location={location}
                currentRetestList={currentRetestList}
                currentAssetOwnersList={currentAssetOwnersList}
                formValues={formValues}
                selectedAsset={selectedAsset}
                assetsSearch={debounceAssetsSearch}
                assignCurrentAsset={assignCurrentAsset}
                handleChange={handleChange}
                focusElementRef={assetIdElementRef}
                classes={classes}
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
