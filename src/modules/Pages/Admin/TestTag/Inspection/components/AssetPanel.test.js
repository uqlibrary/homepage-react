import React from 'react';
import AssetPanel from './AssetPanel';
import { render, act, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import Immutable from 'immutable';

import assetData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssets';

import assetTypeData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssetTypes';
import configData from '../../../../../../data/mock/data/testing/testAndTag/testTagOnLoadInspection';
import locale from '../../testTag.locale.js';

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
        const { getByText, getByTestId } = setup({
            actions: { loadAssetTypes: actionFn },
            formValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
        });

        expect(getByText(locale.pages.inspect.form.asset.title)).toBeInTheDocument();
        expect(getByTestId('asset_selector-asset-panel')).toBeInTheDocument();
        expect(getByTestId('asset_type_selector-asset-panel')).toBeInTheDocument();
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
        const { getByText } = setup({
            actions: { loadAssetTypes: actionFn },
            formValues: newValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
        });

        expect(getByText(locale.pages.inspect.form.asset.title)).toBeInTheDocument();
    });

    it('renders loading spinners', () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const actionFn = jest.fn();
        const { getByTestId, rerender } = setup({
            actions: { loadAssetTypes: actionFn },
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
                actions: { loadAssetTypes: actionFn },
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
            actions: { saveAssetTypeAndReload: addNewAssetTypeFn, loadAssetTypes: loadAssetTypesFn },
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
            actions: { saveAssetTypeAndReload: addNewAssetTypeFn, loadAssetTypes: loadAssetTypesFn },
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
            actions: { saveAssetTypeAndReload: addNewAssetTypeFn, loadAssetTypes: loadAssetTypesFn },
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

    // MOVE FOLLOWING TESTS TO ASSETSELECTOR TEST
    // it('can search for asset ids', async () => {
    //     const resetForm = jest.fn();
    //     const assignCurrentAsset = jest.fn();
    //     const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };

    //     const wontTriggerValue = 'UQL3'; // not a long enough text
    //     const willTriggerValue = 'UQL31';

    //     // eslint-disable-next-line no-unused-vars
    //     const handleChange = jest.fn(prop => jest.fn(event => {}));
    //     const actionFn = jest.fn();

    //     const { getByTestId } = setup({
    //         actions: { loadAssets: actionFn },
    //         formValues,
    //         location,
    //         resetForm,
    //         assignCurrentAsset,
    //         handleChange,
    //         saveInspectionSaving: false,
    //         isValid: false,
    //     });

    //     // screen.debug(undefined, 100000);

    //     act(() => {
    //         fireEvent.change(getByTestId('testntagFormAssetId-input'), { target: { value: wontTriggerValue } });
    //     });
    //     await waitFor(() => expect(actionFn).not.toHaveBeenCalledWith(wontTriggerValue));

    //     act(() => {
    //         fireEvent.change(getByTestId('testntagFormAssetId-input'), { target: { value: willTriggerValue } });
    //     });
    //     await waitFor(() => expect(actionFn).toHaveBeenCalledWith(willTriggerValue));
    // });

    // it('should auto assign the current asset if returned list only contains one entry', () => {
    //     const resetForm = jest.fn();
    //     const assignCurrentAsset = jest.fn();
    //     const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
    //     // eslint-disable-next-line no-unused-vars
    //     const handleChange = jest.fn(prop => jest.fn(event => {}));

    //     const setStateMock = jest.fn();
    //     const spyState = useState => [useState, setStateMock];
    //     jest.spyOn(React, 'useState').mockImplementationOnce(spyState);

    //     setup({
    //         formValues,
    //         location,
    //         resetForm,
    //         assignCurrentAsset,
    //         handleChange,
    //         saveInspectionSaving: false,
    //         isValid: false,
    //         state: { testTagAssetsReducer: { assetsList: [{ ...assetData[0] }], assetsListLoading: false } },
    //     });

    //     expect(assignCurrentAsset).toHaveBeenCalledWith({ ...assetData[0] });
    //     expect(setStateMock).toHaveBeenCalledWith(false); // auto closes the autocomplete popup
    // });
});
