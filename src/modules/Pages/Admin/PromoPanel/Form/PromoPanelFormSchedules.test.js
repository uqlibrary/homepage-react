import React from 'react';
import PromoPanelFormSchedules from './PromoPanelFormSchedules';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        values: { is_default_panel: false, start: '1970/10/10 00:00:00' },
        isEdit: true,
        scheduledList: [],
        knownGroups: [
            { group: 'student', name: 'student' },
            { group: 'public', name: 'public' },
        ],
        defaults: {},
        displayList: [{ groupNames: 'student', startDate: '2020/01/01 00:00:00', endDate: '2020/02/01 00:00:00' }],
        removePanelGroupSchedule: jest.fn(),
        editPanelGroupSchedule: jest.fn(),
        selectorGroupNames: ['student'],
        handleAddSchedule: jest.fn(),
        handleChange: () => jest.fn(),
        handleGroupChange: jest.fn(),
    };
    return rtlRender(<PromoPanelFormSchedules {...props} {...testProps} />);
}

describe('Promo Panel Form confirmation', () => {
    it('renders correct type for scheduled if startdate is in past (scheduled)', () => {
        const { getByTestId, getByText } = setup();
        expect(getByTestId('admin-promopanel-startdate-past')).toBeInTheDocument();
        expect(getByText('Currently scheduled for groups')).toBeInTheDocument();
    });

    it('renders correct type for default panel', () => {
        const { getByText } = setup({ values: { is_default_panel: true } });
        expect(getByText('Currently default for groups')).toBeInTheDocument();
    });
    it('correctly calls handleAddSchedule', () => {
        const handleAddSchedule = jest.fn();
        const { getByTestId } = setup({ handleAddSchedule: handleAddSchedule });
        fireEvent.click(getByTestId('admin-promopanel-form-button-addSchedule'));
        expect(handleAddSchedule).toBeCalled();
    });
    it('correctly calls editSchedule', () => {
        const editSchedule = jest.fn();
        const { getByTestId } = setup({ editPanelGroupSchedule: editSchedule });
        fireEvent.click(getByTestId('admin-promopanel-form-button-editSchedule-0'));
        expect(editSchedule).toBeCalledWith(0);
    });
    it('correctly calls removeSchedule', () => {
        const removeSchedule = jest.fn();
        const { getByTestId } = setup({ removePanelGroupSchedule: removeSchedule });
        fireEvent.click(getByTestId('admin-promopanel-form-button-removeSchedule-0'));
        expect(removeSchedule).toBeCalledWith(0);
    });
});
