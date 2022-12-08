import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { useTheme } from '@material-ui/core';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import TestTagHeader from './TestTagHeader';
import EventPanel from './EventPanel';
import AssetPanel from './AssetPanel';
import { scrollToTopOfPage, statusEnum } from '../utils/helpers';
import { useForm, useValidation, useLocation } from '../utils/hooks';
import locale from '../testTag.locale';

const moment = require('moment');

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
}));

const testStatusEnum = statusEnum(locale);

const DEFAULT_FORM_VALUES = {
    asset_id_displayed: undefined,
    user_id: undefined,
    asset_department_owned_by: undefined,
    room_id: undefined,
    asset_type_id: undefined,
    action_date: undefined,
    inspection_status: undefined,
    inspection_device_id: undefined,
    inspection_fail_reason: undefined,
    inspection_notes: undefined,
    inspection_date_next: undefined,
    isRepair: false,
    repairer_contact_details: undefined,
    isDiscarded: false,
    discard_reason: undefined,
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
    const { isValid, validateValues } = useValidation({ testStatusEnum });
    const assignAssetDefaults = React.useCallback(
        (asset = {}, formValues = {}, location = {}) => {
            return {
                ...DEFAULT_FORM_VALUES,
                asset_id_displayed: asset?.asset_id_displayed ?? undefined,
                asset_department_owned_by: formOwnerId ?? undefined,
                asset_type_id: asset?.asset_type?.asset_type_id ?? undefined,
                user_id: formValues?.user_id ?? undefined,
                room_id: location?.formRoomId ?? undefined,
                action_date: formValues?.action_date ?? today,
                inspection_device_id:
                    formValues?.inspection_device_id !== -1
                        ? formValues?.inspection_device_id
                        : initConfig?.inspection_devices?.[0].device_id ?? undefined,
            };
        },
        [formOwnerId, initConfig?.inspection_devices, today],
    );

    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
        defaultDateFormat: locale.config.dateFormat,
    });

    const { location, setLocation } = useLocation();

    const headerDepartmentText = React.useMemo(
        () => locale?.form?.pageSubtitle?.(initConfig?.user?.user_department ?? '') ?? '',
        [initConfig],
    );

    useEffect(() => {
        if (!initConfigLoading && !!initConfig) {
            handleChange('user_id')(initConfig.user.user_id);
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
    const resetForm = () => {
        actions.clearAssets();
        actions.clearSaveInspection();
        scrollToTopOfPage();
        assignCurrentAsset({});
    };
    useEffect(() => {
        if (formValues?.asset_id_displayed === undefined && assetIdElementRef.current && !!initConfig) {
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
        (!!!initConfigError || initConfigError.length === 0) &&
            (!!!floorListError || floorListError.length === 0) &&
            (!!!roomListError || roomListError.length === 0) &&
            (!!!assetsListError || assetsListError.length === 0) &&
            validateValues(formValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initConfigError, floorListError, roomListError, assetsListError, formValues]);

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
            <TestTagHeader
                departmentText={headerDepartmentText}
                requiredText={locale?.form?.requiredText ?? ''}
                className={classes.header}
            />

            <EventPanel
                actions={actions}
                location={location}
                setLocation={setLocation}
                actionDate={formValues?.action_date ?? ''}
                handleChange={handleChange}
                classes={classes}
                hasInspection={formValues?.inspection_status !== undefined}
                isMobileView={isMobileView}
            />

            <AssetPanel
                actions={actions}
                location={location}
                resetForm={resetForm}
                currentRetestList={currentRetestList}
                currentAssetOwnersList={currentAssetOwnersList}
                formValues={formValues}
                selectedAsset={selectedAsset}
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
