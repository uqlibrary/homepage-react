import React from 'react';
import InspectionPanel from './InspectionPanel';
import { rtlRender, rerender, act, fireEvent, WithReduxStore, waitFor, within } from 'test-utils';
import Immutable from 'immutable';

import configData from '../../../../../../data/mock/data/testAndTag/testTagOnLoadInspection';
import assetData from '../../../../../../data/mock/data/testAndTag/testTagAssets';
import userData from '../../../../../../data/mock/data/testAndTag/testTagUser';
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

const DEFAULT_NEXT_TEST_DATE_VALUE = '12';

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
        defaultNextTestDateValue = DEFAULT_NEXT_TEST_DATE_VALUE,
        classes = {},
        disabled = false,
        isMobileView = false,
        ...props
    } = testProps;

    const _state = {
        testTagOnLoadInspectionReducer: { inspectionConfig: configData, inspectionConfigLoading: false },
        testTagUserReducer: { user: userData },
        ...state,
    };

    return renderer(
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
        const updateKey1 = 'inspection_date_next';
        const updateKey2 = 'inspection_device_id';
        const updateKey3 = 'inspection_device_id';
        const handleChange = jest.fn(prop =>
            jest.fn(value => {
                if (prop === updateKey1) {
                    expect(String(value.format('YYYY-MM-DD'))).toMatch(/^2017-12-05|2017-03-05$/);
                } else if (prop === updateKey2) expect(value).toEqual(2);
                else if (prop === updateKey3) expect(value).toEqual('FAILED');
            }),
        );

        const { getByText, getByTestId, getByRole, getAllByRole } = setup({
            formValues,
            selectedAsset: {},
            handleChange,
        });

        expect(getByText(locale.pages.inspect.form.inspection.title)).toBeInTheDocument();
        expect(getByTestId('inspection_panel-inspection-device')).toBeInTheDocument();
        expect(getByTestId('inspection_panel-inspection-result-toggle-buttons')).toBeInTheDocument();
        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey1));
        act(() => {
            fireEvent.mouseDown(getByTestId('months_selector-inspection-panel-select'));
        });
        selectOptionFromListByIndex(0, { getByRole, getAllByRole });

        act(() => {
            fireEvent.mouseDown(getByTestId('inspection_panel-inspection-device-select'));
        });
        selectOptionFromListByIndex(1, { getByRole, getAllByRole });

        act(() => {
            fireEvent.click(getByTestId('inspection_panel-inspection-result-failed-button'));
        });
    });

    it('warns when department testing device is chosen for a PASS test', async () => {
        const updateKeyDate = 'inspection_date_next';
        const updateKeyTestDeviceId = 'inspection_device_id';
        const updateKeyDeviceId = 3;
        const newValueDate = '2017-12-05';
        const handleChange = jest.fn(prop =>
            jest.fn(value => {
                switch (prop) {
                    case updateKeyDate:
                        expect(value.format('YYYY-MM-DD')).toEqual(newValueDate);
                        break;
                    case updateKeyTestDeviceId:
                        expect(value).toEqual(updateKeyDeviceId);
                        break;
                    default:
                        return;
                }
            }),
        );

        const { getByTestId } = setup({
            id: 'test',
            formValues,
            selectedAsset: {},
            handleChange,
        });
        const initRender = within(getByTestId('test-inspection_panel').parentElement);
        expect(initRender.getByText(locale.pages.inspect.form.inspection.title)).toBeInTheDocument();
        expect(initRender.getByTestId('test-inspection_panel-inspection-device-select')).toBeInTheDocument();
        expect(initRender.getByTestId('test-inspection_panel-inspection-device-input')).toHaveAttribute('value', '1');
        expect(
            initRender.queryByTestId('test-inspection_panel-inspection-device-validation-text'),
        ).not.toBeInTheDocument();

        // simulate state update
        setup(
            {
                id: 'testRerender',
                formValues: { ...formValues, inspection_device_id: updateKeyDeviceId }, // change selected device id
                selectedAsset: {},
                handleChange,
            },
            rerender,
        );
        const rerendered = within(getByTestId('testRerender-inspection_panel').parentElement);
        expect(rerendered.getByText(locale.pages.inspect.form.inspection.title)).toBeInTheDocument();
        expect(rerendered.getByTestId('testRerender-inspection_panel-inspection-device-input')).toHaveAttribute(
            'value',
            '3',
        );
        expect(
            rerendered.getByTestId('testRerender-inspection_panel-inspection-device-validation-text'),
        ).toBeInTheDocument();
        expect(
            rerendered.getByTestId('testRerender-inspection_panel-inspection-device-validation-text'),
        ).toHaveTextContent('Visual inspection can not be used for a PASS test');
    });

    it('allows entry of inspection notes text', async () => {
        const testInputId = 'inspection_panel-inspection-notes-input';
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
        const testInputId = 'inspection_panel-fail-reason-input';
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
