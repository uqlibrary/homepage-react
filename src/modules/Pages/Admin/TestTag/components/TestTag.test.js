import React from 'react';
import TestTag from './TestTag';
import { rtlRender, act, fireEvent, WithReduxStore, waitFor, screen } from 'test-utils';
import Immutable from 'immutable';

import configData from '../../../../../data/mock/data/testing/testTagOnLoad';
import locale from '../testTag.locale.js';

const currentRetestList = [
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '60', label: '5 years' },
];

const currentAssetOwnersList = [{ value: 'UQL-WSS', label: 'UQL-WSS' }];
const DEFAULT_NEXT_TEST_DATE_VALUE = 12;
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

function setup(testProps = {}, renderer = rtlRender) {
    const {
        state = {},
        actions = {},
        defaultFormValues = DEFAULT_FORM_VALUES,
        assetsListError = null,
        initConfig = configData,
        initConfigLoading = false,
        initConfigError = null,
        floorListError = null,
        roomListError = null,
        saveInspectionSaving = false,
        saveInspectionSuccess = null,
        saveInspectionError = null,
        ...props
    } = testProps;

    const _state = {
        testTagOnLoadReducer: { initConfig: configData, initConfigLoading: false },
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <TestTag
                actions={actions}
                defaultFormValues={defaultFormValues}
                currentRetestList={currentRetestList}
                currentAssetOwnersList={currentAssetOwnersList}
                defaultNextTestDateValue={DEFAULT_NEXT_TEST_DATE_VALUE}
                assetsListError={assetsListError}
                initConfig={initConfig}
                initConfigLoading={initConfigLoading}
                initConfigError={initConfigError}
                floorListError={floorListError}
                roomListError={roomListError}
                saveInspectionSaving={saveInspectionSaving}
                saveInspectionSuccess={saveInspectionSuccess}
                saveInspectionError={saveInspectionError}
                {...props}
            />
        </WithReduxStore>,
    );
}

describe('TestTag', () => {
    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    it('renders component', () => {
        const loadConfigFn = jest.fn();
        const { getByText } = setup({ actions: { loadConfig: loadConfigFn } });

        expect(getByText(locale.form.pageTitle)).toBeInTheDocument();
        expect(getByText(locale.form.pageSubtitle?.(configData.user.user_department))).toBeInTheDocument();
        expect(getByText(locale.form.event.title)).toBeInTheDocument();
        expect(getByText(locale.form.asset.title)).toBeInTheDocument();
        expect(loadConfigFn).toHaveBeenCalled();
    });

    it('should show a save error dialog panel', async () => {
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const saveErrorTitle = 'Some error';
        const { getByRole, getByText, getByTestId, queryByRole } = setup({
            actions: { loadConfig: loadConfigFn, clearSaveInspection: clearSaveInspectionFn },
            saveInspectionError: saveErrorTitle,
        });
        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText(locale.form.saveError.confirmationTitle(saveErrorTitle))).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-testTag-save-failed'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show a network error dialog panel', async () => {
        const loadConfigFn = jest.fn();
        const { getByRole, getByText, getByTestId, queryByRole } = setup({
            actions: { loadConfig: loadConfigFn },
            initConfigError: 'error',
        });

        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText(locale.form.networkError.confirmationTitle)).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-testTag-network-error'));
        });
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show a save success for PASSED asset dialog panel', async () => {
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole } = setup({
            actions: {
                loadConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                data: {
                    asset_status: 'CURRENT',
                    asset_id_displayed: 'UQL000705',
                    user_licence_number: 'NOT LICENCED',
                    action_date: '2022-12-12',
                    asset_next_test_due_date: '2023Dec12',
                },
            },
        });
        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(getByText('Tested By: NOT LICENCED')).toBeInTheDocument();
        expect(getByText('2022-12-12')).toBeInTheDocument();
        expect(getByText('2023Dec12')).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-testTag-save-succeeded'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show a save success for FAILED asset dialog panel', async () => {
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole, queryByText } = setup({
            actions: {
                loadConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                data: {
                    asset_status: 'FAILED',
                    asset_id_displayed: 'UQL000705',
                    user_licence_number: '1234567890',
                    action_date: '2022-12-12',
                    asset_next_test_due_date: '2023Dec12',
                },
            },
        });

        screen.debug(undefined, 50000);

        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByTestId('testTagDialogTaggedBy').textContent).toBe('TAG PLACED BY:1234567890');
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(queryByText('2022-12-12')).not.toBeInTheDocument();
        expect(queryByText('2023Dec12')).not.toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-testTag-save-succeeded'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show a save success for OUTFORREPAIR asset dialog panel', async () => {
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole, queryByText } = setup({
            actions: {
                loadConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                data: {
                    asset_status: 'OUTFORREPAIR',
                    asset_id_displayed: 'UQL000705',
                    user_licence_number: '1234567890',
                    action_date: '2022-12-12',
                    asset_next_test_due_date: '2023Dec12',
                },
            },
        });

        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByTestId('testTagDialogTaggedBy').textContent).toBe('TAG PLACED BY:1234567890');
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(queryByText('2022-12-12')).not.toBeInTheDocument();
        expect(queryByText('2023Dec12')).not.toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-testTag-save-succeeded'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show a save success for DISCARDED asset dialog panel', async () => {
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole, queryByText } = setup({
            actions: {
                loadConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                data: {
                    asset_status: 'DISCARDED',
                    asset_id_displayed: 'UQL000705',
                    user_licence_number: '1234567890',
                    action_date: '2022-12-12',
                    asset_next_test_due_date: '2023Dec12',
                },
            },
        });

        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByTestId('testTagDialogTaggedBy').textContent).toBe('TAG PLACED BY:1234567890');
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(queryByText('2022-12-12')).not.toBeInTheDocument();
        expect(queryByText('2023Dec12')).not.toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-testTag-save-succeeded'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show defaults (coverage)', async () => {
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole } = setup({
            actions: {
                loadConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                data: {
                    asset_status: 'CURRENT',
                    asset_id_displayed: 'UQL000705',
                    user_licence_number: 'NOT LICENCED',
                    action_date: '2022-12-12',
                },
            },
        });
        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(getByText('Tested By: NOT LICENCED')).toBeInTheDocument();
        expect(getByText('2022-12-12')).toBeInTheDocument();
        expect(getByText('N/A')).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-testTag-save-succeeded'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });
});
