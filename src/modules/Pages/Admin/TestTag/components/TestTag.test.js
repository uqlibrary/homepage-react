import React from 'react';
import TestTag from './TestTag';
import { rtlRender, act, fireEvent, WithReduxStore, waitFor, screen } from 'test-utils';
import Immutable from 'immutable';
import {
    mockAllIsIntersecting,
    // mockIsIntersecting,
    // intersectionMockInstance,
} from 'react-intersection-observer/test-utils';

import configData from '../../../../../data/mock/data/testing/testTagOnLoad';
import assetData from '../../../../../data/mock/data/testing/testTagAssets';
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
    beforeEach(() => {
        mockAllIsIntersecting(true);
    });

    it('renders component', () => {
        const mockFn = jest.fn();
        const { getByText, getByTestId } = setup({
            actions: { loadConfig: mockFn, clearAssets: mockFn, clearSaveInspection: mockFn },
        });

        expect(getByText(locale.form.pageTitle)).toBeInTheDocument();
        expect(getByText(locale.form.pageSubtitle?.(configData.user.department_display_name))).toBeInTheDocument();
        expect(getByText(locale.form.event.title)).toBeInTheDocument();
        expect(getByText(locale.form.asset.title)).toBeInTheDocument();
        expect(getByTestId('testntagFormResetButton')).toBeInTheDocument();
        expect(getByTestId('testntagFormSubmitButton')).toBeInTheDocument();
        expect(getByTestId('testntagFormSubmitButton')).toHaveAttribute('disabled', '');
        expect(mockFn).toHaveBeenCalled();
    });

    it('should show a save error dialog panel', async () => {
        const loadConfigFn = jest.fn();
        const clearAssetsFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const saveErrorTitle = 'Some error';
        const { getByRole, getByText, getByTestId, queryByRole } = setup({
            actions: {
                loadConfig: loadConfigFn,
                clearAssets: clearAssetsFn,
                clearSaveInspection: clearSaveInspectionFn,
            },
            saveInspectionError: saveErrorTitle,
        });
        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText(locale.form.saveError.confirmationTitle(saveErrorTitle))).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-testTag-save-failed'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
        expect(clearAssetsFn).toHaveBeenCalled();
    });

    it('should show a network error dialog panel', async () => {
        const loadConfigFn = jest.fn();
        const clearAssetsFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const { getByRole, getByText, getByTestId, queryByRole } = setup({
            actions: {
                loadConfig: loadConfigFn,
                clearAssets: clearAssetsFn,
                clearSaveInspection: clearSaveInspectionFn,
            },
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

        // screen.debug(undefined, 50000);

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

    /*
    it('can save inspection', async () => {
        const mockLoadAssets = jest.fn(() => [...assetData]);
        const mockFn = jest.fn();
        const saveActionFn = jest.fn();
        const { getByText, getByTestId, queryByTestId, getByRole, getAllByRole } = setup({
            actions: {
                loadConfig: mockFn,
                loadAssets: mockLoadAssets,
                saveInspection: saveActionFn,
                clearAssets: mockFn,
                clearSaveInspection: mockFn,
            },
        });

        expect(getByText(locale.form.pageTitle)).toBeInTheDocument();

        expect(getByTestId('testntagFormAssetTypeInput')).toHaveAttribute('disabled', '');

        act(() => {
            fireEvent.change(getByTestId('testntagFormAssetIdInput'), { target: { value: 'UQL310000' } });
        });

        await waitFor(() =>
            expect(getByTestId('testntagFormAssetTypeInput')).not.toHaveAttribute('disabled', 'disabled'),
        );

        expect(queryByTestId('testResultNextDate')).not.toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('testResultToggleButtons-PASSED'));
        });

        await waitFor(() => expect(getByTestId('testResultNextDate')).toBeInTheDocument());

        act(() => {
            fireEvent.change(getByTestId('inspectionNotes-input'), { target: { value: 'notes' } });
        });

        fireEvent.mouseDown(getByTestId('testntag-form-buildingid'));
        expect(getByRole('listbox')).not.toEqual(null);
        act(() => {
            const options = getAllByRole('option');

            fireEvent.mouseDown(options[0]);
            options[0].click();
        });

        const expected = {
            asset_id_displayed: 'UQL310000',
            user_id: 3,
            asset_department_owned_by: 'UQL-WSS',
            asset_type_id: 1,
            action_date: '2016-12-05 14:22',
            room_id: 1,
            with_inspection: {
                inspection_status: 'PASSED',
                inspection_device_id: 1,
                inspection_fail_reason: undefined,
                inspection_notes: 'notes',
                inspection_date_next: '2018-12-05 14:22',
            },
            with_repair: undefined,
            with_discard: undefined,
        };

        act(() => {
            fireEvent.click(getByTestId('testntagFormSubmitButton'));
        });
        expect(saveActionFn).toHaveBeenCalledWith(expected);

        // const selectedAsset = { ...assetData[0] };
        // const formValues = {
        //     action_date: '2016-12-05 14:22',
        //     asset_department_owned_by: 'UQL-WSS',
        //     asset_id_displayed: 'UQL310000',
        //     asset_type_id: 1,
        //     discard_reason: undefined,
        //     inspection_date_next: '2018-12-05 14:22',
        //     inspection_device_id: 1,
        //     inspection_fail_reason: undefined,
        //     inspection_notes: 'notes',
        //     inspection_status: 'PASSED',
        //     isDiscarded: false,
        //     isRepair: false,
        //     repairer_contact_details: undefined,
        //     room_id: 1,
        //     user_id: 3,
        // };

        // // eslint-disable-next-line no-unused-vars
        // const handleChange = jest.fn(prop => jest.fn(event => {}));
        // const actionFn = jest.fn();
        // const expected = {
        //     asset_id_displayed: 'UQL310000',
        //     user_id: 3,
        //     asset_department_owned_by: 'UQL-WSS',
        //     asset_type_id: 1,
        //     action_date: '2016-12-05 14:22',
        //     room_id: 1,
        //     with_inspection: {
        //         inspection_status: 'PASSED',
        //         inspection_device_id: 1,
        //         inspection_fail_reason: undefined,
        //         inspection_notes: 'notes',
        //         inspection_date_next: '2018-12-05 14:22',
        //     },
        //     with_repair: undefined,
        //     with_discard: undefined,
        // };

        // const { getByTestId } = setup({
        //     defaultFormValues: formValues,
        //     actions: { saveInspection: actionFn },
        //     formValues,
        //     location,
        //     resetForm,
        //     selectedAsset,
        //     assignCurrentAsset,
        //     handleChange,
        //     saveInspectionSaving: false,
        //     isValid: true,
        // });

        // // screen.debug(undefined, 100000);

        // expect(getByTestId('testntagFormSubmitButton')).not.toHaveAttribute('disabled', '');

        // act(() => {
        //     fireEvent.click(getByTestId('testntagFormSubmitButton'));
        // });
        // expect(actionFn).toHaveBeenCalledWith(expected);
    });
    */

    // it('renders saving spinner', () => {
    //     const resetForm = jest.fn();
    //     const assignCurrentAsset = jest.fn();
    //     const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
    //     // eslint-disable-next-line no-unused-vars
    //     const handleChange = jest.fn(prop => jest.fn(event => {}));

    //     const { getByTestId } = setup({
    //         formValues,
    //         location,
    //         resetForm,
    //         assignCurrentAsset,
    //         handleChange,
    //         saveInspectionSaving: true,
    //         isValid: true,
    //     });

    //     expect(getByTestId('saveInspectionSpinner')).toBeInTheDocument();
    // });
});
