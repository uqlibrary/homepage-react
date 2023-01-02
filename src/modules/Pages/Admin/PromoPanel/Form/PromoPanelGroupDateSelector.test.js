import React from 'react';
import PromoPanelGroupDateSelector from './PromoPanelGroupDateSelector';
import { rtlRender, screen, fireEvent } from '../../../../../../utils/test-utils';

function setup(testProps = {}) {
    const props = {
        isEditingDate: true,
        defaultStartDate: '2000/01/01 00:00:00',
        defaultEndDate: '2000/01/02 23:59:00',
        handleCloseGroupDate: jest.fn(),
        handleSaveGroupDate: jest.fn(),
        scheduleChangeIndex: 0,
        scheduleGroupIndex: 'student',
        setConfirmationMessage: jest.fn(),
        setIsConfirmOpen: jest.fn(),
        setConfirmationMode: jest.fn(),
        panelScheduleId: 0,
    };
    return rtlRender(<PromoPanelGroupDateSelector {...props} {...testProps} />);
}

describe('Promo Panel Group Date Selector', () => {
    it('Should render correctly', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });
    it('Should render date warnings', () => {
        const { getByTestId } = setup();
        expect(getByTestId('start-date-warning')).toBeInTheDocument();
        expect(getByTestId('end-date-warning')).toBeInTheDocument();
    });
    it('Should not render date warnings if dates are OK', () => {
        const { getByTestId, queryByTestId } = setup({
            defaultStartDate: '2040/01/01 00:00:00',
            defaultEndDate: '2040/01/02 23:59:00',
        });
        expect(queryByTestId('start-date-warning')).not.toBeInTheDocument();
        expect(queryByTestId('end-date-warning')).not.toBeInTheDocument();
        screen.debug(undefined, 10000);
    });
});
