import React from 'react';
import ActionPanel from './ActionPanel';
import { rtlRender, act, fireEvent, waitFor } from 'test-utils';

import locale from '../../testTag.locale.js';

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(<ActionPanel {...testProps} />);
}

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

describe('ActionPanel', () => {
    it('renders component', () => {
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const classes = {};
        const isMobileView = false;
        const disabled = false;

        const { getByText, getByTestId } = setup({ formValues, handleChange, classes, isMobileView, disabled });

        expect(getByText(locale.pages.inspect.form.action.title)).toBeInTheDocument();
        expect(getByTestId('tab-repair')).toBeInTheDocument();
        expect(getByTestId('tab-discard')).toBeInTheDocument();
    });

    it('allows selection of tabs', () => {
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const classes = {};
        const isMobileView = false;
        const disabled = false;
        const testValues = { ...formValues };
        testValues.inspection_status = 'FAILED';

        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);

        const { getByTestId } = setup({ formValues: testValues, handleChange, classes, isMobileView, disabled });

        act(() => {
            fireEvent.click(getByTestId('tab-discard'));
        });

        expect(setStateMock).toHaveBeenCalledWith(1);

        act(() => {
            fireEvent.click(getByTestId('tab-repair'));
        });

        expect(setStateMock).toHaveBeenCalledWith(0);
    });

    it('allows selection of only discard tab', () => {
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const classes = {};
        const isMobileView = false;
        const disabled = false;

        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);

        const { getByTestId } = setup({ formValues, handleChange, classes, isMobileView, disabled });

        act(() => {
            fireEvent.click(getByTestId('tab-discard'));
        });

        expect(setStateMock).toHaveBeenCalledWith(1);

        act(() => {
            fireEvent.click(getByTestId('tab-repair'));
        });
        // can only access the Repair tab if status === FAILED
        expect(setStateMock).not.toHaveBeenCalledWith(0);
    });

    it('allows entry of repair text', async () => {
        const testInputId = 'debounced_text_field-repairerDetails-input';
        const updateKey = 'repairer_contact_details';
        const newValue = 'repair details';

        const handleChange = jest.fn(prop =>
            jest.fn(event => {
                expect(prop).toEqual(updateKey);
                expect(event.target.value).toEqual(newValue);
            }),
        );
        const classes = {};
        const isMobileView = false;
        const disabled = false;
        const testAsset = { ...formValues };
        testAsset.inspection_status = 'FAILED';
        testAsset.isRepair = true;
        testAsset.repairer_contact_details = '';

        const { getByTestId } = setup({
            formValues: testAsset,
            handleChange,
            classes,
            isMobileView,
            disabled,
        });

        expect(getByTestId(testInputId)).toBeInTheDocument();
        act(() => {
            fireEvent.change(getByTestId(testInputId), { target: { value: newValue } });
        });
        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey));
    });

    it('allows entry of discarded text', async () => {
        const testInputId = 'debounced_text_field-discardReason-input';
        const updateKey = 'discard_reason';
        const newValue = 'discard details';
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop =>
            jest.fn(event => {
                expect(prop).toEqual(updateKey);
                expect(event.target.value).toEqual(newValue);
            }),
        );
        const classes = {};
        const isMobileView = false;
        const disabled = false;
        const testAsset = { ...formValues };
        testAsset.isDiscarded = true;
        testAsset.discard_reason = '';

        const { getByTestId } = setup({
            formValues: testAsset,
            handleChange,
            classes,
            isMobileView,
            disabled,
        });

        act(() => {
            fireEvent.click(getByTestId('tab-discard'));
        });

        expect(getByTestId(testInputId)).toBeInTheDocument();
        act(() => {
            fireEvent.change(getByTestId(testInputId), { target: { value: newValue } });
        });
        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey));
    });
});
