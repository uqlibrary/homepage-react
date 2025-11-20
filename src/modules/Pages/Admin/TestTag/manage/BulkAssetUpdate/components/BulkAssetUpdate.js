import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import CircularProgress from '@mui/material/CircularProgress';

import ConfirmationAlert from '../../../SharedComponents/ConfirmationAlert/ConfirmationAlert';
import StandardAuthPage from '../../../SharedComponents/StandardAuthPage/StandardAuthPage';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

import { PERMISSIONS } from '../../../config/auth';
import { useForm, useObjectList, useConfirmationAlert } from '../../../helpers/hooks';
import { transformRow, transformRequest, makeAssetExcludedMessage } from './utils';
import { breadcrumbs } from 'config/routes';
import { FormContext } from '../../../helpers/hooks';
import StepOne from './StepOne';
import StepTwo from './StepTwo';

const StyledWrapper = styled('div')(({ theme }) => ({
    flexGrow: 1,
    '& .actionButtons': {
        marginTop: theme.spacing(2),
    },
    '& .centredGrid': { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    '& .centredGridNoJustify': {
        display: 'flex',
        alignItems: 'center',
    },
    '& .nextDateLabel': { ...theme.typography.body2 },
}));

const componentId = 'bulk-asset-update';
const componentIdLower = 'bulk_asset_update';

const BulkAssetUpdate = ({ actions, defaultFormValues }) => {
    const pageLocale = locale.pages.manage.bulkassetupdate;

    const list = useObjectList([], transformRow, { key: 'asset_id' });
    const excludedList = useObjectList([], null, { key: 'asset_id' });

    const [step, setStep] = useState(1);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogueBusy, setConfirmDialogueBusy] = useState(false);

    const { formValues, signature: formValueSignature, resetFormValues, handleChange } = useForm({
        defaultValues: { ...defaultFormValues },
    });

    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

    useEffect(() => {
        handleChange('asset_list')(list.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list.data]);

    const { confirmationAlert, openConfirmationAlert, closeConfirmationAlert } = useConfirmationAlert({
        duration: locale.config.alerts.timeout,
    });

    const resetForm = useCallback(() => {
        const newFormValues = { ...defaultFormValues };
        setConfirmDialogueBusy(false);
        setConfirmDialogOpen(false);
        resetFormValues(newFormValues);
        actions.clearAssetsMine();
        list.clear();
        if (excludedList.data.length > 0) list.importTransformedData(excludedList.data);
        excludedList.clear();
        setStep(1);
    }, [actions, defaultFormValues, excludedList, list, resetFormValues]);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.testntag.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.testntag.pathname);

        resetForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNextStepButton = () => {
        setStep(2);
    };
    const handlePrevStepButton = () => {
        list.importTransformedData(excludedList.data);
        excludedList.clear();
        setStep(1);
    };

    const openConfirmDialog = () => setConfirmDialogOpen(true);
    const closeConfirmDialog = () => setConfirmDialogOpen(false);

    const handleOnSubmit = () => {
        openConfirmDialog();
    };

    const handleConfirmDialogClose = () => closeConfirmDialog();
    const handleConfirmDialogAction = () => {
        // Send data to the server and save update
        setConfirmDialogueBusy(true);
        const clonedData = structuredClone(formValues);
        const request = transformRequest(clonedData);
        console.log('Bulk Asset Update Request:', request);
        actions
            .bulkAssetUpdate(request)
            .then(() => {
                openConfirmationAlert(locale.config.alerts.success(), 'success');
                resetForm();
            })
            .catch(error => {
                console.error(error);
                openConfirmationAlert(locale.config.alerts.failed(pageLocale.form.alert.snackbars.failed), 'error');
                setConfirmDialogueBusy(false);
            });
    };

    const dialogMessageObject = React.useMemo(() => {
        if (confirmDialogOpen && excludedList.data.length > 0) {
            const excludedListString = makeAssetExcludedMessage({ excludedList });
            return pageLocale.form.alert.dialogBulkUpdateConfirm(list.data.length, excludedListString);
        }
        return pageLocale.form.alert.dialogBulkUpdateConfirm(list.data.length);
    }, [confirmDialogOpen, excludedList, list.data.length, pageLocale.form.alert]);

    return (
        <StandardAuthPage
            title={locale.pages.general.pageTitle}
            locale={pageLocale}
            requiredPermissions={[PERMISSIONS.can_inspect, PERMISSIONS.can_alter]}
            inclusive={false}
        >
            <StyledWrapper>
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    cancelButtonColor="secondary"
                    confirmationBoxId={componentId}
                    onCancelAction={handleConfirmDialogClose}
                    onAction={handleConfirmDialogAction}
                    isOpen={confirmDialogOpen}
                    locale={
                        !confirmDialogueBusy
                            ? dialogMessageObject
                            : {
                                  ...dialogMessageObject,
                                  confirmButtonLabel: (
                                      <CircularProgress
                                          color="inherit"
                                          size={15}
                                          id={`${componentIdLower}-confirmation-progress`}
                                          data-testid={`${componentIdLower}-confirmation-progress`}
                                      />
                                  ),
                              }
                    }
                    disableButtonsWhenBusy
                    isBusy={confirmDialogueBusy}
                    noMinContentWidth
                />
                <FormContext.Provider value={{ formValues, resetFormValues, handleChange, formValueSignature }}>
                    {step === 1 && (
                        <StepOne
                            id={componentId}
                            list={list}
                            isFilterDialogOpen={isFilterDialogOpen}
                            setIsFilterDialogOpen={setIsFilterDialogOpen}
                            actions={actions}
                            resetForm={resetForm}
                            nextStep={handleNextStepButton}
                        />
                    )}
                    {step === 2 && (
                        <StepTwo
                            id={componentId}
                            list={list}
                            excludedList={excludedList}
                            actions={actions}
                            isFilterDialogOpen={isFilterDialogOpen}
                            prevStep={handlePrevStepButton}
                            onSubmit={handleOnSubmit}
                        />
                    )}
                </FormContext.Provider>
            </StyledWrapper>
            <ConfirmationAlert
                isOpen={confirmationAlert.visible}
                message={confirmationAlert.message}
                type={confirmationAlert.type}
                autoHideDuration={confirmationAlert.autoHideDuration}
                closeAlert={closeConfirmationAlert}
            />
        </StandardAuthPage>
    );
};

BulkAssetUpdate.propTypes = {
    actions: PropTypes.object,
    defaultFormValues: PropTypes.object,
};

export default React.memo(BulkAssetUpdate);
