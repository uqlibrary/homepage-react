import React from 'react';
import Inspection from './Inspection';
import { rtlRender, WithRouter, act, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import Immutable from 'immutable';
import {
    mockAllIsIntersecting,
    // mockIsIntersecting,
    // intersectionMockInstance,
} from 'react-intersection-observer/test-utils';

import configData from '../../../../../../data/mock/data/testing/testAndTag/testTagOnLoadInspection';
import userData from '../../../../../../data/mock/data/testing/testAndTag/testTagUser';
import assetData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssets';
import assetTypeData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssetTypes';
import floorData from '../../../../../../data/mock/data/testing/testAndTag/testTagFloors';
import roomData from '../../../../../../data/mock/data/testing/testAndTag/testTagRooms';

import locale from '../../testTag.locale.js';
import { getUserPermissions } from '../../helpers/auth';

const currentRetestList = [
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '60', label: '5 years' },
];

const currentAssetOwnersList = [{ value: 'UQL', label: 'UQL' }];
const DEFAULT_NEXT_TEST_DATE_VALUE = '12';
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

const selectOptionFromListByIndex = (index, actions) => {
    expect(actions.getByRole('listbox')).not.toEqual(null);
    act(() => {
        const options = actions.getAllByRole('option');
        fireEvent.mouseDown(options[index]);
        options[index].click();
    });
};

function setup(testProps = {}, renderer = rtlRender) {
    const {
        state = {},
        actions = {},
        defaultFormValues = DEFAULT_FORM_VALUES,
        assetsListError = null,
        inspectionConfig = configData,
        inspectionConfigLoading = false,
        inspectionConfigError = null,

        floorListError = null,
        roomListError = null,
        saveInspectionSaving = false,
        saveInspectionSuccess = null,
        saveInspectionError = null,
        user = { ...userData },
        ...props
    } = testProps;

    const _state = {
        testTagOnLoadInspectionReducer: {
            inspectionConfig: configData,
            inspectionConfigLoading: false,
            inspectionConfigLoaded: true,
        },
        testTagUserReducer: {
            userLoading: false,
            userLoaded: true,
            userError: false,
            user: userData,
            privilege: getUserPermissions(userData.privileges ?? {}),
        },
        testTagLocationReducer: {
            siteList: configData.sites,
            siteListLoaded: true,
            floorList: floorData[0],
            floorListLoaded: true,
            roomList: roomData[0],
            roomListLoaded: true,
        },
        testTagAssetsReducer: {
            assetsList: assetData,
            assetsListLoading: false,
        },
        testTagAssetTypesReducer: {
            assetTypesList: assetTypeData,
            assetTypesListLoading: false,
            assetTypesListError: null,
        },
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <Inspection
                    actions={actions}
                    defaultFormValues={defaultFormValues}
                    currentRetestList={currentRetestList}
                    currentAssetOwnersList={currentAssetOwnersList}
                    defaultNextTestDateValue={DEFAULT_NEXT_TEST_DATE_VALUE}
                    assetsListError={assetsListError}
                    inspectionConfig={inspectionConfig}
                    inspectionConfigLoading={inspectionConfigLoading}
                    inspectionConfigError={inspectionConfigError}
                    floorListError={floorListError}
                    roomListError={roomListError}
                    saveInspectionSaving={saveInspectionSaving}
                    saveInspectionSuccess={saveInspectionSuccess}
                    saveInspectionError={saveInspectionError}
                    user={user}
                    {...props}
                />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Inspection component', () => {
    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });
    beforeEach(() => {
        mockAllIsIntersecting(true);
    });

    it('renders component', async () => {
        const mockFn = jest.fn();
        const { getByText, getByTestId } = setup({
            actions: {
                loadAssetTypes: mockFn,
                loadInspectionConfig: mockFn,
                clearAssets: mockFn,
                clearSaveInspection: mockFn,
            },
        });

        expect(getByText(locale.pages.general.pageTitle)).toBeInTheDocument();
        expect(
            getByText(locale.pages.inspect.header.pageSubtitle?.(configData.user.department_display_name)),
        ).toBeInTheDocument();
        expect(getByText(locale.pages.inspect.form.event.title)).toBeInTheDocument();
        expect(getByText(locale.pages.inspect.form.asset.title)).toBeInTheDocument();
        expect(getByTestId('inspection-reset-button')).toBeInTheDocument();
        expect(getByTestId('inspection-save-button')).toBeInTheDocument();
        expect(getByTestId('inspection-save-button')).toHaveAttribute('disabled', '');
        expect(mockFn).toHaveBeenCalled();
    });

    it('should show a save error dialog panel', async () => {
        const mockFn = jest.fn();
        const loadConfigFn = jest.fn();
        const clearAssetsFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearSaveInspectionErrorFn = jest.fn();
        const clearSaveAssetTypeErrorFn = jest.fn();
        const clearFloorsErrorFn = jest.fn();
        const clearRoomsErrorFn = jest.fn();
        const saveErrorTitle = 'Some error';
        const { getByText, getByTitle, getByTestId, queryByTestId } = setup({
            actions: {
                loadAssetTypes: mockFn,
                loadInspectionConfig: loadConfigFn,
                clearAssets: clearAssetsFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearSaveInspectionError: clearSaveInspectionErrorFn,
                clearSaveAssetTypeError: clearSaveAssetTypeErrorFn,
                clearFloorsError: clearFloorsErrorFn,
                clearRoomsError: clearRoomsErrorFn,
            },
            saveInspectionError: saveErrorTitle,
            saveAssetTypeError: saveErrorTitle,
            floorListError: saveErrorTitle,
            roomListError: saveErrorTitle,
        });

        await waitFor(() => expect(getByTestId('confirmation_alert-error-alert')).toBeInTheDocument());
        expect(getByText(locale.config.alerts.error(saveErrorTitle))).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTitle('Close'));
        });
        expect(clearSaveInspectionErrorFn).toHaveBeenCalled();
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearSaveAssetTypeErrorFn).toHaveBeenCalled();
        expect(clearFloorsErrorFn).toHaveBeenCalled();
        expect(clearRoomsErrorFn).toHaveBeenCalled();

        await waitFor(() => expect(queryByTestId('confirmation_alert-error-alert')).not.toBeInTheDocument());
        expect(clearAssetsFn).toHaveBeenCalled();
    });

    it('should show a network error dialog panel', async () => {
        const mockFn = jest.fn();
        const loadConfigFn = jest.fn();
        const clearAssetsFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearInspectionConfigError = jest.fn();
        const inspectionConfigError = 'network error';
        const { getByText, getByTitle, getByTestId, queryByTestId } = setup({
            actions: {
                loadAssetTypes: mockFn,
                loadInspectionConfig: loadConfigFn,
                clearAssets: clearAssetsFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearInspectionConfigError,
            },
            inspectionConfigError,
        });
        await waitFor(() => expect(getByTestId('confirmation_alert-error-alert')).toBeInTheDocument());
        expect(getByText(locale.config.alerts.error(inspectionConfigError))).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTitle('Close'));
        });
        await waitFor(() => expect(queryByTestId('confirmation_alert-error-alert')).not.toBeInTheDocument());
        expect(clearInspectionConfigError).toHaveBeenCalled();
    });

    it('should show a save success for PASSED asset dialog panel', async () => {
        const mockFn = jest.fn();
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole } = setup({
            actions: {
                loadAssetTypes: mockFn,
                loadInspectionConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                asset_status: 'CURRENT',
                asset_id_displayed: 'UQL000705',
                user_licence_number: 'NOT LICENCED',
                action_date: '2022-12-12',
                asset_next_test_due_date: '2023Dec12',
            },
        });
        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(getByText('NOT LICENCED')).toBeInTheDocument();
        expect(getByText('2022-12-12')).toBeInTheDocument();
        expect(getByText('2023Dec12')).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-inspection-save-success'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show a save success for FAILED asset dialog panel', async () => {
        const mockFn = jest.fn();
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole, queryByText } = setup({
            actions: {
                loadAssetTypes: mockFn,
                loadInspectionConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                asset_status: 'FAILED',
                asset_id_displayed: 'UQL000705',
                user_licence_number: '1234567890',
                action_date: '2022-12-12',
                asset_next_test_due_date: '2023Dec12',
            },
        });

        // screen.debug(undefined, 50000);

        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByTestId('saved-licence-number').textContent).toBe('1234567890');
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(queryByText('2022-12-12')).not.toBeInTheDocument();
        expect(queryByText('2023Dec12')).not.toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-inspection-save-success'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show a save success for OUTFORREPAIR asset dialog panel', async () => {
        const mockFn = jest.fn();
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole, queryByText } = setup({
            actions: {
                loadAssetTypes: mockFn,
                loadInspectionConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                asset_status: 'OUTFORREPAIR',
                asset_id_displayed: 'UQL000705',
                user_licence_number: '1234567890',
                action_date: '2022-12-12',
                asset_next_test_due_date: '2023Dec12',
            },
        });

        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByTestId('saved-licence-number').textContent).toBe('1234567890');
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(queryByText('2022-12-12')).not.toBeInTheDocument();
        expect(queryByText('2023Dec12')).not.toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-inspection-save-success'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show a save success for DISCARDED asset dialog panel', async () => {
        const mockFn = jest.fn();
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole, queryByText } = setup({
            actions: {
                loadAssetTypes: mockFn,
                loadInspectionConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                asset_status: 'DISCARDED',
                asset_id_displayed: 'UQL000705',
                user_licence_number: '1234567890',
                action_date: '2022-12-12',
                asset_next_test_due_date: '2023Dec12',
            },
        });

        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByTestId('saved-licence-number').textContent).toBe('1234567890');
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(queryByText('2022-12-12')).not.toBeInTheDocument();
        expect(queryByText('2023Dec12')).not.toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-inspection-save-success'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show defaults (coverage)', async () => {
        const mockFn = jest.fn();
        const loadConfigFn = jest.fn();
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        const { getByRole, getByText, getByTestId, queryByRole } = setup({
            actions: {
                loadAssetTypes: mockFn,
                loadInspectionConfig: loadConfigFn,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            saveInspectionSuccess: {
                asset_status: 'CURRENT',
                asset_id_displayed: 'UQL000705',
                user_licence_number: 'NOT LICENCED',
                action_date: '2022-12-12',
            },
        });
        await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByText('UQL000705')).toBeInTheDocument();
        expect(getByText('NOT LICENCED')).toBeInTheDocument();
        expect(getByText('2022-12-12')).toBeInTheDocument();
        expect(getByText('N/A')).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('confirm-inspection-save-success'));
        });
        expect(clearSaveInspectionFn).toHaveBeenCalled();
        expect(clearAssetsFn).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    describe('API', () => {
        beforeEach(() => {
            mockApi = setupMockAdapter();
        });
        afterEach(() => {
            mockApi.reset();
        });

        it('can save inspection', () => {
            const mockLoadAssets = jest.fn(() => assetData);
            const mockLoadAssetTypes = jest.fn(() => assetTypeData);
            const mockLoadInspectionConfig = jest.fn(() => configData);
            const mockFn = jest.fn();
            const saveActionFn = jest.fn();
            const mockLoadFloors = jest.fn(() => floorData[0]);
            const mockLoadRooms = jest.fn(() => roomData[0]);
            const { getByText, getByTestId, queryByTestId, getByRole, getAllByRole } = setup({
                actions: {
                    loadInspectionConfig: mockLoadInspectionConfig,
                    loadAssets: mockLoadAssets,
                    loadAssetsFiltered: mockLoadAssets,
                    loadAssetTypes: mockLoadAssetTypes,
                    saveInspection: saveActionFn,
                    clearAssets: mockFn,
                    clearFloors: mockFn,
                    clearRooms: mockFn,
                    loadFloors: mockLoadFloors,
                    loadRooms: mockLoadRooms,
                    clearSaveInspection: mockFn,
                },
                defaultFormValues: {
                    ...DEFAULT_FORM_VALUES,
                    user_id: 3,
                    asset_department_owned_by: 'UQL',
                },
            });

            expect(getByText(locale.pages.general.pageTitle)).toBeInTheDocument();

            expect(getByTestId('asset_type_selector-asset-panel-input')).toHaveAttribute('disabled', '');

            expect(queryByTestId('location_picker-event-panel-site-progress')).not.toBeInTheDocument();
            act(() => {
                fireEvent.mouseDown(getByTestId('asset_selector-asset-panel-input'));
                fireEvent.change(getByTestId('asset_selector-asset-panel-input'), {
                    target: { value: 'UQL100000' },
                });
            });
            selectOptionFromListByIndex(0, { getByRole, getAllByRole });

            expect(getByTestId('asset_type_selector-asset-panel-input')).not.toHaveAttribute('disabled');
            expect(getByTestId('last_inspection_panel')).toBeInTheDocument();

            expect(queryByTestId('months_selector-inspection-panel-next-date-label')).not.toBeInTheDocument();

            act(() => {
                fireEvent.mouseDown(getByTestId('asset_type_selector-asset-panel-input'));
            });
            selectOptionFromListByIndex(0, { getByRole, getAllByRole });

            act(() => {
                fireEvent.click(getByTestId('inspection_panel-inspection-result-passed-button'));
            });

            expect(getByTestId('inspection_panel-inspection-result-passed-button')).toHaveClass('Mui-selected');

            expect(getByTestId('months_selector-inspection-panel-next-date-label')).toBeInTheDocument();
            expect(getByTestId('inspection_panel-inspection-notes-input')).not.toHaveAttribute('disabled');
            act(() => {
                fireEvent.change(getByTestId('inspection_panel-inspection-notes-input'), {
                    target: { value: 'notes' },
                });
            });

            act(() => {
                fireEvent.mouseDown(getByTestId('location_picker-event-panel-building-input'));
            });
            selectOptionFromListByIndex(0, { getByRole, getAllByRole });

            act(() => {
                fireEvent.mouseDown(getByTestId('location_picker-event-panel-floor-input'));
            });
            selectOptionFromListByIndex(0, { getByRole, getAllByRole });
            act(() => {
                fireEvent.mouseDown(getByTestId('location_picker-event-panel-room-input'));
            });
            selectOptionFromListByIndex(0, { getByRole, getAllByRole });

            const expected = {
                asset_id_displayed: 'UQL100000',
                user_id: 3,
                asset_department_owned_by: 'UQL',
                asset_type_id: 1,
                action_date: '2017-06-30 00:00',
                room_id: 1,
                with_inspection: {
                    inspection_status: 'PASSED',
                    inspection_device_id: 1,
                    inspection_fail_reason: undefined,
                    inspection_notes: 'notes',
                    inspection_date_next: '2018-06-30 00:00',
                },
                with_repair: undefined,
                with_discard: undefined,
            };

            expect(getByTestId('inspection-save-button')).not.toHaveAttribute('disabled');
            act(() => {
                fireEvent.click(getByTestId('inspection-save-button'));
            });

            expect(saveActionFn).toHaveBeenCalledWith(expected);
        });
    });

    it('renders saving spinner', () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: 1, formBuildingId: 1, formFloorId: 1, formRoomId: 1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByTestId } = setup({
            formValues: DEFAULT_FORM_VALUES,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: true,
            isValid: true,
            actions: { clearAssets: jest.fn(), clearSaveInspection: jest.fn(), loadInspectionConfig: jest.fn() },
        });

        expect(getByTestId('inspection-progress')).toBeInTheDocument();
    });
});
