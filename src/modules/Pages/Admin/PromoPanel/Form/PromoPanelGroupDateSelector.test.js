import React from 'react';
import PromoPanelGroupDateSelector from './PromoPanelGroupDateSelector';
import { rtlRender, fireEvent } from '../../../../../../utils/test-utils';

const PromoList = [
    {
        usergroup_group: 'student',
        scheduled_panels: [
            {
                panel_schedule_id: 1,
                panel_schedule_start_time: '2022/01/01 00:00:00',
                panel_schedule_end_time: '2022/02/01 00:00:00',
            },
        ],
    },
];
const ConflictList = [
    {
        usergroup_group: 'student',
        scheduled_panels: [
            {
                panel_schedule_id: 1,
                panel_schedule_start_time: '2000/01/01 00:00:00',
                panel_schedule_end_time: '2080/02/01 00:00:00',
            },
        ],
    },
];
function setup(testProps = {}) {
    const props = {
        isEditingDate: true,
        defaultStartDate: '2000/01/01 00:00:00',
        defaultEndDate: '2000/01/02 23:59:00',
        handleCloseGroupDate: jest.fn(),
        handleSaveGroupDate: jest.fn(),
        setConfirmationMessage: jest.fn(),
        setIsConfirmOpen: jest.fn(),
        setConfirmationMode: jest.fn(),
        panelScheduleId: 0,
        fullPromoPanelUserTypeList: PromoList,
    };
    return rtlRender(<PromoPanelGroupDateSelector {...props} {...testProps} />);
}

describe('Promo Panel Group Date Selector', () => {
    it('Should render correctly', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
    it('Should render date warnings', () => {
        const { getByTestId } = setup();
        expect(getByTestId('start-date-warning')).toBeInTheDocument();
        expect(getByTestId('end-date-warning')).toBeInTheDocument();
    });
    it('Should not render date warnings if dates are OK', () => {
        const { queryByTestId } = setup({
            defaultStartDate: '2040/01/01 00:00:00',
            defaultEndDate: '2040/01/02 23:59:00',
        });
        expect(queryByTestId('start-date-warning')).not.toBeInTheDocument();
        expect(queryByTestId('end-date-warning')).not.toBeInTheDocument();
    });

    it('Should handle close', () => {
        const handleCloseGroupDate = jest.fn();
        const { queryByTestId } = setup({
            handleCloseGroupDate: handleCloseGroupDate,
            defaultStartDate: '2040/01/01 00:00:00',
            defaultEndDate: '2040/01/02 23:59:00',
        });
        expect(queryByTestId('start-date-warning')).not.toBeInTheDocument();
        expect(queryByTestId('end-date-warning')).not.toBeInTheDocument();
        fireEvent.click(queryByTestId('admin-promopanel-group-button-cancel'));
        expect(handleCloseGroupDate).toBeCalled();
    });
    it('Should handle save', () => {
        const handleCloseGroupDate = jest.fn();
        const captureError = jest.fn();
        const { queryByTestId } = setup({
            handleCloseGroupDate: handleCloseGroupDate,
            setConfirmationMessage: captureError,
            defaultStartDate: '2040/01/01 00:00:00',
            defaultEndDate: '2040/01/02 23:59:00',
        });
        expect(queryByTestId('start-date-warning')).not.toBeInTheDocument();
        expect(queryByTestId('end-date-warning')).not.toBeInTheDocument();
        fireEvent.click(queryByTestId('admin-promopanel-group-button-save'));
        expect(captureError).not.toBeCalled();
    });
    it('Should capture conflict', () => {
        const handleCloseGroupDate = jest.fn();
        const captureError = jest.fn();
        const { queryByTestId } = setup({
            handleCloseGroupDate: handleCloseGroupDate,
            setConfirmationMessage: captureError,
            defaultStartDate: '2040/01/01 00:00:00',
            defaultEndDate: '2040/01/02 23:59:00',
            fullPromoPanelUserTypeList: ConflictList,
            scheduleChangeIndex: 0,
            scheduleGroupIndex: 'student',
        });
        expect(queryByTestId('start-date-warning')).not.toBeInTheDocument();
        expect(queryByTestId('end-date-warning')).not.toBeInTheDocument();
        fireEvent.click(queryByTestId('admin-promopanel-group-button-save'));
        expect(captureError).toBeCalled();
    });

    it('Cannot have start date afer end date', () => {
        const handleCloseGroupDate = jest.fn();
        const { queryByTestId, getByText } = setup({
            handleCloseGroupDate: handleCloseGroupDate,
            defaultStartDate: '2040/02/01 00:00:00',
            defaultEndDate: '2040/01/01 23:59:00',
            fullPromoPanelUserTypeList: ConflictList,
        });
        expect(queryByTestId('start-date-warning')).not.toBeInTheDocument();
        expect(queryByTestId('end-date-warning')).not.toBeInTheDocument();
        expect(getByText('Start Date cannot be after End Date.')).toBeInTheDocument();
    });
});
