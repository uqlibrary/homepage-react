import React from 'react';
import InspectionPanel from './InspectionPanel';
import { render, act, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import Immutable from 'immutable';

import configData from '../../../../../data/mock/data/testing/testTagOnLoad';

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
import locale from '../testTag.locale.js';

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
        testTagOnLoadReducer: { initConfig: configData, initConfigLoading: false },
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

describe('TabPanel', () => {
    it('renders component', async () => {
        const updateKey = 'inspection_date_next';
        const newValue = '2018-06-30';
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

        expect(getByText(locale.form.inspection.title)).toBeInTheDocument();
        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey));
    });

    // it('renders component', async () => {
    //     const updateKey = 'inspection_date_next';
    //     const newValue = '2018-06-30';
    //     const handleChange = jest.fn(prop =>
    //         jest.fn(value => {
    //             expect(prop).toEqual(updateKey);
    //             expect(value.format('YYYY-MM-DD')).toEqual(newValue);
    //         }),
    //     );

    //     const { getByText, getByTestId } = setup({
    //         formValues,
    //         selectedAsset: {},
    //         handleChange,
    //     });

    //     expect(getByText(locale.form.inspection.title)).toBeInTheDocument();
    //     await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey));
    // });
});
