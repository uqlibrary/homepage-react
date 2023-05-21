import React from 'react';
import AssetPanel from './AssetPanel';
import { render, act, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import Immutable from 'immutable';

import configData from '../../../../../data/mock/data/testing/testTagOnLoad';
import assetData from '../../../../../data/mock/data/testing/testTagAssets';

import locale from '../testTag.locale.js';

const currentRetestList = [
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '60', label: '5 years' },
];

const DEFAULT_NEXT_TEST_DATE_VALUE = 12;

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

function setup(testProps = {}) {
    const { state = {}, actions = {}, focusElementRef = {}, classes = {}, isMobileView = false, ...props } = testProps;

    const _state = {
        testTagOnLoadReducer: { initConfig: configData, initConfigLoading: false },
        testTagAssetsReducer: { assetsList: assetData, assetsListLoading: false },
        ...state,
    };
    return render(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AssetPanel
                actions={actions}
                currentRetestList={currentRetestList}
                defaultNextTestDateValue={DEFAULT_NEXT_TEST_DATE_VALUE}
                focusElementRef={focusElementRef}
                classes={classes}
                isMobileView={isMobileView}
                {...props}
            />
        </WithReduxStore>,
    );
}

describe('AssetPanel', () => {
    it('renders component', () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByText, getByTestId } = setup({
            formValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
        });

        expect(getByText(locale.form.asset.title)).toBeInTheDocument();
        expect(getByTestId('testntagFormAssetId')).toBeInTheDocument();
        expect(getByTestId('testntagFormAssetType')).toBeInTheDocument();
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

        const { getByText } = setup({
            formValues: newValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
        });

        expect(getByText(locale.form.asset.title)).toBeInTheDocument();
    });

    it('renders loading spinners', () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const { getByTestId } = setup({
            formValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
            state: {
                testTagOnLoadReducer: { initConfig: {}, initConfigLoading: true },
                testTagAssetsReducer: { assetsList: [], assetsListLoading: true },
            },
        });

        expect(getByTestId('assetIdSpinner')).toBeInTheDocument();
        expect(getByTestId('assetTypeSpinner')).toBeInTheDocument();
    });

    it('can search for asset ids', async () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };

        const wontTriggerValue = 'UQL310'; // not a long enough text
        const willTriggerValue = 'UQL3100';

        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const actionFn = jest.fn();

        const { getByTestId } = setup({
            actions: { loadAssets: actionFn },
            formValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
        });

        // screen.debug(undefined, 100000);

        act(() => {
            fireEvent.change(getByTestId('testntagFormAssetIdInput'), { target: { value: wontTriggerValue } });
        });
        await waitFor(() => expect(actionFn).not.toHaveBeenCalledWith(wontTriggerValue));

        act(() => {
            fireEvent.change(getByTestId('testntagFormAssetIdInput'), { target: { value: willTriggerValue } });
        });
        await waitFor(() => expect(actionFn).toHaveBeenCalledWith(willTriggerValue));
    });

    it('should auto assign the current asset if returned list only contains one entry', () => {
        const resetForm = jest.fn();
        const assignCurrentAsset = jest.fn();
        const location = { formSiteId: -1, formBuildingId: -1, formFloorId: -1, formRoomId: -1 };
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));

        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);

        setup({
            formValues,
            location,
            resetForm,
            assignCurrentAsset,
            handleChange,
            saveInspectionSaving: false,
            isValid: false,
            state: { testTagAssetsReducer: { assetsList: [{ ...assetData[0] }], assetsListLoading: false } },
        });

        expect(assignCurrentAsset).toHaveBeenCalledWith({ ...assetData[0] });
        expect(setStateMock).toHaveBeenCalledWith(false); // auto closes the autocomplete popup
    });
});
