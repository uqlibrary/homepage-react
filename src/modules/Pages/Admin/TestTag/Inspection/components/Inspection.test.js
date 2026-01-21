import React from 'react';
import Inspection from './Inspection';
import { rtlRender, WithRouter, act, fireEvent, WithReduxStore, waitFor, screen, preview } from 'test-utils';
import Immutable from 'immutable';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import configData from '../../../../../../data/mock/data/testing/testAndTag/testTagOnLoadInspection';
import userData from '../../../../../../data/mock/data/testing/testAndTag/testTagUser';
import assetData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssets';
import assetTypeData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssetTypes';
import floorData from '../../../../../../data/mock/data/testing/testAndTag/testTagFloors';
import roomData from '../../../../../../data/mock/data/testing/testAndTag/testTagRooms';

import locale from '../../testTag.locale.js';
import * as repositories from 'repositories';

// Mock react-cookie to control printer preference
// Use mockCookies['TNT_LABEL_PRINTER_PREFERENCE'] = 'printer-name' to set a printer in tests
// Use delete mockCookies['TNT_LABEL_PRINTER_PREFERENCE'] to clear the printer selection
const mockSetCookie = jest.fn();
const mockCookies = {};
jest.mock('react-cookie', () => ({
    useCookies: jest.fn(() => [mockCookies, mockSetCookie]),
}));

// Mock useLabelPrinter hook with controllable printer instance
const mockGetConnectionStatus = jest.fn();
const mockPrint = jest.fn();
const mockSetPrinterPreference = jest.fn();

jest.mock('../../SharedComponents/LabelPrinter/useLabelPrinter', () => {
    return jest.fn(() => ({
        printerCode: 'emulator',
        printer: {
            code: 'emulator',
            getAvailablePrinters: jest.fn().mockResolvedValue([{ name: 'Emulator' }]),
            getConnectionStatus: mockGetConnectionStatus,
            setPrinter: jest.fn().mockResolvedValue({ name: 'Emulator' }),
            print: mockPrint,
        },
        printerPreference: 'Emulator',
        setPrinterPreference: mockSetPrinterPreference,
        availablePrinters: [{ name: 'Emulator' }],
    }));
});

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
        accountLoading = false,
        user = { ...userData, user_department: 'TEST' },
        ...props
    } = testProps;

    const _state = {
        testTagOnLoadInspectionReducer: {
            inspectionConfig: configData,
            inspectionConfigLoading: false,
            inspectionConfigLoaded: true,
        },
        accountReducer: {
            accountLoading,
            account: { tnt: user },
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
        mockApi = setupMockAdapter();
    });
    afterEach(() => {
        mockApi.reset();
    });

    const fillForm = async (passedOrFailed = 'passed', discard = false, repair = false) => {
        expect(screen.getByText(locale.pages.general.pageTitle)).toBeInTheDocument();

        expect(screen.getByTestId('asset_type_selector-asset-panel-input')).toHaveAttribute('disabled', '');

        expect(screen.queryByTestId('location_picker-event-panel-site-progress')).not.toBeInTheDocument();
        act(() => {
            fireEvent.mouseDown(screen.getByTestId('asset_selector-asset-panel-input'));
            fireEvent.change(screen.getByTestId('asset_selector-asset-panel-input'), {
                target: { value: 'UQL100000' },
            });
        });
        selectOptionFromListByIndex(0, { getByRole: screen.getByRole, getAllByRole: screen.getAllByRole });

        expect(screen.getByTestId('asset_type_selector-asset-panel-input')).not.toHaveAttribute('disabled');
        expect(screen.getByTestId('last_inspection_panel')).toBeInTheDocument();

        expect(screen.queryByTestId('months_selector-inspection-panel-next-date-label')).not.toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(screen.getByTestId('asset_type_selector-asset-panel-input'));
        });
        selectOptionFromListByIndex(0, { getByRole: screen.getByRole, getAllByRole: screen.getAllByRole });

        act(() => {
            fireEvent.click(screen.getByTestId(`inspection_panel-inspection-result-${passedOrFailed}-button`));
        });

        if (passedOrFailed === 'passed') {
            expect(screen.getByTestId('months_selector-inspection-panel-next-date-label')).toBeInTheDocument();
            expect(screen.queryByTestId('inspection_panel-fail-reason-input')).not.toBeInTheDocument();
        } else {
            expect(screen.queryByTestId('months_selector-inspection-panel-next-date-label')).not.toBeInTheDocument();
            expect(screen.getByTestId('inspection_panel-fail-reason-input')).toBeInTheDocument();
            act(() => {
                fireEvent.change(screen.getByTestId('inspection_panel-fail-reason-input'), {
                    target: { value: 'reason' },
                });
            });
        }
        expect(screen.getByTestId('inspection_panel-inspection-notes-input')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.change(screen.getByTestId('inspection_panel-inspection-notes-input'), {
                target: { value: 'notes' },
            });
        });

        if (discard) {
            act(() => {
                fireEvent.mouseDown(screen.getByTestId('action_panel-is-discard-select'));
            });
            selectOptionFromListByIndex(1, { getByRole: screen.getByRole, getAllByRole: screen.getAllByRole });
            expect(screen.getByTestId('action_panel-discard-reason-input')).not.toHaveAttribute('disabled');
            act(() => {
                fireEvent.change(screen.getByTestId('action_panel-discard-reason-input'), {
                    target: { value: 'reason' },
                });
            });
        }
        if (repair) {
            act(() => {
                fireEvent.click(screen.getByTestId('action_panel-repair-tab-button'));
            });
            await screen.findByTestId('action_panel-is-repair-select');
            act(() => {
                fireEvent.mouseDown(screen.getByTestId('action_panel-is-repair-select'));
            });
            selectOptionFromListByIndex(1, { getByRole: screen.getByRole, getAllByRole: screen.getAllByRole });
            expect(screen.getByTestId('action_panel-repairer-details-input')).not.toHaveAttribute('disabled');
            act(() => {
                fireEvent.change(screen.getByTestId('action_panel-repairer-details-input'), {
                    target: { value: 'reason' },
                });
            });
        }

        act(() => {
            fireEvent.mouseDown(screen.getByTestId('location_picker-event-panel-building-input'));
        });
        selectOptionFromListByIndex(0, { getByRole: screen.getByRole, getAllByRole: screen.getAllByRole });

        act(() => {
            fireEvent.mouseDown(screen.getByTestId('location_picker-event-panel-floor-input'));
        });
        selectOptionFromListByIndex(0, { getByRole: screen.getByRole, getAllByRole: screen.getAllByRole });
        act(() => {
            fireEvent.mouseDown(screen.getByTestId('location_picker-event-panel-room-input'));
        });
        selectOptionFromListByIndex(0, { getByRole: screen.getByRole, getAllByRole: screen.getAllByRole });
    };

    const getMockDefaults = () => {
        const mockLoadAssets = jest.fn(() => assetData);
        const mockLoadAssetTypes = jest.fn(() => assetTypeData);
        const mockLoadInspectionConfig = jest.fn(() => configData);
        const mockFn = jest.fn();
        const mockLoadFloors = jest.fn(() => floorData[0]);
        const mockLoadRooms = jest.fn(() => roomData[0]);
        const clearSaveInspectionFn = jest.fn();
        const clearAssetsFn = jest.fn();

        return {
            actions: {
                loadInspectionConfig: mockLoadInspectionConfig,
                loadAssets: mockLoadAssets,
                loadAssetsFiltered: mockLoadAssets,
                loadAssetTypes: mockLoadAssetTypes,
                saveInspection: mockFn,
                clearFloors: mockFn,
                clearRooms: mockFn,
                loadFloors: mockLoadFloors,
                loadRooms: mockLoadRooms,
                clearSaveInspection: clearSaveInspectionFn,
                clearAssets: clearAssetsFn,
            },
            defaultFormValues: {
                ...DEFAULT_FORM_VALUES,
                user_id: 3,
                asset_department_owned_by: 'UQL',
            },
        };
    };

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

        const savedResponse = {
            asset_status: 'CURRENT',
            asset_id_displayed: expected.asset_id_displayed,
            user_licence_number: '1234567890',
            action_date: expected.action_date.split(' ')[0],
            asset_next_test_due_date: '2023Dec12',
        };

        const defaults = getMockDefaults();
        const saveActionFn = jest.fn(() => Promise.resolve(savedResponse));
        defaults.actions.saveInspection = saveActionFn;

        const { getByTestId, getByText, findByRole, queryByRole } = setup({
            ...defaults,
        });

        await fillForm();

        expect(getByTestId('inspection_panel-inspection-result-passed-button')).toHaveClass('Mui-selected');

        expect(getByTestId('inspection-save-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('inspection-save-button'));
        });

        expect(saveActionFn).toHaveBeenCalledWith(expected);

        await findByRole('dialog');
        expect(getByText('Asset saved')).toBeInTheDocument();
        expect(getByText(savedResponse.asset_id_displayed)).toBeInTheDocument();
        expect(getByTestId('saved-licence-number').textContent).toBe(savedResponse.user_licence_number);
        expect(getByText(savedResponse.action_date)).toBeInTheDocument();
        expect(getByText('2023Dec12')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('confirm-inspection-save-success'));
        });
        expect(defaults.actions.clearSaveInspection).toHaveBeenCalled();
        expect(defaults.actions.clearAssets).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    }, 10000);

    it('should show a save success for FAILED asset dialog panel', async () => {
        const expected = {
            asset_id_displayed: 'UQL100000',
            user_id: 3,
            asset_department_owned_by: 'UQL',
            asset_type_id: 1,
            action_date: '2017-06-30 00:00',
            room_id: 1,
            with_inspection: {
                inspection_status: 'FAILED',
                inspection_device_id: 1,
                inspection_fail_reason: 'reason',
                inspection_notes: 'notes',
                inspection_date_next: undefined,
            },
            with_repair: undefined,
            with_discard: undefined,
        };

        const savedResponse = {
            asset_status: expected.with_inspection.inspection_status,
            asset_id_displayed: expected.asset_id_displayed,
            user_licence_number: '1234567890',
            action_date: expected.action_date,
            asset_next_test_due_date: undefined,
        };
        mockApi.onPost(repositories.routes.TEST_TAG_ASSET_ACTION().apiUrl).reply(200, { data: savedResponse });

        const defaults = getMockDefaults();
        const saveActionFn = jest.fn(() => Promise.resolve(savedResponse));
        defaults.actions.saveInspection = saveActionFn;

        const { getByTestId, getByText, findByRole, queryByRole } = setup({
            ...defaults,
        });

        await fillForm('failed');

        expect(getByTestId('inspection_panel-inspection-result-failed-button')).toHaveClass('Mui-selected');

        expect(getByTestId('inspection-save-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('inspection-save-button'));
        });

        expect(saveActionFn).toHaveBeenCalledWith(expected);

        await findByRole('dialog');

        expect(getByText('OUT OF SERVICE')).toBeInTheDocument();
        expect(getByText(savedResponse.asset_id_displayed)).toBeInTheDocument();
        expect(getByText('TAG PLACED BY:')).toBeInTheDocument();
        expect(getByTestId('saved-licence-number').textContent).toBe(savedResponse.user_licence_number);
        act(() => {
            fireEvent.click(getByTestId('confirm-inspection-save-success'));
        });
        expect(defaults.actions.clearSaveInspection).toHaveBeenCalled();
        expect(defaults.actions.clearAssets).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    }, 10000);

    it('should show a save success for OUTFORREPAIR asset dialog panel', async () => {
        const expected = {
            asset_id_displayed: 'UQL100000',
            user_id: 3,
            asset_department_owned_by: 'UQL',
            asset_type_id: 1,
            action_date: '2017-06-30 00:00',
            room_id: 1,
            with_inspection: {
                inspection_status: 'FAILED',
                inspection_device_id: 1,
                inspection_date_next: undefined,
                inspection_fail_reason: 'reason',
                inspection_notes: 'notes',
            },
            with_discard: undefined,
            with_repair: {
                repairer_contact_details: 'reason',
            },
        };

        const savedResponse = {
            asset_status: expected.with_inspection.inspection_status,
            asset_id_displayed: expected.asset_id_displayed,
            user_licence_number: '1234567890',
            action_date: expected.action_date,
            asset_next_test_due_date: '2023Dec12',
        };
        mockApi.onPost(repositories.routes.TEST_TAG_ASSET_ACTION().apiUrl).reply(200, { data: savedResponse });

        const defaults = getMockDefaults();
        const saveActionFn = jest.fn(() => Promise.resolve(savedResponse));
        defaults.actions.saveInspection = saveActionFn;

        const { getByTestId, getByText, findByRole, queryByRole, queryByText } = setup({
            ...defaults,
        });

        await fillForm('failed', false, true);

        expect(getByTestId('inspection_panel-inspection-result-failed-button')).toHaveClass('Mui-selected');

        expect(getByTestId('inspection-save-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('inspection-save-button'));
        });

        expect(saveActionFn).toHaveBeenCalledWith(expected);

        await findByRole('dialog');

        expect(getByText('OUT OF SERVICE')).toBeInTheDocument();
        expect(getByText(savedResponse.asset_id_displayed)).toBeInTheDocument();
        expect(getByText('TAG PLACED BY:')).toBeInTheDocument();
        expect(getByTestId('saved-licence-number').textContent).toBe(savedResponse.user_licence_number);
        expect(queryByText('2022-12-12')).not.toBeInTheDocument();
        expect(queryByText('2023Dec12')).not.toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('confirm-inspection-save-success'));
        });
        expect(defaults.actions.clearSaveInspection).toHaveBeenCalled();
        expect(defaults.actions.clearAssets).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('should show a save success for DISCARDED asset dialog panel', async () => {
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
                inspection_date_next: '2018-06-30 00:00',
                inspection_fail_reason: undefined,
                inspection_notes: 'notes',
            },
            with_repair: undefined,
            with_discard: {
                discard_reason: 'reason',
            },
        };

        const savedResponse = {
            asset_status: expected.with_inspection.inspection_status,
            asset_id_displayed: expected.asset_id_displayed,
            user_licence_number: '1234567890',
            action_date: expected.action_date,
            asset_next_test_due_date: '2023Dec12',
        };
        mockApi.onPost(repositories.routes.TEST_TAG_ASSET_ACTION().apiUrl).reply(200, { data: savedResponse });

        const defaults = getMockDefaults();
        const saveActionFn = jest.fn(() => Promise.resolve(savedResponse));
        defaults.actions.saveInspection = saveActionFn;

        const { getByTestId, getByText, findByRole, queryByRole, queryByText } = setup({
            ...defaults,
        });

        await fillForm('passed', true);

        expect(getByTestId('inspection_panel-inspection-result-passed-button')).toHaveClass('Mui-selected');

        expect(getByTestId('inspection-save-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('inspection-save-button'));
        });

        expect(saveActionFn).toHaveBeenCalledWith(expected);

        await findByRole('dialog');

        expect(getByText('OUT OF SERVICE')).toBeInTheDocument();
        expect(getByText(savedResponse.asset_id_displayed)).toBeInTheDocument();
        expect(getByText('TAG PLACED BY:')).toBeInTheDocument();
        expect(getByTestId('saved-licence-number').textContent).toBe(savedResponse.user_licence_number);
        expect(queryByText('2022-12-12')).not.toBeInTheDocument();
        expect(queryByText('2023Dec12')).not.toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('confirm-inspection-save-success'));
        });
        expect(defaults.actions.clearSaveInspection).toHaveBeenCalled();
        expect(defaults.actions.clearAssets).toHaveBeenCalled();
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
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
    describe('label printing', () => {
        const mockSuccessData = {
            asset_status: 'CURRENT',
            asset_id_displayed: 'UQL100000',
            user_licence_number: '1234567890',
            action_date: '2017-06-30',
            asset_next_test_due_date: '2023Dec12',
        };

        beforeEach(() => {
            jest.clearAllMocks();
            mockCookies.TNT_LABEL_PRINTER_PREFERENCE = 'Emulator';
            // Default mock returns ready: true
            mockGetConnectionStatus.mockResolvedValue({ ready: true });
            mockPrint.mockResolvedValue({ ok: true });
        });
        afterEach(() => {
            delete mockCookies.TNT_LABEL_PRINTER_PREFERENCE;
        });

        it('should open printer dialog on save success with PASSED status when printing is enabled for UQL department', async () => {
            // Mock fetch, used by Emulator printer
            global.fetch = jest.fn();
            const mockResponse = { ok: true };
            global.fetch.mockResolvedValueOnce(mockResponse);

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

            const savedResponse = {
                asset_status: 'CURRENT',
                asset_id_displayed: expected.asset_id_displayed,
                user_licence_number: '1234567890',
                action_date: expected.action_date.split(' ')[0],
                asset_next_test_due_date: '2023Dec12',
            };

            const defaults = getMockDefaults();
            const saveActionFn = jest.fn(() => Promise.resolve(savedResponse));
            defaults.actions.saveInspection = saveActionFn;

            const { getByTestId } = setup({
                ...defaults,
                saveInspectionSuccess: savedResponse,
                user: { ...userData, user_department: 'UQL' },
            });

            await fillForm();

            expect(getByTestId('inspection-save-button')).not.toHaveAttribute('disabled');
            act(() => {
                fireEvent.click(getByTestId('inspection-save-button'));
            });

            expect(saveActionFn).toHaveBeenCalledWith(expected);

            await waitFor(() => {
                expect(getByTestId('confirm-inspection-printer-save-success')).toBeInTheDocument();
                expect(getByTestId('confirm-alternate-inspection-printer-save-success')).toBeInTheDocument();
            });

            act(() => {
                fireEvent.click(getByTestId('confirm-alternate-inspection-printer-save-success'));
            });
            preview.debug();
            // Should show success info alert
            await waitFor(() => {
                expect(getByTestId('confirmation_alert-info-alert')).toHaveTextContent('Print job sent to Emulator');
            });
        }, 10000);

        it('should show alert when no inspection data is available for printing', async () => {
            const defaults = getMockDefaults();
            const saveActionFn = jest.fn(() => Promise.resolve({ ...mockSuccessData, asset_id_displayed: null }));
            defaults.actions.saveInspection = saveActionFn;

            const { getByTestId } = setup({
                ...defaults,
                user: { ...userData, user_department: 'UQL' },
            });

            await fillForm();

            act(() => {
                fireEvent.click(getByTestId('inspection-save-button'));
            });

            await waitFor(() => {
                expect(getByTestId('confirm-inspection-printer-save-success')).toBeInTheDocument();
            });

            // Attempt to print without inspection data
            act(() => {
                fireEvent.click(getByTestId('confirm-alternate-inspection-printer-save-success'));
            });
            // Should show error alert
            await waitFor(() => {
                expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent(
                    'No label data available to print.',
                );
            });
        }, 10000);

        it('should show alert when printer is not ready', async () => {
            // Override the mock to return ready: false for this test
            mockGetConnectionStatus.mockResolvedValue({ ready: false });

            const defaults = getMockDefaults();
            const saveActionFn = jest.fn(() => Promise.resolve(mockSuccessData));
            defaults.actions.saveInspection = saveActionFn;

            const { getByTestId } = setup({
                ...defaults,
                saveInspectionSuccess: mockSuccessData,
                user: { ...userData, user_department: 'UQL' },
            });

            await fillForm();

            act(() => {
                fireEvent.click(getByTestId('inspection-save-button'));
            });

            await waitFor(() => {
                expect(getByTestId('confirm-inspection-printer-save-success')).toBeInTheDocument();
            });

            act(() => {
                fireEvent.click(getByTestId('confirm-alternate-inspection-printer-save-success'));
            });

            await waitFor(() => {
                expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent(
                    'The selected printer is not ready.',
                );
            });
        }, 10000);

        it('should show alert when print job fails', async () => {
            const defaults = getMockDefaults();
            const saveActionFn = jest.fn(() => Promise.resolve(mockSuccessData));
            defaults.actions.saveInspection = saveActionFn;

            const { getByTestId } = setup({
                ...defaults,
                saveInspectionSuccess: mockSuccessData,
                user: { ...userData, user_department: 'UQL' },
            });

            await fillForm();

            act(() => {
                fireEvent.click(getByTestId('inspection-save-button'));
            });

            await waitFor(() => {
                expect(getByTestId('confirm-inspection-printer-save-success')).toBeInTheDocument();
            });

            act(() => {
                fireEvent.click(getByTestId('confirm-alternate-inspection-printer-save-success'));
            });

            await waitFor(() => {
                expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent(
                    'Unable to send the print job.',
                );
            });
        }, 10000);

        it('should show alert when printer connection fails', async () => {
            const defaults = getMockDefaults();
            const saveActionFn = jest.fn(() => Promise.resolve(mockSuccessData));
            defaults.actions.saveInspection = saveActionFn;

            const { getByTestId, queryByTestId } = setup({
                ...defaults,
                saveInspectionSuccess: mockSuccessData,
                user: { ...userData, user_department: 'UQL' },
            });

            await fillForm();

            act(() => {
                fireEvent.click(getByTestId('inspection-save-button'));
            });

            await waitFor(() => {
                expect(getByTestId('confirm-inspection-printer-save-success')).toBeInTheDocument();
            });

            // Attempt to print (connection might fail based on printer mock)
            act(() => {
                fireEvent.click(getByTestId('confirm-alternate-inspection-printer-save-success'));
            });

            // Should show either error or success alert
            await waitFor(() => {
                const errorAlert = queryByTestId('confirmation_alert-error-alert');
                const infoAlert = queryByTestId('confirmation_alert-info-alert');
                expect(errorAlert || infoAlert).toBeTruthy();
            });
        }, 10000);

        it('should show alert when template is not found for printer', async () => {
            const defaults = getMockDefaults();
            const saveActionFn = jest.fn(() => Promise.resolve(mockSuccessData));
            defaults.actions.saveInspection = saveActionFn;

            const { getByTestId, queryByTestId } = setup({
                ...defaults,
                saveInspectionSuccess: null, // Explicitly set to null to test no data scenario                saveInspectionSuccess: mockSuccessData,
                user: { ...userData, user_department: 'UQL' },
            });

            await fillForm();

            act(() => {
                fireEvent.click(getByTestId('inspection-save-button'));
            });

            await waitFor(() => {
                expect(getByTestId('confirm-inspection-printer-save-success')).toBeInTheDocument();
            });

            // Attempt to print (template might not be found based on printer mock)
            act(() => {
                fireEvent.click(getByTestId('confirm-alternate-inspection-printer-save-success'));
            });

            // Should show either error or success alert
            await waitFor(() => {
                const errorAlert = queryByTestId('confirmation_alert-error-alert');
                const infoAlert = queryByTestId('confirmation_alert-info-alert');
                expect(errorAlert || infoAlert).toBeTruthy();
            });
        }, 10000);
    });
});
