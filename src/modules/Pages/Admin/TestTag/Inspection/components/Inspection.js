import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import { InView } from 'react-intersection-observer';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import StandardAuthPage from '../../SharedComponents/StandardAuthPage/StandardAuthPage';
import ConfirmationAlert from '../../SharedComponents/ConfirmationAlert/ConfirmationAlert';

import EventPanel from './EventPanel';
import AssetPanel from './AssetPanel';

import { statusEnum } from '../utils/helpers';
import { scrollToTopOfPage } from 'helpers/general';
import { useValidation } from '../utils/hooks';
import { useLocation, useForm, useConfirmationAlert } from '../../helpers/hooks';
import locale from '../../testTag.locale';
import { transformer } from '../utils/transformers';
import { saveInspectionTransformer } from '../transformers/saveInspectionTransformer';
import { getSuccessDialog } from '../utils/saveDialog';
import { PERMISSIONS } from '../../config/auth';
import { useConfirmationState } from 'hooks';
import { breadcrumbs } from 'config/routes';

const componentId = 'inspection';

const moment = require('moment');
const testStatusEnum = statusEnum(locale.pages.inspect.config);

const StyledWrapper = styled('div')(({ theme }) => ({
    '& .toggleButtonMobile': {
        flex: 1,
    },
    '& .toolbar': {
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignContent: 'space-between',
            padding: theme.spacing(2),
            '& > button': {
                display: 'block',
                width: '100%',
                '&:first-child': {
                    marginBlockEnd: theme.spacing(2),
                },
            },
        },
    },
    '& .appbarWrapper': {
        marginTop: theme.spacing(2),
    },
    '& .appbarPositionVisible': {
        position: 'relative',
        backgroundColor: 'white',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
    '& .appbarPositionClipped': {
        position: 'fixed',
        left: '1rem',
        right: '1rem',
        top: 'auto',
        bottom: 0,
        minHeight: '64px',
        width: 'auto',
    },
    '& .dialogContainer': {
        borderRadius: '6px',
        borderWidth: '1px',
        borderStyle: 'solid',
        color: 'black',
    },
    '& .dialogPassedContainer': {
        backgroundColor: '#69B400',
        borderColor: '#69B400',
    },
    '& .dialogFailedContainer': {
        backgroundColor: '#ef000c',
        borderColor: '#ef000c',
    },
    '& .dialogTitle': {
        textAlign: 'center',
        padding: '8px',
        '& >p': {
            fontWeight: '500',
            fontFamily: 'monospace, monospace',
        },
    },
    '& .dialogFailedTitle': {
        '& >h4': {
            fontWeight: '700',
            fontFamily: 'monospace, monospace',
            textDecoration: 'underline',
        },
    },
    '& .dialogFailedAssetStatus': {
        textAlign: 'center',
        padding: '8px',
        '& >h5': {
            fontWeight: '700',
            fontFamily: 'monospace, monospace',
        },
    },
    '& .dialogBarcode': {
        backgroundColor: 'white',
        padding: '8px',
        textAlign: 'center',
        '& >h6': {
            fontFamily: 'monospace, monospace',
        },
    },
    '& .dialogSuccessLineItems': {
        padding: '8px',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
        '& >p': {
            fontWeight: '500',
            fontFamily: 'monospace, monospace',
        },
    },
    '& .dialogFailedLineItems': {
        padding: '8px',
        textAlign: 'center',
        '& >p': {
            fontWeight: '500',
            fontFamily: 'monospace, monospace',
        },
    },
    '& .addNewLabel': {
        width: '100%',
    },
    '& .buttonWhite': {
        color: 'white',
        border: '1px solid white',
    },
}));

const Inspection = ({
    user,
    actions,
    defaultFormValues,
    defaultNextTestDateValue,
    assetsListError,
    inspectionConfig,
    inspectionConfigError,
    floorListError,
    roomListError,
    saveInspectionSaving,
    saveInspectionSuccess,
    saveInspectionError,
    saveAssetTypeSaving,
    saveAssetTypeError,
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    const inspectionLocale = locale.pages.inspect;

    const [selectedAsset, setSelectedAsset] = useState({});
    const [isSaveSuccessOpen, showSaveSuccessConfirmation, hideSaveSuccessConfirmation] = useConfirmationState();

    const onCloseConfirmationAlert = () => {
        !!inspectionConfigError && actions.clearInspectionConfigError();
        !!saveInspectionError && actions.clearSaveInspectionError();
        !!saveAssetTypeError && actions.clearSaveAssetTypeError();
        !!floorListError && actions.clearFloorsError();
        !!roomListError && actions.clearRoomsError();
    };
    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
        onClose: onCloseConfirmationAlert,
        errorMessage:
            inspectionConfigError || saveInspectionError || saveAssetTypeError || floorListError || roomListError,
        errorMessageFormatter: locale.config.alerts.error,
    });
    const { isValid, validateValues } = useValidation({ testStatusEnum, user });
    const assignAssetDefaults = React.useCallback(
        (asset = {}, formValues = {}, location = {}) => {
            const today = moment().format(inspectionLocale.config.dateFormat);
            return {
                ...defaultFormValues,
                isManualDate: formValues?.isManualDate ?? false,
                asset_id_displayed: asset?.asset_id_displayed ?? undefined,
                asset_type_id: asset?.asset_type?.asset_type_id ?? undefined,
                room_id: location?.room ?? undefined,
                action_date: formValues?.action_date ?? today,
                inspection_device_id:
                    formValues?.inspection_device_id !== undefined
                        ? formValues?.inspection_device_id
                        : inspectionConfig?.inspection_devices?.[0]?.device_id ?? /* istanbul ignore next */ undefined,
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [inspectionConfig?.inspection_devices, defaultFormValues],
    );

    const { formValues, resetFormValues, handleChange } = useForm({
        defaultValues: { ...assignAssetDefaults() },
        defaultDateFormat: inspectionLocale.config.dateFormat,
    });

    const { location, setLocation } = useLocation();

    useEffect(() => {
        if (!!saveInspectionSuccess) {
            showSaveSuccessConfirmation();
        }
    }, [saveInspectionSuccess, showSaveSuccessConfirmation]);

    const [inView, setInView] = React.useState(false);

    const assignCurrentAsset = asset => {
        const newFormValues = assignAssetDefaults(asset, formValues, location);

        resetFormValues(newFormValues);
        setSelectedAsset(asset);
    };

    const resetForm = (scroll = true) => {
        actions.clearAssets();
        actions.clearSaveInspection();
        !!scroll && scrollToTopOfPage();
        assignCurrentAsset({});
    };

    const hideSuccessMessage = () => {
        hideSaveSuccessConfirmation();
        resetForm();
    };

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.testntag.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.testntag.pathname);

        resetForm();
        actions.loadInspectionConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (!!!inspectionConfigError || /* istanbul ignore next */ inspectionConfigError.length === 0) &&
            (!!!floorListError || /* istanbul ignore next */ floorListError.length === 0) &&
            (!!!roomListError || /* istanbul ignore next */ roomListError.length === 0) &&
            (!!!assetsListError || /* istanbul ignore next */ assetsListError.length === 0) &&
            validateValues(formValues, selectedAsset?.last_inspection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inspectionConfigError, floorListError, roomListError, assetsListError, formValues, selectedAsset]);

    const saveForm = () => {
        /* istanbul ignore else */ if (isValid && !saveInspectionSaving) {
            const transformedData = transformer(
                formValues,
                saveInspectionTransformer(testStatusEnum.PASSED.value, testStatusEnum.FAILED.value),
                { lastInspection: selectedAsset?.last_inspection, dateFormat: inspectionLocale.config.dateFormat } ??
                    /* istanbul ignore next */ {},
            );
            actions.saveInspection(transformedData);
        }
    };

    const successDialog = React.useMemo(() => getSuccessDialog(saveInspectionSuccess, inspectionLocale), [
        inspectionLocale,
        saveInspectionSuccess,
    ]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={inspectionLocale}
            requiredPermissions={[PERMISSIONS.can_inspect]}
        >
            <StyledWrapper>
                <ConfirmationBox
                    actionButtonColor="secondary"
                    actionButtonVariant="contained"
                    confirmationBoxId={`${componentId}-save-success`}
                    hideCancelButton
                    onAction={hideSuccessMessage}
                    onClose={hideSuccessMessage}
                    isOpen={isSaveSuccessOpen}
                    locale={successDialog}
                    noMinContentWidth
                />
                <EventPanel
                    id={componentId}
                    actions={actions}
                    location={location}
                    setLocation={setLocation}
                    actionDate={formValues?.action_date ?? /* istanbul ignore next */ ''}
                    handleChange={handleChange}
                    hasInspection
                    isMobileView={isMobileView}
                />
                <AssetPanel
                    id={componentId}
                    actions={actions}
                    location={location}
                    resetForm={() => resetForm()}
                    formValues={formValues}
                    selectedAsset={selectedAsset}
                    assignCurrentAsset={assignCurrentAsset}
                    handleChange={handleChange}
                    setSelectedAsset={setSelectedAsset}
                    defaultNextTestDateValue={defaultNextTestDateValue}
                    saveAssetTypeSaving={saveAssetTypeSaving}
                    isMobileView={isMobileView}
                    canAddAssetType
                    confirmationAlert={confirmationAlert}
                    openConfirmationAlert={openConfirmationAlert}
                    closeConfirmationAlert={closeConfirmationAlert}
                />
                <InView
                    as="div"
                    className={'appbarWrapper'}
                    onChange={setInView}
                    rootMargin="200% 0px 0px 0px"
                    threshold={0}
                >
                    <AppBar
                        component={'div'}
                        className={`${inView ? 'appbarPositionVisible' : 'appbarPositionClipped'}${
                            !inView && !isMobileView ? ' layout-card' : ''
                        }`}
                        id={`${componentId}-app-bar`}
                        data-testid={`${componentId}-app-bar`}
                    >
                        <Toolbar className={'toolbar'}>
                            <Button
                                variant="outlined"
                                onClick={resetForm}
                                fullWidth={isMobileView}
                                id={`${componentId}-reset-button`}
                                data-testid={`${componentId}-reset-button`}
                                color={inView ? 'primary' : 'secondary'}
                                className={!inView ? 'buttonWhite' : ''}
                            >
                                {inspectionLocale.form.buttons.reset}
                            </Button>
                            <Box style={{ flexGrow: 1 }} />

                            <Button
                                variant="contained"
                                color={inView ? 'primary' : 'secondary'}
                                disabled={!isValid || saveInspectionSaving}
                                onClick={saveForm}
                                fullWidth={isMobileView}
                                id={`${componentId}-save-button`}
                                data-testid={`${componentId}-save-button`}
                            >
                                {saveInspectionSaving ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={25}
                                        id={`${componentId}-progress`}
                                        data-testid={`${componentId}-progress`}
                                    />
                                ) : (
                                    inspectionLocale.form.buttons.save
                                )}
                            </Button>
                        </Toolbar>
                    </AppBar>
                </InView>
                <ConfirmationAlert
                    isOpen={confirmationAlert.visible}
                    message={confirmationAlert.message}
                    type={confirmationAlert.type}
                    closeAlert={closeConfirmationAlert}
                    autoHideDuration={confirmationAlert.autoHideDuration}
                />
            </StyledWrapper>
        </StandardAuthPage>
    );
};

Inspection.propTypes = {
    user: PropTypes.object,
    actions: PropTypes.object,
    defaultFormValues: PropTypes.object,
    defaultNextTestDateValue: PropTypes.string,
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
    saveAssetTypeSaving: PropTypes.bool,
    saveAssetTypeSuccess: PropTypes.any,
    saveAssetTypeError: PropTypes.any,
};

export default React.memo(Inspection);
