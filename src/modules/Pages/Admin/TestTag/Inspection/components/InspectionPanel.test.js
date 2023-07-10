import React from 'react';
import InspectionPanel from './InspectionPanel';
import { render, act, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import Immutable from 'immutable';

import configData from '../../../../../../data/mock/data/testing/testTagOnLoadInspection';
import assetData from '../../../../../../data/mock/data/testing/testTagAssets';
import locale from '../../testTag.locale.js';

const formValues = {
    action_date: '2016-12-05 14:22',
    asset_department_owned_by: 'UQL-WSS',
    asset_id_displayed: 'UQL310000',
    asset_type_id: 1,
    discard_reason: undefined,
    inspection_date_next: '2018-12-05 14:22',
    inspection_device_id: 1,
    inspection_fail_reason: undefined,
    inspection_notes: '',
    inspection_status: 'PASSED',
    isDiscarded: false,
    isRepair: false,
    repairer_contact_details: undefined,
    room_id: 1,
    user_id: 3,
};

const currentRetestList = [
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '60', label: '5 years' },
];

const DEFAULT_NEXT_TEST_DATE_VALUE = 12;

function setup(testProps = {}) {
    const {
        state = {},
        defaultNextTestDateValue = DEFAULT_NEXT_TEST_DATE_VALUE,
        classes = {},
        disabled = false,
        isMobileView = false,
        ...props
    } = testProps;

    const _state = {
        testTagOnLoadInspectionReducer: { inspectionConfig: configData.data, inspectionConfigLoading: false },
        ...state,
    };
    return render(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <InspectionPanel
                currentRetestList={currentRetestList}
                defaultNextTestDateValue={defaultNextTestDateValue}
                classes={classes}
                disabled={disabled}
                isMobileView={isMobileView}
                {...props}
            />
        </WithReduxStore>,
    );
}

describe('InspectionPanel', () => {
    it('renders component', async () => {
        const updateKey = 'inspection_date_next';
        const newValue = '2017-12-05';
        const handleChange = jest.fn(prop =>
            jest.fn(value => {
                expect(prop).toEqual(updateKey);
                expect(value.format('YYYY-MM-DD')).toEqual(newValue);
            }),
        );

        const { getByText, getByTestId } = setup({
            formValues,
            selectedAsset: {},
            handleChange,
        });

        expect(getByText(locale.pages.inspect.form.inspection.title)).toBeInTheDocument();
        expect(getByTestId('testResultTestingDevice')).toBeInTheDocument();
        expect(getByTestId('testResultToggleButtons')).toBeInTheDocument();
        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey));
    });

    it('allows entry of inspection notes text', async () => {
        const testInputId = 'debounced_text_field-inspectionNotes-input';
        const updateKey = 'inspection_notes';
        const newValue = 'some inspection notes';

        const handleChange = jest.fn(prop =>
            jest.fn(event => {
                if (prop === updateKey) {
                    expect(prop).toEqual(updateKey);
                    expect(event.target.value).toEqual(newValue);
                }
            }),
        );

        const { getByTestId } = setup({
            formValues,
            handleChange,
            selectedAsset: { ...assetData[0] },
        });

        expect(getByTestId(testInputId)).toBeInTheDocument();
        act(() => {
            fireEvent.change(getByTestId(testInputId), { target: { value: newValue } });
        });
        await waitFor(() => expect(handleChange).toHaveBeenLastCalledWith(updateKey));
    });

    it('allows entry of fail reason text', async () => {
        const testInputId = 'debounced_text_field-inspectionFailReason-input';
        const updateKey = 'inspection_fail_reason';
        const newValue = 'some fail reason';

        const handleChange = jest.fn(prop =>
            jest.fn(event => {
                if (prop === updateKey) {
                    expect(prop).toEqual(updateKey);
                    expect(event.target.value).toEqual(newValue);
                }
            }),
        );

        const testValues = { ...formValues };
        testValues.inspection_status = 'FAILED';

        const { getByTestId } = setup({
            formValues: testValues,
            handleChange,
            selectedAsset: { ...assetData[0] },
        });

        expect(getByTestId(testInputId)).toBeInTheDocument();
        act(() => {
            fireEvent.change(getByTestId(testInputId), { target: { value: newValue } });
        });
        await waitFor(() => expect(handleChange).toHaveBeenLastCalledWith(updateKey));
    });

    it('handles defaults', async () => {
        // code coverage
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(value => {}));

        const testValues = { ...formValues };
        delete testValues.inspection_device_id;
        delete testValues.inspection_status;
        delete testValues.inspection_notes;

        const { getByText } = setup({
            formValues: testValues,
            selectedAsset: {},
            handleChange,
            isMobileView: true,
            state: { testTagOnLoadInspectionReducer: { inspectionConfig: [], inspectionConfigLoading: true } },
        });

        expect(getByText(locale.pages.inspect.form.inspection.title)).toBeInTheDocument();
    });
});
