import React from 'react';
import ActionPanel from './ActionPanel';
import { rtlRender, act, fireEvent, waitFor } from 'test-utils';

import * as helpers from '../utils/helpers';

import locale from '../../testTag.locale.js';

import { componentId } from './ActionPanel';

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
        expect(getByTestId(`${componentId}-repair-tab-button`)).toBeInTheDocument();
        expect(getByTestId(`${componentId}-discard-tab-button`)).toBeInTheDocument();
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
        // act(() => {
        //     fireEvent.click(getByTestId(`${componentId}-discard-tab-button`));
        // });

        // expect(setStateMock).toHaveBeenCalledWith(0);

        act(() => {
            fireEvent.click(getByTestId(`${componentId}-repair-tab-button`));
        });

        expect(setStateMock).toHaveBeenCalledWith(1);
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

        // act(() => {
        //     fireEvent.click(getByTestId(`${componentId}-discard-tab-button`));
        // });

        // expect(setStateMock).toHaveBeenCalledWith(0);

        act(() => {
            fireEvent.click(getByTestId(`${componentId}-repair-tab-button`));
        });
        // can only access the Repair tab if status === FAILED
        expect(setStateMock).not.toHaveBeenCalledWith(1);
    });

    it('allows entry of repair text', async () => {
        const testInputId = `${componentId}-repairer-details-input`;
        const updateKey1 = 'repairer_contact_details';
        const newValue1 = 'repair details';
        const updateKey2 = 'isRepair';
        const newValue2 = true;

        const handleChange = jest.fn(prop =>
            jest.fn(event => {
                if (prop === updateKey1) {
                    expect(event.target.value).toEqual(newValue1);
                } else if (prop === updateKey2) {
                    expect(event).toEqual(newValue2);
                }
            }),
        );
        const classes = {};
        const isMobileView = false;
        const disabled = false;
        const testAsset = { ...formValues };
        testAsset.inspection_status = 'FAILED';
        // testAsset.isRepair = true;
        testAsset.repairer_contact_details = '';

        const { getByTestId } = setup({
            formValues: testAsset,
            handleChange,
            classes,
            isMobileView,
            disabled,
        });

        act(() => {
            fireEvent.click(getByTestId(`${componentId}-repair-tab-button`));
        });

        expect(getByTestId(testInputId)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId(`${componentId}-is-repair-select`));
        });
        act(() => {
            fireEvent.click(getByTestId(`${componentId}-is-repair-option-1`));
        });
        act(() => {
            fireEvent.change(getByTestId(testInputId), { target: { value: newValue1 } });
        });
        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey1));
    });

    it('allows entry of discarded text', async () => {
        const testInputId = `${componentId}-discard-reason-input`;
        const updateKey1 = 'discard_reason';
        const newValue1 = 'discard details';
        const updateKey2 = 'isDiscarded';
        const newValue2 = true;

        const handleChange = jest.fn(prop =>
            jest.fn(event => {
                if (prop === updateKey1) {
                    expect(event.target.value).toEqual(newValue1);
                } else if (prop === updateKey2) {
                    expect(event).toEqual(newValue2);
                }
            }),
        );
        const classes = {};
        const isMobileView = false;
        const disabled = false;
        const testAsset = { ...formValues };
        testAsset.discard_reason = '';

        const { getByTestId } = setup({
            formValues: testAsset,
            handleChange,
            classes,
            isMobileView,
            disabled,
        });

        act(() => {
            fireEvent.click(getByTestId(`${componentId}-discard-tab-button`));
        });

        expect(getByTestId(testInputId)).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId(`${componentId}-is-discard-select`));
        });
        act(() => {
            fireEvent.click(getByTestId(`${componentId}-is-discard-option-1`));
        });

        act(() => {
            fireEvent.change(getByTestId(testInputId), { target: { value: newValue1 } });
        });
        await waitFor(() => expect(handleChange).toHaveBeenCalledWith(updateKey1));
    });

    it('fires discard validation function (coverage)', () => {
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const isValidDiscardFn = jest.spyOn(helpers, 'isValidDiscard');

        const classes = {};
        const disabled = false;

        setup({
            formValues: { ...formValues, isDiscarded: true },
            handleChange,
            classes,
            disabled,
            isMobileView: false,
        });

        expect(isValidDiscardFn).toHaveBeenCalled();
    });

    it('fires repair validation function (coverage)', () => {
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const isValidRepairFn = jest.spyOn(helpers, 'isValidRepair');

        const classes = {};
        const disabled = false;

        setup({
            formValues: { ...formValues, isRepair: true },
            handleChange,
            classes,
            disabled,
            isMobileView: false,
        });

        expect(isValidRepairFn).toHaveBeenCalled();
    });

    it('resets component (coverage)', () => {
        // eslint-disable-next-line no-unused-vars
        const handleChange = jest.fn(prop => jest.fn(event => {}));
        const classes = {};
        const isMobileView = false;
        const disabled = false;

        const { getByText, getByTestId, rerender } = setup({
            formValues: { ...formValues, inspection_status: 'FAILED' },
            handleChange,
            classes,
            isMobileView: true,
            disabled,
        });

        expect(getByText(locale.pages.inspect.form.action.title)).toBeInTheDocument();
        expect(getByTestId(`${componentId}-discard-tab-button`)).toBeInTheDocument();
        expect(getByTestId(`${componentId}-discard-tab-button`)).toHaveClass('Mui-selected');
        expect(getByTestId(`${componentId}-discard-tab-button`)).toHaveClass('MuiTab-fullWidth');
        expect(getByTestId(`${componentId}-repair-tab-button`)).toBeInTheDocument();
        expect(getByTestId(`${componentId}-repair-tab-button`)).not.toHaveClass('Mui-selected');
        expect(getByTestId(`${componentId}-repair-tab-button`)).toHaveClass('MuiTab-fullWidth');

        act(() => {
            fireEvent.click(getByTestId(`${componentId}-repair-tab-button`));
        });

        expect(getByTestId(`${componentId}-repair-tab-button`)).toHaveClass('Mui-selected');
        expect(getByTestId(`${componentId}-discard-tab-button`)).not.toHaveClass('Mui-selected');

        setup(
            {
                formValues: { ...formValues, inspection_status: 'PASSED', isRepair: true },
                handleChange,
                classes,
                isMobileView,
                disabled,
            },
            rerender,
        );

        expect(handleChange).toHaveBeenCalledWith('isRepair');
        expect(getByTestId(`${componentId}-discard-tab-button`)).toHaveClass('Mui-selected');
        expect(getByTestId(`${componentId}-repair-tab-button`)).not.toHaveClass('Mui-selected');
        expect(getByTestId(`${componentId}-discard-tab-button`)).not.toHaveClass('MuiTab-fullWidth');
        expect(getByTestId(`${componentId}-repair-tab-button`)).not.toHaveClass('MuiTab-fullWidth');
    });
});
