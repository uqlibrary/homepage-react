import React from 'react';
import AssetPanel from './AssetPanel';
import { render, act, fireEvent, WithReduxStore, waitFor, userEvent } from 'test-utils';
import Immutable from 'immutable';

import assetData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssets';

import assetTypeData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssetTypes';
import configData from '../../../../../../data/mock/data/testing/testAndTag/testTagOnLoadInspection';
import locale from '../../testTag.locale.js';

jest.mock('throttle-debounce', () => ({
    debounce: jest.fn((_delay, fn) => fn),
    throttle: jest.fn((_delay, fn) => fn),
}));

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(() => [{}, jest.fn(), jest.fn()]),
}));

const currentRetestList = [
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '60', label: '5 years' },
];

const DEFAULT_NEXT_TEST_DATE_VALUE = '12';

const formValues = {
    action_date: '2016-12-05 14:22',
    asset_department_owned_by: 'UQL-WSS',
    asset_id_displayed: 'UQL310000',
    asset_type_id: 1,
    discard_reason: undefined,
    inspection_date_next: '2018-12-05 14:22',
    inspection_device_id: 1,
    inspection_fail_reason: undefined,
    inspection_notes: 'notes',
    inspection_status: 'PASSED',
    isDiscarded: false,
    isRepair: false,
    repairer_contact_details: undefined,
    room_id: 1,
    user_id: 3,
};

function setup(testProps = {}, renderer = render) {
    const { state = {}, actions = {}, focusElementRef = {}, classes = {}, isMobileView = false, ...props } = testProps;

    const _state = {
        testTagOnLoadInspectionReducer: { inspectionConfig: configData, inspectionConfigLoading: false },
        testTagAssetsReducer: { assetsList: assetData, assetsListLoading: false },
        testTagAssetTypesReducer: {
            assetTypesList: assetTypeData,
            assetTypesListLoading: false,
            assetTypesListError: null,
        },
        accountReducer: {
            account: {
                tnt: {
                    user_team: 'WSS',
                    user_id: 3,
                    user_uid: 'uqtesttag',
                    user_name: 'TnT Admin',
                    user_department: 'UQL',
                    privileges: {
                        can_admin: 1,
                        can_inspect: 1,
                        can_alter: 1,
                        can_see_reports: 1,
                    },
                },
            },
            accountLoading: false,
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AssetPanel
                id="test"
                actions={actions}
                currentRetestList={currentRetestList}
                defaultNextTestDateValue={DEFAULT_NEXT_TEST_DATE_VALUE}
                focusElementRef={focusElementRef}
                classes={classes}
                isMobileView={isMobileView}
                canAddAssetType
                {...props}
            />
        </WithReduxStore>,
    );
}

const selectOptionFromListByIndex = (index, actions) => {
    expect(actions.getByRole('listbox')).not.toEqual(null);
    act(() => {
        const options = actions.getAllByRole('option');

        fireEvent.mouseDown(options[index]);
        options[index].click();
    });
};

describe('AssetPanel', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        console.error.mockRestore();
    });
    it('renders component', () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const actionFn = jest.fn();
        const openConfirmationAlertFn = jest.fn();
        const { getByText, getByTestId } = setup({
            actions: { loadAssetTypes: actionFn, clearAssets: jest.fn() },
            formValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
            openConfirmationAlert: openConfirmationAlertFn,
        });

        expect(getByText(locale.pages.inspect.form.asset.title)).toBeInTheDocument();
        expect(getByTestId('asset_selector-asset-panel')).toBeInTheDocument();
        expect(getByTestId('asset_type_selector-asset-panel')).toBeInTheDocument();
        expect(openConfirmationAlertFn).not.toHaveBeenCalled();
    });

    it('renders component without certain params', () => {
        // coverage
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const newValues = { ...formValues };
        newValues.asset_id_displayed = undefined;
        const actionFn = jest.fn();
        const openConfirmationAlertFn = jest.fn();
        const { getByText } = setup({
            actions: { loadAssetTypes: actionFn, clearAssets: jest.fn() },
            formValues: newValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
            openConfirmationAlert: openConfirmationAlertFn,
        });

        expect(getByText(locale.pages.inspect.form.asset.title)).toBeInTheDocument();
        expect(openConfirmationAlertFn).not.toHaveBeenCalled();
    });

    it('renders loading spinners', () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const actionFn = jest.fn();
        const { getByTestId, rerender } = setup({
            actions: { loadAssetTypes: actionFn, clearAssets: jest.fn() },
            formValues: {},
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
            state: {
                testTagOnLoadInspectionReducer: { inspectionConfig: {}, inspectionConfigLoading: true },
                testTagAssetsReducer: { assetsList: [], assetsListLoading: false },
                testTagAssetTypesReducer: { assetTypesList: [], assetTypesListLoading: true },
            },
        });
        expect(getByTestId('asset_type_selector-asset-panel-progress')).toBeInTheDocument();
        setup(
            {
                actions: { loadAssetTypes: actionFn, clearAssets: jest.fn() },
                formValues: {},
                location,
                resetForm,
                assignCurrentAsset,
                handleChange,
                saveInspectionSaving: false,
                isValid: false,
                state: {
                    testTagOnLoadInspectionReducer: { inspectionConfig: {}, inspectionConfigLoading: true },
                    testTagAssetsReducer: { assetsList: [], assetsListLoading: true },
                    testTagAssetTypesReducer: { assetTypesList: [], assetTypesListLoading: true },
                },
                estTagAssetTypesReducer: { assetTypesList: [], assetTypesListLoading: true },
            },
            rerender,
        );
        expect(getByTestId('asset_selector-asset-panel-progress')).toBeInTheDocument();
    });

    it('shows dialog to add new asset type', async () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const openConfirmationAlertFn = jest.fn();
        const addNewAssetTypeFn = jest.fn(() => {
            return Promise.resolve({ data: { asset_type_id: 99999 } });
        });
        const loadAssetTypesFn = jest.fn(() => {
            return Promise.resolve({ data: [{ asset_type_id: 99999 }] });
        });

        const { getByText, getByTestId, getByRole, getAllByRole, queryByTestId } = setup({
            actions: {
                saveAssetTypeAndReload: addNewAssetTypeFn,
                loadAssetTypes: loadAssetTypesFn,
                clearAssets: jest.fn(),
            },
            formValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
            openConfirmationAlert: openConfirmationAlertFn,
        });

        expect(getByText(locale.pages.inspect.form.asset.title)).toBeInTheDocument();
        expect(getByTestId('asset_type_selector-asset-panel')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('asset_type_selector-asset-panel-input'));
        });
        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(getByTestId('asset_type_selector-asset-panel-input')).toHaveAttribute('value', 'Power Cord - C13');

        act(() => {
            fireEvent.mouseDown(getByTestId('asset_type_selector-asset-panel-input'));
        });
        const newOption = getByRole('option', { name: 'ADD NEW ASSET TYPE' });
        act(() => {
            newOption.click();
        });
        await waitFor(() => expect(getByTestId('update_dialog-asset-panel')).toBeInTheDocument());
        act(() => {
            fireEvent.click(getByTestId('asset_type_name-input'));
            fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'Test new asset type' } });
        });
        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        await waitFor(() => expect(queryByTestId('update_dialog-asset-panel')).not.toBeInTheDocument());
        expect(addNewAssetTypeFn).toHaveBeenCalledWith(
            expect.objectContaining({ asset_type_name: 'Test new asset type' }),
        );
        expect(openConfirmationAlertFn).toHaveBeenCalledWith('Request successfully completed', 'success');
        expect(handleChange).toHaveBeenCalledWith('asset_type_id');
    });

    it('(coverage) handles saving and reloading fail  ', async () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const openConfirmationAlertFn = jest.fn();
        const addNewAssetTypeFn = jest.fn(() => {
            return Promise.reject('error');
        });
        const loadAssetTypesFn = jest.fn(() => {
            return Promise.resolve({ data: [{ asset_type_id: 99999 }] });
        });
        const { getByText, getByTestId, getByRole, getAllByRole, queryByTestId } = setup({
            actions: {
                saveAssetTypeAndReload: addNewAssetTypeFn,
                loadAssetTypes: loadAssetTypesFn,
                clearAssets: jest.fn(),
            },
            formValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
            openConfirmationAlert: openConfirmationAlertFn,
        });

        expect(getByText(locale.pages.inspect.form.asset.title)).toBeInTheDocument();
        expect(getByTestId('asset_type_selector-asset-panel')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('asset_type_selector-asset-panel-input'));
        });
        selectOptionFromListByIndex(1, { getByRole, getAllByRole });
        expect(getByTestId('asset_type_selector-asset-panel-input')).toHaveAttribute('value', 'Power Cord - C13');

        expect(handleChange).toHaveBeenCalledWith('asset_type_id');

        act(() => {
            fireEvent.mouseDown(getByTestId('asset_type_selector-asset-panel-input'));
        });
        const newOption = getByRole('option', { name: 'ADD NEW ASSET TYPE' });
        act(() => {
            newOption.click();
        });
        await waitFor(() => expect(getByTestId('update_dialog-asset-panel')).toBeInTheDocument());
        act(() => {
            fireEvent.click(getByTestId('asset_type_name-input'));
            fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'Test new asset type' } });
        });
        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        // if promise is rejected, dialog will still be in the page
        await waitFor(() => expect(queryByTestId('update_dialog-asset-panel')).toBeInTheDocument());
        expect(addNewAssetTypeFn).toHaveBeenCalledWith(
            expect.objectContaining({ asset_type_name: 'Test new asset type' }),
        );
        expect(openConfirmationAlertFn).toHaveBeenCalledWith(expect.stringContaining('Operation failed'), 'error');
    });

    it('does not call clearAssets when toggling all teams off and selectedAsset matches user team', () => {
        const clearAssetsFn = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const { getByRole } = setup({
            actions: { loadAssetTypes: jest.fn(), clearAssets: clearAssetsFn },
            formValues,
            selectedAsset: { asset_team_slug: 'WSS' },
            location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
            resetForm: jest.fn(),
            assignCurrentAsset: jest.fn(),
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
        });

        clearAssetsFn.mockClear();

        const toggle = getByRole('checkbox', { name: 'All team assets' });
        // Toggle on
        act(() => {
            fireEvent.click(toggle);
        });
        expect(clearAssetsFn).not.toHaveBeenCalled();

        // Toggle off — asset team matches user team, so clearAssets should NOT be called
        act(() => {
            fireEvent.click(toggle);
        });
        expect(clearAssetsFn).not.toHaveBeenCalled();
    });

    it('calls clearAssets when toggling all teams off and selectedAsset does not match user team', () => {
        const clearAssetsFn = jest.fn();
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const { getByRole } = setup({
            actions: { loadAssetTypes: jest.fn(), clearAssets: clearAssetsFn },
            formValues,
            selectedAsset: { asset_team_slug: 'SPACES' },
            location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
            resetForm: jest.fn(),
            assignCurrentAsset: jest.fn(),
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
        });

        clearAssetsFn.mockClear();

        const toggle = getByRole('checkbox', { name: 'All team assets' });
        // Toggle on
        act(() => {
            fireEvent.click(toggle);
        });
        expect(clearAssetsFn).not.toHaveBeenCalled();

        // Toggle off — asset team ('SPACES') does not match user team ('WSS'), so clearAssets IS called
        act(() => {
            fireEvent.click(toggle);
        });
        expect(clearAssetsFn).toHaveBeenCalledTimes(1);
    });

    it('(coverage) handles loading asset types failure', async () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const openConfirmationAlertFn = jest.fn();
        const addNewAssetTypeFn = jest.fn(() => {
            return Promise.resolve({ data: { asset_type_id: 99999 } });
        });
        const loadAssetTypesFn = jest.fn(() => {
            return Promise.reject('error');
        });
        const { getByText, getByTestId, getByRole, getAllByRole, queryByTestId } = setup({
            actions: {
                saveAssetTypeAndReload: addNewAssetTypeFn,
                loadAssetTypes: loadAssetTypesFn,
                clearAssets: jest.fn(),
            },
            formValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
            openConfirmationAlert: openConfirmationAlertFn,
        });

        expect(getByText(locale.pages.inspect.form.asset.title)).toBeInTheDocument();
        expect(getByTestId('asset_type_selector-asset-panel')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('asset_type_selector-asset-panel-input'));
        });
        selectOptionFromListByIndex(1, { getByRole, getAllByRole });
        expect(getByTestId('asset_type_selector-asset-panel-input')).toHaveAttribute('value', 'Power Cord - C13');

        expect(handleChange).toHaveBeenCalledWith('asset_type_id');

        act(() => {
            fireEvent.mouseDown(getByTestId('asset_type_selector-asset-panel-input'));
        });
        const newOption = getByRole('option', { name: 'ADD NEW ASSET TYPE' });
        act(() => {
            newOption.click();
        });
        await waitFor(() => expect(getByTestId('update_dialog-asset-panel')).toBeInTheDocument());
        act(() => {
            fireEvent.click(getByTestId('asset_type_name-input'));
            fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'Test new asset type' } });
        });
        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        await waitFor(() => expect(queryByTestId('update_dialog-asset-panel')).not.toBeInTheDocument());
        expect(addNewAssetTypeFn).toHaveBeenCalledWith(
            expect.objectContaining({ asset_type_name: 'Test new asset type' }),
        );
        expect(openConfirmationAlertFn).toHaveBeenNthCalledWith(1, 'Request successfully completed', 'success');
        expect(openConfirmationAlertFn).toHaveBeenLastCalledWith(
            expect.stringContaining('Encountered an error'),
            'error',
        );
    });

    describe('useNoResultsAlert', () => {
        it('calls openConfirmationAlert when assets list is loaded and empty', () => {
            const openConfirmationAlertFn = jest.fn();
            // eslint-disable-next-line no-unused-vars
            const handleChange = jest.fn(prop => jest.fn(event => {}));
            setup({
                actions: { loadAssetTypes: jest.fn(), clearAssets: jest.fn() },
                formValues,
                location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
                resetForm: jest.fn(),
                assignCurrentAsset: jest.fn(),
                handleChange,
                openConfirmationAlert: openConfirmationAlertFn,
                state: {
                    testTagAssetsReducer: { assetsList: [], assetsListLoaded: true, assetsListLoading: false },
                },
            });

            expect(openConfirmationAlertFn).toHaveBeenCalledWith(
                expect.stringContaining('No matching asset found'),
                'error',
            );
        });

        it('does not call openConfirmationAlert when assets list is loaded and non-empty', () => {
            const openConfirmationAlertFn = jest.fn();
            // eslint-disable-next-line no-unused-vars
            const handleChange = jest.fn(prop => jest.fn(event => {}));
            setup({
                actions: { loadAssetTypes: jest.fn(), clearAssets: jest.fn() },
                formValues,
                location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
                resetForm: jest.fn(),
                assignCurrentAsset: jest.fn(),
                handleChange,
                openConfirmationAlert: openConfirmationAlertFn,
                state: {
                    testTagAssetsReducer: { assetsList: assetData, assetsListLoaded: true, assetsListLoading: false },
                },
            });

            expect(openConfirmationAlertFn).not.toHaveBeenCalled();
        });

        it('does not call openConfirmationAlert when assets list is not yet loaded', () => {
            const openConfirmationAlertFn = jest.fn();
            // eslint-disable-next-line no-unused-vars
            const handleChange = jest.fn(prop => jest.fn(event => {}));
            setup({
                actions: { loadAssetTypes: jest.fn(), clearAssets: jest.fn() },
                formValues,
                location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
                resetForm: jest.fn(),
                assignCurrentAsset: jest.fn(),
                handleChange,
                openConfirmationAlert: openConfirmationAlertFn,
                state: {
                    testTagAssetsReducer: { assetsList: [], assetsListLoaded: false, assetsListLoading: true },
                },
            });

            expect(openConfirmationAlertFn).not.toHaveBeenCalled();
        });
    });

    describe('all teams switch', () => {
        it('calls loadAssetsFiltered when toggling all teams after a search', async () => {
            const searchPattern = 'UQL310000';
            const loadAssetsFilteredFn = jest.fn();
            // eslint-disable-next-line no-unused-vars
            const handleChange = jest.fn(prop => jest.fn(event => {}));
            const { getByTestId, getByRole } = setup({
                actions: {
                    loadAssetTypes: jest.fn(),
                    clearAssets: jest.fn(),
                    loadAssetsFiltered: loadAssetsFilteredFn,
                },
                formValues,
                location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
                resetForm: jest.fn(),
                assignCurrentAsset: jest.fn(),
                handleChange,
                saveInspectionSaving: false,
                isValid: false,
            });

            // Type in asset selector using userEvent — triggers real input events that React detects
            const input = getByTestId('asset_selector-asset-panel-input');
            await userEvent.type(input, searchPattern);

            loadAssetsFilteredFn.mockClear();

            // Toggle all teams on — should call loadAssetsFiltered since searchTerm is set
            const toggle = getByRole('checkbox', { name: 'All team assets' });
            await userEvent.click(toggle);

            expect(loadAssetsFilteredFn).toHaveBeenCalledWith(
                expect.objectContaining({ all_teams: true }),
                searchPattern,
            );
        }, 10000);

        it('calls loadAssetsFiltered without all_teams when toggling off after a search', async () => {
            const loadAssetsFilteredFn = jest.fn();
            // eslint-disable-next-line no-unused-vars
            const handleChange = jest.fn(prop => jest.fn(event => {}));
            const { getByTestId, getByRole } = setup({
                actions: {
                    loadAssetTypes: jest.fn(),
                    clearAssets: jest.fn(),
                    loadAssetsFiltered: loadAssetsFilteredFn,
                },
                formValues,
                selectedAsset: { asset_team_slug: 'WSS' },
                location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
                resetForm: jest.fn(),
                assignCurrentAsset: jest.fn(),
                handleChange,
                saveInspectionSaving: false,
                isValid: false,
            });

            const input = getByTestId('asset_selector-asset-panel-input');
            await userEvent.type(input, 'UQL310000');

            // Ensure toggle is ON before testing the OFF toggle
            const toggle = getByRole('checkbox', { name: 'All team assets' });
            await userEvent.click(toggle);
            await expect(getByTestId('asset_panel-all-teams-switch')).toBeChecked();

            loadAssetsFilteredFn.mockClear();

            // Toggle off — should call loadAssetsFiltered with empty filter (no all_teams)
            await userEvent.click(toggle);

            expect(loadAssetsFilteredFn).toHaveBeenCalledWith(
                expect.not.objectContaining({ all_teams: true }),
                'UQL310000',
            );
        }, 10000);

        it('does not call loadAssetsFiltered after clearing the search', async () => {
            const loadAssetsFilteredFn = jest.fn();
            // eslint-disable-next-line no-unused-vars
            const handleChange = jest.fn(prop => jest.fn(event => {}));
            const { getByTestId, getByRole } = setup({
                actions: {
                    loadAssetTypes: jest.fn(),
                    clearAssets: jest.fn(),
                    loadAssetsFiltered: loadAssetsFilteredFn,
                },
                formValues,
                state: { testTagAssetsReducer: { assetsList: [], assetsListLoading: false } },
                location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
                resetForm: jest.fn(),
                assignCurrentAsset: jest.fn(),
                handleChange,
                saveInspectionSaving: false,
                isValid: false,
            });

            // Type in asset selector using userEvent — triggers real input events that React detects
            const input = getByTestId('asset_selector-asset-panel-input');
            await userEvent.type(input, 'UQL310000');

            // Clear the input via Autocomplete clear button (triggers onClear, resetting searchTerm)
            const clearButton = getByTestId('asset_selector-asset-panel').querySelector(
                '.MuiAutocomplete-clearIndicator',
            );
            await userEvent.click(clearButton);

            loadAssetsFilteredFn.mockClear();

            // Toggle all teams — should NOT call loadAssetsFiltered since searchTerm was cleared
            const toggle = getByRole('checkbox', { name: 'All team assets' });
            await userEvent.click(toggle);

            expect(loadAssetsFilteredFn).not.toHaveBeenCalled();
        }, 10000);

        it('shows warning alert when allTeams is on and selectedAsset is from a different team', async () => {
            // eslint-disable-next-line no-unused-vars
            const handleChange = jest.fn(prop => jest.fn(event => {}));
            const { getByTestId, getByRole } = setup({
                actions: { loadAssetTypes: jest.fn(), clearAssets: jest.fn() },
                formValues,
                selectedAsset: { asset_team_slug: 'SPACES', asset_team_display_name: 'Spaces Team' },
                location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
                resetForm: jest.fn(),
                assignCurrentAsset: jest.fn(),
                handleChange,
                saveInspectionSaving: false,
                isValid: false,
            });

            // Toggle all teams on
            const toggle = getByRole('checkbox', { name: 'All team assets' });
            await userEvent.click(toggle);

            expect(getByTestId('asset_panel-all-teams-warning-text')).toBeInTheDocument();
        });

        it('does not show warning alert when allTeams is on and selectedAsset is from same team', async () => {
            // eslint-disable-next-line no-unused-vars
            const handleChange = jest.fn(prop => jest.fn(event => {}));
            const { queryByTestId, getByRole } = setup({
                actions: { loadAssetTypes: jest.fn(), clearAssets: jest.fn() },
                formValues,
                selectedAsset: { asset_team_slug: 'WSS', asset_team_display_name: 'Work Station Support' },
                location: { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 },
                resetForm: jest.fn(),
                assignCurrentAsset: jest.fn(),
                handleChange,
                saveInspectionSaving: false,
                isValid: false,
            });

            // Toggle all teams on
            const toggle = getByRole('checkbox', { name: 'All team assets' });
            await userEvent.click(toggle);

            expect(queryByTestId('asset_panel-all-teams-warning-text')).not.toBeInTheDocument();
        });
    });
});
